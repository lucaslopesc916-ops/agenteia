"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Users,
  MessageSquare,
  Settings,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Agentes",
    href: "/agents",
    icon: Bot,
  },
  {
    label: "Contatos",
    href: "/contacts",
    icon: Users,
  },
  {
    label: "Conversas",
    href: "/conversations",
    icon: MessageSquare,
  },
  {
    label: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <aside className="flex flex-col w-64 h-full bg-white border-r border-[#E5E7EB] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#7C3AED]">
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <span className="text-[15px] font-semibold text-[#111827] tracking-tight">
          Winner<span className="text-[#7C3AED]">.AI</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#EDE9FE] text-[#7C3AED]"
                  : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"
              )}
            >
              <Icon
                className={cn(
                  "w-4.5 h-4.5 shrink-0",
                  isActive ? "text-[#7C3AED]" : "text-[#9CA3AF]"
                )}
                size={18}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Logout */}
      <div className="px-3 pb-4 border-t border-[#E5E7EB] pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-50 text-[#6B7280] hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
