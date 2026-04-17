"use client";

import { useState } from "react";
import { FileText, Globe, Upload, Plus, Trash2, CheckCircle, Clock } from "lucide-react";

const trainings = [
  { id: 1, type: "text", title: "FAQ Geral", status: "active", created: "20/03/2026", size: "2.4 KB" },
  { id: 2, type: "website", title: "https://minhaempresa.com.br", status: "active", created: "19/03/2026", size: "45 KB" },
  { id: 3, type: "document", title: "catalogo_produtos.pdf", status: "processing", created: "23/03/2026", size: "1.2 MB" },
];

const typeIcons: Record<string, React.ElementType> = {
  text: FileText,
  website: Globe,
  document: Upload,
};

const typeLabels: Record<string, string> = {
  text: "Texto",
  website: "Website",
  document: "Documento",
};

const typeColors: Record<string, string> = {
  text: "bg-blue-100 text-blue-700",
  website: "bg-emerald-100 text-emerald-700",
  document: "bg-orange-100 text-orange-700",
};

export default function TrainingsPage() {
  const [activeTab, setActiveTab] = useState<"text" | "website" | "document">("text");

  return (
    <div className="max-w-3xl space-y-6">
      {/* Add training */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-sm font-semibold text-[#111827] mb-4">Adicionar Treinamento</h2>

        <div className="flex gap-2 mb-4">
          {(["text", "website", "document"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#EDE9FE] text-[#7C3AED]"
                  : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6]"
              }`}
            >
              {typeLabels[tab]}
            </button>
          ))}
        </div>

        {activeTab === "text" && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Título do conteúdo"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors"
            />
            <textarea
              rows={6}
              placeholder="Cole ou escreva o conteúdo que o agente deve aprender..."
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors resize-none"
            />
          </div>
        )}

        {activeTab === "website" && (
          <div className="space-y-3">
            <input
              type="url"
              placeholder="https://seusite.com.br"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors"
            />
            <p className="text-xs text-[#9CA3AF]">
              O sistema irá rastrear e indexar o conteúdo do site automaticamente.
            </p>
          </div>
        )}

        {activeTab === "document" && (
          <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 flex flex-col items-center gap-3 hover:border-[#7C3AED] hover:bg-[#EDE9FE]/20 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
              <Upload size={18} className="text-[#7C3AED]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#374151]">Arraste um arquivo ou clique para selecionar</p>
              <p className="text-xs text-[#9CA3AF] mt-1">PDF, DOCX, TXT até 10MB</p>
            </div>
          </div>
        )}

        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={15} />
          Adicionar treinamento
        </button>
      </div>

      {/* Trainings list */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-sm font-semibold text-[#111827] mb-4">
          Base de Conhecimento ({trainings.length})
        </h2>

        <div className="space-y-2">
          {trainings.map((t) => {
            const Icon = typeIcons[t.type];
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <div className={`p-2 rounded-lg ${typeColors[t.type]}`}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111827] truncate">{t.title}</p>
                  <p className="text-xs text-[#9CA3AF]">{t.size} · {t.created}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {t.status === "active" ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                      <CheckCircle size={12} /> Ativo
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <Clock size={12} /> Processando
                    </span>
                  )}
                  <button className="p-1 rounded hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-[#9CA3AF] hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
