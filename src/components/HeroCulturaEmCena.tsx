import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DossiePreview } from './DossiePreview';

export const HeroCulturaEmCena: React.FC = () => {
  const { setCurrentView, setSearchTerm, loginAsLucas } = useApp();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchTerm(searchInput.trim());
      setCurrentView('catalog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePillClick = (term: string) => {
    setSearchTerm(term);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemoCase = () => {
    loginAsLucas();
    setCurrentView('checklist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickPills = ['Música', 'Indaiatuba', 'ProAC', 'PNAB', 'Audiovisual', 'Rouanet'];

  return (
    <section className="relative bg-[#FAF7F2] dark:bg-[#121214] border-b border-[#E6E0D5] dark:border-white/10 pt-12 sm:pt-16 pb-16 sm:pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Coluna Esquerda: 7 colunas no desktop */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FAF7F2] dark:bg-white/5 border border-[#E6E0D5] dark:border-white/10 text-xs font-semibold uppercase tracking-wider text-[#991B1B] dark:text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B] dark:bg-red-400" />
                <span>Fomento Cultural · Indaiatuba & Região</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1C1917] dark:text-[#F5F3EF] leading-[1.08]">
                Editais culturais sem mistério: do cadastro à aprovação.
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#57534E] dark:text-[#D6D3D1] max-w-xl leading-relaxed">
              Guia prático, cofre de documentos com alertas de validade e simulador de fomento para artistas, bandas e coletivos de Indaiatuba e região.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-lg bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-medium text-sm transition-colors shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#991B1B] cursor-pointer"
              >
                Ver editais
              </button>

              <button
                type="button"
                onClick={handleDemoCase}
                className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F3EF] hover:text-[#991B1B] dark:hover:text-red-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#991B1B] rounded-md px-2 py-1"
              >
                <span>Ver um caso de exemplo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Campo de Busca Integrado */}
            <div className="pt-3 max-w-xl space-y-3">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <label htmlFor="hero-search-input" className="sr-only">
                  Buscar editais por área, termo ou localização
                </label>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78716C] dark:text-[#A8A29E]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  id="hero-search-input"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar por linguagem, edital ou cidade..."
                  className="w-full pl-10 pr-24 py-3 text-sm rounded-lg border border-[#CFC7B8] dark:border-white/10 bg-white dark:bg-[#1A1A1E] text-[#1C1917] dark:text-white placeholder:text-[#A8A29E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#991B1B] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3.5 py-1.5 rounded-md bg-[#1C1917] dark:bg-[#FAF7F2] text-white dark:text-[#1C1917] text-xs font-semibold hover:bg-[#292524] dark:hover:bg-white transition-colors cursor-pointer"
                >
                  Buscar
                </button>
              </form>

              {/* Pílulas de Acesso Rápido */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[#78716C] dark:text-[#A8A29E] mr-1 text-[11px] font-medium uppercase tracking-wider">
                  Sugestões:
                </span>
                {quickPills.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => handlePillClick(pill)}
                    className="px-2.5 py-1 rounded-md bg-white dark:bg-[#1A1A1E] text-[#57534E] dark:text-[#D6D3D1] border border-[#E6E0D5] dark:border-white/10 hover:border-[#991B1B] dark:hover:border-red-400 hover:text-[#991B1B] dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Coluna Direita: 5 colunas no desktop com Dossiê em formato físico */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none pt-4 lg:pt-0">
            <DossiePreview />
          </div>

        </div>
      </div>
    </section>
  );
};
