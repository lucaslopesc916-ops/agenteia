"use client";

export default function AgentWorkPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <h2 className="text-sm font-semibold text-[#111827] mb-4">Configurações de Trabalho</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">
              Horário de atendimento
            </label>
            <div className="flex gap-2">
              <select className="flex-1 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors bg-white">
                <option>08:00</option>
                <option>09:00</option>
                <option>07:00</option>
              </select>
              <span className="flex items-center text-[#9CA3AF] text-sm">até</span>
              <select className="flex-1 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors bg-white">
                <option>18:00</option>
                <option>20:00</option>
                <option>22:00</option>
                <option>24:00 (sempre ativo)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">
              Mensagem fora do horário
            </label>
            <textarea
              rows={3}
              defaultValue="Olá! No momento estamos fora do horário de atendimento. Nosso horário é de segunda a sexta, das 8h às 18h. Deixe sua mensagem e retornaremos em breve! 😊"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">
              Limite de mensagens por conversa
            </label>
            <input
              type="number"
              defaultValue={50}
              className="w-40 px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">0 = sem limite</p>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[#111827]">Transferir para humano</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Ao detectar palavras-chave sensíveis</p>
            </div>
            <button className="relative w-10 h-5 bg-[#7C3AED] rounded-full transition-colors">
              <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
            <div>
              <p className="text-sm font-medium text-[#111827]">Salvar contatos automaticamente</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Adicionar novos leads à base</p>
            </div>
            <button className="relative w-10 h-5 bg-[#7C3AED] rounded-full transition-colors">
              <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform" />
            </button>
          </div>
        </div>
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
