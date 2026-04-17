"use client";

import { Bot, Upload } from "lucide-react";

export default function AgentProfilePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-sm font-semibold text-[#111827] mb-4">Dados do Agente</h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#0D9488] flex items-center justify-center text-white">
            <Bot size={28} />
          </div>
          <div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">
              <Upload size={14} />
              Trocar foto
            </button>
            <p className="text-xs text-[#9CA3AF] mt-1">PNG, JPG até 2MB</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">
              Nome do agente
            </label>
            <input
              type="text"
              defaultValue="Atendente Geral"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">
              Modelo de IA
            </label>
            <select className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors bg-white">
              <optgroup label="OpenAI">
                <option value="gpt-4o-mini">GPT-4o Mini (rápido e econômico)</option>
                <option value="gpt-4o">GPT-4o (mais capaz)</option>
              </optgroup>
              <optgroup label="Anthropic">
                <option value="claude-sonnet-4-20250514">Claude Sonnet 4 (inteligente e rápido)</option>
                <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (ultra-rápido e barato)</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">
              Tom de voz
            </label>
            <select className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors bg-white">
              <option>Profissional</option>
              <option>Amigável e informal</option>
              <option>Técnico</option>
              <option>Persuasivo (vendas)</option>
              <option>Empático (suporte)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-sm font-semibold text-[#111827] mb-1">Prompt do Sistema</h2>
        <p className="text-xs text-[#9CA3AF] mb-4">
          Defina a personalidade, regras e objetivos do agente.
        </p>
        <textarea
          rows={8}
          defaultValue={`Você é um assistente de atendimento ao cliente da [Nome da Empresa]. Seu objetivo é ajudar os clientes com dúvidas, informações sobre produtos e resolver problemas de forma eficiente e cordial.

Regras:
- Sempre seja educado e profissional
- Responda de forma clara e objetiva
- Caso não saiba a resposta, diga que vai verificar e encaminhe para um humano
- Nunca invente informações`}
          className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors resize-none font-mono"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium rounded-lg transition-colors">
          Salvar alterações
        </button>
        <button className="px-5 py-2 border border-[#E5E7EB] text-[#6B7280] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}
