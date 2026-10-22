import React from 'react';
import { FileText, ArrowRight, AlertTriangle, Clock, CheckCircle2, FileQuestion } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DossiePreview: React.FC = () => {
  const { loginAsLucas, setCurrentView, activeApplication } = useApp();

  const handleOpenChecklist = () => {
    loginAsLucas();
    setCurrentView('checklist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progressPercent = activeApplication ? activeApplication.progressPercentage : 60;
  const completedCount = activeApplication 
    ? activeApplication.steps.filter(s => s.isCompleted).length 
    : 3;
  const totalCount = activeApplication ? activeApplication.steps.length : 5;

  return (
    <div className="relative group">
      {/* Clipe metálico de papel físico no topo direito */}
      <div 
        className="absolute -top-3 right-8 w-5 h-11 border-2 border-stone-400 dark:border-stone-500 rounded-full z-20 pointer-events-none shadow-xs bg-gradient-to-b from-stone-200 to-stone-400 dark:from-stone-600 dark:to-stone-800 opacity-90"
        aria-hidden="true"
      />

      {/* Cartão de Pasta/Prancheta de Papel */}
      <div className="crop-marks relative p-6 sm:p-7 rounded-2xl bg-[#FFFDF8] dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-md transition-shadow duration-300 hover:shadow-lg">
        {/* Cabeçalho da Prancheta */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E6E0D5] dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#991B1B] dark:text-red-400">
                Prancheta em Andamento
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B]" />
              <span className="text-xs text-[#78716C] dark:text-[#A8A29E]">Exemplo Real</span>
            </div>
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F3EF] mt-1">
              Banda Veludo Branco
            </h3>
            <p className="text-xs text-[#57534E] dark:text-[#D6D3D1] mt-0.5">
              Edital de Circulação Musical Indaiatuba 2026
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-bold font-sans tabular-nums text-[#1C1917] dark:text-[#F5F3EF]">
              {progressPercent}%
            </span>
            <span className="block text-[11px] text-[#78716C] dark:text-[#A8A29E] tabular-nums">
              {completedCount} de {totalCount} itens
            </span>
          </div>
        </div>

        {/* Barra de Progresso Editorial */}
        <div className="mt-4">
          <div className="w-full h-2 bg-[#E6E0D5] dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1E3A2F] dark:bg-emerald-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Lista de Documentos com Carimbos de Conformidade */}
        <div className="mt-5 space-y-3">
          {/* 1. Comprovante de endereço: Vencido */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#141417] border border-[#E6E0D5] dark:border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertTriangle className="w-4 h-4 text-[#991B1B] shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#1C1917] dark:text-[#F5F3EF] truncate">
                  Comprovante de Endereço (Indaiatuba)
                </p>
                <p className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">
                  Exigência municipal de domicílio
                </p>
              </div>
            </div>
            {/* Carimbo de borda dupla vermelha */}
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border-2 border-red-700 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300">
              Vencido há 3 dias
            </span>
          </div>

          {/* 2. CND Municipal: Vence em breve */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#141417] border border-[#E6E0D5] dark:border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#1C1917] dark:text-[#F5F3EF] truncate">
                  CND Municipal de Tributos
                </p>
                <p className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">
                  Prefeitura Municipal de Indaiatuba
                </p>
              </div>
            </div>
            {/* Carimbo âmbar */}
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              Vence em 8 dias
            </span>
          </div>

          {/* 3. RG/CPF: Válido */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#141417] border border-[#E6E0D5] dark:border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#1C1917] dark:text-[#F5F3EF] truncate">
                  RG e CPF do Representante
                </p>
                <p className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">
                  Documentação pessoal regularizada
                </p>
              </div>
            </div>
            {/* Carimbo verde floresta */}
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-700 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              Válido
            </span>
          </div>

          {/* 4. Planilha orçamentária: Pendente de envio */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#141417] border border-[#E6E0D5] dark:border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileQuestion className="w-4 h-4 text-stone-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#1C1917] dark:text-[#F5F3EF] truncate">
                  Planilha Orçamentária e Cronograma
                </p>
                <p className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">
                  Memória de cálculo dos R$ 25.000
                </p>
              </div>
            </div>
            {/* Carimbo borda tracejada */}
            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded border border-dashed border-stone-400 bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300">
              Pendente de envio
            </span>
          </div>
        </div>

        {/* Botão de Ação Direta */}
        <div className="mt-5 pt-4 border-t border-[#E6E0D5] dark:border-white/10">
          <button
            type="button"
            onClick={handleOpenChecklist}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1C1917] dark:bg-[#FAF7F2] text-[#FAF7F2] dark:text-[#1C1917] hover:bg-[#292524] dark:hover:bg-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#991B1B] cursor-pointer"
          >
            <span>Abrir o checklist do Lucas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
