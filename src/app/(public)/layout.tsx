import { Navbar } from "@/components/layout/navbar";
import { prisma } from "@/lib/prisma";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let siteName = "MHK.";
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });
    if (settings?.siteName) siteName = settings.siteName.split(" ")[0] + ".";
  } catch {
    // DB not connected yet
  }

  return (
    <>
      <Navbar siteName={siteName} />
      <div className="pt-16">{children}</div>
    </>
  );
}
