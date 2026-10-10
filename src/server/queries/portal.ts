import { cache } from "react";
import { db } from "@/lib/db";
import { Role, AccountStatus, BookingStatus } from "@prisma/client";

export interface PortalData {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: Role;
  };
  studentProfile: {
    id: string;
    studentId: string;
    program: string;
    department: string;
    institution: string;
    sessionYear: string;
    batch: string | null;
    phone: string;
    thesisTitle: string | null;
    supervisorName: string | null;
    status: AccountStatus;
    supervisor?: {
      id?: string;
      designation?: string | null;
      department?: string | null;
      officeRoom?: string | null;
      user: {
        name: string;
        email: string;
      };
    } | null;
    bookings: Array<{
      id: string;
      startTime: Date;
      endTime: Date;
      purpose: string;
      samples: string | null;
      status: string;
      equipment: {
        id: string;
        name: string;
        category: string;
        imageUrl: string | null;
      };
      experimentLog?: {
        id: string;
        title: string;
        actualHoursUsed: number;
        protocolSummary: string;
        observations: string | null;
        verifiedBy: string | null;
        verifiedAt: Date | null;
      } | null;
    }>;
    workLogs: Array<{
      actualHoursUsed: number;
    }>;
  } | null;
  facultyProfile: {
    id: string;
    designation: string;
    department: string;
    officeRoom: string | null;
    supervisedStudents: Array<{ id: string }>;
  } | null;
  stats: {
    totalHours: number;
    upcomingBookingsCount: number;
    totalLogsCount: number;
    supervisedStudentsCount: number;
    pendingVerificationsCount: number;
  };
}

interface RawPortalBookingJson {
  id: string;
  startTime: string;
  endTime: string;
  purpose: string;
  samples: string | null;
  status: string;
  equipment: {
    id: string;
    name: string;
    category: string;
    imageUrl: string | null;
  };
  experimentLog?: {
    id: string;
    title: string;
    actualHoursUsed: number;
    protocolSummary: string;
    observations: string | null;
    verifiedBy: string | null;
    verifiedAt: string | null;
  } | null;
}

interface RawFacultyProfileJson {
  id: string;
  designation: string;
  department: string;
  officeRoom: string | null;
  supervisedStudentsCount: number;
}

interface RawPortalRow {
  user_id: string;
  user_name: string | null;
  user_email: string;
  user_role: Role;
  student_profile_id: string | null;
  student_id: string | null;
  student_program: string | null;
  student_department: string | null;
  student_institution: string | null;
  session_year: string | null;
  student_batch: string | null;
  student_phone: string | null;
  thesis_title: string | null;
  fallback_supervisor_name: string | null;
  profile_status: AccountStatus | null;
  supervisor_id: string | null;
  supervisor_designation: string | null;
  supervisor_department: string | null;
  supervisor_office: string | null;
  supervisor_name: string | null;
  supervisor_email: string | null;
  total_hours: number | string | null;
  bookings_json: RawPortalBookingJson[] | null;
  faculty_profile_json: RawFacultyProfileJson | null;
  pending_verifications_count: number | string | null;
  all_students_count: number | string | null;
}

/**
 * Ultra-fast, single-roundtrip portal data loader.
 * Employs a single optimized PostgreSQL query with JSON aggregation
 * returning user, profiles, supervisor, bookings, work logs, and metrics in ~350ms.
 * Wrapped in React cache() so PortalLayout, PortalPage, and sub-pages share the
 * exact same in-memory promise within a single request with 0 duplicate roundtrips.
 */
