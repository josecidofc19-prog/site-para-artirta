import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogOut, 
  TrendingUp,
  FolderLock,
  ListTodo,
  Compass,
  BookOpen,
  LifeBuoy,
  Info,
  Settings,
  ChevronDown,
  Calendar,
  Sparkles,
  Award,
  Layers,
  Building2,
  Landmark,
  Home
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppView } from '../types';
import { Tooltip } from './Tooltip';

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
    activeApplication,
    setWorkspaceModalOpen,
    showWorkspaceButton
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Submenu 'Ferramentas & Cofre' do artista
  const ferramentasItems: { id: AppView; label: string; desc: string; icon: React.FC<any>; badge?: string | null }[] = [
    { 
      id: 'vault', 
      label: 'Cofre de Documentos', 
      desc: 'Central de certidões, CNDs e comprovantes com aviso de vencimento',
      icon: FolderLock 
    },
    { 
      id: 'checklist', 
      label: 'Preparação & Inscrição', 
      desc: 'Simulação passo a passo com checklist de conformidade',
      icon: ListTodo,
      badge: activeApplication ? `${activeApplication.progressPercentage}%` : null 
    },
    { 
      id: 'guia', 
      label: 'Guia do Artista', 
      desc: 'Passo a passo, certidões e conformidade técnica',
      icon: BookOpen 
    },
    { 
      id: 'apoio', 
      label: 'Apoio ao Artista', 
      desc: 'Canais de atendimento, FAQ e direitos culturais',
      icon: LifeBuoy 
    },
    { 
      id: 'como_funciona', 
      label: 'Como Funciona', 
      desc: 'Metodologia e simulação de editais culturais',
      icon: Info 
    }
  ];

  const handleNavClick = (viewId: AppView) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    setResourcesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFerramentasActive = ['vault', 'checklist', 'guia', 'apoio', 'como_funciona'].includes(currentView);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-[#E6E0D5] dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          
          {/* Marca Editorial Cultura em Cena */}
          <button
            onClick={() => handleNavClick('home')}
            className="brand-btn-interactive flex items-center gap-3 text-left p-1.5 -ml-1.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 group cursor-pointer"
            aria-label="Ir para a página inicial do Cultura em Cena"
          >
            {/* Ícone de Palco / Brasão Cultural */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#991B1B] to-[#7F1D1D] text-white flex items-center justify-center shadow-xs border border-white/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-editorial text-xl italic font-bold">C</span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F3EF] leading-tight group-hover:text-[#991B1B] dark:group-hover:text-red-400 transition-colors">
                Cultura em Cena
              </span>
              <span className="hidden sm:inline text-[11px] tracking-wider uppercase font-semibold text-[#78716C] dark:text-[#A8A29E]">
                Fomento, Documentos & Editais
              </span>
            </div>
          </button>

          {/* NAVEGAÇÃO FIEL AO BENCHMARKING PROSAS:
              [ Início ] [ Empresas ] (Pílula Vermelha) [ Organizações Públicas ] [ Editais ] [ Calendário Cultural ] [ Ferramentas & Cofre ▾ ] */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-medium" aria-label="Navegação principal">
            
            {/* 1. Início */}
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-red-700 ${
                currentView === 'home'
                  ? 'text-[#991B1B] dark:text-red-400 font-bold bg-[#991B1B]/10 dark:bg-red-950/30'
                  : 'text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F2EEE7] dark:hover:bg-white/5'
              }`}
            >
              Início
            </button>

            {/* 2. Empresas (Pílula Vermelha destacada fiel ao Prosas) */}
            <Tooltip content="Portal de Patrocinadores: Simulador Fiscal Rouanet Art. 18 / ProAC ICMS com custo zero e vitrine de projetos">
              <button
                onClick={() => handleNavClick('empresas')}
                className={`btn-pill-empresas relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer focus-visible:ring-2 focus-visible:ring-red-700 shadow-xs ${
                  currentView === 'empresas'
                    ? 'bg-[#991B1B] text-white ring-2 ring-red-500/50 shadow-md'
                    : 'bg-[#991B1B] text-white hover:bg-red-700'
                }`}
              >
                Empresas
              </button>
            </Tooltip>

            {/* 3. Organizações Públicas */}
            <Tooltip content="Gestão para Secretarias Municipais e Prefeituras: PNAB, editais locais e pré-auditoria">
              <button
                onClick={() => handleNavClick('organizacoes_publicas')}
                className={`px-3 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  currentView === 'organizacoes_publicas'
                    ? 'text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-100/70 dark:bg-emerald-950/40'
                    : 'text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                Organizações Públicas
              </button>
            </Tooltip>

            {/* 4. Editais */}
            <button
              onClick={() => handleNavClick('catalog')}
              className={`px-3 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-red-700 ${
                currentView === 'catalog'
                  ? 'text-[#991B1B] dark:text-red-400 font-bold bg-[#991B1B]/10 dark:bg-red-950/30'
                  : 'text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F2EEE7] dark:hover:bg-white/5'
              }`}
            >
              Editais
            </button>

            {/* 5. Calendário Cultural */}
            <button
              onClick={() => handleNavClick('calendario')}
              className={`px-3 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-red-700 ${
                currentView === 'calendario'
                  ? 'text-[#991B1B] dark:text-red-400 font-bold bg-[#991B1B]/10 dark:bg-red-950/30'
                  : 'text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F2EEE7] dark:hover:bg-white/5'
              }`}
            >
              Calendário Cultural
            </button>

            {/* 6. Dropdown Ferramentas & Cofre ▾ */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setResourcesDropdownOpen(prev => !prev)}
                aria-expanded={resourcesDropdownOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-red-700 ${
                  isFerramentasActive 
                    ? 'text-[#991B1B] dark:text-red-400 font-bold bg-[#991B1B]/10 dark:bg-red-950/30' 
                    : 'text-[#57534E] dark:text-[#D6D3D1] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span>Ferramentas & Cofre</span>
                {activeApplication && (
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-full bg-[#1E3A2F] text-white dark:bg-emerald-500 dark:text-stone-950 shadow-2xs">
                    {activeApplication.progressPercentage}%
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {resourcesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 p-2 rounded-2xl bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-xl z-50 space-y-1"
                  >
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-stone-500 border-b border-[#E6E0D5] dark:border-white/10 mb-1">
                      Recursos Operacionais do Artista
                    </div>
                    {ferramentasItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-3 cursor-pointer ${
                          currentView === item.id 
                            ? 'bg-[#991B1B]/10 dark:bg-red-950/40 text-[#991B1B] dark:text-red-400' 
                            : 'hover:bg-[#FAF7F2] dark:hover:bg-white/5 text-[#1C1917] dark:text-[#F5F3EF]'
                        }`}
                      >
                        <item.icon className="w-5 h-5 text-[#991B1B] dark:text-red-400 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{item.label}</span>
                            {item.badge && (
                              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#78716C] dark:text-[#A8A29E] leading-relaxed">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Ações da Direita: Tema + Demonstração / Usuário */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Alternador de Tema */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#F2EEE7] dark:hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-red-700 cursor-pointer"
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-[#1C1917]" aria-hidden="true" />
              )}
            </motion.button>

            {/* Acesso ao Google Workspace Hub (renderizado condicionalmente via variável de estado/configuração) */}
            {showWorkspaceButton && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setWorkspaceModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-500/20 border border-teal-200 dark:border-teal-500/30 transition-colors cursor-pointer shadow-2xs"
                title="Google Workspace (Google Agenda, Planilhas e Formulários)"
              >
                <Layers className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                <span className="hidden sm:inline">Google Workspace</span>
              </motion.button>
            )}

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#1A1A1E] text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/10 transition-colors border border-[#E6E0D5] dark:border-white/10 shadow-2xs focus-visible:ring-2 focus-visible:ring-red-700 cursor-pointer"
                  title="Painel do Artista"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden="true" />
                  <span className="truncate max-w-[130px] font-sans">
                    {user.name} ({user.profileType === 'banda_grupo' ? 'Banda' : user.profileType})
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('perfil')}
                  className="p-2 text-[#78716C] hover:text-[#991B1B] dark:hover:text-red-400 rounded-xl hover:bg-[#F2EEE7] dark:hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-red-700 cursor-pointer"
                  title="Configurações do Perfil"
                  aria-label="Configurações do Perfil"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-[#78716C] hover:text-red-700 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus-visible:ring-2 focus-visible:ring-red-700 cursor-pointer"
                  title="Sair da conta"
                  aria-label="Sair da conta"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={loginAsLucas}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/10 transition-colors border border-[#E6E0D5] dark:border-white/10 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-red-700 cursor-pointer flex items-center gap-1.5"
                  title="Simular com o perfil de demonstração de Lucas (Banda de Rock de Indaiatuba)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#991B1B] dark:text-red-400" />
                  <span>Demonstração Lucas</span>
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="btn-editorial-primary text-xs px-4 py-2 focus-visible:ring-2 focus-visible:ring-red-700 cursor-pointer"
                >
                  Criar conta
                </button>
              </div>
            )}

            {/* Menu Hambúrguer para Telas Pequenas */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2.5 text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5 rounded-xl focus-visible:ring-2 focus-visible:ring-red-700 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Acessível e Organizado */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="lg:hidden bg-[#FAF7F2] dark:bg-[#121214] border-b border-[#E6E0D5] dark:border-white/10 px-4 pt-3 pb-6 space-y-4 overflow-hidden shadow-xl"
          >
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-wider font-bold text-[#78716C] dark:text-[#A8A29E] px-3 py-1">
                Navegação Principal (Benchmarking Prosas)
              </div>

              {/* Início */}
              <button
                onClick={() => handleNavClick('home')}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'home' 
                    ? 'bg-[#991B1B]/10 text-[#991B1B] dark:text-red-400 font-bold' 
                    : 'text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-[#991B1B] dark:text-red-400" />
                  <span>Início (Foco no Artista)</span>
                </span>
              </button>

              {/* Empresas - Pílula Vermelha */}
              <button
                onClick={() => handleNavClick('empresas')}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  currentView === 'empresas' 
                    ? 'bg-[#991B1B] text-white shadow-md' 
                    : 'bg-red-50 dark:bg-red-950/40 text-[#991B1B] dark:text-red-300 hover:bg-red-100'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Building2 className="w-4 h-4" />
                  <span>Empresas & Patrocinadores</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-700 text-white">
                  Custo R$ 0
                </span>
              </button>

              {/* Organizações Públicas */}
              <button
                onClick={() => handleNavClick('organizacoes_publicas')}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'organizacoes_publicas' 
                    ? 'bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 font-bold' 
                    : 'text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Landmark className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Organizações Públicas (PNAB)</span>
                </span>
              </button>

              {/* Editais */}
              <button
                onClick={() => handleNavClick('catalog')}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'catalog' 
                    ? 'bg-[#991B1B]/10 text-[#991B1B] dark:text-red-400 font-bold' 
                    : 'text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Compass className="w-4 h-4 text-[#991B1B] dark:text-red-400" />
                  <span>Catálogo de Editais</span>
                </span>
              </button>

              {/* Calendário Cultural */}
              <button
                onClick={() => handleNavClick('calendario')}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'calendario' 
                    ? 'bg-[#991B1B]/10 text-[#991B1B] dark:text-red-400 font-bold' 
                    : 'text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#991B1B] dark:text-red-400" />
                  <span>Calendário Cultural</span>
                </span>
              </button>
            </div>

            <div className="space-y-1 pt-2 border-t border-[#E6E0D5] dark:border-white/10">
              <div className="text-[11px] uppercase tracking-wider font-bold text-[#78716C] dark:text-[#A8A29E] px-3 py-1">
                Ferramentas & Cofre do Artista
              </div>
              {ferramentasItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    currentView === item.id 
                      ? 'bg-[#991B1B]/10 text-[#991B1B] dark:text-red-400 font-bold' 
                      : 'text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#F2EEE7] dark:hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-[#78716C] dark:text-[#A8A29E]" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#1E3A2F] text-white dark:bg-emerald-500 dark:text-stone-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E6E0D5] dark:border-white/10 space-y-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-white dark:bg-[#1A1A1E] rounded-xl border border-[#E6E0D5] dark:border-white/10">
                    <div className="text-xs">
                      <p className="font-bold text-[#1C1917] dark:text-[#F5F3EF]">{user.name}</p>
                      <p className="text-[#78716C] dark:text-[#A8A29E]">{user.city}, SP · {user.artisticArea}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleNavClick('perfil')}
                        className="p-2 text-[#78716C] hover:text-[#991B1B] rounded-lg"
                        title="Configurações do Perfil"
                        aria-label="Configurações do Perfil"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                        title="Sair"
                        aria-label="Sair da conta"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full py-3 text-xs font-bold text-center rounded-xl bg-white dark:bg-[#1A1A1E] text-[#1C1917] dark:text-white border border-[#E6E0D5] dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer hover:bg-[#F2EEE7] transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-[#991B1B] dark:text-red-400" />
                    <span>Acessar Painel de Performance</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      loginAsLucas();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 text-xs text-center font-semibold rounded-xl border border-[#E6E0D5] dark:border-white/10 bg-white dark:bg-[#1A1A1E] text-[#1C1917] dark:text-white"
                  >
                    Entrar como Lucas
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="btn-editorial-primary w-full py-2.5 text-xs text-center"
                  >
                    Criar conta
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
