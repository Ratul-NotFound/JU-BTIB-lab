import { db } from "../src/lib/db";
import { MemberCategory } from "@prisma/client";

async function main() {
  const teachers = [
    {
      slug: "prof-dr-md-farhad-hossain",
      name: "Prof. Dr. Md. Farhad Hossain",
      category: MemberCategory.PI_FACULTY,
      title: "Co-Principal Investigator & Professor",
      bio: "Professor in the Department of Biotechnology and Genetic Engineering at Jahangirnagar University. Leading research in molecular diagnostics, metabolic pathway engineering, and microbial genomics in collaboration with BTIB Lab.",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
      email: "farhad.bge@juniv.edu",
      interests: ["Molecular Diagnostics", "Metabolic Engineering", "Microbial Genomics", "Enzymology"],
      profileLinks: { juProfile: "https://juniv.edu/department/biogen" },
      joinYear: 2014,
      order: 2,
      published: true,
    },
    {
      slug: "dr-shamim-ara-begum",
      name: "Dr. Shamim Ara Begum",
      category: MemberCategory.PI_FACULTY,
      title: "Faculty Advisor & Associate Professor",
      bio: "Associate Professor in Biotechnology & Genetic Engineering at Jahangirnagar University. Advising BTIB scholars on plant tissue culture, bioactive secondary metabolites, and agricultural biotechnology.",
      photoUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80",
      email: "shamim.bge@juniv.edu",
      interests: ["Plant Biotechnology", "Secondary Metabolites", "Tissue Culture", "Phytochemistry"],
      profileLinks: { juProfile: "https://juniv.edu/department/biogen" },
      joinYear: 2016,
      order: 3,
      published: true,
    },
  ];

  for (const t of teachers) {
    await db.teamMember.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
    console.log("Seeded faculty teacher:", t.name);
  }
}

main()
  .then(() => {
    console.log("Success!");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
