import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Clock, Landmark, Building2,
  Calculator, ShieldCheck, User, Users, Music
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtistProfileType, AppView, VerificationStatus } from '../types';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { Tooltip, InfoTooltip } from './Tooltip';
import { HeroCulturaEmCena } from './HeroCulturaEmCena';
import { FaqSection } from './FaqSection';

const NOTICE_BADGE: Record<VerificationStatus, { label: string; tooltip: string; className: string }> = {
  verified: {
    label: 'Fonte verificada',
    tooltip: 'Chamamento publicado em diário oficial ou portal público com link direto para a consulta original.',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
  },
  pending_verification: {
    label: 'Em confirmação',
    tooltip: 'Referência existente nos canais institucionais, aguardando portaria de abertura ou cronograma definitivo.',
    className: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
  },
  forecast: {
    label: 'Previsão anual',
    tooltip: 'Estimativa baseada nos ciclos históricos de anos anteriores para planejamento antecipado do projeto.',
    className: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
  },
  demo: {
    label: 'Modelo didático',
    tooltip: 'Edital simulado para aprendizado prático e treino de envio de documentação, sem efeito jurídico.',
    className: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-white/5 dark:text-stone-300 dark:border-white/10',
  },
};

export const HomePage: React.FC = () => {
  const {
    selectedProfile,
    setSelectedProfile,
    setCurrentView,
    setSelectedGrantId,
    grants,
    setAuthModalOpen,
    setAuthModalMode,
    loginAsLucas,
  } = useApp();

  const goTo = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openGrant = (grantId: string) => {
    setSelectedGrantId(grantId);
    goTo('grant_detail');
  };

  const startDemo = () => {
    loginAsLucas();
    goTo('checklist');
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
      desc: 'Músicos com representação formal', 
      tooltip: 'Exige Carta de Representação assinada por todos os integrantes delegando poderes ao proponente.',
      icon: Music 
    },
    { 
      id: 'coletivo_cultural' as ArtistProfileType, 
      label: 'Coletivo', 
      desc: 'Grupos e trupes sem CNPJ', 
      tooltip: 'Grupos artísticos informais representados por um líder responsável pelo projeto.',
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

  const featuredGrants = grants
    .filter(g => g.verificationStatus === 'verified' && !getGrantDeadlineInfo(g.deadlineDate).isClosed)
    .slice(0, 3);

  const getCompatibleCountForProfile = (profileId: ArtistProfileType) => {
    return grants.filter(g => 
      g.verificationStatus === 'verified' && 
      !getGrantDeadlineInfo(g.deadlineDate).isClosed &&
      g.eligibleProfiles.includes(profileId)
    ).length;
  };

  const formatCompatibleLabel = (count: number) => {
    if (count === 1) return '1 edital compatível aberto';
    return `${count} editais compatíveis abertos`;
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">

      {/* 1. HERO 12 COLUNAS COM BUSCA INTEGRADA E DOSSIÊ FÍSICO */}
      <HeroCulturaEmCena />

      {/* 2. PANORAMA DO FOMENTO CULTURAL (Papel com Crop-Marks) */}
      <section aria-label="Panorama do Fomento Cultural" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="crop-marks relative p-6 sm:p-8 rounded-2xl bg-[#FFFDF8] dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5 text-[#991B1B] dark:text-red-400" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#991B1B] dark:text-red-400 block">
                  Panorama do Fomento Regional
                </span>
                <h2 className="font-editorial text-lg sm:text-xl font-semibold text-[#1C1917] dark:text-[#F5F3EF]">
                  Mapeamento em Indaiatuba, RMC e âmbito nacional
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-xs divide-x divide-[#E6E0D5] dark:divide-white/10 pt-4 md:pt-0 border-t md:border-t-0 border-[#E6E0D5] dark:border-white/10">
              <div className="pl-3 first:pl-0">
                <span className="text-[11px] text-[#78716C] dark:text-[#A8A29E] block">Recursos Mapeados</span>
                <span className="text-base sm:text-lg font-semibold tabular-nums text-[#1C1917] dark:text-[#F5F3EF]">
                  R$ 4.2M+
                </span>
              </div>
              <div className="pl-3">
                <span className="text-[11px] text-[#78716C] dark:text-[#A8A29E] block">Fontes Públicas</span>
                <span className="text-base sm:text-lg font-semibold tabular-nums text-[#1C1917] dark:text-[#F5F3EF]">
                  100% Abertas
                </span>
              </div>
              <div className="pl-3">
                <span className="text-[11px] text-[#78716C] dark:text-[#A8A29E] block">Foco Territorial</span>
                <span className="text-base sm:text-lg font-semibold text-[#1C1917] dark:text-[#F5F3EF]">
                  Indaiatuba & RMC
                </span>
              </div>
              <div className="pl-3">
                <span className="text-[11px] text-[#78716C] dark:text-[#A8A29E] block">Risco de Inabilitação</span>
                <span className="text-base sm:text-lg font-semibold tabular-nums text-[#991B1B] dark:text-red-400">
                  -78% com Cofre
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PERFIS ATENDIDOS COM CONTAGEM GRAMATICALMENTE PRECISA */}
      <section aria-labelledby="perfil-title" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#991B1B] dark:text-red-400">
            Enquadramento Técnico
          </span>
          <h2 id="perfil-title" className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917] dark:text-[#F5F3EF]">
            Como você se inscreve?
          </h2>
          <p className="text-sm text-[#78716C] dark:text-[#A8A29E] max-w-lg mx-auto">
            O enquadramento determina quais anexos, certidões e comprovantes serão cobrados pela comissão julgadora.
          </p>
        </div>

        <div role="radiogroup" aria-labelledby="perfil-title" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map(({ id, label, desc, tooltip, icon: Icon }) => {
            const active = selectedProfile === id;
            const count = getCompatibleCountForProfile(id);
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
                className={`text-left p-5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  active
                    ? 'border-[#991B1B] bg-red-50/40 dark:border-red-500 dark:bg-red-950/20 shadow-xs'
                    : 'border-[#E6E0D5] dark:border-white/10 bg-white dark:bg-[#1A1A1E] hover:border-[#CFC7B8] dark:hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className={`p-2 rounded-lg ${active ? 'bg-[#991B1B] text-white' : 'bg-[#FAF7F2] dark:bg-white/5 text-[#57534E] dark:text-[#D6D3D1]'}`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    {active && <CheckCircle2 className="w-5 h-5 text-[#991B1B] dark:text-red-400" aria-hidden="true" />}
                  </div>
                  
                  <div className="flex items-center justify-between gap-1 mt-4">
                    <p className="font-semibold text-base text-[#1C1917] dark:text-[#F5F3EF] leading-tight">
                      {label}
                    </p>
                    <InfoTooltip title={label} content={tooltip} position="top" />
                  </div>
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-1 leading-relaxed">{desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E6E0D5] dark:border-white/5 flex items-center gap-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="tabular-nums">{formatCompatibleLabel(count)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. OPORTUNIDADES ABERTAS */}
      <section aria-labelledby="destaques-title" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#991B1B] dark:text-red-400">
              Chamamentos Ativos
            </span>
            <h2 id="destaques-title" className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917] dark:text-[#F5F3EF]">
              Oportunidades com inscrições abertas
            </h2>
            <p className="text-sm text-[#78716C] dark:text-[#A8A29E]">
              Consulte sempre o edital e a publicação original no portal oficial do órgão emissor.
            </p>
          </div>
          <button
            type="button"
            onClick={() => goTo('catalog')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#991B1B] dark:text-red-400 hover:underline cursor-pointer"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {featuredGrants.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-[#CFC7B8] dark:border-white/10 text-center text-[#78716C] dark:text-[#A8A29E] text-sm">
            Nenhum edital aberto no momento. Consulte o calendário cultural para ver as previsões dos próximos ciclos.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredGrants.map((grant) => {
              const deadline = getGrantDeadlineInfo(grant.deadlineDate);
              const badge = NOTICE_BADGE[grant.verificationStatus ?? 'verified'];
              return (
                <article
                  key={grant.id}
                  className="flex flex-col p-6 rounded-xl border border-[#E6E0D5] dark:border-white/10 bg-white dark:bg-[#1A1A1E] hover:border-[#CFC7B8] dark:hover:border-white/20 transition-all shadow-xs"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Tooltip title={badge.label} content={badge.tooltip} position="top">
                      <span className={`px-2.5 py-0.5 rounded-md border text-[11px] font-medium cursor-help inline-flex items-center gap-1 ${badge.className}`}>
                        {badge.label}
                      </span>
                    </Tooltip>
                    <span className="text-[#78716C] dark:text-[#A8A29E] text-xs">
                      {grant.sphere} · {grant.artisticArea}
                    </span>
                  </div>

                  <h3 className="mt-3 font-editorial text-lg font-bold leading-snug text-[#1C1917] dark:text-[#F5F3EF]">
                    {grant.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#78716C] dark:text-[#A8A29E]">{grant.issuingBody}</p>
                  
                  <p className="mt-3 text-xs sm:text-sm text-[#57534E] dark:text-[#D6D3D1] line-clamp-3 flex-1 leading-relaxed">
                    {grant.summary}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#E6E0D5] dark:border-white/5 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums text-[#1C1917] dark:text-[#F5F3EF]">
                      <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                      {deadline.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => openGrant(grant.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#991B1B] dark:text-red-400 hover:underline cursor-pointer"
                      aria-label={`Ver detalhes de ${grant.title}`}
                    >
                      <span>Ver detalhes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. PARA INSTITUIÇÕES: EMPRESAS & ÓRGÃOS PÚBLICOS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs uppercase font-semibold tracking-wider text-[#991B1B] dark:text-red-400">
            Ecossistema de Fomento
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917] dark:text-[#F5F3EF]">
            Soluções dedicadas a cada parceiro cultural
          </h2>
          <p className="text-sm text-[#78716C] dark:text-[#A8A29E]">
            Conectamos quem produz arte, quem financia via incentivo fiscal com custo zero e quem gere o fomento municipal e estadual.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Empresas & Patrocinadores */}
          <div className="rounded-2xl border border-[#E6E0D5] dark:border-white/10 bg-white dark:bg-[#1A1A1E] p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-[#991B1B] dark:text-red-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900/50">
                  Custo R$ 0,00
                </span>
              </div>
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#1C1917] dark:text-[#F5F3EF]">
                  Empresas & Patrocinadores Privados
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#D6D3D1] mt-2 leading-relaxed">
                  Simule em tempo real aportes via <strong>Lei Rouanet (Artigo 18 — 100% dedutível no IRPJ)</strong> e <strong>ProAC ICMS SP</strong>. Apoie projetos pré-auditados com retorno de imagem institucional e responsabilidade social.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-[#78716C] dark:text-[#A8A29E]">
                <div className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-[#991B1B]" />
                  <span>Simulador Fiscal IRPJ e ICMS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Projetos Pré-auditados</span>
                </div>
              </div>
            </div>
            <div className="pt-5 mt-5 border-t border-[#E6E0D5] dark:border-white/10">
              <button
                type="button"
                onClick={() => goTo('empresas')}
                className="w-full py-2.5 px-4 rounded-lg font-medium text-xs bg-[#991B1B] hover:bg-[#7F1D1D] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Acessar Portal de Empresas & Simulador</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card Organizações Públicas */}
          <div className="rounded-2xl border border-[#E6E0D5] dark:border-white/10 bg-white dark:bg-[#1A1A1E] p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Landmark className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                  PNAB & Municípios
                </span>
              </div>
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#1C1917] dark:text-[#F5F3EF]">
                  Organizações Públicas & Secretarias
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#D6D3D1] mt-2 leading-relaxed">
                  Recursos técnicos para gestores municipais e comissões avaliarem editais da <strong>PNAB (Política Nacional Aldir Blanc)</strong> e fundos municipais, assegurando conformidade jurídica e redução de recursos administrativos.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-[#78716C] dark:text-[#A8A29E]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Redução de Recursos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Conformidade PNAB</span>
                </div>
              </div>
            </div>
            <div className="pt-5 mt-5 border-t border-[#E6E0D5] dark:border-white/10">
              <button
                type="button"
                onClick={() => goTo('organizacoes_publicas')}
                className="w-full py-2.5 px-4 rounded-lg font-medium text-xs bg-[#1E3A2F] hover:bg-[#142820] text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Acessar Portal de Gestão Pública</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PERGUNTAS FREQUENTES (FAQ) */}
      <FaqSection />

      {/* 7. CTA FINAL EDITORIAL */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#1C1917] dark:bg-[#1A1A1E] border border-white/10 p-8 sm:p-10 text-center space-y-5 shadow-md">
          <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#FAF7F2]">
            Sua próxima inscrição começa organizada.
          </h2>
          <p className="text-sm text-[#A8A29E] max-w-lg mx-auto leading-relaxed">
            Cadastre seus documentos no cofre ou experimente a simulação prática com o dossiê da Banda Veludo Branco.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={openRegister}
              className="px-5 py-2.5 rounded-lg bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto"
            >
              Criar Conta Gratuita
            </button>
            <button
              type="button"
              onClick={startDemo}
              className="px-5 py-2.5 rounded-lg border border-white/20 text-[#FAF7F2] hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer w-full sm:w-auto"
            >
              Testar com Lucas (Banda Veludo Branco)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
