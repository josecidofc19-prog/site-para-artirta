import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogOut, 
  FolderLock,
  ListTodo,
  Compass,
  BookOpen,
  Calendar,
  Building2,
  Landmark,
  ChevronDown,
  Settings,
  UserCheck,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppView } from '../types';

export const Navbar: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    user, 
    logout, 
    currentView, 
    setCurrentView,
    setAuthModalOpen,
    setAuthModalMode,
    loginAsLucas,
    activeApplication
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [instituicoesDropdownOpen, setInstituicoesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setInstituicoesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (viewId: AppView) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    setInstituicoesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isInstituicoesActive = ['empresas', 'organizacoes_publicas'].includes(currentView);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-[#E6E0D5] dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          
          {/* Marca Editorial Cultura em Cena com ponto vermelho */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-baseline gap-1 text-left p-1.5 -ml-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#991B1B] group cursor-pointer"
            aria-label="Ir para a página inicial do Cultura em Cena"
          >
            <span className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#1C1917] dark:text-[#F5F3EF] leading-tight">
              Cultura em Cena<span className="text-[#991B1B]">.</span>
            </span>
            <span className="hidden sm:inline text-[11px] tracking-wide uppercase font-medium text-[#78716C] dark:text-[#A8A29E] ml-2 border-l border-[#E6E0D5] dark:border-white/10 pl-2">
              Fomento & Editais
            </span>
          </button>

          {/* NAVEGAÇÃO PRINCIPAL — 4 LINKS ESSENCIAIS + DROPDOWN INSTITUIÇÕES */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium" aria-label="Navegação principal">
            
            {/* 1. Editais */}
            <button
              onClick={() => handleNavClick('catalog')}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-[#991B1B] ${
                currentView === 'catalog'
                  ? 'text-[#991B1B] dark:text-red-400 font-semibold bg-[#991B1B]/10 dark:bg-red-950/30'
                  : 'text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F2EEE7] dark:hover:bg-white/5'
              }`}
            >
              Editais
            </button>

            {/* 2. Calendário */}
            <button
              onClick={() => handleNavClick('calendario')}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-[#991B1B] ${
                currentView === 'calendario'
                  ? 'text-[#991B1B] dark:text-red-400 font-semibold bg-[#991B1B]/10 dark:bg-red-950/30'
                  : 'text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F2EEE7] dark:hover:bg-white/5'
              }`}
            >
              Calendário
            </button>

            {/* 3. Cofre com badge de progresso */}
            <button
              onClick={() => handleNavClick('vault')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-[#991B1B] ${
                currentView === 'vault'
                  ? 'text-[#991B1B] dark:text-red-400 font-semibold bg-[#991B1B]/10 dark:bg-red-950/30'
                  : 'text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F2EEE7] dark:hover:bg-white/5'
              }`}
            >
              <span>Cofre</span>
              {activeApplication && (
                <span className="text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md bg-[#1E3A2F] text-white dark:bg-emerald-900 dark:text-emerald-200">
                  {activeApplication.progressPercentage}%
                </span>
              )}
            </button>

            {/* 4. Guia */}
            <button
              onClick={() => handleNavClick('guia')}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-[#991B1B] ${
                currentView === 'guia'
                  ? 'text-[#991B1B] dark:text-red-400 font-semibold bg-[#991B1B]/10 dark:bg-red-950/30'
                  : 'text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F2EEE7] dark:hover:bg-white/5'
              }`}
            >
              Guia
            </button>

            {/* 5. Dropdown Para instituições */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setInstituicoesDropdownOpen(prev => !prev)}
                aria-expanded={instituicoesDropdownOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-[#991B1B] ${
                  isInstituicoesActive
                    ? 'text-[#991B1B] dark:text-red-400 font-semibold bg-[#991B1B]/10 dark:bg-red-950/30'
                    : 'text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span>Para instituições</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${instituicoesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {instituicoesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-2 w-72 p-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-lg z-50 space-y-1"
                  >
                    <button
                      type="button"
                      onClick={() => handleNavClick('empresas')}
                      className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-3 cursor-pointer ${
                        currentView === 'empresas'
                          ? 'bg-[#991B1B]/10 dark:bg-red-950/40 text-[#991B1B] dark:text-red-400'
                          : 'hover:bg-[#FAF7F2] dark:hover:bg-white/5 text-[#1C1917] dark:text-[#F5F3EF]'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-[#991B1B] dark:text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold">Empresas & Simulador</div>
                        <div className="text-xs text-[#78716C] dark:text-[#A8A29E] leading-relaxed">
                          Incentivo fiscal Rouanet e ProAC com custo líquido zero
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNavClick('organizacoes_publicas')}
                      className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-3 cursor-pointer ${
                        currentView === 'organizacoes_publicas'
                          ? 'bg-[#1E3A2F]/10 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300'
                          : 'hover:bg-[#FAF7F2] dark:hover:bg-white/5 text-[#1C1917] dark:text-[#F5F3EF]'
                      }`}
                    >
                      <Landmark className="w-4 h-4 text-emerald-800 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold">Organizações Públicas</div>
                        <div className="text-xs text-[#78716C] dark:text-[#A8A29E] leading-relaxed">
                          Gestão de editais, conformidade e recursos da PNAB
                        </div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* AÇÕES DA DIREITA: Alternador de tema + Demonstração / Perfil */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Alternador de Tema */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#F2EEE7] dark:hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-[#991B1B] cursor-pointer"
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-[#1C1917]" aria-hidden="true" />
              )}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-[#1A1A1E] text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/10 transition-colors border border-[#E6E0D5] dark:border-white/10 focus-visible:ring-2 focus-visible:ring-[#991B1B] cursor-pointer"
                  title="Painel do Artista"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden="true" />
                  <span className="truncate max-w-[130px]">
                    {user.name} ({user.profileType === 'banda_grupo' ? 'Banda' : user.profileType})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('perfil')}
                  className="p-2 text-[#78716C] hover:text-[#991B1B] dark:hover:text-red-400 rounded-lg hover:bg-[#F2EEE7] dark:hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-[#991B1B] cursor-pointer"
                  title="Configurações do Perfil"
                  aria-label="Configurações do Perfil"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-[#78716C] hover:text-red-700 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus-visible:ring-2 focus-visible:ring-[#991B1B] cursor-pointer"
                  title="Sair da conta"
                  aria-label="Sair da conta"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={loginAsLucas}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg text-[#1C1917] dark:text-[#F5F3EF] bg-white dark:bg-[#1A1A1E] hover:bg-[#F2EEE7] dark:hover:bg-white/10 transition-colors border border-[#E6E0D5] dark:border-white/10 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#991B1B] cursor-pointer flex items-center gap-1.5"
                  title="Simular com o perfil de demonstração de Lucas (Banda de Rock de Indaiatuba)"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#991B1B] dark:text-red-400" />
                  <span>Demonstração Lucas</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="text-xs px-3.5 py-2 rounded-lg bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-medium focus-visible:ring-2 focus-visible:ring-[#991B1B] cursor-pointer transition-colors"
                >
                  Criar conta
                </button>
              </div>
            )}

            {/* Menu Hambúrguer Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2.5 text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5 rounded-lg focus-visible:ring-2 focus-visible:ring-[#991B1B] cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Acessível (min 44px touch targets) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="lg:hidden bg-[#FAF7F2] dark:bg-[#121214] border-b border-[#E6E0D5] dark:border-white/10 px-4 pt-3 pb-6 space-y-4 overflow-hidden shadow-lg"
          >
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#78716C] dark:text-[#A8A29E] px-3 py-1">
                Navegação
              </div>

              {/* Editais */}
              <button
                type="button"
                onClick={() => handleNavClick('catalog')}
                className={`flex items-center justify-between w-full px-3.5 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'catalog' 
                    ? 'bg-[#991B1B]/10 text-[#991B1B] dark:text-red-400 font-semibold' 
                    : 'text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Compass className="w-4 h-4 text-[#991B1B] dark:text-red-400" />
                  <span>Editais Abertos</span>
                </span>
              </button>

              {/* Calendário */}
              <button
                type="button"
                onClick={() => handleNavClick('calendario')}
                className={`flex items-center justify-between w-full px-3.5 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'calendario' 
                    ? 'bg-[#991B1B]/10 text-[#991B1B] dark:text-red-400 font-semibold' 
                    : 'text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#991B1B] dark:text-red-400" />
                  <span>Calendário Cultural</span>
                </span>
              </button>

              {/* Cofre */}
              <button
                type="button"
                onClick={() => handleNavClick('vault')}
                className={`flex items-center justify-between w-full px-3.5 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'vault' 
                    ? 'bg-[#991B1B]/10 text-[#991B1B] dark:text-red-400 font-semibold' 
                    : 'text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <FolderLock className="w-4 h-4 text-[#991B1B] dark:text-red-400" />
                  <span>Cofre de Documentos</span>
                </span>
                {activeApplication && (
                  <span className="text-[10px] font-semibold tabular-nums px-2 py-0.5 rounded-md bg-[#1E3A2F] text-white">
                    {activeApplication.progressPercentage}%
                  </span>
                )}
              </button>

              {/* Guia */}
              <button
                type="button"
                onClick={() => handleNavClick('guia')}
                className={`flex items-center justify-between w-full px-3.5 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'guia' 
                    ? 'bg-[#991B1B]/10 text-[#991B1B] dark:text-red-400 font-semibold' 
                    : 'text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[#991B1B] dark:text-red-400" />
                  <span>Guia do Artista</span>
                </span>
              </button>
            </div>

            <div className="pt-2 border-t border-[#E6E0D5] dark:border-white/10 space-y-1">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#78716C] dark:text-[#A8A29E] px-3 py-1">
                Para instituições
              </div>

              {/* Empresas */}
              <button
                type="button"
                onClick={() => handleNavClick('empresas')}
                className={`flex items-center justify-between w-full px-3.5 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'empresas' 
                    ? 'bg-[#991B1B]/10 text-[#991B1B] dark:text-red-400 font-semibold' 
                    : 'text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-[#991B1B] dark:text-red-400" />
                  <span>Empresas & Simulador Fiscal</span>
                </span>
              </button>

              {/* Organizações Públicas */}
              <button
                type="button"
                onClick={() => handleNavClick('organizacoes_publicas')}
                className={`flex items-center justify-between w-full px-3.5 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'organizacoes_publicas' 
                    ? 'bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold' 
                    : 'text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Landmark className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                  <span>Organizações Públicas (PNAB)</span>
                </span>
              </button>
            </div>

            {/* Ações de Acesso Mobile */}
            <div className="pt-3 border-t border-[#E6E0D5] dark:border-white/10 space-y-2">
              {!user ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      loginAsLucas();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-[#E6E0D5] dark:border-white/10 text-xs font-semibold text-[#1C1917] dark:text-[#F5F3EF] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-[#991B1B]" />
                    <span>Carregar Demonstração Lucas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('register');
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#991B1B] text-white text-xs font-semibold flex items-center justify-center cursor-pointer"
                  >
                    Criar conta
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-900 text-xs font-semibold text-red-700 dark:text-red-400 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da conta ({user.name})</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
