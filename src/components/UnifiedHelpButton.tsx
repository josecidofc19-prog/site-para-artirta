import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, MessageSquare, ExternalLink, X, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from '../config/whatsapp';

export const UnifiedHelpButton: React.FC = () => {
  const { setAssistantOpen, showToast } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanNumber = WHATSAPP_NUMBER.trim().replace(/\D/g, '');
  const isWhatsAppConfigured = Boolean(
    cleanNumber && 
    cleanNumber.length >= 10 && 
    cleanNumber !== '5519987654321'
  );

  const whatsappUrl = isWhatsAppConfigured
    ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`
    : '#';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!isWhatsAppConfigured) {
      e.preventDefault();
      showToast(
        'Atendimento em implantação',
        'O canal de WhatsApp direto está sendo configurado para acolhimento de artistas.',
        'info'
      );
    }
    setMenuOpen(false);
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-14 right-0 w-72 p-3 bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 rounded-2xl shadow-xl space-y-2 mb-2"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E0D5] dark:border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                Central de Ajuda
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1 text-[#78716C] hover:text-[#1C1917] dark:hover:text-white rounded-lg cursor-pointer"
                aria-label="Fechar opções"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setAssistantOpen(true);
                setMenuOpen(false);
              }}
              className="w-full text-left p-2.5 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-white/5 transition-colors flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#991B1B] dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F3EF]">
                  Perguntar ao assistente
                </div>
                <div className="text-xs text-[#78716C] dark:text-[#A8A29E] leading-relaxed">
                  Tire dúvidas sobre prazos, documentos e editais
                </div>
              </div>
            </button>

            <a
              href={whatsappUrl}
              onClick={handleWhatsAppClick}
              target={isWhatsAppConfigured ? '_blank' : undefined}
              rel={isWhatsAppConfigured ? 'noopener noreferrer' : undefined}
              className="w-full text-left p-2.5 rounded-xl hover:bg-[#FAF7F2] dark:hover:bg-white/5 transition-colors flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1C1917] dark:text-[#F5F3EF]">
                  <span>Falar no WhatsApp</span>
                  {isWhatsAppConfigured && <ExternalLink className="w-3 h-3 text-[#78716C]" />}
                </div>
                <div className="text-xs text-[#78716C] dark:text-[#A8A29E] leading-relaxed">
                  Atendimento humano e suporte regional
                </div>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-label="Abrir central de ajuda e dúvidas"
        className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-2.5 min-h-[44px] min-w-[44px] rounded-full bg-[#1C1917] dark:bg-[#FAF7F2] text-[#FAF7F2] dark:text-[#1C1917] hover:bg-[#292524] dark:hover:bg-white transition-all shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer"
      >
        <HelpCircle className="w-4 h-4 text-[#FAF7F2] dark:text-[#1C1917]" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide">Dúvidas?</span>
      </button>
    </div>
  );
};
