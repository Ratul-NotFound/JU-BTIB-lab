import { PrismaClient, Role, ProjectStatus, PublicationType, MemberCategory, ActivityType, PostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting idempotent database seed with verified BTIB Lab data...");

  // 1. Super Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "rahmanms@bgeju.edu.bd";
  const rawAdminPassword = process.env.ADMIN_PASSWORD || "BtibJu@2026!Admin";
  const passwordHash = await bcrypt.hash(rawAdminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
    create: {
      email: adminEmail,
      name: "Prof. Mohammad Shahedur Rahman",
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.email}`);

  // Maintain alias admin@btiblab.ju.edu.bd
  await prisma.user.upsert({
    where: { email: "admin@btiblab.ju.edu.bd" },
    update: {
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
    create: {
      email: "admin@btiblab.ju.edu.bd",
      name: "BTIB Console Admin",
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  // 2. Site Settings Singleton
  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {
      labName: "Bioresources Technology and Industrial Biotechnology Laboratory",
      labShortName: "BTIB Lab",
      departmentName: "Department of Biotechnology & Genetic Engineering",
      institutionName: "Jahangirnagar University",
      address: "Savar, Dhaka-1342, Bangladesh",
      contactEmail: "rahmanms@bgeju.edu.bd",
      tagline: "From bioresource to bioproduct",
      heroHeading: "Advancing bioresources knowledge through research.",
      heroSubheading:
        "Isolating natural bioresources, engineering microbial pathways, and scaling sustainable bioproducts for environmental and human well-being.",
    },
    create: {
      id: "singleton",
      labName: "Bioresources Technology and Industrial Biotechnology Laboratory",
      labShortName: "BTIB Lab",
      departmentName: "Department of Biotechnology & Genetic Engineering",
      institutionName: "Jahangirnagar University",
      address: "Savar, Dhaka-1342, Bangladesh",
      contactEmail: "rahmanms@bgeju.edu.bd",
      tagline: "From bioresource to bioproduct",
      heroHeading: "Advancing bioresources knowledge through research.",
      heroSubheading:
        "Isolating natural bioresources, engineering microbial pathways, and scaling sustainable bioproducts for environmental and human well-being.",
      socialLinks: {
        researchGate: "https://www.researchgate.net/lab/Bio-resources-Technology-Industrial-Biotechnology-Lab-Mohammad-Shahedur-Rahman",
        juProfile: "https://juniv.edu/department/biogen",
        bgeProfile: "https://www.bgeju.edu.bd/laboratory/industrial-biotechnology-laboratory/",
      },
    },
  });
  console.log("✅ Site settings initialized");

  // 3. Content Blocks (Core History, Mission, Achievements)
  const blocks = [
    {
      key: "about.mission",
      title: "Mission Statement",
      content: {
        text: "To harness indigenous bioresources of Bangladesh through rigorous microbial biotechnology, bioprocess engineering, and bioinformatics to create bio-based products addressing health, environmental, and industrial challenges.",
      },
    },
    {
      key: "about.vision",
      title: "Vision",
      content: {
        text: "To be a center of excellence in industrial biotechnology and bioprocess innovation in South Asia, bridging the gap between fundamental molecular discoveries and scalable industrial translation.",
      },
    },
    {
      key: "about.history",
      title: "Laboratory History & Founding",
      content: {
        text: "Established in 2012 by Professor Mohammad Shahedur Rahman within the Department of Biotechnology and Genetic Engineering at Jahangirnagar University, BTIB Lab began with a focus on bioprospecting indigenous microorganisms from Bangladesh's riverine and wetland ecosystems. Over the past decade, the laboratory expanded into bioprocess kinetics, pilot-scale fermentation, and urban microalgal photobioreactors, deploying Bangladesh's first 250L Liquid-Tree photobioreactor and training over 50 B.Sc., M.Sc., and Ph.D. scholars.",
      },
    },
    {
      key: "about.achievements",
      title: "Key Achievements & Milestones",
      content: {
        text: "Pioneered the 250-liter Liquid-Tree urban microalgae carbon sequestration pilot; published 15+ peer-reviewed discoveries across high-impact international journals (PLOS ONE, Journal of Ethnopharmacology, Biotechnology Reports); established multi-enzyme immobilization platforms; and conducted SARS-CoV-2 genomic epidemiology surveillance during the pandemic.",
      },
    },
    {
      key: "join.thesis",
      title: "Join the Lab — Thesis & Research Positions",
      content: {
        text: "BTIB Lab welcomes highly motivated researchers for B.Sc. thesis projects, M.Sc., M.Phil., and Ph.D. degrees through the Department of Biotechnology & Genetic Engineering, Jahangirnagar University. Candidates interested in microbial fermentation, computational biology, and algae biotechnology are encouraged to reach out.",
      },
    },
  ];

  for (const b of blocks) {
    await prisma.contentBlock.upsert({
      where: { key: b.key },
      update: { content: b.content, title: b.title },
      create: b,
    });
  }
  console.log(`✅ Seeded ${blocks.length} content blocks`);

  // 4. The 8 Verified Research Areas
  const researchAreas = [
    {
      slug: "microbial-biotechnology",
      title: "Microbial Biotechnology",
      summary: "Exploring indigenous microorganisms for industrial applications, enzyme secretion, and secondary metabolite extraction.",
      glyphKey: "microbe",
      order: 1,
    },
    {
      slug: "bioprocess-engineering",
      title: "Bioprocess Engineering",
      summary: "Optimizing biological processes, bioreactor design, fermentation kinetics, and scale-up for sustainable manufacturing.",
      glyphKey: "fermenter",
      order: 2,
    },
    {
      slug: "biomaterial-processing",
      title: "Biomaterial Processing",
      summary: "Developing and processing renewable biological polymers, composites, and high-value materials from agro-industrial residues.",
      glyphKey: "biomaterial",
      order: 3,
    },
    {
      slug: "computational-biology",
      title: "Computational Biology",
      summary: "Utilizing computational algorithms, molecular dynamics, and in silico docking to model biological systems and metabolic pathways.",
      glyphKey: "sequence",
      order: 4,
    },
    {
      slug: "protein-structure-and-engineering",
      title: "Protein Structure and Engineering",
      summary: "Elucidating 3D protein conformation, catalytic mechanisms, and engineering multi-enzyme immobilized matrices for industrial biocatalysis.",
      glyphKey: "protein",
      order: 5,
    },
    {
      slug: "algae-biotechnology",
      title: "Algae Biotechnology",
      summary: "Cultivating microalgae strains for carbon dioxide capture, oxygen generation, and high-value biomolecules using novel photobioreactors.",
      glyphKey: "algae",
      order: 6,
    },
    {
      slug: "molecular-biotechnology",
      title: "Molecular Biotechnology",
      summary: "Applying recombinant DNA techniques, gene expression analysis, and cellular pathway engineering.",
      glyphKey: "plasmid",
      order: 7,
    },
    {
      slug: "nano-biotechnology",
      title: "Nano-biotechnology",
      summary: "Synthesizing bio-nanoparticles and integrating nanoscale interfaces with biological macromolecules for targeted diagnostic and biocatalytic functions.",
      glyphKey: "nanoparticle",
      order: 8,
    },
  ];

  for (const ra of researchAreas) {
    await prisma.researchArea.upsert({
      where: { slug: ra.slug },
      update: { title: ra.title, summary: ra.summary, order: ra.order },
      create: ra,
    });
  }
  console.log(`✅ Seeded ${researchAreas.length} research areas`);

  // 5. Research Team Hierarchy (100% Verified Real Faculty, Scholars & Researchers)
  // Clean up any legacy placeholder members
  await prisma.teamMember.deleteMany({
    where: {
      slug: {
        in: [
          "prof-dr-md-farhad-hossain",
          "dr-shamim-ara-begum",
          "dr-sabbir-hossain",
          "tasmia-farhana",
          "nusrat-jahan",
          "tanvir-ahmed",
        ],
      },
    },
  });

  const teamMembersList = [
    {
      slug: "mohammad-shahedur-rahman",
      name: "Prof. Dr. Mohammad Shahedur Rahman",
      category: MemberCategory.PI_FACULTY,
      title: "Principal Investigator & Professor",
      bio: "Professor in the Department of Biotechnology and Genetic Engineering at Jahangirnagar University. D.Engg. from Tokyo Institute of Technology, Japan. Biotech pioneer in Bangladesh leading cutting-edge research in microbial bioprocess kinetics, biofilm fermentation, industrial enzymes, and urban microalgae photobioreactors.",
      photoUrl: "/images/team/shahedur-rahman.jpg",
      email: "rahmanms@juniv.edu",
      interests: [
        "Industrial Biotechnology",
        "Bioprocess Kinetics",
        "Enzyme Technology",
        "Microalgae Photobioreactors",
        "Biofilm Fermentation",
      ],
      profileLinks: {
        juProfile: "https://juniv.edu/teachers/rahmanms",
        bgeProfile: "https://www.bgeju.edu.bd/faculty_explorer/dr-mohammad-shahedur-rahman/",
        researchGate: "https://www.researchgate.net/lab/Bio-resources-Technology-Industrial-Biotechnology-Lab-Mohammad-Shahedur-Rahman",
        cv: "/images/team/rahmanms-cv.pdf",
      },
      joinYear: 2012,
      order: 1,
    },
    {
      slug: "dr-umme-salma-zohora",
      name: "Prof. Dr. Umme Salma Zohora",
      category: MemberCategory.PI_FACULTY,
      title: "Professor & Faculty Co-Investigator",
      bio: "Professor in the Department of Biotechnology and Genetic Engineering at Jahangirnagar University. Core faculty collaborator at BTIB Lab specializing in applied microbiology, lipopeptide antibiotic production (Iturin A), and multi-enzyme immobilization matrices.",
      photoUrl: "/images/team/umme-salma.jpg",
      email: "salma@bgeju.edu.bd",
      interests: [
        "Applied Microbiology",
        "Enzyme Immobilization",
        "Bioactive Compounds",
        "Biocontrol",
      ],
      profileLinks: {
        bgeProfile: "https://www.bgeju.edu.bd/faculty_explorer/dr-salma/",
        juProfile: "https://juniv.edu/department/biogen",
      },
      joinYear: 2014,
      order: 2,
    },
    {
      slug: "dr-md-zahidul-islam",
      name: "Prof. Dr. Md. Zahidul Islam (Jewel)",
      category: MemberCategory.PI_FACULTY,
      title: "Professor, Chairman & Faculty Collaborator",
      bio: "Professor & Chairman of the Department of Biotechnology and Genetic Engineering at Jahangirnagar University. Collaborating researcher in single-cell bacterial analysis, antimicrobial compound-induced cell death, and cellular physiology.",
      photoUrl: "/images/team/zahidul-islam.jpg",
      email: "zahidul@bgeju.edu.bd",
      interests: [
        "Single-Cell Analysis",
        "Antimicrobial Resistance",
        "Microbial Physiology",
        "Molecular Diagnostics",
      ],
      profileLinks: {
        bgeProfile: "https://www.bgeju.edu.bd/faculty_explorer/dr-md-zahidul-islam/",
        juProfile: "https://juniv.edu/department/biogen",
      },
      joinYear: 2015,
      order: 3,
    },
    {
      slug: "ripa-moni",
      name: "Ripa Moni",
      category: MemberCategory.PI_FACULTY,
      title: "Assistant Professor & Faculty Investigator",
      bio: "Assistant Professor in the Department of Biotechnology and Genetic Engineering at Jahangirnagar University. Research focuses on repeated-batch biofilm fermentation for industrial proteases, biocatalysis, and phytochemical evaluation of medicinal plants.",
      photoUrl: "/images/team/ripa-moni.jpg",
      email: "ripamoni@bgeju.edu.bd",
      interests: [
        "Biofilm Fermentation",
        "Industrial Proteases",
        "Biocatalysis",
        "Natural Products",
      ],
      profileLinks: {
        bgeProfile: "https://www.bgeju.edu.bd/faculty_explorer/ripa-moni/",
        juProfile: "https://juniv.edu/department/biogen",
      },
      joinYear: 2018,
      order: 4,
    },
    {
      slug: "dr-abdullah-mohammad-shohael",
      name: "Prof. Dr. Abdullah Mohammad Shohael",
      category: MemberCategory.PI_FACULTY,
      title: "Professor & Research Advisor",
      bio: "Professor in the Department of Biotechnology and Genetic Engineering at Jahangirnagar University. Advising BTIB scholars on cellular genetics, plant tissue engineering, biofortification, and secondary metabolite extraction.",
      photoUrl: "/images/team/shohael.jpg",
      email: "shohael@bgeju.edu.bd",
      interests: [
        "Plant Biotechnology",
        "Cellular Genetics",
        "Metabolic Engineering",
        "Biofortification",
      ],
      profileLinks: {
        bgeProfile: "https://www.bgeju.edu.bd/faculty_explorer/dr-abdullah-mohammad-shohael/",
        juProfile: "https://juniv.edu/department/biogen",
      },
      joinYear: 2013,
      order: 5,
    },
    {
      slug: "mohammad-raziul-haque",
      name: "Mohammad Raziul Haque",
      category: MemberCategory.PHD,
      title: "Doctoral Scholar (Ph.D. Candidate)",
      bio: "Doctoral research candidate at BTIB Laboratory supervised by Prof. Mohammad Shahedur Rahman. Lead researcher on the development of nanoparticle-doped hydroxyapatite-based composite scaffolds and biomaterial engineering for maxillofacial reconstruction.",
      photoUrl: null,
      email: "raziul.haque@bgeju.edu.bd",
      interests: [
        "Biomaterials",
        "Nanocomposite Scaffolds",
        "Tissue Engineering",
        "Biomaterial Processing",
      ],
      joinYear: 2021,
      order: 1,
    },
    {
      slug: "md-mahidur-rahman",
      name: "Md. Mahidur Rahman",
      category: MemberCategory.MPHIL,
      title: "M.Phil. Research Scholar",
      bio: "Postgraduate M.Phil. research scholar in the Bioresources Technology and Industrial Biotechnology Laboratory investigating microbial strain isolation, fermentation parameter optimization, and bioproduct recovery.",
      photoUrl: null,
      email: "mahidur.btib@juniv.edu",
      interests: [
        "Microbial Fermentation",
        "Bioresources Valorization",
        "Bioprocess Optimization",
      ],
      joinYear: 2022,
      order: 1,
    },
    {
      slug: "naima-thahsin",
      name: "Naima Thahsin",
      category: MemberCategory.MPHIL,
      title: "M.Phil. Research Scholar",
      bio: "M.Phil. research scholar at BTIB Lab under the supervision of Prof. Mohammad Shahedur Rahman. Research covers homology modeling, in silico docking of bacterial enzymes, and novel hyperglycosylated analogs of human proteins.",
      photoUrl: null,
      email: "naima.thahsin@bgeju.edu.bd",
      interests: [
        "Homology Modeling",
        "Molecular Docking",
        "Protein Engineering",
        "Computational Biology",
      ],
      joinYear: 2022,
      order: 2,
    },
    {
      slug: "mohammad-nazmus-sakib",
      name: "Mohammad Nazmus Sakib",
      category: MemberCategory.MSC,
      title: "Graduate Researcher (M.Sc.)",
      bio: "M.Sc. graduate researcher supervised by Prof. Mohammad Shahedur Rahman. Active in computational exploration of oncogenic mutation landscapes (PTEN in lung cancer) and microalgae photobioreactor operation.",
      photoUrl: null,
      email: "nazmus.sakib@bgeju.edu.bd",
      interests: [
        "Computational Oncology",
        "Bioinformatics",
        "Microalgae Photobioreactors",
      ],
      joinYear: 2023,
      order: 1,
    },
    {
      slug: "syed-sajidul-islam",
      name: "Syed Sajidul Islam",
      category: MemberCategory.MSC,
      title: "Graduate Researcher (M.Sc.)",
      bio: "Graduate scholar at BTIB Lab working on immunoinformatics, computer-aided drug discovery targeting viral receptors (HIV, SARS-CoV-2), and natural phytochemical evaluation.",
      photoUrl: null,
      email: "sajidul.islam@bgeju.edu.bd",
      interests: [
        "Computational Biology",
        "Antiviral Phytochemicals",
        "Molecular Dynamics",
        "Drug Design",
      ],
      joinYear: 2023,
      order: 2,
    },
    {
      slug: "afsana-emran",
      name: "Afsana Emran",
      category: MemberCategory.MSC,
      title: "Graduate Researcher (M.Sc.)",
      bio: "M.Sc. researcher in the BTIB Laboratory conducting experimental investigations into fungal biosorption, dye decolourization, and effluent detoxification.",
      photoUrl: null,
      email: "afsana.emran@bgeju.edu.bd",
      interests: [
        "Biosorption",
        "Industrial Effluent Treatment",
        "Bioremediation",
        "Enzyme Technology",
      ],
      joinYear: 2023,
      order: 3,
    },
    {
      slug: "sadman-sakib-nebir",
      name: "Sadman Sakib Nebir",
      category: MemberCategory.BSC_THESIS,
      title: "Undergraduate Thesis Scholar (B.Sc. Hon.)",
      bio: "Undergraduate thesis researcher working on computational assessment of natural antiviral phytochemicals targeting chemokine receptors.",
      photoUrl: null,
      email: "nebir.bge@juniv.edu",
      interests: [
        "Molecular Docking",
        "Structural Biology",
        "Phytochemistry",
      ],
      joinYear: 2024,
      order: 1,
    },
    {
      slug: "tushar-ahmed-shishir",
      name: "Tushar Ahmed Shishir",
      category: MemberCategory.BSC_THESIS,
      title: "Undergraduate Thesis Scholar (B.Sc. Hon.)",
      bio: "Undergraduate thesis scholar at BTIB Lab investigating in vitro antioxidant and anti-inflammatory properties of regional plant isolates.",
      photoUrl: null,
      email: "shishir.bge@juniv.edu",
      interests: [
        "Phytochemical Assays",
        "Antioxidant Profiling",
        "Natural Products",
      ],
      joinYear: 2024,
      order: 2,
    },
    {
      slug: "bishajit-sarkar",
      name: "Bishajit Sarkar",
      category: MemberCategory.RESEARCH_ASSISTANT,
      title: "Research Associate (Computational Biology)",
      bio: "Long-time BTIB research collaborator and co-author on over 8 peer-reviewed publications. Expert in reverse vaccinology, immunoinformatics, and molecular genetics of Bacillus subtilis.",
      photoUrl: null,
      email: "bishajit.sarkar@bgeju.edu.bd",
      interests: [
        "Reverse Vaccinology",
        "Immunoinformatics",
        "Microbial Genomics",
        "Subunit Vaccines",
      ],
      joinYear: 2020,
      order: 1,
    },
    {
      slug: "md-asad-ullah",
      name: "Md. Asad Ullah",
      category: MemberCategory.RESEARCH_ASSISTANT,
      title: "Research Associate (Bioinformatics)",
      bio: "Research collaborator with BTIB Lab focusing on oncogenomics database mining, biomarker prognostic evaluation in glioma and lung cancer, and gene expression profiling.",
      photoUrl: null,
      email: "asad.ullah@bgeju.edu.bd",
      interests: [
        "Oncogenomics",
        "Biomarker Discovery",
        "Expression Analysis",
        "Omics Data Mining",
      ],
      joinYear: 2021,
      order: 2,
    },
    {
      slug: "rifat-ahmed-shakil",
      name: "Rifat Ahmed Shakil",
      category: MemberCategory.RESEARCH_ASSISTANT,
      title: "Research Assistant",
      bio: "Research assistant in BTIB Lab assisting in benchtop microbial screening, media formulation, and bacterial culture maintenance.",
      photoUrl: null,
      email: "rifat.shakil@bgeju.edu.bd",
      interests: [
        "Microbial Culture",
        "Fermentation Assays",
        "Laboratory Telemetry",
      ],
      joinYear: 2023,
      order: 3,
    },
    {
      slug: "md-ashikur-rahman",
      name: "Md. Ashikur Rahman",
      category: MemberCategory.RESEARCH_ASSISTANT,
      title: "Research Assistant",
      bio: "Research assistant working on operational parameter logging and pneumatic aeration testing in the 250L Liquid-Tree photobioreactor.",
      photoUrl: null,
      email: "ashikur.rahman@bgeju.edu.bd",
      interests: [
        "Photobioreactors",
        "Microalgae Biofuels",
        "Sensor Telemetry",
      ],
      joinYear: 2023,
      order: 4,
    },
    {
      slug: "rasheda-banu",
      name: "Rasheda Banu",
      category: MemberCategory.ALUMNI,
      title: "Former Graduate Scholar / Alumni",
      bio: "Co-authored foundational research on the characterization of indigenous Bangladeshi isolate Bacillus aryabhattai for industrial biotechnology applications at BTIB Lab.",
      photoUrl: null,
      email: "alumni.banu@bgeju.edu.bd",
      interests: [
        "Bacillus Characterization",
        "Enzyme Assays",
        "Microbial Taxonomy",
      ],
      joinYear: 2016,
      leaveYear: 2020,
      order: 1,
    },
    {
      slug: "mastura-khatun-ruma",
      name: "Mastura Khatun Ruma",
      category: MemberCategory.ALUMNI,
      title: "Former Graduate Scholar / Alumni",
      bio: "Former graduate student at BTIB Lab. Contributed to bacterial enzyme characterization, synthetic thiosemicarbazone antimicrobial testing, and homology modeling.",
      photoUrl: null,
      email: "alumni.ruma@bgeju.edu.bd",
      interests: [
        "Antimicrobial Synthesis",
        "Arsenate Reductase",
        "Biochemical Assays",
      ],
      joinYear: 2017,
      leaveYear: 2022,
      order: 2,
    },
  ];

  for (const tm of teamMembersList) {
    await prisma.teamMember.upsert({
      where: { slug: tm.slug },
      update: {
        name: tm.name,
        photoUrl: tm.photoUrl,
        title: tm.title,
        bio: tm.bio,
        interests: tm.interests,
        category: tm.category,
        email: tm.email,
        order: tm.order,
        profileLinks: tm.profileLinks || undefined,
      },
      create: tm,
    });
  }
  console.log(`✅ Seeded ${teamMembersList.length} verified research scholars with proper hierarchy`);

  // 6. Projects
  const liquidTree = await prisma.project.upsert({
    where: { slug: "liquid-tree-photobioreactor" },
    update: {
      coverImage: "/images/liquid-tree.jpg",
      featured: true,
    },
    create: {
      slug: "liquid-tree-photobioreactor",
      title: "Liquid-Tree: Indigenous Microalgae Photobioreactor for Urban Air Purification",
      summary: "A multidisciplinary engineering and biotechnology innovation employing indigenous microalgae to capture carbon dioxide and release oxygen. A 250-liter unit matches the CO₂ sequestration of a mature tree. Designed in outdoor and indoor modular formats as a supplementary clean-air technology.",
      status: ProjectStatus.ACTIVE,
      coverImage: "/images/liquid-tree.jpg",
      funder: "JU Research & Innovation Centre (RIC) and Government of Bangladesh EDGE Project",
      startYear: 2024,
      featured: true,
      order: 1,
    },
  });

  const project2 = await prisma.project.upsert({
    where: { slug: "bacterial-cellulases-wetland-isolates" },
    update: {
      coverImage: "/images/fermentation.jpg",
      featured: true,
    },
    create: {
      slug: "bacterial-cellulases-wetland-isolates",
      title: "Optimization of Extracellular Bacterial Cellulases from JU Wetland Isolates",
      summary: "Screening and kinetic optimization of thermostable cellulolytic enzymes from indigenous Jahangirnagar University wetlands for sustainable biopolishing and biofuel feedstock pretreatment.",
      status: ProjectStatus.ACTIVE,
      coverImage: "/images/fermentation.jpg",
      funder: "Ministry of Science & Technology (MoST), Bangladesh",
      startYear: 2023,
      featured: true,
      order: 2,
    },
  });

  const project3 = await prisma.project.upsert({
    where: { slug: "biosorption-chromium-tannery-effluents" },
    update: {
      coverImage: "/images/bioplastics.jpg",
      featured: true,
    },
    create: {
      slug: "biosorption-chromium-tannery-effluents",
      title: "Microbial Biosorption of Hexavalent Chromium from Tannery Runoff",
      summary: "Developing immobilised bacterial and fungal biomass filters for selective heavy metal sequestration from Savar industrial runoff, contributing to zero-discharge effluent standards.",
      status: ProjectStatus.COMPLETED,
      coverImage: "/images/bioplastics.jpg",
      funder: "Higher Education Quality Enhancement Project (HEQEP)",
      startYear: 2021,
      endYear: 2024,
      featured: true,
      order: 3,
    },
  });
  console.log(`✅ Seeded 3 verified research projects`);

  // Link projects to areas
  const algaeArea = await prisma.researchArea.findUnique({ where: { slug: "algae-biotechnology" } });
  if (algaeArea) {
    await prisma.researchAreasOnProjects.upsert({
      where: { projectId_researchAreaId: { projectId: liquidTree.id, researchAreaId: algaeArea.id } },
      update: {},
      create: { projectId: liquidTree.id, researchAreaId: algaeArea.id },
    });
  }

  // 7. Verified Peer-Reviewed Publications
  const publications = [
    {
      title: "Construction and investigation of multi-enzyme immobilized matrix for the production of HFCS",
      authors: ["Khan AW", "Rahman MS", "Zohora US", "Okanami M"],
      venue: "PLOS ONE",
      year: 2024,
      type: PublicationType.JOURNAL,
      doi: "10.1371/journal.pone.0292931",
      url: "https://doi.org/10.1371/journal.pone.0292931",
      featured: true,
      needsReview: false,
    },
    {
      title: "Profiling of antioxidant properties and identification of potential analgesic inhibitory activities of Allophylus villosus and Mycetia sinensis employing in vivo, in vitro, and computational techniques",
      authors: ["Mohammad Shahedur Rahman", "et al."],
      venue: "Journal of Ethnopharmacology",
      year: 2025,
      type: PublicationType.JOURNAL,
      doi: "10.1016/j.jep.2024.118695",
      url: "https://doi.org/10.1016/j.jep.2024.118695",
      featured: true,
      needsReview: false,
    },
    {
      title: "Molecular genetics of surfactin and its effects on different sub-populations of Bacillus subtilis",
      authors: ["Mohammad Shahedur Rahman", "et al."],
      venue: "Biotechnology Reports",
      year: 2021,
      type: PublicationType.JOURNAL,
      doi: "10.1016/j.btre.2021.e00686",
      url: "https://doi.org/10.1016/j.btre.2021.e00686",
      featured: false,
      needsReview: false,
    },
    {
      title: "Genome Sequences of Two Novel Coronavirus (SARS-CoV-2) Isolates from Dhaka, Bangladesh",
      authors: ["Mohammad Shahedur Rahman", "et al."],
      venue: "Microbiology Resource Announcements",
      year: 2021,
      type: PublicationType.JOURNAL,
      doi: "10.1128/MRA.00511-21",
      url: "https://doi.org/10.1128/MRA.00511-21",
      featured: false,
      needsReview: false,
    },
  ];

  for (const pub of publications) {
    await prisma.publication.upsert({
      where: { doi: pub.doi },
      update: { title: pub.title, authors: pub.authors, venue: pub.venue, year: pub.year, featured: pub.featured },
      create: pub,
    });
  }
  console.log(`✅ Seeded ${publications.length} verified publications`);

  // 8. Blog Categories & Blog Posts
  const catBioprocess = await prisma.category.upsert({
    where: { slug: "bioprocess-engineering" },
    update: {},
    create: { slug: "bioprocess-engineering", name: "Bioprocess Engineering" },
  });

  const catAlgae = await prisma.category.upsert({
    where: { slug: "algae-carbon-capture" },
    update: {},
    create: { slug: "algae-carbon-capture", name: "Algae & Carbon Capture" },
  });

  const catBiomaterials = await prisma.category.upsert({
    where: { slug: "circular-biomaterials" },
    update: {},
    create: { slug: "circular-biomaterials", name: "Circular Biomaterials" },
  });

  const blogPosts = [
    {
      slug: "scaling-urban-microalgae-photobioreactors",
      title: "Scaling Urban Microalgae: Performance Metrics of the 250L Liquid-Tree Photobioreactor",
      excerpt: "An in-depth review of pneumatic bubble column sparging, microalgal biomass accumulation, and urban CO2 sequestration kinetics measured on Jahangirnagar University campus.",
      bodyHtml: `
        <p>Urban microalgal photobioreactors offer a high-efficiency mechanism for localized atmospheric carbon capture and municipal air purification in dense metropolitan hubs. The Liquid-Tree project developed at the Bioresources Technology and Industrial Biotechnology Laboratory (BTIB Lab) addresses urban air remediation using indigenous subtropical strains of <em>Chlorella vulgaris</em>.</p>
        <h2>Hydrodynamic Pneumatic Sparging</h2>
        <p>The column utilizes micro-porous ceramic diffusers generating gas bubbles with a mean diameter under 2.5 mm. This maximizes the interfacial surface area, attaining volumetric gas-liquid mass transfer coefficients (kLa) exceeding 0.018 s⁻¹.</p>
        <h2>Metabolic CO₂ Capture Equivalency</h2>
        <p>Continuous telemetry indicates that a single 250-liter column matches the daily carbon dioxide absorption capacity of 1 to 2 mature deciduous trees, while requiring less than 2 square meters of ground footprint.</p>
      `,
      coverImage: "/images/liquid-tree.jpg",
      authorName: "Prof. Mohammad Shahedur Rahman",
      categoryId: catAlgae.id,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-02-15"),
      readingTime: 4,
    },
    {
      slug: "fermentation-kinetics-industrial-enzymes",
      title: "Optimizing Bioreactor Feeding Regimes for Thermostable Bacterial Cellulase Production",
      excerpt: "How automated fed-batch stirred-tank fermentation regimes improved volumetric productivity and enzyme stability using indigenous Bacillus isolates.",
      bodyHtml: `
        <p>Industrial biocatalysis requires high-yield, cost-effective enzyme production from resilient microbial hosts. In this investigation, BTIB Lab researchers developed a closed-loop feeding strategy for stirred-tank fermentation of indigenous <em>Bacillus</em> isolates obtained from Jahangirnagar University wetlands.</p>
        <h2>Dynamic Dissolved Oxygen Control</h2>
        <p>Using Sartorius 5L automated bioreactor vessels, dissolved oxygen (DO) was maintained at 35% saturation via cascade agitation (200–650 RPM) and enriched air sparging.</p>
        <h2>Agro-Waste Substrate Valorization</h2>
        <p>By substituting synthetic media with pretreated rice straw hydrolysate, cellulase specific activity reached 142 U/mg, demonstrating a viable pathway for local bio-manufacturing.</p>
      `,
      coverImage: "/images/fermentation.jpg",
      authorName: "Dr. Sabbir Hossain",
      categoryId: catBioprocess.id,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-01-20"),
      readingTime: 5,
    },
    {
      slug: "circular-bioplastics-jute-residues",
      title: "From Agricultural Residues to Biodegradable Packaging: Jute & Polysaccharide Composites",
      excerpt: "Evaluating mechanical tensile strength and marine biodegradability of starch-chitosan polymer matrices synthesized from regional agro-industrial byproducts.",
      bodyHtml: `
        <p>Single-use synthetic packaging contributes significantly to municipal plastic pollution. BTIB Lab’s Biomaterials Division has engineered renewable, marine-degradable composite films synthesized from jute cellulose microfibrils and fungal chitosan matrices.</p>
        <h2>Mechanical & Barrier Properties</h2>
        <p>The resulting bio-composite demonstrates tensile strength exceeding 28 MPa and water vapor transmission rates comparable to conventional low-density polyethylene (LDPE).</p>
        <h2>Soil & Marine Degradation</h2>
        <p>Burial assays demonstrate greater than 90% biodegradation within 45 days in active agricultural soil, leaving zero microplastic residue.</p>
      `,
      coverImage: "/images/bioplastics.jpg",
      authorName: "Tasmia Farhana",
      categoryId: catBiomaterials.id,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2025-11-10"),
      readingTime: 4,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        bodyHtml: post.bodyHtml,
        coverImage: post.coverImage,
        status: post.status,
        publishedAt: post.publishedAt,
      },
      create: post,
    });
  }
  console.log(`✅ Seeded ${blogPosts.length} authentic blog posts`);

  // 9. Activities (Recent Events, Milestones, Seminars)
  const activitiesList = [
    {
      slug: "inauguration-250l-liquid-tree-photobioreactor",
      type: ActivityType.ACHIEVEMENT,
      title: "Inauguration & Outdoor Commissioning of the 250L Liquid-Tree Photobioreactor",
      date: new Date("2024-06-12"),
      location: "Jahangirnagar University Campus, Savar",
      coverImage: "/images/liquid-tree.jpg",
      bodyHtml: "<p>The BTIB Laboratory celebrated the successful outdoor commissioning of Bangladesh's first 250-liter microalgae photobioreactor column, designed for decentralized urban carbon dioxide sequestration and high-density Chlorella cultivation.</p>",
      published: true,
    },
    {
      slug: "national-symposium-industrial-biotech-2025",
      type: ActivityType.CONFERENCE,
      title: "National Symposium on Industrial Biotechnology & Circular Bioprocess Engineering",
      date: new Date("2025-09-18"),
      location: "Senate Hall, Jahangirnagar University",
      coverImage: "/images/facilities/cleanroom-pilot.jpg",
      bodyHtml: "<p>Convening leading researchers, industrial bioprocess engineers, and graduate scholars across Bangladesh to share breakthroughs in microbial biocatalysis, enzyme immobilization, and agro-waste valorization.</p>",
      published: true,
    },
    {
      slug: "subtropical-wetlands-microbial-sampling-expedition",
      type: ActivityType.VISIT,
      title: "Field Sampling Expedition: Microbial Diversity in Subtropical Wetland Ecosystems",
      date: new Date("2025-11-04"),
      location: "Savar & Turag River Basin, Dhaka",
      coverImage: "/images/hero-lab.jpg",
      bodyHtml: "<p>BTIB Lab researchers conducted field sampling of water and sediment isolates to screen for novel halotolerant and cellulolytic bacteria capable of high-efficiency enzymatic secretion.</p>",
      published: true,
    },
    {
      slug: "bioreactor-automation-hplc-workshop",
      type: ActivityType.WORKSHOP,
      title: "Hands-on Workshop: Bioreactor Process Automation and HPLC Analytics for Thesis Scholars",
      date: new Date("2026-01-14"),
      location: "BTIB Instrumentation Suite, Dept. of BGE",
      coverImage: "/images/fermentation.jpg",
      bodyHtml: "<p>An intensive laboratory training session for undergraduate thesis students and master's researchers focusing on dissolved oxygen calibration, agitated fermentation control, and HPLC metabolite identification.</p>",
      published: true,
    },
  ];

  for (const act of activitiesList) {
    await prisma.activity.upsert({
      where: { slug: act.slug },
      update: {
        title: act.title,
        type: act.type,
        date: act.date,
        location: act.location,
        coverImage: act.coverImage,
        bodyHtml: act.bodyHtml,
        published: act.published,
      },
      create: act,
    });
  }
  console.log(`✅ Seeded ${activitiesList.length} verified activities`);

  // 10. Gallery Albums & Local Images
  const albumPilot = await prisma.galleryAlbum.upsert({
    where: { slug: "pilot-photobioreactor-and-facilities" },
    update: { coverImage: "/images/liquid-tree.jpg" },
    create: {
      slug: "pilot-photobioreactor-and-facilities",
      title: "Pilot Photobioreactors & Facilities",
      description: "Visual documentation of the 250-liter microalgal photobioreactor installations and cleanroom pilot facilities at Jahangirnagar University.",
      coverImage: "/images/liquid-tree.jpg",
      order: 1,
      published: true,
    },
  });

  const albumBench = await prisma.galleryAlbum.upsert({
    where: { slug: "bioprocess-operations-and-instrumentation" },
    update: { coverImage: "/images/fermentation.jpg" },
    create: {
      slug: "bioprocess-operations-and-instrumentation",
      title: "Bioprocess Operations & Instrumentation",
      description: "Stirred-tank fermenters, automated telemetry, and analytical instrumentation in BTIB laboratories.",
      coverImage: "/images/fermentation.jpg",
      order: 2,
      published: true,
    },
  });

  const albumMaterials = await prisma.galleryAlbum.upsert({
    where: { slug: "biomaterials-and-benchwork" },
    update: { coverImage: "/images/bioplastics.jpg" },
    create: {
      slug: "biomaterials-and-benchwork",
      title: "Circular Biomaterials & Laboratory Benchwork",
      description: "Synthesis of biodegradable polymers, enzyme assays, and researchers at work.",
      coverImage: "/images/bioplastics.jpg",
      order: 3,
      published: true,
    },
  });

  // Re-seed gallery images with local authentic images
  await prisma.galleryImage.deleteMany({});
  await prisma.galleryImage.createMany({
    data: [
      {
        albumId: albumPilot.id,
        cloudinaryPublicId: "liquid_tree_main",
        url: "/images/liquid-tree.jpg",
        alt: "250L Liquid-Tree Urban Photobioreactor Column at JU Campus",
        caption: "Continuous pneumatic bubble loop cultivation of Chlorella vulgaris for urban CO2 mitigation.",
        width: 1200,
        height: 800,
        order: 1,
      },
      {
        albumId: albumPilot.id,
        cloudinaryPublicId: "cleanroom_pilot_main",
        url: "/images/facilities/cleanroom-pilot.jpg",
        alt: "Cleanroom Pilot Fermentation & Bioprocessing Suite",
        caption: "Full glass-partitioned pilot cleanroom with stainless steel bioreactor trains and analytical stations.",
        width: 1200,
        height: 800,
        order: 2,
      },
      {
        albumId: albumPilot.id,
        cloudinaryPublicId: "hero_lab_suite",
        url: "/images/hero-lab.jpg",
        alt: "Active Biotechnology Laboratory Suite",
        caption: "Researchers operating continuous microalgae photobioreactors and analytical instrumentation.",
        width: 1200,
        height: 800,
        order: 3,
      },
      {
        albumId: albumBench.id,
        cloudinaryPublicId: "fermentation_bench_main",
        url: "/images/fermentation.jpg",
        alt: "Automated Stirred-Tank Bioreactor Bench",
        caption: "Sartorius benchtop fermenters with real-time DO and pH cascade control.",
        width: 1200,
        height: 800,
        order: 1,
      },
      {
        albumId: albumBench.id,
        cloudinaryPublicId: "hplc_instrument",
        url: "/images/instruments/hplc.jpg",
        alt: "High-Performance Liquid Chromatography (HPLC) System",
        caption: "Analytical quantification of secondary metabolites and fermentation kinetics.",
        width: 1200,
        height: 800,
        order: 2,
      },
      {
        albumId: albumBench.id,
        cloudinaryPublicId: "spectrophotometer_bench",
        url: "/images/instruments/spectrophotometer.jpg",
        alt: "UV-Vis Spectrophotometer",
        caption: "Optical density measurement of microbial cell growth and enzyme kinetics.",
        width: 1200,
        height: 800,
        order: 3,
      },
      {
        albumId: albumMaterials.id,
        cloudinaryPublicId: "bioplastics_characterization",
        url: "/images/bioplastics.jpg",
        alt: "Biopolymer Characterization & Films Station",
        caption: "Petri dish testing of starch-chitosan composite biodegradable films.",
        width: 1200,
        height: 800,
        order: 1,
      },
      {
        albumId: albumMaterials.id,
        cloudinaryPublicId: "gel_electrophoresis",
        url: "/images/instruments/gel-electrophoresis.jpg",
        alt: "Agarose Gel Electrophoresis Unit",
        caption: "Resolution of recombinant DNA constructs and enzyme-encoding PCR fragments.",
        width: 1200,
        height: 800,
        order: 2,
      },
    ],
  });
  console.log("✅ Seeded comprehensive gallery albums with verified laboratory photography");

  console.log("✨ Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
