import sanitizeHtml from "sanitize-html";

/**
 * Robust, XSS-proof HTML sanitizer for user and administrative rich-text fields.
 * Strips script tags, unsafe protocols (javascript:, data:), event handlers (onload, onerror),
 * and disallows malicious embedded active content while preserving academic and editorial formatting.
 */
export function sanitizeRichHtml(rawHtml?: string | null): string {
  if (!rawHtml || typeof rawHtml !== "string") {
    return "";
  }

  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img",
      "figure",
      "figcaption",
      "table",
      "tbody",
      "thead",
      "tr",
      "td",
      "th",
      "code",
      "pre",
      "hr",
      "br",
      "span",
      "div",
      "mark",
      "sub",
      "sup",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "class", "loading"],
      a: ["href", "name", "target", "rel", "class", "title"],
      span: ["class"],
      div: ["class"],
      code: ["class"],
      pre: ["class"],
      table: ["class"],
      th: ["class", "colspan", "rowspan", "scope"],
      td: ["class", "colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        // Enforce rel="noopener noreferrer" on external links to prevent tabnabbing
        if (attribs.target === "_blank") {
          return {
            tagName,
            attribs: {
              ...attribs,
              rel: "noopener noreferrer",
            },
          };
        }
        return { tagName, attribs };
      },
    },
  });
}
