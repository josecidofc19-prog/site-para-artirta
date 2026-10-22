import React, { useState } from 'react';
import { RotateCcw, Trash2, SlidersHorizontal, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

export const BannerAviso: React.FC = () => {
  const { resetDemoToInitialState, clearAllLocalStorage } = useApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);

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
          className="bg-[#FFFDF8] dark:bg-[#1A1A1E] text-[#1C1917] dark:text-[#F5F3EF] rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6E0D5] dark:border-white/10 space-y-4"
        >
          <h3 id="reset-modal-title" className="text-lg font-bold">
            Reiniciar demonstração de Lucas?
          </h3>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
            Isso restaurará o perfil da Banda Veludo Branco com checklist em 60% e comprovante de residência vencido para fins de simulação.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="cancel-reset-btn"
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E6E0D5] dark:border-white/10 hover:bg-[#F2EEE7] dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                resetDemoToInitialState();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#991B1B] text-white hover:bg-red-800 transition-colors cursor-pointer"
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
          className="bg-[#FFFDF8] dark:bg-[#1A1A1E] text-[#1C1917] dark:text-[#F5F3EF] rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E6E0D5] dark:border-white/10 space-y-4"
        >
          <h3 id="clear-modal-title" className="text-lg font-bold text-[#991B1B]">
            Excluir todos os dados locais?
          </h3>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
            Esta ação limpará o localStorage do navegador. Você retornará ao estado limpo inicial.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="cancel-clear-btn"
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E6E0D5] dark:border-white/10 hover:bg-[#F2EEE7] dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                clearAllLocalStorage();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#991B1B] text-white hover:bg-red-800 transition-colors cursor-pointer"
            >
              Excluir dados
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside 
      aria-label="Aviso de demonstração" 
      className="bg-[#F2EEE7] dark:bg-[#1A1A1E] text-[#44403C] dark:text-[#A8A29E] border-b border-[#E6E0D5] dark:border-white/10 text-xs py-1.5 px-4 relative z-40 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-h-[24px]">
        {/* Mensagem compacta */}
        <div className="flex items-center gap-2 truncate">
          <Info className="w-3.5 h-3.5 text-[#78716C] dark:text-[#A8A29E] shrink-0" aria-hidden="true" />
          <span className="truncate">
            Versão de demonstração · dados e documentos simulados
          </span>
        </div>

        {/* Links compactos alinhados à direita (Desktop) */}
        <div className="hidden sm:flex items-center gap-4 shrink-0 text-[11px]">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-[#57534E] dark:text-[#D6D3D1] hover:text-[#991B1B] dark:hover:text-red-400 font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reiniciar demo</span>
          </button>
          <span className="text-[#CFC7B8] dark:text-white/20" aria-hidden="true">·</span>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#991B1B] dark:hover:text-red-400 transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Limpar cache</span>
          </button>
        </div>

        {/* Opções agrupadas no mobile */}
        <div className="sm:hidden relative shrink-0">
          <button
            onClick={() => setMobileOptionsOpen(!mobileOptionsOpen)}
            className="text-[11px] font-semibold text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1917] px-2 py-0.5 rounded border border-[#E6E0D5] dark:border-white/10 inline-flex items-center gap-1 cursor-pointer"
            aria-expanded={mobileOptionsOpen}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Opções</span>
          </button>

          {mobileOptionsOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-[#FFFDF8] dark:bg-[#1A1A1E] rounded-xl border border-[#E6E0D5] dark:border-white/10 shadow-lg p-1.5 z-50 space-y-1">
              <button
                onClick={() => {
                  setMobileOptionsOpen(false);
                  setShowResetConfirm(true);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#F2EEE7] dark:hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-[#991B1B]" />
                <span>Reiniciar demo</span>
              </button>
              <button
                onClick={() => {
                  setMobileOptionsOpen(false);
                  setShowClearConfirm(true);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-[#78716C] dark:text-[#A8A29E] hover:bg-[#F2EEE7] dark:hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
                <span>Limpar cache</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showResetConfirm && <ResetConfirmModal onClose={() => setShowResetConfirm(false)} />}
      {showClearConfirm && <ClearConfirmModal onClose={() => setShowClearConfirm(false)} />}
    </aside>
  );
};