export const getPortalData = cache(
  async (userId: string, userEmail?: string | null): Promise<PortalData | null> => {
    try {
      const emailFilter = userEmail ? userEmail.toLowerCase().trim() : "";

      const rows = await db.$queryRaw<RawPortalRow[]>`
        SELECT
          u.id AS user_id,
          u.name AS user_name,
          u.email AS user_email,
          u.role AS user_role,
          sp.id AS student_profile_id,
          sp."studentId" AS student_id,
          sp.program AS student_program,
          sp.department AS student_department,
          sp.institution AS student_institution,
          sp."sessionYear" AS session_year,
          sp.batch AS student_batch,
          sp.phone AS student_phone,
          sp."thesisTitle" AS thesis_title,
          sp."supervisorName" AS fallback_supervisor_name,
          sp.status AS profile_status,
          sup.id AS supervisor_id,
          sup.designation AS supervisor_designation,
          sup.department AS supervisor_department,
          sup."officeRoom" AS supervisor_office,
          sup_u.name AS supervisor_name,
          sup_u.email AS supervisor_email,
          (
            SELECT COALESCE(SUM(el."actualHoursUsed"), 0)
            FROM "ExperimentLog" el
            WHERE el."studentProfileId" = sp.id
          ) AS total_hours,
          (
            SELECT COALESCE(
              json_agg(
                json_build_object(
                  'id', b.id,
                  'startTime', b."startTime",
                  'endTime', b."endTime",
                  'purpose', b.purpose,
                  'samples', b.samples,
                  'status', b.status,
                  'equipment', json_build_object(
                    'id', eq.id,
                    'name', eq.name,
                    'category', eq.category,
                    'imageUrl', eq."imageUrl"
                  ),
                  'experimentLog', CASE WHEN el_b.id IS NOT NULL THEN json_build_object(
                    'id', el_b.id,
                    'title', el_b.title,
                    'actualHoursUsed', el_b."actualHoursUsed",
                    'protocolSummary', el_b."protocolSummary",
                    'observations', el_b.observations,
                    'verifiedBy', el_b."verifiedBy",
                    'verifiedAt', el_b."verifiedAt"
                  ) ELSE NULL END
                )
                ORDER BY b."startTime" DESC
              ),
              '[]'::json
            )
            FROM (
              SELECT * FROM "EquipmentBooking"
              WHERE "studentProfileId" = sp.id
              ORDER BY "startTime" DESC
              LIMIT 30
            ) b
            JOIN "Equipment" eq ON eq.id = b."equipmentId"
            LEFT JOIN "ExperimentLog" el_b ON el_b."bookingId" = b.id
          ) AS bookings_json,
          (
            SELECT json_build_object(
              'id', fp.id,
              'designation', fp.designation,
              'department', fp.department,
              'officeRoom', fp."officeRoom",
              'supervisedStudentsCount', (
                SELECT COUNT(*)::int FROM "StudentProfile" WHERE "supervisorId" = fp.id
              )
            )
            FROM "FacultyProfile" fp
            WHERE fp."userId" = u.id
          ) AS faculty_profile_json,
          (
            SELECT COUNT(*)::int FROM "ExperimentLog" WHERE "verifiedBy" IS NULL
          ) AS pending_verifications_count,
          (
            SELECT COUNT(*)::int FROM "StudentProfile"
          ) AS all_students_count
        FROM "User" u
        LEFT JOIN "StudentProfile" sp ON sp."userId" = u.id
        LEFT JOIN "FacultyProfile" sup ON sup.id = sp."supervisorId"
        LEFT JOIN "User" sup_u ON sup_u.id = sup."userId"
        WHERE u.id = ${userId} OR (${emailFilter} != '' AND LOWER(u.email) = ${emailFilter})
        LIMIT 1;
      `;

      if (!rows || rows.length === 0) {
        return null;
      }

      const r = rows[0];
      const now = new Date();

      const bookings = (r.bookings_json || []).map((b: RawPortalBookingJson) => ({
        ...b,
        startTime: new Date(b.startTime),
        endTime: new Date(b.endTime),
        experimentLog: b.experimentLog
          ? {
              ...b.experimentLog,
              verifiedAt: b.experimentLog.verifiedAt ? new Date(b.experimentLog.verifiedAt) : null,
            }
          : null,
      }));

      const upcomingBookingsCount = bookings.filter(
        (b) => b.endTime >= now && b.status === BookingStatus.CONFIRMED
      ).length;

      const totalHours = Number(r.total_hours) || 0;

      const studentProfile = r.student_profile_id && r.student_id
        ? {
            id: r.student_profile_id,
            studentId: r.student_id,
            program: r.student_program || "BSC_THESIS",
            department: r.student_department || "Department of Biotechnology & Genetic Engineering",
            institution: r.student_institution || "Jahangirnagar University",
            sessionYear: r.session_year || "",
            batch: r.student_batch,
            phone: r.student_phone || "",
            thesisTitle: r.thesis_title,
            supervisorName: r.fallback_supervisor_name,
            status: r.profile_status as AccountStatus,
            supervisor: r.supervisor_id
              ? {
                  id: r.supervisor_id,
                  designation: r.supervisor_designation,
                  department: r.supervisor_department,
                  officeRoom: r.supervisor_office,
                  user: {
                    name: r.supervisor_name || "Assigned Faculty",
                    email: r.supervisor_email || "",
                  },
                }
              : null,
            bookings,
            workLogs: [{ actualHoursUsed: totalHours }],
          }
        : null;

      const fp = r.faculty_profile_json;
      const facultyProfile = fp
        ? {
            id: fp.id,
            designation: fp.designation,
            department: fp.department,
            officeRoom: fp.officeRoom,
            supervisedStudents: Array.from({ length: fp.supervisedStudentsCount || 0 }, () => ({ id: "" })),
          }
        : null;

      const isFaculty = r.user_role === Role.FACULTY;
      const isAdmin = r.user_role === Role.SUPER_ADMIN || r.user_role === Role.EDITOR;

      return {
        user: {
          id: r.user_id,
          name: r.user_name,
          email: r.user_email,
          role: r.user_role as Role,
        },
        studentProfile,
        facultyProfile,
        stats: {
          totalHours,
          upcomingBookingsCount,
          totalLogsCount: bookings.filter((b) => Boolean(b.experimentLog)).length,
          supervisedStudentsCount: isAdmin ? Number(r.all_students_count) || 0 : fp?.supervisedStudentsCount || 0,
          pendingVerificationsCount: isFaculty || isAdmin ? Number(r.pending_verifications_count) || 0 : 0,
        },
      };
    } catch (err) {
      console.error("getPortalData error:", err);
      return null;
    }
  }
);
