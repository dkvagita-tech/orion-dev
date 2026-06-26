import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ siteName = "MHK." }: { siteName?: string }) {
  return (
    <header className="fixed top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-lg font-bold text-transparent">
          {siteName}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <Link href="/admin/login" className="text-sm text-violet-400 hover:text-violet-300">
            Admin
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
