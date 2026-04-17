"use client";

import Header from "@/components/layout/Header";
import { User, CreditCard, Bell, Shield, Building } from "lucide-react";

const sections = [
  { icon: Building, label: "Empresa", desc: "Nome, logo e dados da conta" },
  { icon: User, label: "Perfil", desc: "Suas informações pessoais" },
  { icon: CreditCard, label: "Plano e Créditos", desc: "Gerencie sua assinatura" },
  { icon: Bell, label: "Notificações", desc: "Configure seus alertas" },
  { icon: Shield, label: "Segurança", desc: "Senha e autenticação" },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header title="Configurações" subtitle="Gerencie sua conta e preferências" />

      <main className="flex-1 p-6 max-w-2xl">
        <div className="space-y-2">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                className="w-full bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center gap-4 hover:shadow-sm transition-shadow text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EDE9FE] flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-[#7C3AED]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{s.label}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{s.desc}</p>
                </div>
                <svg className="ml-auto text-[#9CA3AF]" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Plan info */}
        <div className="mt-6 bg-gradient-to-br from-[#7C3AED] to-[#0D9488] rounded-xl p-5 text-white">
          <p className="text-xs font-medium opacity-75 uppercase tracking-wide">Seu plano atual</p>
          <p className="text-xl font-bold mt-1">Starter</p>
          <p className="text-sm opacity-75 mt-1">5.000 créditos/mês · 1 agente · 1 canal</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Créditos usados</span>
              <span>3.370 / 5.000</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div className="bg-white rounded-full h-1.5" style={{ width: "67.4%" }} />
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-white text-[#7C3AED] text-sm font-semibold rounded-lg hover:bg-opacity-90 transition-colors">
            Fazer upgrade
          </button>
        </div>
      </main>
    </div>
  );
}
