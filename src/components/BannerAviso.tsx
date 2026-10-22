import React, { useState } from 'react';
import { AlertCircle, RotateCcw, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { Tooltip } from './Tooltip';

export const BannerAviso: React.FC = () => {
  const { resetDemoToInitialState, clearAllLocalStorage } = useApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Modais de confirmação acessíveis
  const ResetConfirmModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const modalRef = useModalAccessibility(true, onClose, '#cancel-reset-btn');

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
      >
        <div 
          ref={modalRef}
          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200/80 dark:border-white/10 space-y-4"
        >
          <h3 id="reset-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
            Reiniciar demonstração de Lucas?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Isso restaurará o usuário Lucas, o perfil de Banda ou grupo, o cofre com o documento vencido e o checklist de inscrição em exatamente 60%, ideal para reiniciar a apresentação em bancas acadêmicas.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="cancel-reset-btn"
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2 text-xs focus-ring"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                resetDemoToInitialState();
                onClose();
              }}
              className="btn-primary px-4 py-2 text-xs focus-ring"
            >
              Confirmar reinício
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ClearConfirmModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const modalRef = useModalAccessibility(true, onClose, '#cancel-clear-btn');

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-modal-title"
      >
        <div 
          ref={modalRef}
          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200/80 dark:border-white/10 space-y-4"
        >
          <h3 id="clear-modal-title" className="text-lg font-bold text-red-600 dark:text-red-400">
            Excluir todos os dados locais?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Esta ação removerá todos os registros armazenados no navegador (localStorage). Você será deslogado e retornará à tela inicial com os dados padrão limpos.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="cancel-clear-btn"
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2 text-xs focus-ring"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                clearAllLocalStorage();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors focus-ring cursor-pointer"
            >
              Excluir dados
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside aria-label="Aviso de demonstração acadêmica" className="bg-slate-900 text-white border-b border-white/10 text-xs sm:text-sm py-2 px-4 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-slate-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
          <span className="leading-tight">
            <strong className="text-white">Demonstração Acadêmica:</strong> Cadastro, autenticação, documentos e preparação de inscrições são simulados. Não insira dados pessoais ou documentos reais.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Tooltip
            title="Demonstração do Lucas"
            content="Restaura o estado didático inicial: Lucas (Banda Veludo Branco) com checklist em 60% e comprovante de endereço vencido para simulação."
            position="bottom"
          >
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#991B1B] hover:bg-[#7F1D1D] text-white transition-colors focus-ring cursor-pointer shadow-xs min-h-[34px]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reiniciar demo (60%)</span>
            </button>
          </Tooltip>

          <Tooltip
            title="Limpar Cache Local"
            content="Remove todos os dados simulados armazenados no navegador nesta sessão, restaurando o aplicativo limpo."
            position="bottom"
          >
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-ring min-h-[34px] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
              <span className="hidden sm:inline">Limpar cache local</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {showResetConfirm && <ResetConfirmModal onClose={() => setShowResetConfirm(false)} />}
      {showClearConfirm && <ClearConfirmModal onClose={() => setShowClearConfirm(false)} />}
    </aside>
  );
};
