import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles, 
  Send,
  Building,
  MapPin,
  Users,
  Shield,
  HelpCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { ArtistProfileType } from '../types';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { Tooltip, InfoTooltip } from './Tooltip';

export const GrantDetailPage: React.FC = () => {
  const { 
    selectedGrantId, 
    grants, 
    user, 
    selectedProfile, 
    startPreparationForGrant, 
    setCurrentView,
    activeApplication
  } = useApp();

  const [showOfficialUrlInfo, setShowOfficialUrlInfo] = useState(false);

  const grant = grants.find(g => g.id === selectedGrantId) || grants[0];
  const { isClosed, daysRemaining, label } = getGrantDeadlineInfo(grant.deadlineDate);

  const activeProfile = user?.profileType || selectedProfile;
  const isEligibleProfile = grant.eligibleProfiles.includes(activeProfile);
  const isPreparingThis = activeApplication?.grantId === grant.id;

  // Análise de Elegibilidade
  const getEligibilityDiagnosis = () => {
    const fulfilled: string[] = [];
    const pending: string[] = [];

    if (isEligibleProfile) {
      fulfilled.push(`Perfil artístico compatível (${activeProfile === 'banda_grupo' ? 'Banda ou grupo' : activeProfile}).`);
    } else {
      pending.push(`Este edital restringe-se aos perfis: ${grant.eligibleProfiles.join(', ')}.`);
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
      
      {/* Botão Voltar */}
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
        
        {/* Metadados e Tipo de Notícia */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#78716C] dark:text-[#A8A29E]">
          {/* Badge do Tipo de Edital */}
          {grant.noticeType === 'real' && (
            <Tooltip
              title="Edital Oficial Verificado"
              content="Edital em vigor publicado em diário oficial ou portal de fomento, com link de comprovação para o órgão público emissor."
              position="bottom"
            >
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1E3A2F]/15 text-[#1E3A2F] dark:text-emerald-400 border border-[#1E3A2F]/25 flex items-center gap-1 cursor-help">
                <CheckCircle2 className="w-3 h-3" />
                <span>Oficial Verificado</span>
              </span>
            </Tooltip>
          )}
          {grant.noticeType === 'previsao_anual' && (
            <Tooltip
              title="Previsão Histórica Anual"
              content="Previsão baseada nos ciclos históricos de anos anteriores. Serve para orientar o cronograma de preparação antes da publicação oficial."
              position="bottom"
            >
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 cursor-help">
                <Clock className="w-3 h-3" />
                <span>Previsão Anual</span>
              </span>
            </Tooltip>
          )}
          {(!grant.noticeType || grant.noticeType === 'simulado') && (
            <Tooltip
              title="Modelo Educativo Didático"
              content="Edital didático simulado para aprendizado de fluxo de inscrição, preparação de dossiê e checklist, sem inscrição real."
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
          <span className={`font-mono font-semibold ${isClosed ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {label}
          </span>
        </div>

        {/* Título do Edital com Tipografia Editorial */}
        <div className="space-y-2">
          <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F3EF] leading-tight">
            {grant.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#D6D3D1]">
            Publicado por: <strong className="text-[#1C1917] dark:text-white">{grant.issuingBody}</strong>
            {grant.officialSource && (
              <span className="text-[#78716C] dark:text-[#A8A29E] ml-1.5 font-sans">
                (Fonte: {grant.officialSource})
              </span>
            )}
          </p>
        </div>

        {/* Tira de Valores e Prazos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-white/5 text-xs">
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-xs font-semibold block mb-0.5">
              Valor por Projeto
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              R$ {grant.grantValue.toLocaleString('pt-BR')},00
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{grant.totalBudgetFormatted}</p>
          </div>

          <div>
            <span className="text-slate-400 uppercase tracking-wider text-xs font-semibold block mb-0.5">
              Encerramento das Inscrições
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono">
              {new Date(grant.deadlineDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <p className={`text-xs font-semibold font-mono ${isClosed ? 'text-red-600 dark:text-red-400' : 'text-amber-500'}`}>
              {label}
            </p>
          </div>

          <div>
            <span className="text-slate-400 uppercase tracking-wider text-xs font-semibold block mb-0.5">
              Enquadramento Legal
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {grant.eligibleLegal.map(l => l.toUpperCase()).join(' · ')}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {grant.eligibleProfiles.length} perfis aceitos
            </p>
          </div>
        </div>

        {/* Barra de Ações */}
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
            <Sparkles className="w-4 h-4" />
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

        {/* Transparência e Fonte Oficial */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Fonte Oficial Mapeada: {grant.officialSource || grant.issuingBody}</span>
          </div>
          <p>
            {grant.isFictitiousNotice} As exigências documentais e critérios de pontuação seguem as diretrizes regulamentares deste órgão para orientar a preparação do artista.
          </p>
        </div>

      </motion.div>

      {/* Diagnóstico de Elegibilidade */}
      <div className="bento-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Diagnóstico de Elegibilidade
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Análise comparativa para o perfil de <strong>{activeProfile === 'banda_grupo' ? 'Banda ou grupo' : activeProfile}</strong>
            </p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
            diagnosis.pending.length === 0 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }`}>
            {diagnosis.pending.length === 0 ? 'Alta compatibilidade' : 'Atenção aos requisitos'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          {/* Requisitos Atendidos */}
          <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/15 border border-emerald-500/20 space-y-2">
            <h3 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-xs">
              <CheckCircle2 className="w-4 h-4" />
              Requisitos que parecem atendidos
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

          {/* Pendências ou Restrições a Conferir */}
          <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-950/15 border border-amber-500/20 space-y-2">
            <h3 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-xs">
              <AlertTriangle className="w-4 h-4" />
              Pontos de atenção / Pendências conhecidas
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
                Nenhuma pendência estrutural identificada. Recomendamos conferir o regulamento integral antes da submissão.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Detalhado: Objetivo, Restrições, Documentos e Critérios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Objetivo, Descrição e Restrições (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bento-card space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Objetivo e Justificativa
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {grant.objective}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-3 border-t border-slate-100 dark:border-white/5">
              {grant.description}
            </p>
          </div>

          <div className="bento-card space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Público Elegível & Restrições Formais
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Público-Alvo:</strong> {grant.eligiblePublic}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Restrições Regulamentares
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {grant.restrictions.map((res, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Documentos Exigidos */}
          <div className="bento-card space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Documentos Necessários Especificados no Edital
            </h2>
            <div className="space-y-3">
              {grant.requiredDocuments.map(doc => (
                <div key={doc.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {doc.name}
                    </h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      doc.mandatory 
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {doc.mandatory ? 'Obrigatório' : 'Opcional'}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    {doc.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Aplica-se a: {doc.appliesToProfiles.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Critérios de Avaliação (1/3) */}
        <div className="space-y-6">
          <div className="bento-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Critérios de Avaliação e Pesos
              </h2>
              <InfoTooltip
                title="Banca Examinadora"
                content="Os pesos indicam o impacto percentual de cada quesito na nota técnica final emitida pela comissão julgadora do edital."
                position="left"
              />
            </div>
            <div className="space-y-4">
              {grant.evaluationCriteria.map((crit, i) => (
                <div key={i} className="text-xs space-y-1.5 pb-3 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>{crit.title}</span>
                    <span className="font-mono text-teal-600 dark:text-teal-400">{crit.weight}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div style={{ width: `${crit.weight}%` }} className="h-full bg-teal-600 dark:bg-teal-500 rounded-full" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pt-0.5">
                    {crit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Modal Educado quando o usuário clica em "Ver edital oficial" */}
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
          Este edital é um <strong>registro didático modelado para a feira universitária</strong>. Não inventamos links para sites governamentais fictícios. Todas as regras, exigências e cálculos de pontuação estão disponíveis nesta própria interface para testes de ponta a ponta.
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
