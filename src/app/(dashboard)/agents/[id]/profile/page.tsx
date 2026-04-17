"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Bot, Upload, Loader2, Check } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  model: string;
  tone: string;
  system_prompt: string;
  avatar_url: string | null;
}

export default function AgentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [tone, setTone] = useState("professional");
  const [systemPrompt, setSystemPrompt] = useState("");

  const loadAgent = useCallback(async () => {
    const res = await fetch(`/api/agents/${id}`);
    if (res.ok) {
      const data = await res.json();
      setAgent(data);
      setName(data.name || "");
      setModel(data.model || "gpt-4o-mini");
      setTone(data.tone || "professional");
      setSystemPrompt(data.system_prompt || "");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadAgent();
  }, [loadAgent]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, model, tone, systemPrompt }),
    });
    if (res.ok) {
      const data = await res.json();
      setAgent(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#7C3AED]" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-sm font-semibold text-[#111827] mb-4">Dados do Agente</h2>

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">
              Modelo de IA
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors bg-white"
            >
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
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors bg-white"
            >
              <option value="professional">Profissional</option>
              <option value="friendly">Amigável e informal</option>
              <option value="technical">Técnico</option>
              <option value="sales">Persuasivo (vendas)</option>
              <option value="support">Empático (suporte)</option>
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
          rows={10}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Ex: Você é um assistente de vendas..."
          className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors resize-none font-mono"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saved ? (
            <Check size={14} />
          ) : null}
          {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}
