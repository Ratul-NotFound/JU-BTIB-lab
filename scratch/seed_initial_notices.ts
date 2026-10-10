import { db } from "../src/lib/db";
import { NoticeCategory, NoticePriority, NoticeAudience } from "@prisma/client";

async function main() {
  const count = await db.labNotice.count();
  console.log(`Current notices count: ${count}`);

  if (count === 0) {
    const adminUser = await db.user.findFirst({
      where: { role: "SUPER_ADMIN" },
    });

    await db.labNotice.createMany({
      data: [
        {
          title: "Autoclave Sterilization Unit Maintenance Schedule",
          content: "The primary autoclaving unit (Room 304, Bio-Prep Wing) will undergo scheduled pressure calibration and preventative maintenance this coming Saturday from 09:00 AM to 02:00 PM. Please autoclave all media, petri plates, and pipette tip boxes in advance or utilize the secondary tabletop autoclave in Room 308.",
          category: NoticeCategory.EQUIPMENT_DOWNTIME,
          priority: NoticePriority.HIGH,
          targetAudience: NoticeAudience.ALL,
          pinned: true,
          published: true,
          authorName: "BTIB Instrumentation Facility",
          userId: adminUser?.id || null,
        },
        {
          title: "Quarterly Thesis Progress Report Submission Deadline",
          content: "All graduate scholars (M.Phil and Ph.D.) conducting research under BTIB supervisors are reminded that the Q3 Research Progress Logbook summary and supervisor-signed hour records must be finalized on the portal before the 25th of this month.",
          category: NoticeCategory.DEADLINE,
          priority: NoticePriority.NORMAL,
          targetAudience: NoticeAudience.STUDENTS_ONLY,
          pinned: false,
          published: true,
          authorName: "Academic Research Committee",
          userId: adminUser?.id || null,
        },
        {
          title: "Strict Lab Biosafety SOP: Personal Protective Equipment (PPE) Compliance",
          content: "Following standard biosafety level 2 (BSL-2) mandates, all researchers, scholars, and technical personnel must wear lab coats, nitrile gloves, and closed-toe footwear at all times within the microbial fermentation suite and HPLC analytical bays. Eating, drinking, or storing food in lab refrigerators is strictly prohibited.",
          category: NoticeCategory.SAFETY_ALERT,
          priority: NoticePriority.URGENT,
          targetAudience: NoticeAudience.ALL,
          pinned: false,
          published: true,
          authorName: "Lab Biosafety Officer",
          userId: adminUser?.id || null,
        },
      ],
    });
    console.log("Successfully seeded 3 official sample notices!");
  } else {
    console.log("Notices already present in database.");
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
