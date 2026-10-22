import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight,
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles, 
  Building,
  MapPin,
  Users,
  Shield,
  HelpCircle,
  X,
  FolderLock,
  ListTodo,
  PenTool,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { findDocForRequirement, calculateDocumentStatus } from '../data/defaultVault';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { Tooltip, InfoTooltip } from './Tooltip';

export const GrantDetailPage: React.FC = () => {
  const { 
    selectedGrantId, 
    grants, 
    user, 
    selectedProfile, 
    vaultDocuments,
    startPreparationForGrant, 
    setCurrentView,
    activeApplication
  } = useApp();

  const [showOfficialUrlInfo, setShowOfficialUrlInfo] = useState(false);

  const grant = grants.find(g => g.id === selectedGrantId) || grants[0];
  const { isClosed, label } = getGrantDeadlineInfo(grant.deadlineDate);

  const activeProfile = user?.profileType || selectedProfile;
  const isEligibleProfile = grant.eligibleProfiles.includes(activeProfile);
  const isPreparingThis = activeApplication?.grantId === grant.id;

  // Análise de Elegibilidade em Tempo Real para o Perfil Ativo
  const getEligibilityDiagnosis = () => {
    const fulfilled: string[] = [];
    const pending: string[] = [];

    if (isEligibleProfile) {
      fulfilled.push(`Perfil artístico compatível (${activeProfile === 'banda_grupo' ? 'Banda ou grupo' : activeProfile === 'artista_solo' ? 'Artista Solo' : activeProfile === 'coletivo_cultural' ? 'Coletivo Cultural' : 'Produtor Cultural'}).`);
    } else {
      pending.push(`Este edital restringe-se aos perfis: ${grant.eligibleProfiles.map(p => p === 'banda_grupo' ? 'Banda' : p === 'artista_solo' ? 'Solo' : p === 'coletivo_cultural' ? 'Coletivo' : 'Produtor').join(', ')}.`);
    }

    if (grant.city) {
      if (user?.city && user.city.toLowerCase() === grant.city.toLowerCase()) {
        fulfilled.push(`Sede no município de ${grant.city} compatível com o cadastro.`);
      } else {
        pending.push(`Exige comprovação de sede ou residência no município de ${grant.city}.`);
      }
    } else if (grant.state === 'SP') {
      fulfilled.push('Abrangência em todo o Estado de São Paulo.');
    } else {
      fulfilled.push('Abrangência nacional (esfera federal).');
    }

    if (grant.maxCityPopulation) {
      pending.push(`Restrito a projetos oriundos de municípios com até ${grant.maxCityPopulation.toLocaleString('pt-BR')} habitantes.`);
    }

    if (grant.eligibleLegal.includes('pf') || grant.eligibleLegal.includes('coletivo')) {
      fulfilled.push('Aceita pessoas físicas e coletivos sem exigência obrigatória de CNPJ.');
    } else if (grant.eligibleLegal.includes('mei') || grant.eligibleLegal.includes('empresa')) {
      pending.push('Exige cadastro societário ativo como MEI ou microempresa cultural.');
    }

    return { fulfilled, pending };
  };

  const diagnosis = getEligibilityDiagnosis();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Botão Voltar ao Catálogo */}
      <button
        onClick={() => {
          setCurrentView('catalog');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors focus-ring cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao catálogo de editais</span>
      </button>

      {/* Cartão Bento de Identificação Principal */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bento-card space-y-6"
      >
        {/* Metadados e Nível de Verificação */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#78716C] dark:text-[#A8A29E]">
          {grant.verificationStatus === 'verified' && (
            <Tooltip
              title="Edital Oficial Verificado"
              content="Confirmado com documento ou fonte oficial direta. Regulamento e cronograma vigentes no órgão emissor."
              position="bottom"
            >
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1E3A2F]/15 text-[#1E3A2F] dark:text-emerald-400 border border-[#1E3A2F]/25 flex items-center gap-1 cursor-help">
                <CheckCircle2 className="w-3 h-3" />
                <span>Oficial Verificado</span>
              </span>
            </Tooltip>
          )}

          {grant.verificationStatus === 'pending_verification' && (
            <Tooltip
              title="Aguardando Confirmação Oficial"
              content="Referência pública existente nos canais governamentais, aguardando publicação definitiva do edital ou anexos específicos."
              position="bottom"
            >
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/25 flex items-center gap-1 cursor-help">
                <Clock className="w-3 h-3" />
                <span>Aguardando Confirmação</span>
              </span>
            </Tooltip>
          )}

          {grant.verificationStatus === 'forecast' && (
            <Tooltip
              title="Previsão Histórica Anual"
              content="Previsão baseada nos ciclos históricos regulares para planejamento e estruturação antecipada de documentos."
              position="bottom"
            >
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 cursor-help">
                <Calendar className="w-3 h-3" />
                <span>Previsão Histórica</span>
              </span>
            </Tooltip>
          )}

          {grant.verificationStatus === 'demo' && (
            <Tooltip
              title="Modelo Educativo Didático"
              content="Edital simulado para aprendizado de fluxo de inscrição e treinamento prático de dossiê documental, sem efeito jurídico."
              position="bottom"
            >
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF7F2] dark:bg-white/10 text-[#57534E] dark:text-[#D6D3D1] border border-[#E6E0D5] dark:border-white/10 flex items-center gap-1 cursor-help">
                <Sparkles className="w-3 h-3 text-[#991B1B]" />
                <span>Modelo Didático</span>
              </span>
            </Tooltip>
          )}

          <span className="font-semibold text-[#1E3A2F] dark:text-emerald-400">{grant.artisticArea}</span>
          <span aria-hidden="true" className="text-[#CFCECB]">·</span>
          <span className="flex items-center gap-1">
            <Building className="w-3.5 h-3.5" />
            {grant.sphere}
          </span>
          <span aria-hidden="true" className="text-[#CFCECB]">·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {grant.city ? `${grant.city}, ${grant.state}` : `Estado de ${grant.state}`}
          </span>
          <span aria-hidden="true" className="text-[#CFCECB]">·</span>
          <span className={`font-semibold tabular-nums ${isClosed ? 'text-red-600 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
            {label}
          </span>
        </div>

        {/* Título do Edital com Tipografia Editorial */}
        <div className="space-y-2">
          <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F3EF] leading-tight">
            {grant.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#D6D3D1]">
            Publicado por: <strong className="text-[#1C1917] dark:text-white">{grant.issuingBody || 'Informação não confirmada'}</strong>
            {grant.officialSource && (
              <span className="text-[#78716C] dark:text-[#A8A29E] ml-1.5 font-sans">
                (Fonte: {grant.officialSource})
              </span>
            )}
          </p>
        </div>

        {/* Barra de Ações Rápidas */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              startPreparationForGrant(grant.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={isClosed}
            className="btn-editorial-primary px-6 py-2.5 text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-red-700 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{isPreparingThis ? 'Continuar preparação (Checklist)' : 'Começar preparação'}</span>
          </motion.button>

          {grant.officialUrl ? (
            <a
              href={grant.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-4 py-2.5 text-xs sm:text-sm focus-ring flex items-center gap-2 min-h-[44px]"
              title={`Acessar portal oficial de ${grant.officialSource || grant.issuingBody}`}
            >
              <ExternalLink className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Acessar portal oficial</span>
            </a>
          ) : (
            <button
              onClick={() => setShowOfficialUrlInfo(true)}
              className="btn-secondary px-4 py-2.5 text-xs sm:text-sm focus-ring flex items-center gap-2 min-h-[44px]"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Ver edital oficial</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* =========================================================================
          A JORNADA DE PREPARAÇÃO EM 8 ETAPAS (ESTRUTURA SEQUENCIAL PADRÃO)
         ========================================================================= */}

      <div className="space-y-6">

        {/* 1. RESUMO E OBJETIVO */}
        <section aria-labelledby="sec-resumo" className="bento-card space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-white/5">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <h2 id="sec-resumo" className="text-base font-bold text-slate-900 dark:text-white">
              Resumo e Objetivo
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {grant.summary || 'Informação não confirmada'}
          </p>
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Objetivo e Justificativa Regulamentar
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {grant.objective || 'Informação não confirmada'}
            </p>
            {grant.description && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
                {grant.description}
              </p>
            )}
          </div>
        </section>

        {/* 2. QUEM PODE PARTICIPAR (DIAGNÓSTICO EM TEMPO REAL) */}
        <section aria-labelledby="sec-participantes" className="bento-card space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <h2 id="sec-participantes" className="text-base font-bold text-slate-900 dark:text-white">
                Quem Pode Participar (Diagnóstico de Elegibilidade)
              </h2>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              diagnosis.pending.length === 0 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            }`}>
              {diagnosis.pending.length === 0 ? 'Alta compatibilidade' : 'Atenção aos requisitos'}
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <p><strong>Público-Alvo:</strong> {grant.eligiblePublic || 'Informação não confirmada'}</p>
            <p><strong>Formatos aceitos:</strong> {grant.eligibleLegal.map(l => l.toUpperCase()).join(' · ') || 'Informação não confirmada'}</p>
            <p><strong>Perfis artísticos:</strong> {grant.eligibleProfiles.join(', ') || 'Informação não confirmada'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/15 border border-emerald-500/20 space-y-2">
              <h3 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                <CheckCircle2 className="w-4 h-4" />
                Requisitos atendidos pelo seu perfil
              </h3>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                {diagnosis.fulfilled.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-950/15 border border-amber-500/20 space-y-2">
              <h3 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                <AlertTriangle className="w-4 h-4" />
                Pontos de atenção e restrições formais
              </h3>
              {diagnosis.pending.length > 0 ? (
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  {diagnosis.pending.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600 dark:text-slate-300">
                  Nenhuma pendência estrutural detectada no perfil ativo.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 3. REQUISITOS E RESTRIÇÕES */}
        <section aria-labelledby="sec-restricoes" className="bento-card space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-white/5">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <h2 id="sec-restricoes" className="text-base font-bold text-slate-900 dark:text-white">
              Requisitos e Restrições Formais
            </h2>
          </div>
          {grant.restrictions && grant.restrictions.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {grant.restrictions.map((res, i) => (
                <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs sm:text-sm text-slate-500 italic">
              Informação não confirmada no cadastro do edital.
            </p>
          )}
        </section>

        {/* 4. DOCUMENTOS EXIGIDOS INTEGRADOS AO COFRE */}
        <section aria-labelledby="sec-documentos" className="bento-card space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <h2 id="sec-documentos" className="text-base font-bold text-slate-900 dark:text-white">
                Documentos Exigidos Integrados ao Cofre
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('vault')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FolderLock className="w-3.5 h-3.5" />
              <span>Abrir Cofre</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cruzamento automático em tempo real entre as exigências deste edital e as certidões salvas no seu Cofre de Documentos:
          </p>

          <div className="space-y-3">
            {grant.requiredDocuments && grant.requiredDocuments.length > 0 ? (
              grant.requiredDocuments.map(req => {
                const vaultDoc = findDocForRequirement(req, vaultDocuments);
                const docStatus = vaultDoc ? calculateDocumentStatus(vaultDoc.expiryDate) : null;

                return (
                  <div 
                    key={req.id} 
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {req.name}
                        </h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          req.mandatory 
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {req.mandatory ? 'Obrigatório' : 'Facultativo'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                        {req.description}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Aplica-se a: {req.appliesToProfiles.join(', ')}
                      </p>
                    </div>

                    {/* Status de Integração com o Cofre */}
                    <div className="shrink-0 flex sm:flex-col items-end gap-1.5">
                      {vaultDoc ? (
                        <>
                          {docStatus === 'em_dia' && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Válido no Cofre
                            </span>
                          )}
                          {docStatus === 'vence_breve' && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Vence em breve
                            </span>
                          )}
                          {docStatus === 'vencido' && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Vencido no Cofre
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {vaultDoc.fileName || 'Arquivo digitalizado'}
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200/70 text-slate-700 dark:bg-white/10 dark:text-slate-300 border border-slate-300 dark:border-white/10">
                            Pendente no Cofre
                          </span>
                          <button
                            onClick={() => setCurrentView('vault')}
                            className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline"
                          >
                            + Adicionar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs sm:text-sm text-slate-500 italic">
                Informação não confirmada no cadastro do edital.
              </p>
            )}
          </div>
        </section>

        {/* 5. CRITÉRIOS DE AVALIAÇÃO E PESOS */}
        <section aria-labelledby="sec-criterios" className="bento-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center justify-center shrink-0">
                5
              </span>
              <h2 id="sec-criterios" className="text-base font-bold text-slate-900 dark:text-white">
                Critérios de Avaliação e Pesos da Banca
              </h2>
            </div>
            <InfoTooltip
              title="Banca Examinadora"
              content="Os pesos percentuais demonstram a proporção de cada quesito na nota técnica final emitida pelos pareceristas."
              position="left"
            />
          </div>

          {grant.evaluationCriteria && grant.evaluationCriteria.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {grant.evaluationCriteria.map((crit, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                    <span>{crit.title}</span>
                    <span className="font-mono text-teal-600 dark:text-teal-400 text-sm">{crit.weight}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div style={{ width: `${crit.weight}%` }} className="h-full bg-teal-600 dark:bg-teal-500 rounded-full" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    {crit.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-500 italic">
              Informação não confirmada no regulamento cadastrado.
            </p>
          )}
        </section>

        {/* 6. VALORES E CRONOGRAMA CONFIRMADOS */}
        <section aria-labelledby="sec-valores" className="bento-card space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-white/5">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center justify-center shrink-0">
              6
            </span>
            <h2 id="sec-valores" className="text-base font-bold text-slate-900 dark:text-white">
              Valores e Cronograma Confirmados
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 space-y-1">
              <span className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold block">
                Valor por Proposta
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                R$ {grant.grantValue.toLocaleString('pt-BR')},00
              </p>
              <p className="text-xs text-slate-500">{grant.totalBudgetFormatted || 'Informação não confirmada'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 space-y-1">
              <span className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold block">
                Prazo de Inscrição
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono">
                {new Date(grant.deadlineDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <p className={`text-xs font-semibold font-mono ${isClosed ? 'text-red-600 dark:text-red-400' : 'text-amber-500'}`}>
                {label}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 space-y-1">
              <span className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold block">
                Ciclo e Publicação
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Publicado em: {new Date(grant.publishedDate).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-xs text-slate-500">
                Ciclo: {grant.cyclePeriod || 'Informação não confirmada'}
              </p>
            </div>
          </div>
        </section>

        {/* 7. FONTE OFICIAL, ÚLTIMA VERIFICAÇÃO E RETIFICAÇÕES */}
        <section aria-labelledby="sec-fonte" className="bento-card space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-white/5">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center justify-center shrink-0">
              7
            </span>
            <h2 id="sec-fonte" className="text-base font-bold text-slate-900 dark:text-white">
              Fonte Oficial, Última Verificação e Retificações
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 space-y-3 text-xs leading-relaxed">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Órgão Emissor: {grant.issuingBody || 'Informação não confirmada'}
                </p>
                <p className="text-slate-500">
                  Documento Oficial: <strong>{grant.officialDocument || 'Informação não confirmada'}</strong>
                </p>
              </div>
              {grant.lastVerifiedAt && (
                <div className="text-slate-400 font-mono text-[11px]">
                  Última checagem: {new Date(grant.lastVerifiedAt).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>

            {grant.rectifications && grant.rectifications.length > 0 ? (
              <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 space-y-1">
                <span className="text-[11px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                  Retificações e Comunicados Registrados:
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                  {grant.rectifications.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-slate-400 italic">
                Nenhuma retificação registrada até a última verificação.
              </p>
            )}

            <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 text-[11px] text-slate-500">
              {grant.isFictitiousNotice}
            </div>
          </div>
        </section>

        {/* 8. PRÓXIMOS PASSOS DE PREPARAÇÃO (AÇÕES OPERACIONAIS) */}
        <section aria-labelledby="sec-proximos-passos" className="bento-card space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-white/5">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              8
            </span>
            <h2 id="sec-proximos-passos" className="text-base font-bold text-slate-900 dark:text-white">
              Próximos Passos de Preparação Operacional
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ação A: Checklist */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <ListTodo className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  Checklist da Inscrição
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Acompanhe cada etapa com cálculo de progresso automático de documentos.
                </p>
              </div>
              <button
                onClick={() => {
                  startPreparationForGrant(grant.id);
                  setCurrentView('checklist');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full btn-primary text-xs py-2 text-center"
              >
                {isPreparingThis ? 'Continuar Checklist' : 'Iniciar Checklist'}
              </button>
            </div>

            {/* Ação B: Cofre */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <FolderLock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  Cofre de Documentos
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Atualize certidões vencidas e comprovantes para validar as exigências.
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentView('vault');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full btn-secondary text-xs py-2 text-center"
              >
                Gerenciar Cofre
              </button>
            </div>

            {/* Ação C: Rascunho da Proposta */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <PenTool className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  Rascunho de Proposta
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Estruture justificativa, plano de trabalho e planilha para copiar no portal oficial.
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentView('formulario_projeto');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full btn-secondary text-xs py-2 text-center"
              >
                Redigir Rascunho
              </button>
            </div>

            {/* Ação D: Portal Oficial */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  Portal Oficial de Envio
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Acesse o sistema governamental ou regulamento publicado pelo emissor.
                </p>
              </div>
              {grant.officialUrl ? (
                <a
                  href={grant.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-secondary text-xs py-2 text-center inline-flex items-center justify-center gap-1.5"
                >
                  <span>Acessar Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={() => setShowOfficialUrlInfo(true)}
                  className="w-full btn-secondary text-xs py-2 text-center"
                >
                  Consultar Fonte
                </button>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* Modal quando o usuário clica em edital oficial didático */}
      {showOfficialUrlInfo && (
        <OfficialUrlInfoModal onClose={() => setShowOfficialUrlInfo(false)} />
      )}

    </div>
  );
};

const OfficialUrlInfoModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const modalRef = useModalAccessibility(true, onClose, '#understand-official-btn');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="official-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 dark:border-white/10 relative space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg focus-ring min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
          aria-label="Fechar aviso de edital oficial"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-1">
          <HelpCircle className="w-5 h-5" aria-hidden="true" />
        </div>
        <h3 id="official-modal-title" className="text-lg font-bold">Endereço Oficial Não Aplicável</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Este edital é um <strong>registro didático modelado para a simulação acadêmica</strong>. Não inventamos links para sites governamentais fictícios. Todas as regras, exigências e cálculos de pontuação estão disponíveis nesta própria interface para testes de ponta a ponta.
        </p>
        <div className="flex justify-end pt-2">
          <button
            id="understand-official-btn"
            onClick={onClose}
            className="btn-primary px-4 py-2 text-xs focus-ring"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
