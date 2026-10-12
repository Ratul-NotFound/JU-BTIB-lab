export const CACHE_TAGS = {
  SETTINGS: "settings",
  RESEARCH_AREAS: "research-areas",
  PROJECTS: "projects",
  PUBLICATIONS: "publications",
  TEAM: "team",
  EQUIPMENT: "equipment",
  ACTIVITIES: "activities",
  GALLERY: "gallery",
  BLOG: "blog",
  CONTENT_BLOCKS: "content-blocks",
  CONTACT: "contact",
  NOTICES: "notices",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
