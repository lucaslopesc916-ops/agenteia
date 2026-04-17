"use client";

import { Trash2 } from "lucide-react";

export default function AgentSettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-sm font-semibold text-[#111827] mb-4">Geral</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[#111827]">Agente ativo</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Permite ou bloqueia atendimentos</p>
            </div>
            <button className="relative w-10 h-5 bg-[#7C3AED] rounded-full transition-colors">
              <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-red-100 p-6">
        <h2 className="text-sm font-semibold text-red-600 mb-1">Zona de Perigo</h2>
        <p className="text-xs text-[#9CA3AF] mb-4">Ações irreversíveis — tenha cuidado.</p>
        <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
          <Trash2 size={15} />
          Excluir agente
        </button>
      </div>
    </div>
  );
}
