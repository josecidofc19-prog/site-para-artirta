import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  FolderLock, 
  ArrowRight, 
  Filter, 
  Layers, 
  Search,
  ListFilter,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ANNUAL_CALENDAR_FORECASTS, AnnualCalendarForecast, getGrantDeadlineInfo } from '../data/mockGrants';
import { Sphere, ArtisticArea } from '../types';

export const CalendarioCulturalPage: React.FC = () => {
  const { 
    setCurrentView, 
    setSelectedGrantId, 
    startPreparationForGrant,
    grants 
  } = useApp();

  const [selectedSphere, setSelectedSphere] = useState<string>('all');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtragem dos eventos e previsões do calendário
  const filteredEvents = useMemo(() => {
    return ANNUAL_CALENDAR_FORECASTS.filter(item => {
      if (selectedSphere !== 'all' && item.sphere !== selectedSphere) {
        return false;
      }
      if (selectedQuarter !== 'all' && item.annualQuarter !== selectedQuarter) {
        return false;
      }
      if (selectedArea !== 'all' && item.artisticArea !== selectedArea) {
        return false;
      }
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesBody = item.issuingBody.toLowerCase().includes(query);
        const matchesCity = item.city ? item.city.toLowerCase().includes(query) : false;
        const matchesArea = item.artisticArea.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesBody && !matchesCity && !matchesArea && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [selectedSphere, selectedQuarter, selectedArea, selectedStatus, searchTerm]);

  const quarters = [
    { id: 'Q1', label: '1º Trimestre (Jan - Mar)', desc: 'Lançamentos de início de ano e cadastros no SALIC' },
    { id: 'Q2', label: '2º Trimestre (Abr - Jun)', desc: 'Pico dos editais estaduais (ProAC) e municipais de música' },
    { id: 'Q3', label: '3º Trimestre (Jul - Set)', desc: 'Ciclos da PNAB nos municípios e prêmios do interior' },
    { id: 'Q4', label: '4º Trimestre (Out - Dez)', desc: 'Chamamentos de final de ano e festivais de verão' },
  ];

  const getQuarterLabel = (q: string) => {
    switch (q) {
      case 'Q1': return '1º Tri (Jan - Mar)';
      case 'Q2': return '2º Tri (Abr - Jun)';
      case 'Q3': return '3º Tri (Jul - Set)';
      case 'Q4': return '4º Tri (Out - Dez)';
      default: return q;
    }
  };

  const clearFilters = () => {
    setSelectedSphere('all');
    setSelectedQuarter('all');
    setSelectedArea('all');
    setSelectedStatus('all');
    setSearchTerm('');
  };

  const handleStartPrep = (forecast: AnnualCalendarForecast) => {
    if (forecast.linkedGrantId) {
      startPreparationForGrant(forecast.linkedGrantId);
    } else {
      // Se for previsão sem edital aberto vinculado, leva ao cofre para adiantar documentos
      setCurrentView('vault');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Topo / Cabeçalho do Calendário */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 border-b border-slate-200/80 dark:border-white/5 pb-8"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono uppercase">
            <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            <span>Planejamento Antecipado de Editais</span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/5">
            Foco: Indaiatuba, RMC & São Paulo
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F3EF]">
              Calendário Cultural Anual
            </h1>
            <p className="text-sm sm:text-base text-[#57534E] dark:text-[#D6D3D1] max-w-3xl leading-relaxed">
              Mapeamento das janelas previsíveis de fomento cultural em Indaiatuba, na Região Metropolitana de Campinas, no Estado de São Paulo e no Governo Federal. Não espere o edital abrir: organize seus documentos no cofre com meses de antecedência.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setCurrentView('vault');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-[#E6E0D5] dark:border-white/10 bg-white dark:bg-[#1A1A1E] text-[#1C1917] dark:text-[#F5F3EF] hover:bg-[#FAF7F2] inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-red-700 min-h-[44px] cursor-pointer"
            >
              <FolderLock className="w-4 h-4 text-[#78716C]" />
              <span>Ver meu cofre</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-editorial-primary px-4 py-2.5 text-xs inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-red-700 min-h-[44px] cursor-pointer"
            >
              <span>Ver editais abertos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tira de Legenda / Status Transparente */}
        <div className="flex flex-wrap items-center gap-3 pt-3 text-xs">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-xs">Legenda de Previsão:</span>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Inscrições Abertas</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 font-semibold">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>Previsão Anual Confirmada</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Ciclo Encerrado / Próxima Edição</span>
          </div>
        </div>
      </motion.div>

      {/* DICA DE ANTECIPAÇÃO ESTRATÉGICA BENTO */}
      <div className="bento-card p-6 sm:p-8 bg-gradient-to-r from-teal-500/5 via-slate-50 to-white dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-900 border-teal-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Por que a antecipação garante aprovações?</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Mais de 65% das desclassificações ocorrem por certidões vencidas de última hora.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Editais de cidades como <strong>Indaiatuba</strong> e <strong>Campinas</strong> e programas como o <strong>ProAC</strong> abrem janelas curtas de 15 a 30 dias para inscrição. Artistas que mantêm o cofre em dia conseguem redigir projetos com calma enquanto outros perdem prazos emitindo certidões.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentView('vault');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-primary px-5 py-3 text-xs whitespace-nowrap shrink-0 shadow-sm min-h-[44px]"
          >
            Adiantar documentos no cofre
          </button>
        </div>
      </div>

      {/* BARRA DE FILTROS E BUSCA */}
      <div className="bento-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por edital, órgão (ex: Indaiatuba, ProAC, MinC), linguagem..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
            />
          </div>

          {/* Filtros em linha */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Esfera */}
            <select
              value={selectedSphere}
              onChange={e => setSelectedSphere(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring cursor-pointer min-h-[40px]"
              aria-label="Filtrar por esfera"
            >
              <option value="all">Todas as Esferas</option>
              <option value="Municipal">Municipal (Indaiatuba / RMC)</option>
              <option value="Estadual">Estadual (São Paulo)</option>
              <option value="Federal">Federal (Nacional)</option>
            </select>

            {/* Trimestre */}
            <select
              value={selectedQuarter}
              onChange={e => setSelectedQuarter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring cursor-pointer min-h-[40px]"
              aria-label="Filtrar por trimestre"
            >
              <option value="all">Todos os Trimestres</option>
              <option value="Q1">1º Trimestre (Jan - Mar)</option>
              <option value="Q2">2º Trimestre (Abr - Jun)</option>
              <option value="Q3">3º Trimestre (Jul - Set)</option>
              <option value="Q4">4º Trimestre (Out - Dez)</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring cursor-pointer min-h-[40px]"
              aria-label="Filtrar por situação do edital"
            >
              <option value="all">Todas as Situações</option>
              <option value="aberto">Inscrições Abertas</option>
              <option value="previsao">Previsão Anual Confirmada</option>
            </select>

            {/* Limpar Filtros */}
            {(selectedSphere !== 'all' || selectedQuarter !== 'all' || selectedStatus !== 'all' || searchTerm.trim()) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Resumo do resultado */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
          <span>Exibindo <strong>{filteredEvents.length}</strong> ciclos e previsões mapeados</span>
          <span className="font-mono">Ano-base 2026</span>
        </div>
      </div>

      {/* GRID DO CALENDÁRIO COM CARTÕES BENTO */}
      <div className="space-y-8">
        
        {/* Agrupamento por Trimestre */}
        {quarters.map(q => {
          const eventsInQuarter = filteredEvents.filter(ev => ev.annualQuarter === q.id);
          if (eventsInQuarter.length === 0 && selectedQuarter !== 'all') {
            return null;
          }

          return (
            <div key={q.id} className="space-y-4">
              
              {/* Cabeçalho do Trimestre */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/5 pb-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold font-mono bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                    {q.id}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {q.label}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {q.desc}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-400 font-mono">
                  {eventsInQuarter.length} {eventsInQuarter.length === 1 ? 'oportunidade' : 'oportunidades'}
                </span>
              </div>

              {/* Lista de Eventos do Trimestre */}
              {eventsInQuarter.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-500">
                  Nenhum ciclo cadastrado com os filtros atuais neste trimestre.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {eventsInQuarter.map(forecast => {
                    const isLinkedOpen = forecast.linkedGrantId !== undefined;
                    const linkedGrant = isLinkedOpen ? grants.find(g => g.id === forecast.linkedGrantId) : null;
                    const deadlineInfo = linkedGrant ? getGrantDeadlineInfo(linkedGrant.deadlineDate) : null;

                    return (
                      <motion.div
                        key={forecast.id}
                        whileHover={{ y: -2 }}
                        className="bento-card p-6 flex flex-col justify-between space-y-5 border-slate-200/80 dark:border-white/5 shadow-xs hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-4">
                          {/* Metadados Superiores */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <span className="font-semibold text-teal-600 dark:text-teal-400 font-mono">
                                {forecast.artisticArea}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Building className="w-3.5 h-3.5" />
                                {forecast.sphere}
                              </span>
                              {forecast.city && (
                                <>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {forecast.city}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Badge de Situação */}
                            {forecast.status === 'aberto' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>Inscrições Abertas</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                <span>Previsão Anual</span>
                              </span>
                            )}
                          </div>

                          {/* Título e Órgão Emissor */}
                          <div className="space-y-1">
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                              {forecast.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Publicado por: <strong className="text-slate-700 dark:text-slate-300">{forecast.issuingBody}</strong>
                            </p>
                          </div>

                          {/* Resumo e Período */}
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                <span>Janela Provável / Vigência:</span>
                              </span>
                              <strong className="text-slate-900 dark:text-white font-mono">
                                {forecast.cyclePeriod}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Valor Estimado de Fomento:</span>
                              <strong className="text-slate-900 dark:text-white font-mono">
                                {forecast.estimatedGrantValue}
                              </strong>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {forecast.description}
                          </p>

                          {/* O que adiantar no cofre agora */}
                          <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                              O que adiantar no cofre para este ciclo:
                            </span>
                            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                              {forecast.recommendedPrepDocs.map((doc, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Dica de Especialista */}
                          <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-500/15 text-xs text-slate-600 dark:text-slate-300">
                            <strong className="text-teal-700 dark:text-teal-300 block mb-0.5">Dica de Preparação:</strong>
                            <span>{forecast.tipsForArtist}</span>
                          </div>
                        </div>

                        {/* Ações Inferiores */}
                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                          <a
                            href={forecast.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors focus-ring py-1 cursor-pointer"
                            title={`Acessar portal oficial de ${forecast.issuingBody}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            <span>Portal Oficial</span>
                          </a>

                          <div className="flex items-center gap-2">
                            {forecast.linkedGrantId ? (
                              <button
                                onClick={() => handleStartPrep(forecast)}
                                className="btn-primary px-4 py-2 text-xs focus-ring min-h-[40px]"
                              >
                                <span>Preparar inscrição</span>
                                <ArrowRight className="w-3.5 h-3.5 inline ml-1.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setCurrentView('vault');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="btn-secondary px-3.5 py-2 text-xs focus-ring min-h-[40px]"
                              >
                                <FolderLock className="w-3.5 h-3.5 inline mr-1 text-teal-600" />
                                <span>Adiantar no cofre</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* Roda de Apoio ao Planejamento */}
      <div className="bento-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-slate-200/80 dark:border-white/5">
        <div className="space-y-2 max-w-2xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Precisa de auxílio para estruturar a documentação de um coletivo em Indaiatuba?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Consulte nosso Guia do Artista com modelos de Carta de Representação, cálculo de CNDs e dicas de redação de projetos culturais.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setCurrentView('guia');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-secondary px-4 py-2.5 text-xs min-h-[44px]"
          >
            Acessar Guia do Artista
          </button>
          <button
            onClick={() => {
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-primary px-4 py-2.5 text-xs min-h-[44px]"
          >
            Explorar Catálogo Completo
          </button>
        </div>
      </div>

    </div>
  );
};
