import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  Clock, 
  ArrowUpDown, 
  Building, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGrantDeadlineInfo } from '../data/mockGrants';
import { ArtisticArea, Sphere, LegalEligibility } from '../types';

export const CatalogPage: React.FC = () => {
  const { 
    grants, 
    searchTerm, 
    setSearchTerm, 
    setSelectedGrantId, 
    setCurrentView,
    startPreparationForGrant,
    activeApplication,
    showDemoGrants,
    setShowDemoGrants
  } = useApp();

  // Estados de Filtros
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedSphere, setSelectedSphere] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedValueRange, setSelectedValueRange] = useState<string>('all');
  const [selectedDeadlineRange, setSelectedDeadlineRange] = useState<string>('all');
  const [selectedLegal, setSelectedLegal] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  
  // Status padrão: "abertos"
  const [selectedStatus, setSelectedStatus] = useState<'abertos' | 'encerrados' | 'todos'>('abertos');
  
  // Ordenação
  const [sortBy, setSortBy] = useState<'prazo' | 'valor' | 'publicacao'>('prazo');

  // Contagem estrita de editais abertos oficiais verificados
  const verifiedOpenCount = useMemo(() => {
    return grants.filter(g => 
      g.verificationStatus === 'verified' && 
      !getGrantDeadlineInfo(g.deadlineDate).isClosed
    ).length;
  }, [grants]);

  // Filtragem combinada em tempo real sobre os dados do estado
  const filteredGrants = useMemo(() => {
    return grants.filter(grant => {
      const deadlineInfo = getGrantDeadlineInfo(grant.deadlineDate);

      // Modelos didáticos (demo) ocultos por padrão, a menos que o switch esteja ativo ou filtro explícito
      if (grant.verificationStatus === 'demo' && !showDemoGrants && selectedVerification !== 'demo') {
        return false;
      }

      // Filtro por Nível de Verificação
      if (selectedVerification !== 'all' && grant.verificationStatus !== selectedVerification) {
        return false;
      }

      // Regra de prazo
      if (selectedStatus === 'abertos' && deadlineInfo.isClosed) {
        return false;
      }
      if (selectedStatus === 'encerrados' && !deadlineInfo.isClosed) {
        return false;
      }

      // Busca por texto
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = grant.title.toLowerCase().includes(query);
        const matchesSummary = grant.summary.toLowerCase().includes(query);
        const matchesBody = grant.issuingBody.toLowerCase().includes(query);
        const matchesArea = grant.artisticArea.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary && !matchesBody && !matchesArea) {
          return false;
        }
      }

      // Filtro por Área Artística
      if (selectedArea !== 'all' && grant.artisticArea !== selectedArea) {
        return false;
      }

      // Filtro por Esfera
      if (selectedSphere !== 'all' && grant.sphere !== selectedSphere) {
        return false;
      }

      // Filtro por Cidade / Território
      if (selectedCity !== 'all') {
        if (selectedCity === 'Indaiatuba' && grant.city !== 'Indaiatuba') return false;
        if (selectedCity === 'Campinas' && grant.city !== 'Campinas') return false;
        if (selectedCity === 'SP' && grant.state !== 'SP') return false;
        if (selectedCity === 'ate_50k' && !grant.maxCityPopulation) return false;
      }

      // Filtro por Valor
      if (selectedValueRange !== 'all') {
        if (selectedValueRange === 'ate_30k' && grant.grantValue > 30000) return false;
        if (selectedValueRange === '30k_60k' && (grant.grantValue <= 30000 || grant.grantValue > 60000)) return false;
        if (selectedValueRange === 'acima_60k' && grant.grantValue <= 60000) return false;
      }

      // Filtro por Prazo
      if (selectedDeadlineRange !== 'all') {
        if (deadlineInfo.isClosed) return false;
        if (selectedDeadlineRange === '15d' && deadlineInfo.daysRemaining > 15) return false;
        if (selectedDeadlineRange === '30d' && deadlineInfo.daysRemaining > 30) return false;
      }

      // Filtro por Elegibilidade Jurídica
      if (selectedLegal !== 'all') {
        if (!grant.eligibleLegal.includes(selectedLegal as LegalEligibility)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'prazo') {
        const diffA = new Date(a.deadlineDate).getTime();
        const diffB = new Date(b.deadlineDate).getTime();
        return diffA - diffB;
      }
      if (sortBy === 'valor') {
        return b.grantValue - a.grantValue;
      }
      if (sortBy === 'publicacao') {
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      }
      return 0;
    });
  }, [
    grants, 
    selectedStatus, 
    searchTerm, 
    selectedArea, 
    selectedSphere, 
    selectedCity, 
    selectedValueRange, 
    selectedDeadlineRange, 
    selectedLegal, 
    selectedVerification,
    showDemoGrants,
    sortBy
  ]);

  const clearAllFilters = () => {
    setSelectedArea('all');
    setSelectedSphere('all');
    setSelectedCity('all');
    setSelectedValueRange('all');
    setSelectedDeadlineRange('all');
    setSelectedLegal('all');
    setSelectedVerification('all');
    setSelectedStatus('abertos');
    setSearchTerm('');
  };

  const hasActiveFilters = 
    selectedArea !== 'all' ||
    selectedSphere !== 'all' ||
    selectedCity !== 'all' ||
    selectedValueRange !== 'all' ||
    selectedDeadlineRange !== 'all' ||
    selectedLegal !== 'all' ||
    selectedVerification !== 'all' ||
    selectedStatus !== 'abertos' ||
    searchTerm.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Topo do Catálogo */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 dark:border-white/5 pb-8"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
            <span className="tracking-wide uppercase font-mono text-xs">Catálogo Confiável de Editais</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Oportunidades de Fomento Cultural
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Diagnóstico de elegibilidade e preparação documental com transparência: oportunidades oficiais verificadas, previsões de ciclos e modelos didáticos para treino.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Oficiais abertos: <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums">{verifiedOpenCount}</strong></span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>Exibindo: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{filteredGrants.length}</strong></span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Switch de Modelos Didáticos (Ocultos por padrão) */}
            <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-slate-300 transition-colors">
              <input
                type="checkbox"
                checked={showDemoGrants}
                onChange={e => setShowDemoGrants(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <span className="font-semibold text-[11px]">Exibir modelos didáticos</span>
            </label>

            <button onClick={() => setCurrentView('eligibilidade')} className="btn-primary px-4 py-2 text-xs inline-flex items-center gap-2 min-h-[36px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Posso me inscrever?
            </button>
          </div>
        </div>
      </motion.div>

      {/* Banner de Destaque: Calendário Cultural Anual */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-sky-500/5 to-transparent border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Calendário Cultural Anual 2026 Mapeado
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Acompanhe as previsões regulares de abertura da PNAB Indaiatuba, ProAC Editais SP, Prêmio Nabor Pires Camargo e prepare o cofre com antecedência.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentView('calendario');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="btn-primary px-4 py-2 text-xs shrink-0 whitespace-nowrap min-h-[40px] flex items-center gap-1.5"
        >
          <span>Acessar Calendário</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Barra de Busca e Filtros - Bento Card */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
        className="bento-card space-y-5"
      >
        
        {/* Linha 1: Input de Busca com Ícone */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por edital, órgão público, área artística ou palavra-chave..."
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Linha 2: Dropdowns de Filtro */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring text-xs"
            >
              <option value="abertos">Prazo demonstrativo futuro (10)</option>
              <option value="encerrados">Prazo demonstrativo passado (2)</option>
              <option value="todos">Todos os modelos (12)</option>
            </select>
          </div>

          {/* Área Artística */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Área Artística
            </label>
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring text-xs"
            >
              <option value="all">Todas as áreas</option>
              <option value="Música">Música (2)</option>
              <option value="Teatro">Teatro (2)</option>
              <option value="Artes Visuais">Artes Visuais (1)</option>
              <option value="Dança">Dança (1)</option>
              <option value="Literatura">Literatura (1)</option>
              <option value="Audiovisual">Audiovisual (1)</option>
              <option value="Circo">Circo (1)</option>
              <option value="Patrimônio Cultural">Patrimônio (2)</option>
            </select>
          </div>

          {/* Esfera */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Esfera
            </label>
            <select
              value={selectedSphere}
              onChange={e => setSelectedSphere(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring text-xs"
            >
              <option value="all">Todas as esferas</option>
              <option value="Municipal">Municipal</option>
              <option value="Estadual">Estadual (SP)</option>
              <option value="Federal">Federal</option>
            </select>
          </div>

          {/* Cidade / População */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Território / Cota
            </label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring text-xs"
            >
              <option value="all">Qualquer local</option>
              <option value="Indaiatuba">Indaiatuba</option>
              <option value="Campinas">Campinas</option>
              <option value="SP">Estado de SP</option>
              <option value="ate_50k">Cidades &le; 50 mil hab.</option>
            </select>
          </div>

          {/* Elegibilidade */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Elegibilidade
            </label>
            <select
              value={selectedLegal}
              onChange={e => setSelectedLegal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring text-xs"
            >
              <option value="all">Qualquer formato</option>
              <option value="pf">Pessoa Física (PF)</option>
              <option value="coletivo">Coletivo sem CNPJ</option>
              <option value="mei">MEI</option>
              <option value="empresa">Empresa (PJ)</option>
            </select>
          </div>

          {/* Nível de Confiabilidade / Status de Verificação */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Confiabilidade
            </label>
            <select
              value={selectedVerification}
              onChange={e => setSelectedVerification(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring text-xs"
            >
              <option value="all">Todas as fontes</option>
              <option value="verified">Oficial verificado</option>
              <option value="pending_verification">Aguardando confirmação</option>
              <option value="forecast">Previsão histórica</option>
              <option value="demo">Modelo didático</option>
            </select>
          </div>

          {/* Ordenação */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Ordenar Por
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus-ring text-xs font-semibold"
            >
              <option value="prazo">Prazo mais urgente</option>
              <option value="valor">Maior valor (R$)</option>
              <option value="publicacao">Mais recentes</option>
            </select>
          </div>

        </div>

        {/* Linha 3: Tags ativas e Limpar Filtros */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/5 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="font-medium">Filtros aplicados:</span>
              {selectedVerification !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border border-slate-200/60 dark:border-white/5">
                  Confiabilidade: {selectedVerification === 'verified' ? 'Oficial verificado' : selectedVerification === 'pending_verification' ? 'Aguardando confirmação' : selectedVerification === 'forecast' ? 'Previsão histórica' : 'Modelo didático'}
                  <button onClick={() => setSelectedVerification('all')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600 dark:hover:text-white" /></button>
                </span>
              )}
              {selectedStatus !== 'abertos' && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border border-slate-200/60 dark:border-white/5">
                  Status: {selectedStatus}
                  <button onClick={() => setSelectedStatus('abertos')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600 dark:hover:text-white" /></button>
                </span>
              )}
              {selectedArea !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border border-slate-200/60 dark:border-white/5">
                  Área: {selectedArea}
                  <button onClick={() => setSelectedArea('all')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600 dark:hover:text-white" /></button>
                </span>
              )}
              {selectedSphere !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border border-slate-200/60 dark:border-white/5">
                  Esfera: {selectedSphere}
                  <button onClick={() => setSelectedSphere('all')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600 dark:hover:text-white" /></button>
                </span>
              )}
              {selectedCity !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border border-slate-200/60 dark:border-white/5">
                  Território: {selectedCity}
                  <button onClick={() => setSelectedCity('all')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600 dark:hover:text-white" /></button>
                </span>
              )}
              {selectedLegal !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border border-slate-200/60 dark:border-white/5">
                  Legal: {selectedLegal.toUpperCase()}
                  <button onClick={() => setSelectedLegal('all')}><X className="w-3 h-3 text-slate-400 hover:text-slate-600 dark:hover:text-white" /></button>
                </span>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}

      </motion.div>

      {/* Lista de Resultados - Bento Grid de Editais */}
      {filteredGrants.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bento-card p-12 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Nenhum edital encontrado para estes critérios
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Tente remover alguns filtros ou selecionar "Todos" para visualizar oportunidades encerradas.
            </p>
          </div>
          <button
            onClick={clearAllFilters}
            className="btn-primary px-5 py-2 text-xs"
          >
            Restaurar catálogo inicial
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGrants.map((grant, index) => {
            const { isClosed, daysRemaining, label } = getGrantDeadlineInfo(grant.deadlineDate);
            const isCurrentApp = Boolean(activeApplication && activeApplication.grantId === grant.id);

            return (
              <motion.div
                key={grant.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 24, 
                  delay: index * 0.03 
                }}
                whileHover={{ y: -3 }}
                className={`p-6 sm:p-7 rounded-2xl sm:rounded-3xl border flex flex-col justify-between transition-all backdrop-blur-xs ${
                  isCurrentApp
                    ? 'border-teal-500/50 bg-teal-50/30 dark:bg-teal-950/20 shadow-xs'
                    : 'border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Badge de Verificação e Metadados */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {grant.verificationStatus === 'verified' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Oficial Verificado
                      </span>
                    )}
                    {grant.verificationStatus === 'pending_verification' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600" /> Aguardando Confirmação
                      </span>
                    )}
                    {grant.verificationStatus === 'forecast' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-600" /> Previsão Histórica
                      </span>
                    )}
                    {grant.verificationStatus === 'demo' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10 inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-red-600" /> Modelo Didático
                      </span>
                    )}

                    <span className="font-semibold text-teal-600 dark:text-teal-400">{grant.artisticArea}</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <span>{grant.sphere}</span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <span className={`font-mono font-semibold ${
                      isClosed 
                        ? 'text-red-600 dark:text-red-400' 
                        : (daysRemaining <= 10 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400')
                    }`}>
                      {label}
                    </span>
                  </div>

                  <div>
                    <h2 
                      onClick={() => {
                        setSelectedGrantId(grant.id);
                        setCurrentView('grant_detail');
                      }}
                      className="text-lg font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer leading-snug line-clamp-2"
                    >
                      {grant.title}
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
                      {grant.issuingBody}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {grant.summary}
                  </p>

                  {/* Restrições e Elegibilidade */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-white/5">
                    {grant.maxCityPopulation && (
                      <span className="font-medium text-teal-700 dark:text-teal-300">
                        Cidades &le; 50 mil hab.
                      </span>
                    )}
                    {grant.eligibleLegal.includes('coletivo') && (
                      <span>· Aceita coletivo sem CNPJ</span>
                    )}
                    {grant.eligibleLegal.includes('mei') && (
                      <span>· Aceita MEI</span>
                    )}
                  </div>
                </div>

                {/* Rodapé do Card com Valor e Ações */}
                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase font-medium text-slate-400 block tracking-wider">
                      Valor Previsto
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                      R$ {grant.grantValue.toLocaleString('pt-BR')},00
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {grant.officialUrl && (
                      <a
                        href={grant.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                        title={`Acessar portal oficial (${grant.officialSource || grant.issuingBody})`}
                        aria-label={`Acessar portal oficial de ${grant.title}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setSelectedGrantId(grant.id);
                        setCurrentView('grant_detail');
                      }}
                      className="btn-secondary px-3.5 py-1.5 text-xs focus-ring min-h-[38px]"
                    >
                      Detalhes
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (isCurrentApp) {
                          setCurrentView('checklist');
                        } else {
                          startPreparationForGrant(grant.id);
                        }
                      }}
                      disabled={isClosed}
                      className="btn-primary px-4 py-1.5 text-xs focus-ring min-h-[38px]"
                    >
                      {isClosed ? 'Encerrado' : (isCurrentApp ? 'Continuar' : 'Preparar')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};
