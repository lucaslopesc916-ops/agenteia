"use client";

import Header from "@/components/layout/Header";
import { Search, Filter, MessageSquare } from "lucide-react";

const conversations = [
  { contact: "Maria Silva", agent: "Atendente Geral", channel: "WhatsApp", lastMessage: "Obrigada pelo atendimento!", status: "Resolvido", updated: "há 5 min" },
  { contact: "João Santos", agent: "Suporte Técnico", channel: "Telegram", lastMessage: "Quando vou receber o suporte?", status: "Em andamento", updated: "há 12 min" },
  { contact: "Ana Costa", agent: "Atendente Geral", channel: "WhatsApp", lastMessage: "Pode me enviar o catálogo?", status: "Resolvido", updated: "há 23 min" },
  { contact: "Pedro Lima", agent: "Vendas", channel: "Instagram", lastMessage: "Qual o preço do plano pro?", status: "Resolvido", updated: "há 1h" },
  { contact: "Carla Mendes", agent: "Atendente Geral", channel: "WhatsApp", lastMessage: "Quero cancelar meu pedido.", status: "Em andamento", updated: "há 1h 30min" },
];

const channelColors: Record<string, string> = {
  WhatsApp: "bg-green-100 text-green-700",
  Telegram: "bg-blue-100 text-blue-700",
  Instagram: "bg-pink-100 text-pink-700",
};

const statusColors: Record<string, string> = {
  Resolvido: "bg-emerald-100 text-emerald-700",
  "Em andamento": "bg-amber-100 text-amber-700",
};

export default function ConversationsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header title="Conversas" subtitle="Histórico de atendimentos" />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={15} />
            <input
              type="text"
              placeholder="Buscar conversas..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E5E7EB] text-[#6B7280] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors">
            <Filter size={15} />
            Filtrar
          </button>
        </div>

        <div className="space-y-2">
          {conversations.map((conv, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED]/20 to-[#0D9488]/20 flex items-center justify-center text-[#7C3AED] font-semibold text-sm shrink-0">
                    {conv.contact.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#111827]">{conv.contact}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${channelColors[conv.channel]}`}>
                        {conv.channel}
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">Agente: {conv.agent}</p>
                    <p className="text-sm text-[#6B7280] mt-1 truncate">{conv.lastMessage}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <p className="text-xs text-[#9CA3AF]">{conv.updated}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[conv.status]}`}>
                    {conv.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
