import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bioresources Technology & Industrial Biotechnology Laboratory (BTIB Lab)",
    short_name: "BTIB Lab JU",
    description:
      "Official website of BTIB Lab, Department of Biotechnology & Genetic Engineering, Jahangirnagar University, Savar, Dhaka-1342.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFBFB",
    theme_color: "#0D9488",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
