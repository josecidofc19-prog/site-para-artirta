import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Sparkles, ArrowRight, Compass, FolderLock, ListTodo,
  CheckCircle2, Clock, ShieldCheck, User, Users, Building2, Music, Calendar,
  BookOpen, ExternalLink, Landmark, Calculator
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtistProfileType, AppView, Grant } from '../types';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { Tooltip, InfoTooltip } from './Tooltip';
import { HeroCulturaEmCena } from './HeroCulturaEmCena';

const NOTICE_BADGE: Record<NonNullable<Grant['noticeType']>, { label: string; tooltip: string; className: string }> = {
  real: {
    label: 'Oficial verificado',
    tooltip: 'Edital em vigor publicado em diário oficial ou portal governamental com link direto para consulta pública.',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
  },
  simulado: {
    label: 'Modelo educativo',
    tooltip: 'Edital simulado para aprendizado prático e treino de envio de documentação, sem efeito jurídico ou inscrição real.',
    className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10',
  },
  previsao_anual: {
    label: 'Previsão histórica',
    tooltip: 'Estimativa baseada nos ciclos e chamamentos anuais de anos anteriores para planejamento prévio de sua produção.',
    className: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
  },
};

export const HomePage: React.FC = () => {
  const {
    selectedProfile, setSelectedProfile, setSearchTerm,
    setCurrentView, setSelectedGrantId,
    grants, setAuthModalOpen, setAuthModalMode, loginAsLucas
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');

  const goTo = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearch.trim());
    goTo('catalog');
  };

  const openGrant = (grantId: string) => {
    setSelectedGrantId(grantId);
    goTo('grant_detail');
  };

  const startDemo = () => {
    loginAsLucas();
    goTo('dashboard');
  };

  const openRegister = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  const profiles = [
    { 
      id: 'artista_solo' as ArtistProfileType, 
      label: 'Artista Solo', 
      desc: 'Pessoa física com CPF próprio', 
      tooltip: 'Inscrição individual via CPF do proponente. Não exige CNPJ ou carta de representação.',
      icon: User 
    },
    { 
      id: 'banda_grupo' as ArtistProfileType, 
      label: 'Banda ou Grupo', 
      desc: 'Músicos com representação', 
      tooltip: 'Exige Carta de Representação assinada por todos os integrantes delegando poderes ao proponente.',
      icon: Music 
    },
    { 
      id: 'coletivo_cultural' as ArtistProfileType, 
      label: 'Coletivo', 
      desc: 'Grupos e trupes sem CNPJ', 
      tooltip: 'Grupos artísticos informais representados por um líder sem a obrigatoriedade de ter CNPJ.',
      icon: Users 
    },
    { 
      id: 'produtor_cultural' as ArtistProfileType, 
      label: 'Produtor (PJ)', 
      desc: 'MEI ou produtoras formais', 
      tooltip: 'Pessoa Jurídica ou MEI com CNAE cultural compatível, apto para emissão de nota fiscal e contratos de fomento.',
      icon: Building2 
    },
  ];

  const quickAccess: { view: AppView; title: string; desc: string; icon: React.ElementType }[] = [
    { view: 'catalog', title: 'Editais', desc: 'Oportunidades com fonte oficial e prazo identificado.', icon: Compass },
    { view: 'calendario', title: 'Calendário cultural', desc: 'Quando cada edital costuma abrir ao longo do ano.', icon: Calendar },
    { view: 'vault', title: 'Cofre de documentos', desc: 'Certidões e comprovantes com alerta de validade.', icon: FolderLock },
    { view: 'guia', title: 'Guia do artista', desc: 'Termos, etapas e dúvidas comuns em linguagem direta.', icon: BookOpen },
  ];

  const steps = [
    { icon: Compass, title: 'Encontre o edital certo', desc: 'Filtre por perfil, área artística e esfera. Cada edital mostra se é oficial, modelo educativo ou previsão.' },
    { icon: FolderLock, title: 'Organize a documentação', desc: 'Guarde certidões no cofre. A plataforma avisa o que venceu e o que vence em breve.' },
    { icon: ListTodo, title: 'Siga o checklist', desc: 'Etapas da inscrição com progresso calculado a partir dos documentos exigidos pelo edital.' },
  ];

  const featuredGrants = grants
    .filter(g => !getGrantDeadlineInfo(g.deadlineDate).isClosed)
    .slice(0, 3);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay },
  });

  return (
    <div className="space-y-20 pb-20">

      {/* 1. HERO MULTI-PÚBLICO COM TOGGLE (SPONSOR / ARTISTA) */}
      <HeroCulturaEmCena 
        onSponsorClick={() => goTo('empresas')} 
        onArtistClick={() => goTo('catalog')} 
      />

      {/* 1.1 BUSCA RÁPIDA DE EDITAIS & DEMO LUCAS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white dark:bg-[#1A1A1E] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-[#991B1B] dark:text-red-400" />
                <span>Busca Rápida de Editais e Chamadas</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Filtre por leis federais (Rouanet, PNAB), estaduais (ProAC) ou fundos municipais (FICC Indaiatuba).
              </p>
            </div>
            <button
              type="button"
              onClick={startDemo}
              className="btn-secondary text-xs px-3.5 py-2 whitespace-nowrap self-stretch sm:self-auto flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>Simular com Lucas</span>
            </button>
          </div>

          {/* Busca */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="flex flex-col sm:flex-row gap-3"
          >
            <label htmlFor="home-search" className="sr-only">Buscar editais</label>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
              <input
                id="home-search"
                type="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Ex.: música, ProAC, Lei Paulo Gustavo, Indaiatuba…"
                className="w-full min-h-[46px] pl-11 pr-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 text-sm"
              />
            </div>
            <button type="submit" className="btn-editorial-primary min-h-[46px] px-6 text-sm">
              <span>Buscar editais</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>

      {/* 2. PERFIL */}
      <section aria-labelledby="perfil-title" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <h2 id="perfil-title" className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Como você se inscreve?
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            O perfil define quais editais e documentos se aplicam a você.
          </p>
        </div>
        <div role="radiogroup" aria-labelledby="perfil-title" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {profiles.map(({ id, label, desc, tooltip, icon: Icon }) => {
            const active = selectedProfile === id;
            return (
              <div
                key={id}
                role="radio"
                tabIndex={0}
                aria-checked={active}
                onClick={() => setSelectedProfile(id)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setSelectedProfile(id);
                  }
                }}
                className={`text-left p-4 sm:p-5 rounded-2xl border transition-colors focus-ring cursor-pointer group ${
                  active
                    ? 'border-teal-700 bg-teal-50 dark:border-teal-400 dark:bg-teal-500/10'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <Icon className={`w-6 h-6 ${active ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500'}`} aria-hidden="true" />
                  {active && <CheckCircle2 className="w-5 h-5 text-teal-700 dark:text-teal-400" aria-hidden="true" />}
                </div>
                <div className="flex items-center justify-between gap-1 mt-3">
                  <p className="font-bold text-slate-900 dark:text-white leading-tight">{label}</p>
                  <InfoTooltip title={label} content={tooltip} position="top" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ACESSO RÁPIDO */}
      <section aria-labelledby="acesso-title" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="acesso-title" className="sr-only">Acesso rápido</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-y border-slate-200 dark:border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-white/10">
          {quickAccess.map(({ view, title, desc, icon: Icon }) => (
            <button
              key={view}
              type="button"
              onClick={() => goTo(view)}
              className="group text-left p-6 hover:bg-white dark:hover:bg-slate-900 transition-colors focus-ring cursor-pointer"
            >
              <Icon className="w-6 h-6 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              <p className="mt-4 font-editorial text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {title}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 3.1 PORTAIS ESPECIALIZADOS (BENCHMARKING PROSAS) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#991B1B] dark:text-red-400">
            Arquitetura de Múltiplos Públicos
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Soluções dedicadas a cada ator do ecossistema cultural
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Conectamos quem faz cultura, quem patrocina com benefícios fiscais e quem gere o fomento público.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Empresas & Patrocinadores */}
          <div className="rounded-3xl border-2 border-red-700/30 dark:border-red-600/30 bg-gradient-to-br from-red-50/50 via-white to-stone-50 dark:from-red-950/20 dark:via-[#1A1A1E] dark:to-[#121214] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#991B1B] text-white flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#991B1B] text-white shadow-2xs">
                  Custo R$ 0,00
                </span>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-slate-900 dark:text-white">
                Empresas & Patrocinadores Privados
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Simule em tempo real aportes via <strong>Lei Rouanet (Artigo 18 — 100% dedutível no IRPJ)</strong> e <strong>ProAC ICMS SP</strong>. Apoie projetos pré-auditados como a Banda Veludo Branco em Indaiatuba com retorno de imagem e impacto ESG.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-[#991B1B]" />
                  <span>Simulador Fiscal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Projetos Pré-aprovados</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-4 border-t border-red-200/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => goTo('empresas')}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#991B1B] hover:bg-red-700 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Acessar Portal de Empresas & Simulador</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card Organizações Públicas */}
          <div className="rounded-3xl border-2 border-emerald-700/30 dark:border-emerald-600/30 bg-gradient-to-br from-emerald-50/50 via-white to-stone-50 dark:from-emerald-950/20 dark:via-[#1A1A1E] dark:to-[#121214] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  PNAB & Municípios
                </span>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-slate-900 dark:text-white">
                Organizações Públicas & Secretarias
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Plataforma oficial para prefeituras e gestores operarem o ciclo de editais da <strong>PNAB (Política Nacional Aldir Blanc)</strong> e fundos locais (como FICC) com pareceres duplo-cegos e pré-auditoria documental.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>-78% Recursos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Pareceres Duplo-Cego</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-4 border-t border-emerald-200/60 dark:border-white/10">
              <button
                type="button"
                onClick={() => goTo('organizacoes_publicas')}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Acessar Portal de Gestão Pública</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OPORTUNIDADES EM DESTAQUE */}
      <section aria-labelledby="destaques-title" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <h2 id="destaques-title" className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Oportunidades abertas
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Confira sempre o edital no portal oficial antes de se inscrever.
            </p>
          </div>
          <button
            type="button"
            onClick={() => goTo('catalog')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-400 hover:underline focus-ring rounded-lg cursor-pointer"
          >
            Ver catálogo completo <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {featuredGrants.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-center text-slate-600 dark:text-slate-400">
            Nenhum edital com inscrições abertas no momento. Consulte o calendário cultural para ver as previsões.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {featuredGrants.map((grant) => {
              const deadline = getGrantDeadlineInfo(grant.deadlineDate);
              const badge = NOTICE_BADGE[grant.noticeType ?? 'simulado'];
              return (
                <article
                  key={grant.id}
                  className="flex flex-col p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Tooltip title={badge.label} content={badge.tooltip} position="top">
                      <span className={`px-2.5 py-1 rounded-full border font-semibold cursor-help inline-flex items-center gap-1 ${badge.className}`}>
                        {badge.label}
                      </span>
                    </Tooltip>
                    <span className="text-slate-500 dark:text-slate-400">{grant.sphere} · {grant.artisticArea}</span>
                  </div>
                  <h3 className="mt-4 font-editorial text-xl font-bold leading-snug text-slate-900 dark:text-white">
                    {grant.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{grant.issuingBody}</p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 flex-1">{grant.summary}</p>
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                      {deadline.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => openGrant(grant.id)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 dark:text-teal-400 hover:underline focus-ring rounded-lg cursor-pointer"
                      aria-label={`Ver detalhes de ${grant.title}`}
                    >
                      Detalhes <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  {grant.officialUrl && (
                    <a
                      href={grant.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 focus-ring rounded"
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      Fonte oficial{grant.officialSource ? `: ${grant.officialSource}` : ''}
                      <span className="sr-only">(abre em nova aba)</span>
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. COMO FUNCIONA */}
      <section aria-labelledby="como-title" className="bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200 dark:border-white/5 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="como-title" className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
            Do edital ao envio, em três frentes
          </h2>
          <ol className="grid md:grid-cols-3 gap-8">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-editorial text-4xl font-bold text-teal-700/30 dark:text-teal-400/30" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <Icon className="w-6 h-6 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 flex items-start sm:items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 text-center">
            <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
            Demonstração acadêmica: documentos e inscrições são simulados. Não envie dados pessoais reais.
          </p>
        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-slate-900 dark:bg-slate-900 border border-white/10 p-8 sm:p-12 text-center space-y-6"
        >
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-white">
            Sua próxima inscrição começa organizada.
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto">
            Crie uma conta para salvar documentos e acompanhar o progresso, ou explore a demonstração com o perfil do Lucas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={openRegister}
              className="btn-editorial-primary min-h-[48px] px-6 w-full sm:w-auto"
            >
              Criar Conta Gratuita
            </button>
            <button
              type="button"
              onClick={startDemo}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors focus-ring w-full sm:w-auto cursor-pointer"
            >
              Testar com Lucas
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
