import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Building2, Paintbrush, Search, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

type Audience = 'sponsor' | 'artist';

export interface HeroCulturaEmCenaProps {
  onSponsorClick?: () => void;
  onArtistClick?: () => void;
}

export const HeroCulturaEmCena: React.FC<HeroCulturaEmCenaProps> = ({
  onSponsorClick,
  onArtistClick,
}) => {
  const { setCurrentView } = useApp();
  const [audience, setAudience] = useState<Audience>('sponsor');

  const handleAction = () => {
    if (audience === 'sponsor') {
      if (onSponsorClick) {
        onSponsorClick();
      } else {
        setCurrentView('empresas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (onArtistClick) {
        onArtistClick();
      } else {
        setCurrentView('catalog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Conteúdo dinâmico baseado no público selecionado
  const content = {
    sponsor: {
      kicker: "Para Empresas e Governo",
      title: "Financie a cultura com segurança e estratégia ESG.",
      desc: "Ligue a sua marca a projetos aprovados em leis de incentivo. Deduza impostos, faça a gestão de editais sem burocracia e acompanhe o impacto social em tempo real num painel transparente.",
      btnText: "Abrir Edital ou Patrocinar",
      color: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500",
    },
    artist: {
      kicker: "Para Artistas e Produtores",
      title: "Transforme a sua arte num projeto financiado.",
      desc: "Diga adeus aos PDFs perdidos em caixas de e-mail. Submeta o seu projeto a grandes empresas e editais públicos através de um formulário padronizado, justo e transparente.",
      btnText: "Submeter o meu Projeto",
      color: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500",
    }
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#121214] pt-24 pb-16 transition-colors">
      
      {/* Fundo Padrão Grid (Estilo SaaS Premium) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-80 dark:opacity-20" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 30%, #000 10%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 30%, #000 10%, transparent 100%)'
        }} 
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Toggle Elegante (O segredo do Aceternity UI) */}
        <div className="flex bg-slate-200/60 dark:bg-white/10 p-1 rounded-full backdrop-blur-md border border-slate-300 dark:border-white/10 shadow-sm mb-12 relative">
          {(['sponsor', 'artist'] as const).map((type) => {
            const isSelected = audience === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setAudience(type)}
                className={`relative px-6 py-2.5 text-sm font-semibold rounded-full flex items-center gap-2 transition-colors z-10 cursor-pointer ${
                  isSelected 
                    ? 'text-slate-900 dark:text-slate-900 font-bold' 
                    : 'text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                {type === 'sponsor' ? <Building2 className="w-4 h-4" /> : <Paintbrush className="w-4 h-4" />}
                {type === 'sponsor' ? 'Quero Financiar' : 'Sou Artista'}
                
                {/* Pílula de seleção animada com Framer Motion layoutId */}
                {isSelected && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white dark:bg-white rounded-full shadow-sm border border-slate-200/50 -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Troca de Conteúdo Animada */}
        <div className="min-h-[260px] sm:min-h-[220px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={audience}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <span className="text-sm font-bold tracking-widest text-slate-400 dark:text-slate-400 uppercase mb-4 block">
                {content[audience].kicker}
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance leading-[1.1] mb-6 max-w-4xl font-editorial">
                {content[audience].title}
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl text-balance leading-relaxed mb-10">
                {content[audience].desc}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  type="button"
                  onClick={handleAction}
                  className={`inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group cursor-pointer ${content[audience].color}`}
                >
                  <span>{content[audience].btnText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {audience === 'sponsor' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('organizacoes_publicas');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-3 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Sou Gestor Público (PNAB) &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('formulario_projeto');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-3 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Criar Rascunho de Projeto &rarr;
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
