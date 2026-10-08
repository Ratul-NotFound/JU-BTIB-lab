"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function AdminTopProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = React.useState(false);

  // When pathname or searchParams changes, navigation has completed
  React.useEffect(() => {
    setNavigating(false);
  }, [pathname, searchParams]);

  // Intercept internal admin link clicks to start progress bar instantly
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        href &&
        href.startsWith("/admin") &&
        !href.startsWith("#") &&
        target.target !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        const currentUrl = window.location.pathname + window.location.search;
        if (href !== currentUrl) {
          setNavigating(true);
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!navigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 overflow-hidden bg-transparent pointer-events-none">
      <div className="h-full bg-gradient-to-r from-[var(--bio-teal)] via-[var(--bio-cyan)] to-[var(--bio-teal)] animate-admin-progress shadow-[0_0_8px_var(--bio-teal)]" />
    </div>
  );
}
