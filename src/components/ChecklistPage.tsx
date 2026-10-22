import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  FileCheck, 
  Send, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Edit3,
  AlertCircle,
  CalendarPlus,
  ClipboardCheck,
  Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { DocUpdateModal } from './DocUpdateModal';
import { VaultDocument, ArtistProfileType } from '../types';
import { Tooltip, InfoTooltip } from './Tooltip';
import { downloadCalendarReminder } from '../utils/calendar';
import { 
  findDocForRequirement, 
  calculateDocumentStatus, 
  isExpiringBeforeGrantDeadline, 
  formatDayMonth 
} from '../data/defaultVault';

export const ChecklistPage: React.FC = () => {
  const { 
    activeApplication, 
    grants, 
    toggleChecklistStep, 
    submitApplicationForReview,
    vaultDocuments,
    setCurrentView,
    setSelectedGrantId,
    user,
    selectedProfile
  } = useApp();

  const [documentToUpdate, setDocumentToUpdate] = useState<VaultDocument | null>(null);

  if (!activeApplication) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Nenhuma inscrição em preparação no momento
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Escolha um edital no catálogo para iniciar o checklist passo a passo.
        </p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="btn-primary px-5 py-2.5 text-xs min-h-[44px]"
        >
          Explorar catálogo de editais
        </button>
      </div>
    );
  }

  const currentGrant = grants.find(g => g.id === activeApplication.grantId) || grants[0];
  const { isClosed, daysRemaining, label } = getGrantDeadlineInfo(currentGrant.deadlineDate);

  const getProfileLabel = (profile: ArtistProfileType) => {
    switch (profile) {
      case 'artista_solo': return 'Artista solo';
      case 'banda_grupo': return 'Banda ou grupo';
      case 'coletivo_cultural': return 'Coletivo cultural';
      case 'produtor_cultural': return 'Produtor cultural';
      default: return profile;
    }
  };

  // Exigências obrigatórias deste edital para o perfil real do artista
  const mandatoryDocsForProfile = currentGrant.requiredDocuments.filter(
    doc => doc.mandatory && doc.appliesToProfiles.includes(activeApplication.profileType)
  );

  const isDocStepComplete = activeApplication.steps.find(s => s.id === 'documentos')?.isCompleted;

  // Próxima ação recomendada dinâmica baseada nos dados reais
  const getNextRecommendedAction = () => {
    // 1. Procura exigência obrigatória com documento vinculado vencido
    const expiredReqItem = mandatoryDocsForProfile.find(req => {
      const doc = findDocForRequirement(req, vaultDocuments);
      return doc && calculateDocumentStatus(doc.expiryDate) === 'vencido';
    });

    if (expiredReqItem) {
      const linkedDoc = findDocForRequirement(expiredReqItem, vaultDocuments);
      return {
        title: `Atualizar documento vencido: ${linkedDoc?.name || expiredReqItem.name}`,
        description: `O documento vinculado "${linkedDoc?.name || expiredReqItem.name}" está expirado no cofre. Ao renová-lo com uma data futura, a etapa documental será concluída automaticamente.`,
        actionLabel: 'Renovar documento agora',
        action: () => linkedDoc && setDocumentToUpdate(linkedDoc),
        isUrgent: true,
      };
    }

    // 2. Procura exigência obrigatória sem documento vinculado
    const missingReqItem = mandatoryDocsForProfile.find(req => !findDocForRequirement(req, vaultDocuments));
    if (missingReqItem) {
      return {
        title: `Vincular documento obrigatório: ${missingReqItem.name}`,
        description: `O edital exige a apresentação de "${missingReqItem.name}". Adicione ou vincule um documento válido no seu cofre.`,
        actionLabel: 'Ir ao cofre de documentos',
        action: () => setCurrentView('vault'),
        isUrgent: true,
      };
    }

    // 3. Demais etapas pendentes do checklist
    const firstPending = activeApplication.steps.find(s => !s.isCompleted);
    if (!firstPending) {
      return {
        title: 'Inscrição 100% pronta para envio',
        description: 'Todas as etapas foram finalizadas com sucesso. Clique no botão abaixo para enviar para a revisão simulada.',
        actionLabel: 'Enviar para revisão simulada',
        action: () => submitApplicationForReview(),
        isUrgent: false,
      };
    }

    if (firstPending.id === 'envio') {
      return {
        title: 'Revisar dossiê final e submeter',
        description: 'Requisitos conferidos, documentos válidos no cofre, portfólio pronto e projeto redigido. Agora basta enviar para a banca simulada.',
        actionLabel: 'Enviar para revisão simulada',
        action: () => submitApplicationForReview(),
        isUrgent: false,
      };
    }

    return {
      title: `Finalizar: ${firstPending.title}`,
      description: firstPending.description,
      actionLabel: 'Completar etapa',
      action: () => toggleChecklistStep(firstPending.id),
      isUrgent: false,
    };
  };

  const nextAction = getNextRecommendedAction();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Cabeçalho da Inscrição */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-200/80 dark:border-white/5 pb-8"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono uppercase">
            <FileCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Inscrição & Checklist Preparatório</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {currentGrant.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Órgão: <strong className="text-slate-800 dark:text-slate-200">{currentGrant.issuingBody}</strong></span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="font-semibold text-[#1C1917] dark:text-[#F5F3EF] tabular-nums">
              R$ {currentGrant.grantValue.toLocaleString('pt-BR')},00
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400 tabular-nums">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {label}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 print:hidden">
          <button
            onClick={() => window.print()}
            className="btn-secondary px-3.5 py-2 text-xs focus-ring min-h-[42px] inline-flex items-center gap-1.5 cursor-pointer"
            title="Imprimir dossiê ou salvar como PDF limpo"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Dossiê</span>
          </button>
          
          <button
            onClick={() => {
              setSelectedGrantId(currentGrant.id);
              setCurrentView('grant_detail');
            }}
            className="btn-secondary px-3.5 py-2 text-xs focus-ring min-h-[42px] cursor-pointer"
          >
            Ver regulamento
          </button>
          
          <button
            onClick={() => downloadCalendarReminder(`Prazo do edital: ${currentGrant.title}`, currentGrant.deadlineDate, `Prazo de inscrição informado para ${currentGrant.title}. Confira o edital oficial antes de enviar.`)}
            className="btn-secondary px-3.5 py-2 text-xs focus-ring min-h-[42px] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarPlus className="w-3.5 h-3.5" /> Agenda
          </button>
          <button
            onClick={submitApplicationForReview}
            disabled={activeApplication.status === 'revisao_solicitada'}
            className="btn-primary px-4 py-2 text-xs focus-ring min-h-[42px] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{activeApplication.status === 'revisao_solicitada' ? 'Em revisão simulada' : 'Enviar para revisão'}</span>
          </button>
        </div>
      </motion.div>

      {/* 4 Fases do Processo Oficial do Edital */}
      <nav aria-label="Fases do Edital" className="p-4 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-2xs">
        <ol className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs" aria-label="Etapas do edital">
          <li className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FAF7F2] dark:bg-white/5 border-l-2 border-[#991B1B]" aria-current="step">
            <span className="w-5 h-5 rounded-full bg-[#991B1B] text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
            <div>
              <p className="font-semibold text-[#1C1917] dark:text-[#F5F3EF]">Inscrições Abertas</p>
              <p className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">Fase atual de submissão</p>
            </div>
          </li>
          <li className="flex items-center gap-2.5 p-2 rounded-lg opacity-80">
            <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center font-medium text-[10px] shrink-0">2</span>
            <div>
              <p className="font-medium text-[#1C1917] dark:text-[#F5F3EF]">Habilitação Documental</p>
              <p className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">Conferência das CNDs</p>
            </div>
          </li>
          <li className="flex items-center gap-2.5 p-2 rounded-lg opacity-80">
            <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center font-medium text-[10px] shrink-0">3</span>
            <div>
              <p className="font-medium text-[#1C1917] dark:text-[#F5F3EF]">Análise de Mérito</p>
              <p className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">Avaliação da comissão</p>
            </div>
          </li>
          <li className="flex items-center gap-2.5 p-2 rounded-lg opacity-80">
            <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center font-medium text-[10px] shrink-0">4</span>
            <div>
              <p className="font-medium text-[#1C1917] dark:text-[#F5F3EF]">Resultado & Homologação</p>
              <p className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">Publicação em D.O.</p>
            </div>
          </li>
        </ol>
      </nav>

      {/* Cartão Bento de Progresso & Próxima Ação */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bento-card space-y-6"
      >
        
        {/* Barra de Progresso Animada com Framer Motion */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Progresso da Inscrição
                </span>
                <InfoTooltip 
                  title="Cálculo do Progresso" 
                  content="Este percentual acompanha 5 tarefas de preparação, com peso de 20% cada. A etapa documental é calculada automaticamente a partir dos documentos obrigatórios vinculados no seu Cofre; as fases do processo público são apenas uma referência e não entram neste percentual."
                  position="top"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                5 tarefas de preparação ponderadas em 20% cada
              </p>
            </div>
            <div className="text-right">
              <motion.span 
                key={activeApplication.progressPercentage}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums inline-block text-slate-900 dark:text-white"
              >
                {activeApplication.progressPercentage}%
              </motion.span>
              <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                {activeApplication.steps.filter(s => s.isCompleted).length} de 5 concluídas
              </p>
            </div>
          </div>

          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200/50 dark:border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${activeApplication.progressPercentage}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 16 }}
              className="h-full rounded-full bg-teal-600 dark:bg-teal-500 shadow-sm"
            />
          </div>
        </div>

        {/* Bloco de Próxima Ação Recomendada */}
        <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
          nextAction.isUrgent 
            ? 'border-red-500/25 bg-red-50/60 dark:bg-red-950/20' 
            : 'border-teal-500/25 bg-teal-50/50 dark:bg-teal-950/20'
        }`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                nextAction.isUrgent 
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' 
                  : 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20'
              }`}>
                {nextAction.isUrgent ? 'Ação Crítica' : 'Próxima Ação'}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {nextAction.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {nextAction.description}
            </p>
          </div>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextAction.action}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all focus-ring shadow-xs whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto cursor-pointer min-h-[42px] ${
              nextAction.isUrgent 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'btn-primary'
            }`}
          >
            <span>{nextAction.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </motion.button>
        </div>

      </motion.div>

      {/* Fluxo educativo comum em editais PNAB: cada regulamento pode variar */}
      <section className="bento-card space-y-4" aria-labelledby="pnab-flow-title">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-300"><ClipboardCheck className="w-5 h-5" /></div>
          <div><h2 id="pnab-flow-title" className="text-lg font-bold text-slate-900 dark:text-white">Fluxo de referência para editais culturais</h2><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Modelo educativo inspirado em processos comuns de fomento. A ordem e os documentos variam conforme o edital.</p></div>
        </div>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[{n:'0',title:'Cadastro',desc:'Criar ou atualizar cadastro no Mapa Cultural ou na plataforma indicada pelo órgão.'},{n:'1',title:'Inscrição',desc:'Ler o edital, preparar a proposta e enviar dentro do prazo oficial.'},{n:'2',title:'Seleção',desc:'Acompanhar análise, resultado preliminar, recursos e resultado final.'},{n:'3',title:'Habilitação',desc:'Se selecionado, apresentar os documentos exigidos nesta fase.'},{n:'4',title:'Termo',desc:'Assinar o instrumento e cumprir as condições para recebimento do recurso.'},{n:'5',title:'Execução e relatório',desc:'Executar o projeto e entregar relatório ou prestação de contas conforme as regras.'}].map(phase => <li key={phase.n} className="rounded-xl border border-slate-200 dark:border-white/10 p-3"><div className="flex items-center gap-2 mb-1"><span className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 inline-flex items-center justify-center text-xs font-bold">{phase.n}</span><h3 className="text-sm font-bold text-slate-900 dark:text-white">{phase.title}</h3></div><p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">{phase.desc}</p></li>)}
        </ol>
        <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">Atenção: documentos de habilitação podem ser exigidos somente após a seleção, mas alguns editais pedem documentos já na inscrição. Siga sempre a seção de etapas e a lista documental do edital específico.</p>
      </section>

      {/* Lista das 5 Etapas do Checklist */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Tarefas de preparação (20% cada)
        </h2>

        <div className="space-y-3.5">
          {activeApplication.steps.map((step, index) => {
            const isDocStep = step.id === 'documentos';
            const isEnvioStep = step.id === 'envio';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 24, 
                  delay: index * 0.04 
                }}
                whileHover={{ y: -2 }}
                className={`p-6 rounded-2xl sm:rounded-3xl border transition-all ${
                  step.isCompleted
                    ? 'border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/15'
                    : 'border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleChecklistStep(step.id)}
                      disabled={isDocStep}
                      className={`mt-0.5 shrink-0 rounded-full transition-colors focus-ring min-w-[36px] min-h-[36px] flex items-center justify-center ${
                        isDocStep ? 'cursor-default' : 'cursor-pointer hover:opacity-80'
                      }`}
                      aria-label={step.isCompleted ? `Marcar ${step.title} como pendente` : `Marcar ${step.title} como concluída`}
                    >
                      {step.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" aria-hidden="true" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" aria-hidden="true" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-base font-bold leading-tight ${
                          step.isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {step.title}
                        </h3>
                        <span className="text-xs font-mono font-semibold text-slate-400">
                          (20%)
                        </span>
                        {isDocStep && (
                          <Tooltip
                            title="Validação Automática em Tempo Real"
                            content="Esta etapa não pode ser marcada manualmente. Ela é validada automaticamente quando todos os documentos obrigatórios exigidos pelo edital estiverem em dia no seu Cofre de Documentos."
                            position="top"
                          >
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 cursor-help inline-flex items-center gap-1">
                              Avaliação automática por validade do cofre
                            </span>
                          </Tooltip>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Detalhes específicos da Etapa 2 (Documental) */}
                      {isDocStep && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Documentos Obrigatórios Exigidos para {getProfileLabel(activeApplication.profileType)}:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            {mandatoryDocsForProfile.map(req => {
                              const match = findDocForRequirement(req, vaultDocuments);
                              const docStatus = match ? calculateDocumentStatus(match.expiryDate) : null;
                              const isDocExpired = docStatus === 'vencido';
                              const isExpiringBeforeDeadline = match && isExpiringBeforeGrantDeadline(match.expiryDate, currentGrant.deadlineDate);

                              return (
                                <div 
                                  key={req.id}
                                  className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between gap-2.5 ${
                                    !match 
                                      ? 'border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-slate-800/40 text-slate-500'
                                      : isDocExpired 
                                        ? 'border-red-500/30 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-300' 
                                        : 'border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-800/40 text-slate-900 dark:text-white'
                                  }`}
                                >
                                  <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{req.name}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      {match 
                                        ? `Vinculado: ${match.name}`
                                        : 'Nenhum documento vinculado com este requisito'}
                                    </p>

                                    {isExpiringBeforeDeadline && !isDocExpired && (
                                      <p className="text-xs font-semibold text-amber-500 mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                        <span>
                                          Vence antes do edital ({formatDayMonth(match.expiryDate)}). Renove antes de enviar.
                                        </span>
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                                    <span className="text-xs font-semibold">
                                      {!match ? (
                                        <span className="text-amber-500">Ausente no cofre</span>
                                      ) : isDocExpired ? (
                                        <span className="text-red-600 dark:text-red-400 font-bold">Vencido no cofre</span>
                                      ) : (
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Em dia</span>
                                      )}
                                    </span>

                                    {match && isDocExpired && (
                                      <button
                                        onClick={() => setDocumentToUpdate(match)}
                                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 shrink-0 min-h-[34px] cursor-pointer"
                                      >
                                        Renovar
                                      </button>
                                    )}
                                    {match && !isDocExpired && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                                    )}
                                    {!match && (
                                      <button
                                        onClick={() => setCurrentView('vault')}
                                        className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                                      >
                                        Vincular no cofre
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ação rápida da etapa */}
                  <div className="shrink-0 flex items-center gap-2">
                    {step.id === 'projeto' && (
                      <button
                        onClick={() => setCurrentView('formulario_projeto')}
                        className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-colors min-h-[42px] flex items-center gap-1.5 cursor-pointer focus-ring border border-teal-500/20"
                        title="Abrir formulário de projeto cultural em etapas"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Formulário de Projeto</span>
                      </button>
                    )}
                    {!isDocStep && !isEnvioStep && (
                      <button
                        onClick={() => toggleChecklistStep(step.id)}
                        className="btn-secondary px-3.5 py-2 text-xs min-h-[42px] focus-ring"
                      >
                        {step.isCompleted ? 'Desmarcar' : 'Concluir'}
                      </button>
                    )}
                    {isDocStep && (
                      <button
                        onClick={() => setCurrentView('vault')}
                        className="btn-secondary px-3.5 py-2 text-xs min-h-[42px] focus-ring"
                      >
                        Ir ao cofre
                      </button>
                    )}
                    {isEnvioStep && !step.isCompleted && (
                      <button
                        onClick={submitApplicationForReview}
                        className="btn-primary px-4 py-2 text-xs min-h-[42px] focus-ring"
                      >
                        Enviar
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Esclarecimento de Envio Simulado */}
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="font-semibold text-slate-900 dark:text-white">
          Aviso sobre o envio para revisão simulada
        </p>
        <p className="leading-relaxed">
          O botão "Enviar para revisão" executa uma simulação interna da plataforma para validação acadêmica do dossiê. Não substitui o envio oficial no sistema eletrônico do órgão público licitante.
        </p>
      </div>

      {/* Modal de Atualização Rápida de Documento */}
      {documentToUpdate && (
        <DocUpdateModal
          document={documentToUpdate}
          onClose={() => setDocumentToUpdate(null)}
        />
      )}

    </div>
  );
};
