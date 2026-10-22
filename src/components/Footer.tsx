import React from 'react';
import { 
  Sparkles, 
  ArrowUp, 
  ShieldCheck, 
  FolderLock, 
  FileCheck, 
  Compass, 
  BookOpen, 
  LifeBuoy, 
  Info, 
  Heart,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (viewId: any) => {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-950 transition-colors">
      {/* Container Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          
          {/* Coluna 1 & 2: Identidade e Missão */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F3EF]">
                Cultura em Cena
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#991B1B]/10 text-[#991B1B] dark:text-red-400 border border-[#991B1B]/20 font-mono">
                v2.5
              </span>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Plataforma desenvolvida para simplificar o acesso a editais culturais por artistas independentes, bandas e coletivos sem equipe de produção.
            </p>

            {/* Badges de Integridade da Demonstração */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Privacidade 100% no Navegador</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulação Acadêmica</span>
              </div>
            </div>
          </div>

          {/* Coluna 3: Navegação Rápida */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navegação
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => navigateTo('home')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('empresas')} 
                  className="hover:text-[#991B1B] dark:hover:text-red-400 transition-colors cursor-pointer text-left font-bold text-[#991B1B] dark:text-red-400"
                >
                  Empresas & Patrocinadores
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('organizacoes_publicas')} 
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left font-medium text-emerald-800 dark:text-emerald-400"
                >
                  Organizações Públicas (PNAB)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('catalog')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Catálogo de Editais
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('calendario')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Calendário Cultural
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('vault')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Cofre de Documentos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('checklist')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Inscrição Guiada
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('dashboard')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Painel de Performance
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Recursos & Guias */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Recursos & Apoio
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => navigateTo('guia')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Guia do Artista
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('como_funciona')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('formulario_projeto')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Rascunho de Projeto
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('apoio')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Central de Apoio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('perfil')} 
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                >
                  Configurações de Perfil
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 5: Transparência & Conformidade */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Transparência
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span>Dados 100% simulados para feira universitária</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span>Sem coleta de CPF, senhas ou arquivos reais</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span>Persistência client-side via localStorage</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span>Cálculos de prazos e vigência em tempo real</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Faixa Inferior de Copyright e Ações Rápidas */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Cultura em Cena. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-slate-400 dark:text-slate-600">·</span>
            <span>Feira Universitária de Inovação Cultural</span>
            <span className="hidden sm:inline text-slate-400 dark:text-slate-600">·</span>
            
            {/* Botão Voltar ao Topo */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
              title="Voltar ao início da página"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
