"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Calendar, Settings, Sliders, ChevronRight, Plus, Video,
  CalendarCheck, Clock, Shuffle, ArrowRight, User, Building2,
  Timer, FileText, Mail, Tag, Loader2, Check, Hourglass, ArrowLeftRight, X,
} from "lucide-react";
import { type AgentBehavior, type CalendarEntry, defaultBehavior, mergeBehavior } from "@/types/agent";

const DAY_LABELS: Record<string, string> = {
  seg: "Segunda-feira", ter: "Terça-feira", qua: "Quarta-feira",
  qui: "Quinta-feira", sex: "Sexta-feira", sab: "Sábado", dom: "Domingo",
};
const DAY_SHORT: Record<string, string> = {
  seg: "Seg", ter: "Ter", qua: "Qua", qui: "Qui", sex: "Sex", sab: "Sab", dom: "Dom",
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#7C3AED]" : "bg-[#D1D5DB]"}`}>
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${checked ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`} />
    </button>
  );
}

function CalendarConfigModal({ cal, onSave, onClose }: {
  cal: CalendarEntry; onSave: (c: CalendarEntry) => void; onClose: () => void;
}) {
  const [data, setData] = useState(cal);
  const [tab, setTab] = useState<"general" | "hours">("general");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <h3 className="text-sm font-semibold text-[#111827]">{data.name}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#F9FAFB]"><X size={16} className="text-[#9CA3AF]" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB]">
          <button onClick={() => setTab("general")}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${tab === "general" ? "text-[#7C3AED] border-b-2 border-[#7C3AED]" : "text-[#6B7280]"}`}>
            Dados Gerais
          </button>
          <button onClick={() => setTab("hours")}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${tab === "hours" ? "text-[#7C3AED] border-b-2 border-[#7C3AED]" : "text-[#6B7280]"}`}>
            Config. Horários
          </button>
        </div>

        <div className="p-6 space-y-5">
          {tab === "general" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">Nome da agenda</label>
                <input type="text" value={data.name} onChange={e => setData({ ...data, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">Agenda</label>
                <select className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white">
                  <option>Pessoal (principal)</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-start gap-3">
                  <Hourglass size={18} className="text-[#7C3AED] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">Tempo mínimo de antecedência</p>
                    <p className="text-xs text-[#9CA3AF]">Não permita agendas em cima da hora</p>
                  </div>
                </div>
                <select value={data.minAdvanceHours} onChange={e => setData({ ...data, minAdvanceHours: Number(e.target.value) })}
                  className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white">
                  <option value={1}>1 hora</option>
                  <option value={2}>2 horas</option>
                  <option value={3}>3 horas</option>
                  <option value={6}>6 horas</option>
                  <option value={12}>12 horas</option>
                  <option value={24}>24 horas</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-start gap-3">
                  <ArrowLeftRight size={18} className="text-[#7C3AED] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">Distância máxima permitida</p>
                    <p className="text-xs text-[#9CA3AF]">Limite máximo de dias permitido</p>
                  </div>
                </div>
                <select value={data.maxDistanceDays} onChange={e => setData({ ...data, maxDistanceDays: Number(e.target.value) })}
                  className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white">
                  <option value={7}>Até uma semana</option>
                  <option value={14}>Até duas semanas</option>
                  <option value={30}>Até um mês</option>
                  <option value={60}>Até dois meses</option>
                </select>
              </div>
            </>
          )}

          {tab === "hours" && (
            <>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#111827]">Agendamentos simultâneos</p>
                  <p className="text-xs text-[#9CA3AF]">Limite no mesmo horário</p>
                </div>
                <select value={data.simultaneousBookings} onChange={e => setData({ ...data, simultaneousBookings: Number(e.target.value) })}
                  className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white">
                  <option value={0}>Não permitir</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#111827]">Sempre aberto</p>
                  <p className="text-xs text-[#9CA3AF]">Permite agendamento em qualquer horário.</p>
                </div>
                <Toggle checked={data.alwaysOpen} onChange={v => setData({ ...data, alwaysOpen: v })} />
              </div>

              {!data.alwaysOpen && (
                <>
                  <p className="text-sm font-medium text-[#111827]">Horários de atendimento:</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(DAY_SHORT).map(([key, label]) => (
                      <button key={key}
                        onClick={() => {
                          const wh = { ...data.weeklyHours };
                          wh[key] = { ...wh[key], active: !wh[key]?.active };
                          setData({ ...data, weeklyHours: wh });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${data.weeklyHours[key]?.active ? "bg-[#7C3AED] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {Object.entries(DAY_LABELS).map(([key, label]) => {
                      const day = data.weeklyHours[key];
                      if (!day?.active) return null;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-xs text-[#374151] w-28">{label}</span>
                          <input type="time" value={day.start}
                            onChange={e => { const wh = { ...data.weeklyHours }; wh[key] = { ...wh[key], start: e.target.value }; setData({ ...data, weeklyHours: wh }); }}
                            className="px-2 py-1 text-xs border border-[#E5E7EB] rounded-lg" />
                          <span className="text-xs text-[#9CA3AF]">–</span>
                          <input type="time" value={day.end}
                            onChange={e => { const wh = { ...data.weeklyHours }; wh[key] = { ...wh[key], end: e.target.value }; setData({ ...data, weeklyHours: wh }); }}
                            className="px-2 py-1 text-xs border border-[#E5E7EB] rounded-lg" />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-[#E5E7EB]">
          <button onClick={onClose} className="text-xs text-red-500 hover:text-red-700">Remover agenda</button>
          <button onClick={() => onSave(data)}
            className="px-5 py-2 bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-medium rounded-lg transition-colors">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AgentWorkPage() {
  const { id } = useParams<{ id: string }>();
  const [behavior, setBehavior] = useState<AgentBehavior>(defaultBehavior);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"agendas" | "config" | "fields">("agendas");
  const [editingCal, setEditingCal] = useState<CalendarEntry | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/agents/${id}`);
    if (res.ok) {
      const data = await res.json();
      setBehavior(mergeBehavior(data.behavior));
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const cal = behavior.calendar;
  const updateConfig = (patch: Partial<typeof cal.config>) => {
    setBehavior(prev => ({ ...prev, calendar: { ...prev.calendar, config: { ...prev.calendar.config, ...patch } } }));
  };
  const updateFields = (patch: Partial<typeof cal.fields>) => {
    setBehavior(prev => ({ ...prev, calendar: { ...prev.calendar, fields: { ...prev.calendar.fields, ...patch } } }));
  };

  function addCalendar() {
    const newCal: CalendarEntry = {
      id: Date.now().toString(),
      name: "Nova Agenda",
      calendarId: "primary",
      minAdvanceHours: 3,
      maxDistanceDays: 7,
      simultaneousBookings: 0,
      alwaysOpen: false,
      weeklyHours: {
        seg: { active: true, start: "10:00", end: "18:00" },
        ter: { active: true, start: "10:00", end: "18:00" },
        qua: { active: true, start: "10:00", end: "18:00" },
        qui: { active: true, start: "10:00", end: "18:00" },
        sex: { active: true, start: "10:00", end: "18:00" },
        sab: { active: false, start: "09:00", end: "13:00" },
        dom: { active: false, start: "09:00", end: "13:00" },
      },
    };
    setBehavior(prev => ({
      ...prev,
      calendar: { ...prev.calendar, calendars: [...prev.calendar.calendars, newCal] },
    }));
    setEditingCal(newCal);
  }

  function saveCal(updated: CalendarEntry) {
    setBehavior(prev => ({
      ...prev,
      calendar: {
        ...prev.calendar,
        calendars: prev.calendar.calendars.map(c => c.id === updated.id ? updated : c),
      },
    }));
    setEditingCal(null);
  }

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

  const tabs = [
    { id: "agendas" as const, label: "Agendas", icon: Calendar },
    { id: "config" as const, label: "Configurações", icon: Settings },
    { id: "fields" as const, label: "Campos", icon: Sliders },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-xl">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-colors ${activeTab === t.id ? "bg-white text-[#7C3AED] shadow-sm" : "text-[#6B7280]"}`}>
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Agendas Tab */}
      {activeTab === "agendas" && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="text-sm font-semibold text-[#111827] mb-4">Agendas conectadas</h2>
          {cal.calendars.length === 0 ? (
            <p className="text-xs text-[#9CA3AF] py-8 text-center">Nenhuma agenda conectada ainda.</p>
          ) : (
            <div className="space-y-3">
              {cal.calendars.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#EDE9FE] flex items-center justify-center">
                      <Calendar size={18} className="text-[#7C3AED]" />
                    </div>
                    <span className="text-sm font-medium text-[#111827]">{c.name}</span>
                  </div>
                  <button onClick={() => setEditingCal(c)}
                    className="flex items-center gap-1 text-xs text-[#7C3AED] font-medium hover:underline">
                    Configurar <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button onClick={addCalendar}
              className="flex items-center gap-2 px-4 py-2 bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-medium rounded-lg transition-colors">
              <Plus size={15} />
              Adicionar conta
            </button>
          </div>
        </div>
      )}

      {/* Configurações Tab */}
      {activeTab === "config" && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-1">
          <h2 className="text-sm font-semibold text-[#111827] mb-4">Configurações</h2>

          <div className="flex items-center justify-between py-4 border-b border-[#F3F4F6]">
            <div className="flex items-start gap-3">
              <Video size={20} className="text-[#7C3AED] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#111827]">Integração com Google Meet</p>
                <p className="text-xs text-[#9CA3AF]">Gerar link do meet ao fazer o agendamento</p>
              </div>
            </div>
            <Toggle checked={cal.config.googleMeet} onChange={v => updateConfig({ googleMeet: v })} />
          </div>

          <div className="flex items-center justify-between py-4 border-b border-[#F3F4F6]">
            <div className="flex items-start gap-3">
              <CalendarCheck size={20} className="text-[#7C3AED] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#111827]">Consulta de horários</p>
                <p className="text-xs text-[#9CA3AF]">Agente pode consultar horários disponíveis</p>
              </div>
            </div>
            <Toggle checked={cal.config.checkAvailability} onChange={v => updateConfig({ checkAvailability: v })} />
          </div>

          <div className="flex items-center justify-between py-4 border-b border-[#F3F4F6]">
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-[#7C3AED] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#111827]">Restrição de horários</p>
                <p className="text-xs text-[#9CA3AF]">Permitir apenas horários cheios, ex: 09:00</p>
              </div>
            </div>
            <Toggle checked={cal.config.restrictFullHours} onChange={v => updateConfig({ restrictFullHours: v })} />
          </div>

          <div className="py-4">
            <div className="flex items-start gap-3 mb-3">
              <Shuffle size={20} className="text-[#7C3AED] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#111827]">Modo de distribuição</p>
                <p className="text-xs text-[#9CA3AF]">Como os agendamentos serão divididos</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 ml-8">
              <button onClick={() => updateConfig({ distributionMode: "sequential" })}
                className={`p-3 rounded-xl border text-left transition-colors ${cal.config.distributionMode === "sequential" ? "border-[#7C3AED] bg-[#EDE9FE]" : "border-[#E5E7EB]"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <ArrowRight size={14} className="text-[#7C3AED]" />
                  <p className="text-xs font-medium text-[#111827]">Distribuir sequencial</p>
                </div>
                <p className="text-xs text-[#9CA3AF]">Alterna entre as agendas sequencialmente.</p>
              </button>
              <button onClick={() => updateConfig({ distributionMode: "intelligent" })}
                className={`p-3 rounded-xl border text-left transition-colors ${cal.config.distributionMode === "intelligent" ? "border-[#7C3AED] bg-[#EDE9FE]" : "border-[#E5E7EB]"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Shuffle size={14} className="text-[#7C3AED]" />
                  <p className="text-xs font-medium text-[#111827]">Distribuição Inteligente</p>
                </div>
                <p className="text-xs text-[#9CA3AF]">Seleciona a agenda mais apropriada.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campos Tab */}
      {activeTab === "fields" && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="text-sm font-semibold text-[#111827] mb-4">Campos para agendamento</h2>

          <div className="space-y-1">
            {[
              { key: "name" as const, icon: User, title: "Nome", desc: "Solicitar nome do usuário" },
              { key: "company" as const, icon: Building2, title: "Empresa", desc: "Solicitar nome da empresa" },
              { key: "summary" as const, icon: FileText, title: "Enviar um resumo", desc: "Anexar resumo da conversa no agendamento" },
              { key: "email" as const, icon: Mail, title: "E-mail do cliente", desc: "Solicitar e-mail para enviar convite" },
              { key: "subject" as const, icon: Tag, title: "Assunto", desc: "Solicitar assunto" },
            ].map(f => (
              <div key={f.key} className="flex items-center justify-between py-4 border-b border-[#F3F4F6] last:border-0">
                <div className="flex items-start gap-3">
                  <f.icon size={20} className="text-[#7C3AED] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">{f.title}</p>
                    <p className="text-xs text-[#9CA3AF]">{f.desc}</p>
                  </div>
                </div>
                <Toggle checked={cal.fields[f.key] as boolean} onChange={v => updateFields({ [f.key]: v })} />
              </div>
            ))}

            <div className="flex items-center justify-between py-4 border-b border-[#F3F4F6]">
              <div className="flex items-start gap-3">
                <Timer size={20} className="text-[#7C3AED] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#111827]">Duração do agendamento</p>
                  <p className="text-xs text-[#9CA3AF]">Quanto tempo vai durar</p>
                </div>
              </div>
              <select value={cal.fields.duration} onChange={e => updateFields({ duration: e.target.value })}
                className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg bg-white">
                <option value="30m">30m</option>
                <option value="1h">1h</option>
                <option value="1h 30m">1h 30m</option>
                <option value="2h">2h</option>
              </select>
            </div>

            <div className="pt-4">
              <label className="block text-xs font-medium text-[#374151] mb-1.5">Template do assunto</label>
              <input type="text" value={cal.fields.subjectTemplate}
                onChange={e => updateFields({ subjectTemplate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg" />
              <p className="text-xs text-[#9CA3AF] mt-1">Variáveis: {"{whatsappName}"}, {"{whatsappPhone}"}</p>
            </div>
          </div>
        </div>
      )}

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
        {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar configurações"}
      </button>

      {editingCal && <CalendarConfigModal cal={editingCal} onSave={saveCal} onClose={() => setEditingCal(null)} />}
    </div>
  );
}
