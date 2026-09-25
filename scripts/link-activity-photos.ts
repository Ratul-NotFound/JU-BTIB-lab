import { db } from "../src/lib/db";

async function main() {
  const actLiquidTree = await db.activity.findUnique({
    where: { slug: "inauguration-250l-liquid-tree-photobioreactor" },
  });
  const actWorkshop = await db.activity.findUnique({
    where: { slug: "bioreactor-automation-hplc-workshop" },
  });
  const actExpedition = await db.activity.findUnique({
    where: { slug: "subtropical-wetlands-microbial-sampling-expedition" },
  });
  const actSymposium = await db.activity.findUnique({
    where: { slug: "national-symposium-industrial-biotech-2025" },
  });

  const albumPBR = await db.galleryAlbum.findUnique({
    where: { slug: "pilot-photobioreactor-and-facilities" },
  });
  const albumOps = await db.galleryAlbum.findUnique({
    where: { slug: "bioprocess-operations-and-instrumentation" },
  });

  if (actLiquidTree && albumPBR) {
    await db.galleryAlbum.update({
      where: { id: albumPBR.id },
      data: { activityId: actLiquidTree.id },
    });
    console.log("Linked PBR album to Liquid Tree activity");
  }

  if (actWorkshop && albumOps) {
    await db.galleryAlbum.update({
      where: { id: albumOps.id },
      data: { activityId: actWorkshop.id },
    });
    console.log("Linked Bioprocess album to Workshop activity");
  }

  if (actExpedition) {
    const existing = await db.galleryAlbum.findUnique({
      where: { slug: "wetland-sampling-expedition-photos" },
    });
    if (!existing) {
      await db.galleryAlbum.create({
        data: {
          slug: "wetland-sampling-expedition-photos",
          title: "Subtropical Wetland Field Sampling Documentation",
          description:
            "Field sampling isolates and water collection along the Turag River and Savar wetlands.",
          coverImage: "/images/hero-lab.jpg",
          activityId: actExpedition.id,
          order: 4,
          published: true,
          images: {
            create: [
              {
                cloudinaryPublicId: "expedition_site_1",
                url: "/images/hero-lab.jpg",
                width: 1200,
                height: 800,
                alt: "Field sampling team in wetland collection site",
                caption:
                  "Collection of submerged sediment cores for extremophile screening.",
                order: 1,
              },
              {
                cloudinaryPublicId: "expedition_lake_site",
                url: "/images/ju-lake.jpg",
                width: 1200,
                height: 800,
                alt: "Jahangirnagar University wetland waters",
                caption:
                  "Aquatic sampling station for microbial diversity isolation.",
                order: 2,
              },
            ],
          },
        },
      });
      console.log("Created album for Wetland Expedition");
    }
  }

  if (actSymposium) {
    const existingSym = await db.galleryAlbum.findUnique({
      where: { slug: "national-symposium-2025-photos" },
    });
    if (!existingSym) {
      await db.galleryAlbum.create({
        data: {
          slug: "national-symposium-2025-photos",
          title: "National Biotechnology Symposium Keynote & Presentations",
          description:
            "Photographic archive of keynote lectures, poster presentations, and industrial panels at Senate Hall.",
          coverImage: "/images/facilities/cleanroom-pilot.jpg",
          activityId: actSymposium.id,
          order: 5,
          published: true,
          images: {
            create: [
              {
                cloudinaryPublicId: "symposium_cleanroom_showcase",
                url: "/images/facilities/cleanroom-pilot.jpg",
                width: 1200,
                height: 800,
                alt: "Symposium technical exhibition of pilot cleanroom fermentation",
                caption:
                  "Technical workshop showcasing automated pilot bioreactors to symposium attendees.",
                order: 1,
              },
              {
                cloudinaryPublicId: "symposium_biomaterials_display",
                url: "/images/bioplastics.jpg",
                width: 1200,
                height: 800,
                alt: "Circular biomaterials poster and demonstration booth",
                caption:
                  "Exhibition of biodegradable cellulose films and bioresource products.",
                order: 2,
              },
            ],
          },
        },
      });
      console.log("Created album for Symposium");
    }
  }
}

main().catch(console.error);
