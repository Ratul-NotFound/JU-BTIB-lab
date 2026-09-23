"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const LivingColonyCanvas = dynamic(
  () => import("@/components/visuals/living-colony-canvas").then((mod) => mod.LivingColonyCanvas),
  { ssr: false }
);

export function HeroCanvasWrapper() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <LivingColonyCanvas />;
}
