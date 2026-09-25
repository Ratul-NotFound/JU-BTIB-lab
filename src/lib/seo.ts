export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Bioresources Technology and Industrial Biotechnology Laboratory (BTIB Lab)",
    "alternateName": "BTIB Lab",
    "url": "https://btiblab.ju.edu.bd",
    "logo": "https://btiblab.ju.edu.bd/images/btib-logo.png",
    "image": "https://btiblab.ju.edu.bd/images/btib-logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Department of Biotechnology & Genetic Engineering, Jahangirnagar University",
      "addressLocality": "Savar",
      "addressRegion": "Dhaka",
      "postalCode": "1342",
      "addressCountry": "BD",
    },
    "parentOrganization": {
      "@type": "CollegeOrUniversity",
      "name": "Jahangirnagar University",
      "url": "https://juniv.edu",
      "logo": "https://btiblab.ju.edu.bd/images/ju-logo.png",
    },
  };
}

export function getScholarlyArticleJsonLd(pub: {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  doi?: string | null;
  url?: string | null;
  abstract?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": pub.title,
    "name": pub.title,
    "author": pub.authors.map((name) => ({
      "@type": "Person",
      "name": name,
    })),
    "datePublished": `${pub.year}-01-01`,
    "publisher": {
      "@type": "Organization",
      "name": pub.venue,
    },
    ...(pub.doi && { "identifier": `https://doi.org/${pub.doi}` }),
    ...(pub.url && { "url": pub.url }),
    ...(pub.abstract && { "description": pub.abstract }),
  };
}

export function getPersonJsonLd(member: {
  name: string;
  title?: string | null;
  email?: string | null;
  bio?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": member.name,
    "jobTitle": member.title || "Researcher",
    "worksFor": {
      "@type": "EducationalOrganization",
      "name": "Bioresources Technology and Industrial Biotechnology Laboratory, Jahangirnagar University",
    },
    ...(member.email && { "email": member.email }),
    ...(member.bio && { "description": member.bio }),
  };
}

export function getBlogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt?: Date | null;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.authorName,
    },
    "datePublished": post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "BTIB Lab",
    },
  };
}
