"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Bot, Plus, MessageSquare, Zap, MoreHorizontal, Loader2 } from "lucide-react";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  model: string;
  tone: string;
  active: boolean;
  channels: { type: string }[];
  _count: { conversations: number };
}

const channelColors: Record<string, string> = {
  whatsapp: "bg-green-100 text-green-700",
  telegram: "bg-blue-100 text-blue-700",
  instagram: "bg-pink-100 text-pink-700",
};

const channelLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  instagram: "Instagram",
};

const toneLabels: Record<string, string> = {
  professional: "Profissional",
  friendly: "Amigável",
  technical: "Técnico",
  persuasive: "Persuasivo",
  empathetic: "Empático",
};

const modelLabels: Record<string, string> = {
  "gpt-4o-mini": "GPT-4o Mini",
  "gpt-4o": "GPT-4o",
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    const res = await fetch("/api/agents");
    if (res.ok) {
      const data = await res.json();
      setAgents(data);
    }
    setLoading(false);
  }

  async function handleCreateAgent() {
    setCreating(true);
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Novo Agente" }),
    });

    if (res.ok) {
      const agent = await res.json();
      // Navigate to the new agent's profile page
      window.location.href = `/agents/${agent.id}/profile`;
    }
    setCreating(false);
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header
        title="Agentes"
        subtitle="Gerencie seus agentes de IA para atendimento"
      />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#6B7280]">
            {loading ? "..." : `${agents.length} agente${agents.length !== 1 ? "s" : ""} criado${agents.length !== 1 ? "s" : ""}`}
          </p>
          <button
            onClick={handleCreateAgent}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Novo agente
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#7C3AED]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#0D9488] flex items-center justify-center text-white">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#111827]">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-[#9CA3AF]">
                        {modelLabels[agent.model] || agent.model}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${agent.active ? "bg-emerald-500" : "bg-gray-300"}`}
                    />
                    <button className="p-1 rounded hover:bg-[#F9FAFB] transition-colors">
                      <MoreHorizontal size={16} className="text-[#9CA3AF]" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-1">
                    <MessageSquare size={12} />
                    <span>{agent._count.conversations} conversas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={12} />
                    <span>{toneLabels[agent.tone] || agent.tone}</span>
                  </div>
                </div>

                {agent.channels.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {agent.channels.map((ch) => (
                      <span
                        key={ch.type}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${channelColors[ch.type] || "bg-gray-100 text-gray-700"}`}
                      >
                        {channelLabels[ch.type] || ch.type}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/agents/${agent.id}/profile`}
                  className="block w-full text-center text-sm font-medium text-[#7C3AED] border border-[#7C3AED]/30 hover:bg-[#EDE9FE] py-2 rounded-lg transition-colors"
                >
                  Configurar agente
                </Link>
              </div>
            ))}

            {/* Create new agent card */}
            <button
              onClick={handleCreateAgent}
              disabled={creating}
              className="bg-white rounded-xl border-2 border-dashed border-[#E5E7EB] p-5 flex flex-col items-center justify-center gap-3 hover:border-[#7C3AED] hover:bg-[#EDE9FE]/30 transition-colors min-h-[200px] group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] group-hover:bg-[#EDE9FE] flex items-center justify-center transition-colors">
                {creating ? (
                  <Loader2 size={20} className="animate-spin text-[#7C3AED]" />
                ) : (
                  <Plus size={20} className="text-[#9CA3AF] group-hover:text-[#7C3AED] transition-colors" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#6B7280] group-hover:text-[#7C3AED] transition-colors">
                  Criar novo agente
                </p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Configure e treine seu assistente de IA
                </p>
              </div>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
