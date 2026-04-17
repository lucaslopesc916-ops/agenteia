import Link from "next/link";
import Header from "@/components/layout/Header";
import { ArrowLeft } from "lucide-react";

const tabs = [
  { label: "Perfil", href: "profile" },
  { label: "Trabalho", href: "work" },
  { label: "Treinamentos", href: "trainings" },
  { label: "Testar", href: "playground" },
  { label: "Canais", href: "channels" },
  { label: "Configurações", href: "settings" },
];

interface AgentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function AgentLayout({ children, params }: AgentLayoutProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header title="Configurar Agente" />

      <div className="px-6 pt-4 bg-white border-b border-[#E5E7EB]">
        <Link
          href="/agents"
          className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#6B7280] mb-3 transition-colors"
        >
          <ArrowLeft size={13} />
          Voltar para agentes
        </Link>

        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={`/agents/${id}/${tab.href}`}
              className="px-3 py-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] border-b-2 border-transparent hover:border-[#7C3AED] transition-colors"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
