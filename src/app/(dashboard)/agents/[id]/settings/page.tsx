"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeftRight, FileText, Clock, Smile, PenLine, ShieldAlert,
  SplitSquareVertical, Bell, Globe, Timer, Hash, Loader2, Check, Trash2,
} from "lucide-react";
import { type AgentBehavior, defaultBehavior, mergeBehavior } from "@/types/agent";

const DAY_LABELS: Record<string, string> = {
  seg: "Segunda-feira", ter: "Terça-feira", qua: "Quarta-feira",
  qui: "Quinta-feira", sex: "Sexta-feira", sab: "Sábado", dom: "Domingo",
};
const DAY_SHORT: Record<string, string> = {
  seg: "Seg", ter: "Ter", qua: "Qua", qui: "Qui", sex: "Sex", sab: "Sab", dom: "Dom",
};
const TIMEZONES = [
  "America/Sao_Paulo", "America/Bahia", "America/Manaus",
  "America/Belem", "America/Cuiaba", "America/Fortaleza",
  "America/Recife", "America/Rio_Branco",
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#7C3AED]" : "bg-[#D1D5DB]"}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${checked ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`} />
    </button>
  );
}

function SettingRow({ icon: Icon, title, desc, children }: {
  icon: React.ElementType; title: string; desc: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#F3F4F6] last:border-0">
      <div className="flex items-start gap-3">
        <Icon size={20} className="text-[#7C3AED] mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-[#111827]">{title}</p>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="shrink-0 ml-4">{children}</div>
    </div>
  );
}

export default function AgentSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const [behavior, setBehavior] = useState<AgentBehavior>(defaultBehavior);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHours, setShowHours] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/agents/${id}`);
    if (res.ok) {
      const data = await res.json();
      setBehavior(mergeBehavior(data.behavior));
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const s = behavior.settings;
  const update = (patch: Partial<typeof s>) => {
    setBehavior(prev => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  };

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ behavior }),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#7C3AED]" size={24} /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Comportamento */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-sm font-semibold text-[#111827] mb-2">Comportamento do Agente</h2>
        <SettingRow icon={ArrowLeftRight} title="Transferir para humano" desc="Permite transferir o atendimento para equipe humana.">
          <Toggle checked={s.transferToHuman} onChange={v => update({ transferToHuman: v })} />
        </SettingRow>
        <SettingRow icon={FileText} title="Resumo ao transferir para humano" desc="Gera resumo automático ao transferir a conversa.">
          <Toggle checked={s.summaryOnTransfer} onChange={v => update({ summaryOnTransfer: v })} />
        </SettingRow>
        <SettingRow icon={Smile} title="Usar Emojis Nas Respostas" desc="Define se o agente pode utilizar emojis.">
          <Toggle checked={s.useEmojis} onChange={v => update({ useEmojis: v })} />
        </SettingRow>
        <SettingRow icon={PenLine} title="Assinar nome do agente nas respostas" desc="Adiciona assinatura automática em cada resposta.">
          <Toggle checked={s.signAgentName} onChange={v => update({ signAgentName: v })} />
        </SettingRow>
        <SettingRow icon={ShieldAlert} title="Restringir Temas Permitidos" desc="O agente não fala sobre outros assuntos.">
          <Toggle checked={s.restrictTopics} onChange={v => update({ restrictTopics: v })} />
        </SettingRow>
        <SettingRow icon={SplitSquareVertical} title="Dividir resposta em partes" desc="Mensagens grandes são separadas em várias mensagens.">
          <Toggle checked={s.splitResponses} onChange={v => update({ splitResponses: v })} />
        </SettingRow>
        <SettingRow icon={Bell} title="Permitir registrar lembretes" desc="O agente pode registrar lembretes ao usuário.">
          <Toggle checked={s.allowReminders} onChange={v => update({ allowReminders: v })} />
        </SettingRow>
      </div>

      {/* Horário de atendimento */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Clock size={20} className="text-[#7C3AED] mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">Horário de atendimento</h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Configure os dias e horários de atendimento.</p>
            </div>
          </div>
          <button onClick={() => setShowHours(!showHours)} className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors">
            <Clock size={16} className="text-[#6B7280]" />
          </button>
        </div>

        {showHours && (
          <div className="space-y-4 pt-4 mt-4 border-t border-[#F3F4F6]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#374151]">Ativar horário de atendimento</span>
              <Toggle checked={s.businessHours.enabled} onChange={v => update({ businessHours: { ...s.businessHours, enabled: v } })} />
            </div>

            {s.businessHours.enabled && (
              <>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(DAY_SHORT).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        const days = { ...s.businessHours.days };
                        days[key] = { ...days[key], active: !days[key]?.active };
                        update({ businessHours: { ...s.businessHours, days } });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${s.businessHours.days[key]?.active ? "bg-[#7C3AED] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {Object.entries(DAY_LABELS).map(([key, label]) => {
                    const day = s.businessHours.days[key];
                    if (!day?.active) return null;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-xs text-[#374151] w-28">{label}</span>
                        <input type="time" value={day.start}
                          onChange={e => {
                            const days = { ...s.businessHours.days };
                            days[key] = { ...days[key], start: e.target.value };
                            update({ businessHours: { ...s.businessHours, days } });
                          }}
                          className="px-2 py-1 text-xs border border-[#E5E7EB] rounded-lg" />
                        <span className="text-xs text-[#9CA3AF]">–</span>
                        <input type="time" value={day.end}
                          onChange={e => {
                            const days = { ...s.businessHours.days };
                            days[key] = { ...days[key], end: e.target.value };
                            update({ businessHours: { ...s.businessHours, days } });
                          }}
                          className="px-2 py-1 text-xs border border-[#E5E7EB] rounded-lg" />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Tempos e Limites */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-sm font-semibold text-[#111827] mb-2">Tempos e Limites</h2>
        <SettingRow icon={Globe} title="Timezone do agente" desc="Timezone usado para datas e agendamentos.">
          <select value={s.timezone} onChange={e => update({ timezone: e.target.value })}
            className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white">
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace("America/", "").replace(/_/g, " ")}</option>)}
          </select>
        </SettingRow>
        <SettingRow icon={Timer} title="Tempo de resposta" desc="Intervalo antes de responder.">
          <select value={s.responseDelay} onChange={e => update({ responseDelay: Number(e.target.value) })}
            className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white">
            <option value={5}>5 segundos</option>
            <option value={10}>10 segundos</option>
            <option value={15}>15 segundos</option>
            <option value={30}>30 segundos</option>
          </select>
        </SettingRow>
        <SettingRow icon={Hash} title="Limite de interações" desc="Quantidade máxima por atendimento.">
          <select value={s.interactionLimit} onChange={e => update({ interactionLimit: Number(e.target.value) })}
            className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white">
            <option value={0}>Sem limite</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </SettingRow>
      </div>

      {/* Zona de Perigo */}
      <div className="bg-white rounded-xl border border-red-100 p-6">
        <h2 className="text-sm font-semibold text-red-600 mb-1">Zona de Perigo</h2>
        <p className="text-xs text-[#9CA3AF] mb-4">Ações irreversíveis — tenha cuidado.</p>
        <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
          <Trash2 size={15} />
          Excluir agente
        </button>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
        {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar configurações"}
      </button>
    </div>
  );
}
