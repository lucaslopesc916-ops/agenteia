"use client";

import Header from "@/components/layout/Header";
import {
  MessageSquare,
  Zap,
  Users,
  Calendar,
  TrendingUp,
  Bot,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const creditsData = [
  { date: "01/03", credits: 420 },
  { date: "05/03", credits: 780 },
  { date: "10/03", credits: 530 },
  { date: "15/03", credits: 1200 },
  { date: "20/03", credits: 890 },
  { date: "25/03", credits: 1450 },
  { date: "30/03", credits: 1100 },
];

const modelData = [
  { model: "GPT-4o Mini", tokens: 4200, cost: 0.63 },
  { model: "GPT-4o", tokens: 800, cost: 2.0 },
];

const kpis = [
  {
    label: "Atendimentos",
    value: "1.284",
    change: "+12% este mês",
    icon: MessageSquare,
    color: "text-[#7C3AED]",
    bg: "bg-[#EDE9FE]",
  },
  {
    label: "Créditos usados",
    value: "6.370",
    change: "de 10.000 disponíveis",
    icon: Zap,
    color: "text-[#0D9488]",
    bg: "bg-[#CCFBF1]",
  },
  {
    label: "Contatos",
    value: "342",
    change: "+28 esta semana",
    icon: Users,
    color: "text-[#2563EB]",
    bg: "bg-[#DBEAFE]",
  },
  {
    label: "Agendamentos",
    value: "47",
    change: "próximos 7 dias",
    icon: Calendar,
    color: "text-[#D97706]",
    bg: "bg-[#FEF3C7]",
  },
];

const recentConversations = [
  { contact: "Maria Silva", channel: "WhatsApp", status: "Resolvido", time: "há 5 min" },
  { contact: "João Santos", channel: "Telegram", status: "Em andamento", time: "há 12 min" },
  { contact: "Ana Costa", channel: "WhatsApp", status: "Resolvido", time: "há 23 min" },
  { contact: "Pedro Lima", channel: "Instagram", status: "Resolvido", time: "há 1h" },
  { contact: "Carla Mendes", channel: "WhatsApp", status: "Em andamento", time: "há 1h 30min" },
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

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header
        title="Dashboard"
        subtitle="Visão geral do seu atendimento com IA"
      />

      <main className="flex-1 p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex items-start gap-4"
              >
                <div className={`${kpi.bg} p-2.5 rounded-lg shrink-0`}>
                  <Icon className={`${kpi.color} w-5 h-5`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#6B7280] font-medium">{kpi.label}</p>
                  <p className="text-2xl font-bold text-[#111827] mt-0.5">{kpi.value}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">{kpi.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Credits Chart */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-[#111827]">
                  Créditos por Período
                </h2>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Março 2026</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#7C3AED] font-medium">
                <TrendingUp size={13} />
                <span>+18% vs mês anterior</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={creditsData}>
                <defs>
                  <linearGradient id="creditsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="credits"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fill="url(#creditsGrad)"
                  name="Créditos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Model Usage */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-[#111827]">
                Gastos por Modelo
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Tokens consumidos</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={modelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="model" type="category" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Bar dataKey="tokens" fill="#7C3AED" radius={[0, 4, 4, 0]} name="Tokens" />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {modelData.map((m) => (
                <div key={m.model} className="flex items-center justify-between text-xs">
                  <span className="text-[#6B7280]">{m.model}</span>
                  <span className="font-medium text-[#111827]">
                    R$ {m.cost.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex justify-between text-xs">
              <span className="text-[#9CA3AF]">Total gasto</span>
              <span className="font-semibold text-[#111827]">R$ 2,63</span>
            </div>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#111827]">
              Conversas Recentes
            </h2>
            <a
              href="/conversations"
              className="flex items-center gap-1 text-xs text-[#7C3AED] font-medium hover:underline"
            >
              Ver todas <ArrowUpRight size={12} />
            </a>
          </div>

          <div className="divide-y divide-[#F3F4F6]">
            {recentConversations.map((conv, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED]/20 to-[#0D9488]/20 flex items-center justify-center text-[#7C3AED] font-semibold text-xs">
                    {conv.contact.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#111827]">{conv.contact}</p>
                    <p className="text-xs text-[#9CA3AF]">{conv.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${channelColors[conv.channel]}`}>
                    {conv.channel}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[conv.status]}`}>
                    {conv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/agents"
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl p-4 flex items-center gap-3 transition-colors"
          >
            <Bot size={20} />
            <div>
              <p className="text-sm font-semibold">Criar novo agente</p>
              <p className="text-xs opacity-75 mt-0.5">Configure um agente de IA</p>
            </div>
          </a>
          <a
            href="/contacts"
            className="bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3 transition-colors"
          >
            <Users size={20} className="text-[#0D9488]" />
            <div>
              <p className="text-sm font-semibold text-[#111827]">Importar contatos</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Carregue sua base de leads</p>
            </div>
          </a>
          <a
            href="/conversations"
            className="bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3 transition-colors"
          >
            <MessageSquare size={20} className="text-[#2563EB]" />
            <div>
              <p className="text-sm font-semibold text-[#111827]">Ver conversas</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Histórico completo</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
