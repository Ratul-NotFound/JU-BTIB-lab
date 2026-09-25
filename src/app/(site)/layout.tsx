import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen" suppressHydrationWarning>
      <SiteHeader />
      <main className="flex-1" suppressHydrationWarning>{children}</main>
      <SiteFooter />
    </div>
  );
}
