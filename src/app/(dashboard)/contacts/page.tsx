"use client";

import Header from "@/components/layout/Header";
import { Search, UserPlus, Filter, Phone, MessageSquare, MoreHorizontal } from "lucide-react";

const contacts = [
  { name: "Maria Silva", phone: "+55 11 98765-4321", source: "WhatsApp", created: "20/03/2026", conversations: 5 },
  { name: "João Santos", phone: "+55 21 97654-3210", source: "Telegram", created: "19/03/2026", conversations: 2 },
  { name: "Ana Costa", phone: "+55 31 96543-2109", source: "WhatsApp", created: "18/03/2026", conversations: 8 },
  { name: "Pedro Lima", phone: "+55 41 95432-1098", source: "Instagram", created: "17/03/2026", conversations: 1 },
  { name: "Carla Mendes", phone: "+55 51 94321-0987", source: "WhatsApp", created: "16/03/2026", conversations: 3 },
];

const sourceColors: Record<string, string> = {
  WhatsApp: "bg-green-100 text-green-700",
  Telegram: "bg-blue-100 text-blue-700",
  Instagram: "bg-pink-100 text-pink-700",
};

export default function ContactsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header title="Contatos" subtitle="Sua base de leads e clientes" />

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={15} />
            <input
              type="text"
              placeholder="Buscar contatos..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E5E7EB] text-[#6B7280] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors">
              <Filter size={15} />
              Filtrar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium rounded-lg transition-colors">
              <UserPlus size={15} />
              Adicionar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F3F4F6]">
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-4 py-3">Nome</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-4 py-3">Telefone</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-4 py-3">Canal</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-4 py-3">Conversas</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-4 py-3">Cadastrado</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {contacts.map((contact, i) => (
                <tr key={i} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C3AED]/20 to-[#0D9488]/20 flex items-center justify-center text-[#7C3AED] text-xs font-semibold">
                        {contact.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-[#111827]">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                      <Phone size={13} />
                      {contact.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sourceColors[contact.source]}`}>
                      {contact.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                      <MessageSquare size={13} />
                      {contact.conversations}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#9CA3AF]">{contact.created}</td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-[#F3F4F6] transition-colors">
                      <MoreHorizontal size={15} className="text-[#9CA3AF]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-[#F3F4F6] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">Mostrando 5 de 342 contatos</p>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">Anterior</button>
              <button className="px-3 py-1.5 text-xs bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors">Próximo</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
