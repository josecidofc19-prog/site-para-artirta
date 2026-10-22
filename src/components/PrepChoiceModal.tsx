import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, UserPlus, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

export const PrepChoiceModal: React.FC = () => {
  const { 
    prepModalOpen, 
    setPrepModalOpen, 
    selectedGrantId, 
    grants, 
    loginAsLucas,
    setAuthModalOpen,
    setAuthModalMode,
    selectedProfile
  } = useApp();

  const handleClose = () => {
    setPrepModalOpen(false);
  };

  const modalRef = useModalAccessibility(prepModalOpen, handleClose, '#btn-choose-lucas');

  if (!prepModalOpen) return null;

  const activeGrant = grants.find(g => g.id === selectedGrantId) || grants[0];

  const handleChooseLucas = () => {
    loginAsLucas();
  };

  const handleChooseRegister = () => {
    setPrepModalOpen(false);
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prep-choice-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-white/10 relative max-h-[90vh] overflow-y-auto space-y-6"
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl focus-ring min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Fechar modal de escolha"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="space-y-2 pr-6">
          <span className="text-xs font-semibold tracking-wider uppercase text-teal-600 dark:text-teal-400 block font-mono">
            Preparação de Edital
          </span>
          <h2 id="prep-choice-title" className="text-xl sm:text-2xl font-bold tracking-tight">
            Como deseja acessar a plataforma?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Você está se preparando para: <strong className="text-slate-900 dark:text-white">{activeGrant?.title}</strong>. A seleção deste edital será mantida em qualquer opção.
          </p>
        </div>

        <div className="space-y-4">
          {/* Opção 1: Lucas (Demonstração Universitária) */}
          <button
            id="btn-choose-lucas"
            onClick={handleChooseLucas}
            className="w-full text-left p-5 rounded-2xl border-2 border-teal-600 dark:border-teal-500 bg-teal-50/50 hover:bg-teal-50 dark:bg-teal-950/20 dark:hover:bg-teal-950/40 transition-all flex items-start gap-4 group focus-ring cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white dark:bg-teal-500 dark:text-slate-950 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-xs">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                  Entrar como Lucas (demonstração)
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-700 text-white dark:bg-teal-400 dark:text-slate-950 shrink-0">
                  Recomendado
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Carrega o cenário acadêmico pronto de 2 minutos: banda autoral de Indaiatuba com checklist em 60% e 1 documento para testar a renovação em tempo real.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300">
                <span>Continuar preparação imediata</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Opção 2: Criar Conta Simulada */}
          <button
            onClick={handleChooseRegister}
            className="w-full text-left p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-start gap-4 group focus-ring cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <UserPlus className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Criar conta simulada
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Cadastre seus dados e perfil artístico ({selectedProfile === 'banda_grupo' ? 'Banda ou grupo' : selectedProfile}). Ao concluir, você voltará diretamente para a preparação desta mesma oportunidade.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                <span>Preencher cadastro simulado</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Sem backend nem envio externo de dados</span>
          <button 
            onClick={handleClose}
            className="hover:underline text-slate-600 dark:text-slate-300 py-1 cursor-pointer"
          >
            Voltar aos detalhes
          </button>
        </div>
      </div>
    </div>
  );
};
