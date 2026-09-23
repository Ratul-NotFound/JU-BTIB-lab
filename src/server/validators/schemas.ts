import { z } from "zod";
import { ProjectStatus, PublicationType, MemberCategory, ActivityType, PostStatus } from "@prisma/client";

// Site Settings Validator
export const siteSettingSchema = z.object({
  labName: z.string().min(2, "Lab name must be at least 2 characters"),
  labShortName: z.string().min(2),
  departmentName: z.string().min(2),
  institutionName: z.string().min(2),
  address: z.string().min(5),
  contactEmail: z.string().email(),
  tagline: z.string().min(2),
  heroHeading: z.string().min(5),
  heroSubheading: z.string().min(10),
  socialLinks: z.record(z.string()).optional().nullable(),
  defaultSeo: z.record(z.string()).optional().nullable(),
});

export type SiteSettingInput = z.infer<typeof siteSettingSchema>;

// Content Block Validator
export const contentBlockSchema = z.object({
  key: z.string().min(2),
  title: z.string().min(2),
  content: z.any(),
});

export type ContentBlockInput = z.infer<typeof contentBlockSchema>;

// Research Area Validator
export const researchAreaSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  bodyHtml: z.string().optional().nullable(),
  glyphKey: z.string().min(1, "Glyph key is required"),
  coverImage: z.string().url().optional().nullable().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export type ResearchAreaInput = z.infer<typeof researchAreaSchema>;

// Project Validator
export const projectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  bodyHtml: z.string().optional().nullable(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.ACTIVE),
  funder: z.string().optional().nullable(),
  startYear: z.coerce.number().int().min(2000).max(2100),
  endYear: z.coerce.number().int().min(2000).max(2100).optional().nullable(),
  coverImage: z.string().optional().nullable().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
  areaIds: z.array(z.string()).optional().default([]),
  teamMemberIds: z.array(z.string()).optional().default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// Publication Validator
export const publicationSchema = z.object({
  title: z.string().min(2, "Title is required"),
  authors: z.array(z.string().min(1)).min(1, "At least one author is required"),
  venue: z.string().min(2, "Venue/Journal name is required"),
  year: z.coerce.number().int().min(1970).max(2100),
  type: z.nativeEnum(PublicationType).default(PublicationType.JOURNAL),
  doi: z.string().optional().nullable().or(z.literal("")),
  url: z.string().url().optional().nullable().or(z.literal("")),
  pdfUrl: z.string().url().optional().nullable().or(z.literal("")),
  abstract: z.string().optional().nullable(),
  bibtex: z.string().optional().nullable(),
  featured: z.boolean().optional().default(false),
  needsReview: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  areaIds: z.array(z.string()).optional().default([]),
  teamMemberIds: z.array(z.string()).optional().default([]),
});

export type PublicationInput = z.infer<typeof publicationSchema>;

// Team Member Validator
export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  category: z.nativeEnum(MemberCategory).default(MemberCategory.BSC_THESIS),
  title: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable().or(z.literal("")),
  email: z.string().email().optional().nullable().or(z.literal("")),
  profileLinks: z.record(z.string()).optional().nullable(),
  interests: z.array(z.string()).optional().default([]),
  joinYear: z.coerce.number().int().min(2000).max(2100),
  leaveYear: z.coerce.number().int().min(2000).max(2100).optional().nullable(),
  order: z.coerce.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

// Equipment Validator
export const equipmentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional().nullable(),
  specifications: z.record(z.string()).optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  order: z.coerce.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;

// Activity Validator
export const activitySchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  type: z.nativeEnum(ActivityType).default(ActivityType.SEMINAR),
  date: z.coerce.date(),
  location: z.string().optional().nullable(),
  bodyHtml: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable().or(z.literal("")),
  published: z.boolean().optional().default(true),
});

export type ActivityInput = z.infer<typeof activitySchema>;

// Blog Post Validator
export const blogPostSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().min(5, "Excerpt is required"),
  bodyHtml: z.string().min(10, "Article content is required"),
  coverImage: z.string().url().optional().nullable().or(z.literal("")),
  authorName: z.string().default("BTIB Editorial"),
  categoryId: z.string().optional().nullable(),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
  publishedAt: z.coerce.date().optional().nullable(),
  readingTime: z.coerce.number().int().default(3),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional().default([]),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// Contact Message Validator
export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0, "Bot detection triggered").optional(), // Honeypot trap
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

// Login Credentials Validator
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Gallery Album Validator
export const galleryAlbumSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable().or(z.literal("")),
  activityId: z.string().optional().nullable(),
  order: z.coerce.number().int().optional().default(0),
  published: z.boolean().optional().default(true),
});

// Gallery Image Validator
export const galleryImageSchema = z.object({
  albumId: z.string().min(1, "Album is required"),
  cloudinaryPublicId: z.string().optional().default("direct_upload"),
  url: z.string().min(1, "Valid image path or URL is required"),
  width: z.coerce.number().int().optional().default(1200),
  height: z.coerce.number().int().optional().default(800),
  alt: z.string().min(1, "Alt text is required"),
  caption: z.string().optional().nullable(),
  order: z.coerce.number().int().optional().default(0),
});

export type GalleryImageInput = z.input<typeof galleryImageSchema>;
export type GalleryAlbumInput = z.input<typeof galleryAlbumSchema>;

