"use server";

import { PublicationType } from "@prisma/client";

export interface FetchedPublicationMetadata {
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: PublicationType;
  doi: string;
  url: string;
  abstract?: string;
}

/**
 * Clean HTML formatting tags from title or string
 */
function cleanString(str?: string | null): string {
  if (!str) return "";
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract clean canonical DOI from raw input (URLs, prefixes, etc.)
 */
function extractCleanDoi(rawDoi: string): string | null {
  if (!rawDoi) return null;
  const trimmed = rawDoi.trim();
  const doiRegex = /(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/i;
  const match = trimmed.match(doiRegex);
  return match ? match[1].replace(/[.,;)]+$/, "") : null;
}

/**
 * Map CrossRef/CSL type to BTIB PublicationType enum
 */
function mapPublicationType(cslType?: string): PublicationType {
  if (!cslType) return PublicationType.JOURNAL;
  const lower = cslType.toLowerCase();
  if (lower.includes("proceedings") || lower.includes("conference") || lower.includes("paper-conference")) {
    return PublicationType.CONFERENCE;
  }
  if (lower.includes("book") || lower.includes("chapter") || lower.includes("monograph")) {
    return PublicationType.BOOK_CHAPTER;
  }
  if (lower.includes("patent")) {
    return PublicationType.PATENT;
  }
  if (lower.includes("preprint") || lower.includes("posted-content")) {
    return PublicationType.OTHER;
  }
  return PublicationType.JOURNAL;
}

/**
 * Auto-fetch publication metadata from CrossRef / DOI.org
 */
export async function fetchPublicationMetadataByDoi(
  rawInput: string
): Promise<{ success: boolean; data?: FetchedPublicationMetadata; error?: string }> {
  try {
    const cleanDoi = extractCleanDoi(rawInput);
    if (!cleanDoi) {
      return {
        success: false,
        error: "Invalid DOI format. Please provide a valid DOI (e.g., 10.1016/j.biortech.2023.129400 or a doi.org link).",
      };
    }

    // 1. Try CrossRef REST API
    try {
      const crossrefUrl = `https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`;
      const res = await fetch(crossrefUrl, {
        headers: {
          "User-Agent": "BTIB-Lab-Academic-Portal/1.0 (mailto:admin@btiblab.ju.edu.bd)",
          Accept: "application/json",
        },
        next: { revalidate: 86400 },
      });

      if (res.ok) {
        const json = await res.json();
        const item = json.message;

        if (item) {
          // Extract title
          const title = cleanString(
            Array.isArray(item.title) ? item.title[0] : item.title || ""
          );

          // Extract authors
          const authorsList: string[] = [];
          if (Array.isArray(item.author)) {
            item.author.forEach((a: { given?: string; family?: string; name?: string }) => {
              if (a.name) {
                authorsList.push(a.name);
              } else if (a.given && a.family) {
                authorsList.push(`${a.given} ${a.family}`);
              } else if (a.family) {
                authorsList.push(a.family);
              }
            });
          }
          const authors = authorsList.join(", ");

          // Extract venue (journal/conference title)
          let venue = "";
          if (Array.isArray(item["container-title"]) && item["container-title"].length > 0) {
            venue = cleanString(item["container-title"][0]);
          } else if (item["container-title"]) {
            venue = cleanString(item["container-title"]);
          } else if (item.publisher) {
            venue = cleanString(item.publisher);
          }

          // Extract publication year
          let year = new Date().getFullYear();
          if (item["published-print"]?.["date-parts"]?.[0]?.[0]) {
            year = item["published-print"]["date-parts"][0][0];
          } else if (item["published-online"]?.["date-parts"]?.[0]?.[0]) {
            year = item["published-online"]["date-parts"][0][0];
          } else if (item.issued?.["date-parts"]?.[0]?.[0]) {
            year = item.issued["date-parts"][0][0];
          } else if (item.created?.["date-parts"]?.[0]?.[0]) {
            year = item.created["date-parts"][0][0];
          }

          const type = mapPublicationType(item.type);
          const doi = item.DOI || cleanDoi;
          const url = item.URL || (item.link?.[0]?.URL ?? `https://doi.org/${doi}`);
          const abstract = cleanString(item.abstract);

          return {
            success: true,
            data: {
              title: title || `Publication (${doi})`,
              authors: authors || "Research Author(s)",
              venue: venue || "Academic Journal / Conference",
              year: Number(year) || new Date().getFullYear(),
              type,
              doi,
              url,
              ...(abstract ? { abstract } : {}),
            },
          };
        }
      }
    } catch {
      // Fallback below
    }

    // 2. Fallback to DOI Content Negotiation (Citeproc JSON)
    const doiUrl = `https://doi.org/${encodeURIComponent(cleanDoi)}`;
    const doiRes = await fetch(doiUrl, {
      headers: {
        Accept: "application/citeproc+json, application/vnd.citationstyles.csl+json, application/json",
      },
      next: { revalidate: 86400 },
    });

    if (doiRes.ok) {
      const csl = await doiRes.json();
      const title = cleanString(Array.isArray(csl.title) ? csl.title[0] : csl.title || "");

      const authorsList: string[] = [];
      if (Array.isArray(csl.author)) {
        csl.author.forEach((a: { given?: string; family?: string; literal?: string }) => {
          if (a.literal) {
            authorsList.push(a.literal);
          } else if (a.given && a.family) {
            authorsList.push(`${a.given} ${a.family}`);
          } else if (a.family) {
            authorsList.push(a.family);
          }
        });
      }
      const authors = authorsList.join(", ");

      const venue = cleanString(csl["container-title"] || csl.publisher || "");
      let year = new Date().getFullYear();
      if (csl.issued?.["date-parts"]?.[0]?.[0]) {
        year = csl.issued["date-parts"][0][0];
      }

      return {
        success: true,
        data: {
          title: title || `Publication (${cleanDoi})`,
          authors: authors || "Research Author(s)",
          venue: venue || "Academic Journal / Conference",
          year: Number(year) || new Date().getFullYear(),
          type: mapPublicationType(csl.type),
          doi: csl.DOI || cleanDoi,
          url: csl.URL || `https://doi.org/${cleanDoi}`,
        },
      };
    }

    return {
      success: false,
      error: "Could not locate DOI in global registries. You can fill in the details manually.",
    };
  } catch (error) {
    console.error("Error in fetchPublicationMetadataByDoi:", error);
    return {
      success: false,
      error: "Failed to connect to DOI registry. Please enter details manually.",
    };
  }
}
