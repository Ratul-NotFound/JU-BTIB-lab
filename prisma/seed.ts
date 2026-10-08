import { PrismaClient, Role, ProjectStatus, PublicationType, MemberCategory, ActivityType, PostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * NON-DESTRUCTIVE SEED SCRIPT
 * ============================
 * This script is safe to run multiple times. It will:
 *   - ONLY create admin users (upsert is acceptable for auth credentials)
 *   - ONLY populate tables that are COMPLETELY EMPTY
 *   - NEVER overwrite, update, or delete existing admin-managed data
 *
 * If a table already has rows, it is considered "admin-managed" and skipped entirely.
 * This protects all changes made through the admin panel.
 */

async function main() {
  console.log("🌱 Starting NON-DESTRUCTIVE database seed...");
  console.log("   ⚠️  Tables with existing data will be SKIPPED (admin-managed).\n");

  // ─── 1. Admin Users (always upsert — credentials only) ────────────────
  const adminEmail = process.env.ADMIN_EMAIL || "rahmanms@bgeju.edu.bd";
  const rawAdminPassword = process.env.ADMIN_PASSWORD || "BtibJu@Dev2026";
  const passwordHash = await bcrypt.hash(rawAdminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: Role.SUPER_ADMIN },
    create: {
      email: adminEmail,
      name: "Prof. Mohammad Shahedur Rahman",
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@btiblab.ju.edu.bd" },
    update: { passwordHash, role: Role.SUPER_ADMIN },
    create: {
      email: "admin@btiblab.ju.edu.bd",
      name: "BTIB Console Admin",
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`✅ Admin users ready: ${adminEmail}`);

  // ─── 2. Site Settings (create only if missing) ─────────────────────────
  const existingSettings = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });
  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
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
    console.log("✅ Site settings created (first run)");
  } else {
    console.log("⏭️  Site settings already exist — skipping (admin-managed)");
  }

  // ─── 3. Content Blocks (create only if table is empty) ─────────────────
  const contentBlockCount = await prisma.contentBlock.count();
  if (contentBlockCount === 0) {
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
      await prisma.contentBlock.create({ data: b });
    }
    console.log(`✅ Seeded ${blocks.length} content blocks (first run)`);
  } else {
    console.log(`⏭️  Content blocks already exist (${contentBlockCount} found) — skipping`);
  }

  // ─── 4. Research Areas (create only if table is empty) ─────────────────
  const researchAreaCount = await prisma.researchArea.count();
  if (researchAreaCount === 0) {
    const researchAreas = [
      { slug: "microbial-biotechnology", title: "Microbial Biotechnology", summary: "Exploring indigenous microorganisms for industrial applications, enzyme secretion, and secondary metabolite extraction.", glyphKey: "microbe", order: 1 },
      { slug: "bioprocess-engineering", title: "Bioprocess Engineering", summary: "Optimizing biological processes, bioreactor design, fermentation kinetics, and scale-up for sustainable manufacturing.", glyphKey: "fermenter", order: 2 },
      { slug: "biomaterial-processing", title: "Biomaterial Processing", summary: "Developing and processing renewable biological polymers, composites, and high-value materials from agro-industrial residues.", glyphKey: "biomaterial", order: 3 },
      { slug: "computational-biology", title: "Computational Biology", summary: "Utilizing computational algorithms, molecular dynamics, and in silico docking to model biological systems and metabolic pathways.", glyphKey: "sequence", order: 4 },
      { slug: "protein-structure-and-engineering", title: "Protein Structure and Engineering", summary: "Elucidating 3D protein conformation, catalytic mechanisms, and engineering multi-enzyme immobilized matrices for industrial biocatalysis.", glyphKey: "protein", order: 5 },
      { slug: "algae-biotechnology", title: "Algae Biotechnology", summary: "Cultivating microalgae strains for carbon dioxide capture, oxygen generation, and high-value biomolecules using novel photobioreactors.", glyphKey: "algae", order: 6 },
      { slug: "molecular-biotechnology", title: "Molecular Biotechnology", summary: "Applying recombinant DNA techniques, gene expression analysis, and cellular pathway engineering.", glyphKey: "plasmid", order: 7 },
      { slug: "nano-biotechnology", title: "Nano-biotechnology", summary: "Synthesizing bio-nanoparticles and integrating nanoscale interfaces with biological macromolecules for targeted diagnostic and biocatalytic functions.", glyphKey: "nanoparticle", order: 8 },
    ];
    for (const ra of researchAreas) {
      await prisma.researchArea.create({ data: ra });
    }
    console.log(`✅ Seeded ${researchAreas.length} research areas (first run)`);
  } else {
    console.log(`⏭️  Research areas already exist (${researchAreaCount} found) — skipping`);
  }

  // ─── 5. Team Members (create only if table is empty) ───────────────────
  const teamMemberCount = await prisma.teamMember.count();
  if (teamMemberCount === 0) {
    const teamMembersList = [
      {
        slug: "mohammad-shahedur-rahman",
        name: "Prof. Dr. Mohammad Shahedur Rahman",
        category: MemberCategory.PI_FACULTY,
        title: "Principal Investigator & Professor",
        bio: "Professor in the Department of Biotechnology and Genetic Engineering at Jahangirnagar University. D.Engg. from Tokyo Institute of Technology, Japan. Biotech pioneer in Bangladesh leading cutting-edge research in microbial bioprocess kinetics, biofilm fermentation, industrial enzymes, and urban microalgae photobioreactors.",
        photoUrl: "/images/team/shahedur-rahman.jpg",
        email: "rahmanms@juniv.edu",
        interests: ["Industrial Biotechnology", "Bioprocess Kinetics", "Enzyme Technology", "Microalgae Photobioreactors", "Biofilm Fermentation"],
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
        interests: ["Applied Microbiology", "Enzyme Immobilization", "Bioactive Compounds", "Biocontrol"],
        profileLinks: { bgeProfile: "https://www.bgeju.edu.bd/faculty_explorer/dr-salma/", juProfile: "https://juniv.edu/department/biogen" },
        joinYear: 2014,
        order: 2,
      },
    ];
    for (const tm of teamMembersList) {
      await prisma.teamMember.create({ data: tm });
    }
    console.log(`✅ Seeded ${teamMembersList.length} team members (first run)`);
  } else {
    console.log(`⏭️  Team members already exist (${teamMemberCount} found) — skipping`);
  }

  // ─── 6. Projects (create only if table is empty) ───────────────────────
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    const liquidTree = await prisma.project.create({
      data: {
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

    await prisma.project.create({
      data: {
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

    await prisma.project.create({
      data: {
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

    // Link project to research area
    const algaeArea = await prisma.researchArea.findUnique({ where: { slug: "algae-biotechnology" } });
    if (algaeArea) {
      await prisma.researchAreasOnProjects.create({
        data: { projectId: liquidTree.id, researchAreaId: algaeArea.id },
      });
    }
    console.log("✅ Seeded 3 research projects (first run)");
  } else {
    console.log(`⏭️  Projects already exist (${projectCount} found) — skipping`);
  }

  // ─── 7. Publications (create only if table is empty) ───────────────────
  const publicationCount = await prisma.publication.count();
  if (publicationCount === 0) {
    const publications = [
      { title: "Construction and investigation of multi-enzyme immobilized matrix for the production of HFCS", authors: ["Khan AW", "Rahman MS", "Zohora US", "Okanami M"], venue: "PLOS ONE", year: 2024, type: PublicationType.JOURNAL, doi: "10.1371/journal.pone.0292931", url: "https://doi.org/10.1371/journal.pone.0292931", featured: true, needsReview: false },
      { title: "Profiling of antioxidant properties and identification of potential analgesic inhibitory activities of Allophylus villosus and Mycetia sinensis employing in vivo, in vitro, and computational techniques", authors: ["Mohammad Shahedur Rahman", "et al."], venue: "Journal of Ethnopharmacology", year: 2025, type: PublicationType.JOURNAL, doi: "10.1016/j.jep.2024.118695", url: "https://doi.org/10.1016/j.jep.2024.118695", featured: true, needsReview: false },
      { title: "Molecular genetics of surfactin and its effects on different sub-populations of Bacillus subtilis", authors: ["Mohammad Shahedur Rahman", "et al."], venue: "Biotechnology Reports", year: 2021, type: PublicationType.JOURNAL, doi: "10.1016/j.btre.2021.e00686", url: "https://doi.org/10.1016/j.btre.2021.e00686", featured: false, needsReview: false },
      { title: "Genome Sequences of Two Novel Coronavirus (SARS-CoV-2) Isolates from Dhaka, Bangladesh", authors: ["Mohammad Shahedur Rahman", "et al."], venue: "Microbiology Resource Announcements", year: 2021, type: PublicationType.JOURNAL, doi: "10.1128/MRA.00511-21", url: "https://doi.org/10.1128/MRA.00511-21", featured: false, needsReview: false },
    ];
    for (const pub of publications) {
      await prisma.publication.create({ data: pub });
    }
    console.log(`✅ Seeded ${publications.length} publications (first run)`);
  } else {
    console.log(`⏭️  Publications already exist (${publicationCount} found) — skipping`);
  }

  // ─── 8. Blog Categories & Posts (create only if table is empty) ────────
  const blogPostCount = await prisma.blogPost.count();
  if (blogPostCount === 0) {
    const catBioprocess = await prisma.category.upsert({ where: { slug: "bioprocess-engineering" }, update: {}, create: { slug: "bioprocess-engineering", name: "Bioprocess Engineering" } });
    const catAlgae = await prisma.category.upsert({ where: { slug: "algae-carbon-capture" }, update: {}, create: { slug: "algae-carbon-capture", name: "Algae & Carbon Capture" } });
    const catBiomaterials = await prisma.category.upsert({ where: { slug: "circular-biomaterials" }, update: {}, create: { slug: "circular-biomaterials", name: "Circular Biomaterials" } });

    await prisma.blogPost.create({
      data: {
        slug: "scaling-urban-microalgae-photobioreactors",
        title: "Scaling Urban Microalgae: Performance Metrics of the 250L Liquid-Tree Photobioreactor",
        excerpt: "An in-depth review of pneumatic bubble column sparging, microalgal biomass accumulation, and urban CO2 sequestration kinetics measured on Jahangirnagar University campus.",
        bodyHtml: `<p>Urban microalgal photobioreactors offer a high-efficiency mechanism for localized atmospheric carbon capture and municipal air purification in dense metropolitan hubs.</p>`,
        coverImage: "/images/liquid-tree.jpg",
        authorName: "Prof. Mohammad Shahedur Rahman",
        categoryId: catAlgae.id,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date("2026-02-15"),
        readingTime: 4,
      },
    });

    await prisma.blogPost.create({
      data: {
        slug: "fermentation-kinetics-industrial-enzymes",
        title: "Optimizing Bioreactor Feeding Regimes for Thermostable Bacterial Cellulase Production",
        excerpt: "How automated fed-batch stirred-tank fermentation regimes improved volumetric productivity and enzyme stability using indigenous Bacillus isolates.",
        bodyHtml: `<p>Industrial biocatalysis requires high-yield, cost-effective enzyme production from resilient microbial hosts.</p>`,
        coverImage: "/images/fermentation.jpg",
        authorName: "Prof. Mohammad Shahedur Rahman",
        categoryId: catBioprocess.id,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date("2026-01-20"),
        readingTime: 5,
      },
    });

    await prisma.blogPost.create({
      data: {
        slug: "circular-bioplastics-jute-residues",
        title: "From Agricultural Residues to Biodegradable Packaging: Jute & Polysaccharide Composites",
        excerpt: "Evaluating mechanical tensile strength and marine biodegradability of starch-chitosan polymer matrices synthesized from regional agro-industrial byproducts.",
        bodyHtml: `<p>Single-use synthetic packaging contributes significantly to municipal plastic pollution. BTIB Lab's Biomaterials Division has engineered renewable, marine-degradable composite films.</p>`,
        coverImage: "/images/bioplastics.jpg",
        authorName: "Prof. Mohammad Shahedur Rahman",
        categoryId: catBiomaterials.id,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date("2025-11-10"),
        readingTime: 4,
      },
    });
    console.log("✅ Seeded 3 blog posts (first run)");
  } else {
    console.log(`⏭️  Blog posts already exist (${blogPostCount} found) — skipping`);
  }

  // ─── 9. Activities (create only if table is empty) ─────────────────────
  const activityCount = await prisma.activity.count();
  if (activityCount === 0) {
    const activitiesList = [
      { slug: "inauguration-250l-liquid-tree-photobioreactor", type: ActivityType.ACHIEVEMENT, title: "Inauguration & Outdoor Commissioning of the 250L Liquid-Tree Photobioreactor", date: new Date("2024-06-12"), location: "Jahangirnagar University Campus, Savar", coverImage: "/images/liquid-tree.jpg", bodyHtml: "<p>The BTIB Laboratory celebrated the successful outdoor commissioning of Bangladesh's first 250-liter microalgae photobioreactor column.</p>", published: true },
      { slug: "national-symposium-industrial-biotech-2025", type: ActivityType.CONFERENCE, title: "National Symposium on Industrial Biotechnology & Circular Bioprocess Engineering", date: new Date("2025-09-18"), location: "Senate Hall, Jahangirnagar University", coverImage: "/images/facilities/cleanroom-pilot.jpg", bodyHtml: "<p>Convening leading researchers, industrial bioprocess engineers, and graduate scholars across Bangladesh.</p>", published: true },
      { slug: "subtropical-wetlands-microbial-sampling-expedition", type: ActivityType.VISIT, title: "Field Sampling Expedition: Microbial Diversity in Subtropical Wetland Ecosystems", date: new Date("2025-11-04"), location: "Savar & Turag River Basin, Dhaka", coverImage: "/images/hero-lab.jpg", bodyHtml: "<p>BTIB Lab researchers conducted field sampling of water and sediment isolates.</p>", published: true },
      { slug: "bioreactor-automation-hplc-workshop", type: ActivityType.WORKSHOP, title: "Hands-on Workshop: Bioreactor Process Automation and HPLC Analytics for Thesis Scholars", date: new Date("2026-01-14"), location: "BTIB Instrumentation Suite, Dept. of BGE", coverImage: "/images/fermentation.jpg", bodyHtml: "<p>An intensive laboratory training session for undergraduate thesis students and master's researchers.</p>", published: true },
    ];
    for (const act of activitiesList) {
      await prisma.activity.create({ data: act });
    }
    console.log(`✅ Seeded ${activitiesList.length} activities (first run)`);
  } else {
    console.log(`⏭️  Activities already exist (${activityCount} found) — skipping`);
  }

  // ─── 10. Gallery Albums & Images (create only if table is empty) ───────
  const galleryAlbumCount = await prisma.galleryAlbum.count();
  if (galleryAlbumCount === 0) {
    const albumPilot = await prisma.galleryAlbum.create({
      data: { slug: "pilot-photobioreactor-and-facilities", title: "Pilot Photobioreactors & Facilities", description: "Visual documentation of the 250-liter microalgal photobioreactor installations and cleanroom pilot facilities at Jahangirnagar University.", coverImage: "/images/liquid-tree.jpg", order: 1, published: true },
    });

    const albumBench = await prisma.galleryAlbum.create({
      data: { slug: "bioprocess-operations-and-instrumentation", title: "Bioprocess Operations & Instrumentation", description: "Stirred-tank fermenters, automated telemetry, and analytical instrumentation in BTIB laboratories.", coverImage: "/images/fermentation.jpg", order: 2, published: true },
    });

    const albumMaterials = await prisma.galleryAlbum.create({
      data: { slug: "biomaterials-and-benchwork", title: "Circular Biomaterials & Laboratory Benchwork", description: "Synthesis of biodegradable polymers, enzyme assays, and researchers at work.", coverImage: "/images/bioplastics.jpg", order: 3, published: true },
    });

    await prisma.galleryImage.createMany({
      data: [
        { albumId: albumPilot.id, cloudinaryPublicId: "liquid_tree_main", url: "/images/liquid-tree.jpg", alt: "250L Liquid-Tree Urban Photobioreactor Column at JU Campus", caption: "Continuous pneumatic bubble loop cultivation of Chlorella vulgaris for urban CO2 mitigation.", width: 1200, height: 800, order: 1 },
        { albumId: albumPilot.id, cloudinaryPublicId: "cleanroom_pilot_main", url: "/images/facilities/cleanroom-pilot.jpg", alt: "Cleanroom Pilot Fermentation & Bioprocessing Suite", caption: "Full glass-partitioned pilot cleanroom with stainless steel bioreactor trains.", width: 1200, height: 800, order: 2 },
        { albumId: albumPilot.id, cloudinaryPublicId: "hero_lab_suite", url: "/images/hero-lab.jpg", alt: "Active Biotechnology Laboratory Suite", caption: "Researchers operating continuous microalgae photobioreactors.", width: 1200, height: 800, order: 3 },
        { albumId: albumBench.id, cloudinaryPublicId: "fermentation_bench_main", url: "/images/fermentation.jpg", alt: "Automated Stirred-Tank Bioreactor Bench", caption: "Sartorius benchtop fermenters with real-time DO and pH cascade control.", width: 1200, height: 800, order: 1 },
        { albumId: albumBench.id, cloudinaryPublicId: "hplc_instrument", url: "/images/instruments/hplc.jpg", alt: "High-Performance Liquid Chromatography (HPLC) System", caption: "Analytical quantification of secondary metabolites.", width: 1200, height: 800, order: 2 },
        { albumId: albumBench.id, cloudinaryPublicId: "spectrophotometer_bench", url: "/images/instruments/spectrophotometer.jpg", alt: "UV-Vis Spectrophotometer", caption: "Optical density measurement of microbial cell growth.", width: 1200, height: 800, order: 3 },
        { albumId: albumMaterials.id, cloudinaryPublicId: "bioplastics_characterization", url: "/images/bioplastics.jpg", alt: "Biopolymer Characterization & Films Station", caption: "Petri dish testing of starch-chitosan composite biodegradable films.", width: 1200, height: 800, order: 1 },
        { albumId: albumMaterials.id, cloudinaryPublicId: "gel_electrophoresis", url: "/images/instruments/gel-electrophoresis.jpg", alt: "Agarose Gel Electrophoresis Unit", caption: "Resolution of recombinant DNA constructs.", width: 1200, height: 800, order: 2 },
      ],
    });
    console.log("✅ Seeded gallery albums & images (first run)");
  } else {
    console.log(`⏭️  Gallery albums already exist (${galleryAlbumCount} found) — skipping`);
  }

  // ─── 11. Equipment & Chemicals (create only if table is empty) ─────────
  const equipmentCount = await prisma.equipment.count();
  if (equipmentCount === 0) {
    const initialEquipmentAndChemicals = [
      // Section 1: Laboratory Equipment & Instrumentation
      { name: "5L Automated Stirred-Tank Bioreactor (Sartorius Biostat B)", category: "Bioprocess & Fermentation", description: "Digital cascade control for dissolved oxygen (DO), agitation (50-1000 RPM), pH peristaltic titration, and temperature regulation.", imageUrl: "/images/fermentation.jpg", order: 1, published: true },
      { name: "250L Liquid-Tree Microalgal Photobioreactor Column", category: "Photobioreactors & Pilot Systems", description: "Pneumatic bubble-sparged outdoor/indoor microalgal cultivation column utilizing Chlorella vulgaris for volumetric carbon capture.", imageUrl: "/images/liquid-tree.jpg", order: 2, published: true },
      { name: "High-Performance Liquid Chromatography (HPLC) System", category: "Analytical Instrumentation", description: "Isocratic and gradient quaternary pump system with UV/Vis diode array detector.", imageUrl: "/images/instruments/hplc.jpg", order: 3, published: true },
      { name: "UV-Vis Double Beam Spectrophotometer (Shimadzu UV-1800)", category: "Analytical Instrumentation", description: "Spectral range 190 to 1100 nm with 1 nm bandpass for enzyme assay kinetics.", imageUrl: "/images/instruments/spectrophotometer.jpg", order: 4, published: true },
      { name: "Horizontal Agarose Gel Electrophoresis Suite & UV Transilluminator", category: "Molecular Biology & Electrophoresis", description: "Precision submarine electrophoresis tanks with high-voltage power supplies.", imageUrl: "/images/instruments/gel-electrophoresis.jpg", order: 5, published: true },
      { name: "High-Speed Refrigerated Centrifuge (Thermo Sorvall)", category: "Centrifugation & Incubation", description: "Maximum speed 15,000 RPM (21,000 x g) with temperature control -10°C to +40°C.", imageUrl: null, order: 6, published: true },
      { name: "Class II Type A2 Biosafety Cabinet", category: "Sterilization & Cleanroom", description: "HEPA-filtered laminar airflow containment providing ISO Class 5 sterile environment.", imageUrl: "/images/facilities/cleanroom-pilot.jpg", order: 7, published: true },
      { name: "Ultra-Low Temperature -86°C Cryogenic Freezer", category: "Sterilization & Cleanroom", description: "Deep-freeze storage system safeguarding the BTIB indigenous microbial strain bank.", imageUrl: null, order: 8, published: true },
      // Section 2: Chemicals & Reagents
      { name: "BG-11 Microalgae Growth Medium Broth Formulation", category: "Culture Media & Broths", description: "Optimized synthetic nitrogen, phosphorus, and trace metal formulation for Chlorella and Cyanobacteria.", imageUrl: null, order: 1, published: true },
      { name: "Luria-Bertani (LB) Broth & Agar Powder (Microbiology Grade)", category: "Culture Media & Broths", description: "Standardized tryptone, yeast extract, and sodium chloride nutrient media.", imageUrl: null, order: 2, published: true },
      { name: "High-Purity Natural Chitosan (Deacetylation Degree ≥ 90%)", category: "Fine Chemicals & Solvents", description: "Biopolymer precursor derived from crustacean chitin for biodegradable packaging films.", imageUrl: "/images/bioplastics.jpg", order: 3, published: true },
      { name: "Taq DNA Polymerase 5 U/µL & 10X Reaction Buffer (with MgCl2)", category: "Molecular Biology Reagents", description: "Recombinant thermostable polymerase enzyme for genomic DNA 16S rRNA gene amplification.", imageUrl: null, order: 4, published: true },
      { name: "HPLC-Grade Acetonitrile & Methanol (Purity ≥ 99.9%)", category: "Fine Chemicals & Solvents", description: "Sub-micron filtered mobile phase solvents with low UV background absorbance.", imageUrl: null, order: 5, published: true },
      { name: "Acrylamide / Bis-Acrylamide 29:1 Solution (30% w/v)", category: "Molecular Biology Reagents", description: "Ultra-pure deionized monomer solution for SDS-PAGE protein characterization.", imageUrl: null, order: 6, published: true },
      { name: "Tris-EDTA (TE) Buffer 100X Concentrate (pH 8.0, Molecular Grade)", category: "Buffers & Analytical Salts", description: "Nuclease-free standard buffer for nucleic acid solubilization and extraction.", imageUrl: null, order: 7, published: true },
      { name: "Coomassie Brilliant Blue R-250 Protein Staining Dye", category: "Stains, Dyes & Indicators", description: "High-sensitivity colorimetric dye for visualizing protein bands in gels.", imageUrl: null, order: 8, published: true },
      { name: "Ampicillin Sodium Salt (Bacteriological Selective Agent)", category: "Antibiotics & Selective Agents", description: "High-potency beta-lactam antibiotic for selective agar plates.", imageUrl: null, order: 9, published: true },
      { name: "3,5-Dinitrosalicylic Acid (DNS) Reducing Sugar Reagent", category: "Enzymes & Biochemical Substrates", description: "Standardized colorimetric assay reagent for cellulase, amylase, and xylanase activities.", imageUrl: null, order: 10, published: true },
    ];
    for (const item of initialEquipmentAndChemicals) {
      await prisma.equipment.create({ data: item });
    }
    console.log(`✅ Seeded ${initialEquipmentAndChemicals.length} equipment & chemical records (first run)`);
  } else {
    console.log(`⏭️  Equipment already exists (${equipmentCount} found) — skipping`);
  }

  console.log("\n✨ Non-destructive seed completed. Admin-managed data is safe.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
