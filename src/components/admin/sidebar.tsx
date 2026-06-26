import Link from "next/link";
import { signOut } from "@/lib/auth";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  BarChart3,
  Award,
  Briefcase,
  HelpCircle,
  Star,
  Wrench,
  Link2,
  Clock,
  FileUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/resume", label: "Resume", icon: FileUser },
  { href: "/admin/timeline", label: "Timeline", icon: Clock },
  { href: "/admin/social", label: "Social Links", icon: Link2 },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-white/10 bg-zinc-950 p-4">
      <div className="mb-8 px-2">
        <Link href="/admin/dashboard" className="text-lg font-bold text-violet-400">
          Admin Panel
        </Link>
        <p className="text-xs text-zinc-500">Hasnat Portfolio CMS</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="space-y-2 border-t border-white/10 pt-4">
        <Link href="/" className="block px-3 text-xs text-zinc-500 hover:text-zinc-300">
          View Site →
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  );
}
