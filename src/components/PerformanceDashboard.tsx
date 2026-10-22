import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  FileText, 
  Calendar, 
  Award, 
  Sparkles, 
  ChevronRight, 
  ShieldAlert, 
  ArrowRight,
  ShieldCheck,
  FolderLock,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { DocUpdateModal } from './DocUpdateModal';
import { VaultDocument } from '../types';
import { calculateDocumentStatus, getCivilDaysRemaining } from '../data/defaultVault';

export const PerformanceDashboard: React.FC = () => {
  const { 
    user, 
    selectedProfile, 
    vaultDocuments, 
    activeApplication, 
    historicalSubmissions, 
    grants, 
    startPreparationForGrant,
    setCurrentView,
    setSelectedGrantId,
    resetDemoToInitialState
  } = useApp();

  const [documentToUpdate, setDocumentToUpdate] = useState<VaultDocument | null>(null);

  // Perfil ativo
  const activeProfileType = user?.profileType || selectedProfile;
  const activeArtistName = user?.name || 'Lucas';
  const activeCity = user?.city || 'Indaiatuba';
  const activeArea = user?.artisticArea || 'Música';

  // Cálculos do Cofre em tempo real
  const docsTotal = vaultDocuments.length;
  const docsValid = vaultDocuments.filter(d => calculateDocumentStatus(d.expiryDate) === 'em_dia').length;
  const docsExpiringSoon = vaultDocuments.filter(d => calculateDocumentStatus(d.expiryDate) === 'vence_breve').length;
  const docsExpired = vaultDocuments.filter(d => calculateDocumentStatus(d.expiryDate) === 'vencido').length;

  const vaultHealthPercent = docsTotal > 0 ? Math.round((docsValid / docsTotal) * 100) : 100;

  // Cálculos de Inscrições
  const totalSubmissions = historicalSubmissions.length + (activeApplication?.status === 'revisao_solicitada' ? 1 : 0);
  const approvedCount = historicalSubmissions.filter(s => s.status === 'aprovado').length;
  const successRate = historicalSubmissions.length > 0 
    ? Math.round((approvedCount / historicalSubmissions.length) * 100) 
    : 0;

  // Editais recomendados com base no perfil ativo
  const recommendedOpportunities = grants
    .filter(grant => {
      const { isClosed } = getGrantDeadlineInfo(grant.deadlineDate);
      if (isClosed) return false;
      return grant.eligibleProfiles.includes(activeProfileType);
    })
    .map(grant => {
      let score = 70;
      const reasons: string[] = [];

      if (grant.artisticArea === activeArea) {
        score += 20;
        reasons.push(`Alinhado à sua área (${activeArea})`);
      }
      if (grant.eligibleProfiles.includes(activeProfileType)) {
        score += 10;
        reasons.push(`Elegível para ${activeProfileType === 'banda_grupo' ? 'Bandas e Grupos' : activeProfileType}`);
      }
      if (grant.city === activeCity || grant.state === 'SP') {
        score += 10;
        reasons.push('Território estadual ou regional direto');
      }
      if (grant.eligibleLegal.includes('coletivo') || grant.eligibleLegal.includes('pf')) {
        reasons.push('Não exige pessoa jurídica formal');
      }

      return {
        grant,
        matchScore: Math.min(score, 98),
        reasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  // Soma de recursos financeiros mapeados elegíveis
  const totalFinancialMapped = recommendedOpportunities.reduce((acc, curr) => acc + curr.grant.grantValue, 0);

  // Próximos prazos críticos
  const criticalDeadlines = grants
    .map(g => ({ grant: g, ...getGrantDeadlineInfo(g.deadlineDate) }))
    .filter(item => !item.isClosed)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 4);

  // Documento vencido prioritário para correção
  const expiredDoc = vaultDocuments.find(d => calculateDocumentStatus(d.expiryDate) === 'vencido');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Cabeçalho Editorial do Painel do Artista */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E6E0D5] dark:border-white/10 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#991B1B]/10 text-[#991B1B] dark:text-red-400 border border-[#991B1B]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase font-semibold text-[11px]">Área do Artista & Gestão de Editais</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F3EF]">
            Painel de {activeArtistName}
          </h1>
          <p className="text-sm text-[#57534E] dark:text-[#D6D3D1] flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Perfil: <strong className="text-[#1C1917] dark:text-[#F5F3EF]">{activeProfileType === 'banda_grupo' ? 'Banda ou grupo musical' : activeProfileType}</strong></span>
            <span className="text-[#A8A29E]">·</span>
            <span>Sede: <strong className="text-[#1C1917] dark:text-[#F5F3EF]">{activeCity}, SP</strong></span>
            <span className="text-[#A8A29E]">·</span>
            <span>Segmento: <strong className="text-[#1C1917] dark:text-[#F5F3EF]">{activeArea}</strong></span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={resetDemoToInitialState}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#E6E0D5] dark:border-white/10 bg-white dark:bg-[#1A1A1E] text-[#57534E] dark:text-[#D6D3D1] hover:bg-[#FAF7F2] dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Reiniciar a demonstração para os dados iniciais do Lucas (60% e doc vencido)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#78716C]" />
            <span>Resetar Demonstração</span>
          </button>

          <button
            onClick={() => setCurrentView('catalog')}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E6E0D5] dark:border-white/10 bg-white dark:bg-[#1A1A1E] text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#FAF7F2] dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Catálogo de Editais
          </button>
          
          <button
            onClick={() => setCurrentView('checklist')}
            className="btn-editorial-primary px-5 py-2 text-xs focus-visible:ring-2 focus-visible:ring-red-700 cursor-pointer"
          >
            <span>Inscrição Ativa ({activeApplication?.progressPercentage || 60}%)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerta de Ação Crítica no Cofre (Se houver documento vencido) */}
      {expiredDoc && (
        <div className="p-5 sm:p-6 rounded-2xl border border-red-500/20 bg-red-50/70 dark:bg-red-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-[#991B1B] text-white shrink-0 mt-0.5 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-red-900 dark:text-red-300">
                Ação Crítica Requerida: Documento obrigatório expirado no cofre
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#D6D3D1] mt-1">
                O documento <strong className="text-[#1C1917] dark:text-white">{expiredDoc.name}</strong> está vencido e impede a conclusão da etapa "Separar documentos" na sua inscrição ativa.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDocumentToUpdate(expiredDoc)}
            className="btn-editorial-primary px-4 py-2 text-xs whitespace-nowrap focus-visible:ring-2 focus-visible:ring-red-700 cursor-pointer"
          >
            Renovar documento agora
          </button>
        </div>
      )}

      {/* Grid Editorial: 4 Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Inscrições */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-2xs">
          <div className="flex items-center justify-between text-[#78716C] dark:text-[#A8A29E] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Inscrições Realizadas</span>
            <div className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-white/5 text-[#991B1B] dark:text-red-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-[#1C1917] dark:text-white font-mono tabular-nums tracking-tight">
              {totalSubmissions}
            </span>
            <span className="text-xs text-[#78716C] dark:text-[#A8A29E]">
              ({historicalSubmissions.length} históricas + 1 ativa)
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E6E0D5] dark:border-white/10 text-xs text-[#57534E] dark:text-[#D6D3D1] flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-[#1E3A2F] dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {approvedCount} selecionadas
            </span>
            <span className="text-[#A8A29E]">·</span>
            <span>1 em preparação</span>
          </div>
        </div>

        {/* Card 2: Taxa de Aprovação */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-2xs">
          <div className="flex items-center justify-between text-[#78716C] dark:text-[#A8A29E] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Taxa de Aprovação</span>
            <div className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-white/5 text-[#1E3A2F] dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-[#1C1917] dark:text-white font-mono tabular-nums tracking-tight">
              {successRate}%
            </span>
            <span className="text-xs font-semibold text-[#1E3A2F] dark:text-emerald-400 font-mono">
              +12% média estadual
            </span>
          </div>
          <p className="mt-4 pt-3 border-t border-[#E6E0D5] dark:border-white/10 text-xs text-[#78716C] dark:text-[#A8A29E] leading-relaxed">
            Baseado em conformidade de dossiês e pontuação técnica de bancas.
          </p>
        </div>

        {/* Card 3: Recursos Financeiros Mapeados */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-2xs">
          <div className="flex items-center justify-between text-[#78716C] dark:text-[#A8A29E] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Recursos Elegíveis</span>
            <div className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-white/5 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-semibold text-[#78716C]">R$</span>
            <span className="text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-white font-mono tabular-nums tracking-tight">
              {totalFinancialMapped.toLocaleString('pt-BR')},00
            </span>
          </div>
          <p className="mt-4 pt-3 border-t border-[#E6E0D5] dark:border-white/10 text-xs text-[#78716C] dark:text-[#A8A29E] leading-relaxed">
            Soma de <strong className="text-[#1C1917] dark:text-white">{recommendedOpportunities.length} editais abertos</strong> compatíveis com seu perfil.
          </p>
        </div>

        {/* Card 4: Conformidade do Cofre de Documentos */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-2xs">
          <div className="flex items-center justify-between text-[#78716C] dark:text-[#A8A29E] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Conformidade do Cofre</span>
            <div className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-white/5 text-[#991B1B] dark:text-red-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-[#1C1917] dark:text-white font-mono tabular-nums tracking-tight">
              {vaultHealthPercent}%
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              docsExpired === 0 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
            }`}>
              {docsExpired === 0 ? 'Regularizado' : `${docsExpired} vencido`}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E6E0D5] dark:border-white/10 flex items-center justify-between text-xs text-[#78716C] dark:text-[#A8A29E]">
            <span className="text-[#1E3A2F] dark:text-emerald-400 font-medium">{docsValid} em dia</span>
            <span>·</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">{docsExpiringSoon} alerta</span>
            <span>·</span>
            <span className="text-red-600 dark:text-red-400 font-medium">{docsExpired} vencido</span>
          </div>
        </div>

      </div>

      {/* Grid Principal: Oportunidades Recomendadas + Cofre e Prazos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Oportunidades Recomendadas (2/3 da largura) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#1C1917] dark:text-white tracking-tight">
                Oportunidades Recomendadas
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] mt-0.5">
                Classificadas por afinidade técnica com seu perfil artístico ({activeProfileType === 'banda_grupo' ? 'Banda ou Grupo' : activeProfileType})
              </p>
            </div>
            <button
              onClick={() => setCurrentView('catalog')}
              className="text-xs sm:text-sm font-semibold text-[#991B1B] dark:text-red-400 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Ver catálogo ({grants.length})</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recommendedOpportunities.map(({ grant, matchScore, reasons }) => {
              const { daysRemaining, label } = getGrantDeadlineInfo(grant.deadlineDate);
              const isCurrentApp = activeApplication?.grantId === grant.id;

              return (
                <div 
                  key={grant.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isCurrentApp 
                      ? 'border-[#991B1B]/40 bg-[#991B1B]/5 dark:bg-red-950/20 shadow-2xs' 
                      : 'border-[#E6E0D5] dark:border-white/10 bg-white dark:bg-[#1A1A1E] hover:border-[#CFCECB]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C] dark:text-[#A8A29E]">
                        <span className="font-semibold text-[#1E3A2F] dark:text-emerald-400">{grant.artisticArea}</span>
                        <span aria-hidden="true">·</span>
                        <span>{grant.sphere}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[#1C1917] dark:text-white font-bold">
                          R$ {grant.grantValue.toLocaleString('pt-BR')},00
                        </span>
                      </div>

                      <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1C1917] dark:text-white leading-snug">
                        {grant.title}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#D6D3D1] line-clamp-2 leading-relaxed">
                        {grant.summary}
                      </p>

                      {/* Motivos da afinidade */}
                      <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#78716C] dark:text-[#A8A29E]">
                        <span className="font-semibold text-[#1C1917] dark:text-white">Afinidade técnica:</span>
                        {reasons.slice(0, 3).map((r, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B]" />
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ação e afinidade */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E6E0D5] dark:border-white/10">
                      <div className="text-right">
                        <div className="flex items-center gap-1 font-mono text-sm font-bold text-[#991B1B] dark:text-red-400">
                          <span>{matchScore}%</span>
                          <span className="text-xs text-[#78716C] font-normal">match</span>
                        </div>
                        <div className="text-xs font-mono text-[#78716C] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>{label}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedGrantId(grant.id);
                            setCurrentView('grant_detail');
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-[#E6E0D5] dark:border-white/10 bg-white dark:bg-[#1A1A1E] text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                        >
                          Ver edital
                        </button>
                        <button
                          onClick={() => {
                            if (isCurrentApp) {
                              setCurrentView('checklist');
                            } else {
                              startPreparationForGrant(grant.id);
                            }
                          }}
                          className="btn-editorial-primary px-4 py-1.5 text-xs focus-visible:ring-2 focus-visible:ring-red-700 cursor-pointer"
                        >
                          {isCurrentApp ? 'Abrir checklist' : 'Preparar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Status de Documentos & Prazos Críticos (1/3 da largura) */}
        <div className="space-y-6">
          
          {/* Caixa 1: Resumo do Status de Documentos */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1C1917] dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#991B1B] dark:text-red-400" />
                Status do Cofre
              </h3>
              <button
                onClick={() => setCurrentView('vault')}
                className="text-xs font-semibold text-[#991B1B] dark:text-red-400 hover:underline transition-colors cursor-pointer"
              >
                Gerenciar cofre
              </button>
            </div>

            {/* Barra de distribuição */}
            <div>
              <div className="h-2.5 w-full rounded-full bg-[#FAF7F2] dark:bg-white/10 overflow-hidden flex border border-[#E6E0D5] dark:border-white/10">
                <div 
                  style={{ width: `${(docsValid / (docsTotal || 1)) * 100}%` }}
                  className="bg-[#1E3A2F] dark:bg-emerald-500" 
                  title={`${docsValid} em dia`}
                />
                <div 
                  style={{ width: `${(docsExpiringSoon / (docsTotal || 1)) * 100}%` }}
                  className="bg-amber-400" 
                  title={`${docsExpiringSoon} vencendo em breve`}
                />
                <div 
                  style={{ width: `${(docsExpired / (docsTotal || 1)) * 100}%` }}
                  className="bg-red-500" 
                  title={`${docsExpired} vencidos`}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-[#A8A29E] mt-2.5 font-mono">
                <span className="flex items-center gap-1.5 text-[#1E3A2F] dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-[#1E3A2F] dark:bg-emerald-500" />
                  Em dia ({docsValid})
                </span>
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  &le; 30d ({docsExpiringSoon})
                </span>
                <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Vencidos ({docsExpired})
                </span>
              </div>
            </div>

            {/* Lista dos Documentos com Botão de Ação Direta */}
            <div className="space-y-2 pt-2 border-t border-[#E6E0D5] dark:border-white/10">
              {vaultDocuments.slice(0, 5).map(doc => {
                const docStatus = calculateDocumentStatus(doc.expiryDate);
                const isExp = docStatus === 'vencido';
                const isWarn = docStatus === 'vence_breve';
                const daysRemaining = getCivilDaysRemaining(doc.expiryDate);

                return (
                  <div 
                    key={doc.id}
                    className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/5 flex items-center justify-between gap-3 text-xs border border-[#E6E0D5]/50 dark:border-white/5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#1C1917] dark:text-white truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-[#78716C] font-mono mt-0.5">
                        {doc.expiryDate ? `Validade: ${new Date(doc.expiryDate).toLocaleDateString('pt-BR')}` : 'Sem validade fixa'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isExp && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
                          Vencido
                        </span>
                      )}
                      {isWarn && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          {daysRemaining !== null ? `${daysRemaining}d` : 'Alerta'}
                        </span>
                      )}
                      {!isExp && !isWarn && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          Em dia
                        </span>
                      )}

                      <button
                        onClick={() => setDocumentToUpdate(doc)}
                        className="text-xs font-bold text-[#991B1B] dark:text-red-400 hover:underline ml-1 cursor-pointer"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Caixa 2: Prazos Críticos do Catálogo */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#1C1917] dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Prazos Críticos (Próximos Encerramentos)
            </h3>

            <div className="space-y-3">
              {criticalDeadlines.map(({ grant, daysRemaining, label }) => (
                <div 
                  key={grant.id}
                  onClick={() => {
                    setSelectedGrantId(grant.id);
                    setCurrentView('grant_detail');
                  }}
                  className="p-3.5 rounded-xl border border-[#E6E0D5] dark:border-white/10 hover:border-[#CFCECB] hover:bg-[#FAF7F2] dark:hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#78716C] dark:text-[#A8A29E]">{grant.artisticArea}</span>
                    <span className={`font-mono font-bold text-xs ${
                      daysRemaining <= 10 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {label}
                    </span>
                  </div>
                  <h4 className="font-editorial text-xs font-bold text-[#1C1917] dark:text-white line-clamp-1">
                    {grant.title}
                  </h4>
                  <p className="text-xs text-[#78716C] font-mono mt-1">
                    R$ {grant.grantValue.toLocaleString('pt-BR')},00 · {grant.sphere}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Seção Inferior: Histórico de Inscrições & Pareceres Técnicos */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1A1A1E] border border-[#E6E0D5] dark:border-white/10 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E0D5] dark:border-white/10 pb-4">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#1C1917] dark:text-white tracking-tight">
              Histórico de Inscrições & Pareceres de Bancas
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] mt-0.5">
              Registro das submissões simuladas com notas técnicas de bancas examinadoras e conformidade.
            </p>
          </div>
          <span className="text-xs font-mono text-[#78716C] dark:text-[#A8A29E]">
            {historicalSubmissions.length} registros avaliados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6E0D5] dark:border-white/10 text-[#78716C] dark:text-[#A8A29E] font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Edital / Oportunidade</th>
                <th className="py-3 px-3">Ano</th>
                <th className="py-3 px-3 text-right">Valor Pleiteado</th>
                <th className="py-3 px-3 text-center">Nota Técnica</th>
                <th className="py-3 px-3">Resultado</th>
                <th className="py-3 px-3">Parecer da Comissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E0D5] dark:divide-white/10 text-[#57534E] dark:text-[#D6D3D1]">
              {historicalSubmissions.map(item => (
                <tr key={item.id} className="hover:bg-[#FAF7F2] dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-[#1C1917] dark:text-white max-w-xs truncate">
                    {item.grantTitle}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#78716C]">
                    {item.year}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-right font-medium text-[#1C1917] dark:text-white">
                    R$ {item.value.toLocaleString('pt-BR')},00
                  </td>
                  <td className="py-3.5 px-3 font-mono text-center font-bold text-[#1E3A2F] dark:text-emerald-400">
                    {item.technicalScore.toFixed(1)} / 100
                  </td>
                  <td className="py-3.5 px-3">
                    {item.status === 'aprovado' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        Aprovado
                      </span>
                    )}
                    {item.status === 'suplente' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        Suplente
                      </span>
                    )}
                    {item.status === 'nao_selecionado' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF7F2] dark:bg-white/10 text-[#78716C] dark:text-[#A8A29E] border border-[#E6E0D5] dark:border-white/10">
                        Não selecionado
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-[#78716C] dark:text-[#A8A29E] text-xs max-w-md leading-relaxed">
                    {item.feedback}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Atualização Rápida se acionado a partir do dashboard */}
      {documentToUpdate && (
        <DocUpdateModal
          document={documentToUpdate}
          onClose={() => setDocumentToUpdate(null)}
        />
      )}

    </div>
  );
};
