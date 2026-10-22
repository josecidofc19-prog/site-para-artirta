import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderLock, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  AlertCircle,
  Search,
  Filter,
  Check,
  RotateCcw,
  CalendarPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VaultDocument } from '../types';
import { DocUpdateModal } from './DocUpdateModal';
import { DocAddModal } from './DocAddModal';
import { 
  calculateDocumentStatus, 
  isExpiringBeforeGrantDeadline, 
  formatDayMonth 
} from '../data/defaultVault';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { Tooltip, InfoTooltip } from './Tooltip';
import { downloadCalendarReminder } from '../utils/calendar';

export const VaultPage: React.FC = () => {
  const { 
    vaultDocuments, 
    removeVaultDocument, 
    setCurrentView,
    user,
    selectedGrantId,
    grants,
    selectedProfile
  } = useApp();
  
  const [editingDoc, setEditingDoc] = useState<VaultDocument | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<VaultDocument | null>(null);

  // Estados de busca e filtros do cofre
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [onlyLinkedToActiveGrant, setOnlyLinkedToActiveGrant] = useState(false);

  const activeGrant = grants.find(g => g.id === selectedGrantId) || grants[0];
  const activeProfileType = user?.profileType || selectedProfile;

  // Lista de IDs de exigências obrigatórias do edital ativo
  const mandatoryReqIds = activeGrant.requiredDocuments
    .filter(r => r.mandatory && r.appliesToProfiles.includes(activeProfileType))
    .map(r => r.id);

  // Resumo quantitativo em tempo real
  const metrics = useMemo(() => {
    let emDia = 0;
    let venceBreve = 0;
    let vencido = 0;

    vaultDocuments.forEach(doc => {
      const status = calculateDocumentStatus(doc.expiryDate);
      if (status === 'em_dia') emDia++;
      else if (status === 'vence_breve') venceBreve++;
      else if (status === 'vencido') vencido++;
    });

    return { total: vaultDocuments.length, emDia, venceBreve, vencido };
  }, [vaultDocuments]);

  // Filtragem dos documentos
  const filteredDocs = useMemo(() => {
    return vaultDocuments.filter(doc => {
      // Filtro por texto
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(query);
        const matchesFileName = doc.fileName ? doc.fileName.toLowerCase().includes(query) : false;
        const matchesNotes = doc.notes ? doc.notes.toLowerCase().includes(query) : false;
        if (!matchesName && !matchesFileName && !matchesNotes) {
          return false;
        }
      }

      // Filtro por categoria
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
        return false;
      }

      // Filtro por status
      if (selectedStatus !== 'all') {
        const docStatus = calculateDocumentStatus(doc.expiryDate);
        if (selectedStatus === 'em_dia' && docStatus !== 'em_dia') return false;
        if (selectedStatus === 'vence_breve' && docStatus !== 'vence_breve') return false;
        if (selectedStatus === 'vencido' && docStatus !== 'vencido') return false;
      }

      // Filtro de vinculados ao edital ativo
      if (onlyLinkedToActiveGrant) {
        if (!doc.requirementId) return false;
        const isLinkedToActive = activeGrant.requiredDocuments.some(req => req.id === doc.requirementId);
        if (!isLinkedToActive) return false;
      }

      return true;
    });
  }, [vaultDocuments, searchTerm, selectedCategory, selectedStatus, onlyLinkedToActiveGrant, activeGrant]);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'identificacao': return 'Identificação / Residência';
      case 'juridico': return 'Jurídico / Representação';
      case 'artistico': return 'Artístico / Portfólio';
      case 'financeiro_fiscal': return 'Fiscal / Tributário';
      default: return cat;
    }
  };

  /**
   * Selo de status com alto contraste e tokens limpos
   */
  const getStatusBadge = (expiryDate: string | null | undefined) => {
    const computedStatus = calculateDocumentStatus(expiryDate);

    if (!expiryDate) {
      return (
        <Tooltip
          title="Documento Permanente"
          content="Documento de validade contínua (ex: portfólio, histórico de apresentações ou estatuto social). Não requer renovação periódica."
          position="top"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 cursor-help">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Permanente</span>
          </span>
        </Tooltip>
      );
    }

    if (computedStatus === 'vencido') {
      return (
        <Tooltip
          title="Documento Vencido"
          content="Prazo expirado. Certidões ou comprovantes vencidos impedem a conclusão automática da etapa documental no checklist."
          position="top"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 cursor-help">
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Vencido</span>
          </span>
        </Tooltip>
      );
    }

    if (computedStatus === 'vence_breve') {
      return (
        <Tooltip
          title="Vencimento Próximo (Atenção)"
          content="Este documento expira nos próximos 30 dias. Recomendamos providenciar uma nova via atualizada antes do término do edital."
          position="top"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 cursor-help">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Vence em breve</span>
          </span>
        </Tooltip>
      );
    }

    return (
      <Tooltip
        title="Documento Regular"
        content="Validade em dia (superior a 30 dias). Documento totalmente habilitado para comprovação em inscrições culturais."
        position="top"
      >
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 cursor-help">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Em dia</span>
        </span>
      </Tooltip>
    );
  };

  // Modal acessível para confirmação de exclusão
  const DeleteConfirmModal: React.FC<{ doc: VaultDocument; onClose: () => void }> = ({ doc, onClose }) => {
    const modalRef = useModalAccessibility(true, onClose, '#cancel-delete-btn');

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
      >
        <div 
          ref={modalRef}
          className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4"
        >
          <h4 id="delete-confirm-title" className="text-base font-bold text-red-600 dark:text-red-400">
            Remover documento do cofre?
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Você está prestes a remover <strong>"{doc.name}"</strong>. Esta ação desvincula este arquivo de qualquer edital preparado no momento.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              id="cancel-delete-btn"
              type="button"
              onClick={onClose}
              className="btn-secondary px-3.5 py-2 text-xs focus-ring min-h-[40px]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                removeVaultDocument(doc.id);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors focus-ring min-h-[40px] cursor-pointer"
            >
              Confirmar remoção
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Topo do Cofre */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/5 pb-8"
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono uppercase">
            <FolderLock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Gestão Documental Inteligente</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Cofre de Documentos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Centralize certidões, comprovantes de endereço de Indaiatuba, portfólios e cartas de representação para validação automática em editais culturais.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddOpen(true)}
            className="btn-primary px-4 py-2.5 text-xs focus-ring min-h-[44px]"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Adicionar documento</span>
          </motion.button>
        </div>
      </motion.div>

      {/* PAINEL BENTO DE MÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bento-card p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">Total Cadastrado</span>
              <InfoTooltip 
                title="Total de Documentos" 
                content="Quantidade total de arquivos e certidões armazenados no cofre digital desta sessão." 
                position="top" 
              />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">{metrics.total}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <FolderLock className="w-5 h-5" />
          </div>
        </div>

        <div className="bento-card p-4 sm:p-5 flex items-center justify-between border-emerald-500/20">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs uppercase font-semibold text-emerald-600 dark:text-emerald-400 block tracking-wider">Em Dia</span>
              <InfoTooltip 
                title="Documentos Em Dia" 
                content="Documentos válidos por mais de 30 dias ou permanentes, aptos para habilitação imediata." 
                position="top" 
              />
            </div>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">{metrics.emDia}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bento-card p-4 sm:p-5 flex items-center justify-between border-amber-500/20">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs uppercase font-semibold text-amber-600 dark:text-amber-400 block tracking-wider">Vence em Breve</span>
              <InfoTooltip 
                title="Atenção à Validade" 
                content="Documentos que expiram dentro dos próximos 30 dias. Recomendamos renová-los para não inviabilizar inscrições." 
                position="top" 
              />
            </div>
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums">{metrics.venceBreve}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bento-card p-4 sm:p-5 flex items-center justify-between border-red-500/20">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs uppercase font-semibold text-red-600 dark:text-red-400 block tracking-wider">Vencidos</span>
              <InfoTooltip 
                title="Pendência Documental" 
                content="Documentos com validade expirada. Devem ser atualizados para habilitar a etapa documental do edital." 
                position="top" 
              />
            </div>
            <span className="text-2xl font-extrabold text-red-600 dark:text-red-400 font-mono tabular-nums">{metrics.vencido}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Aviso Explicativo de Privacidade e Simulação Local */}
      <div className="bento-card p-5 sm:p-6 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white text-sm">
            Privacidade e Armazenamento Local Seguro (Client-Side)
          </p>
          <p className="leading-relaxed">
            Seus arquivos e metadados residem com segurança no seu próprio navegador. A plataforma calcula a conformidade dos editais em tempo real sem transmitir documentos para servidores de terceiros.
          </p>
        </div>
      </div>

      {/* BARRA DE PESQUISA E FILTROS DO COFRE */}
      {vaultDocuments.length > 0 && (
        <div className="bento-card p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Campo de Busca */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Filtrar por nome, arquivo ou observações..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring min-h-[42px]"
              />
            </div>

            {/* Filtro por Categoria */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring cursor-pointer min-h-[42px]"
              aria-label="Filtrar por categoria de documento"
            >
              <option value="all">Todas as Categorias</option>
              <option value="identificacao">Identificação / Residência</option>
              <option value="juridico">Jurídico / Representação</option>
              <option value="artistico">Artístico / Portfólio</option>
              <option value="financeiro_fiscal">Fiscal / Tributário / CNDs</option>
            </select>

            {/* Filtro por Status */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring cursor-pointer min-h-[42px]"
              aria-label="Filtrar por situação da validade"
            >
              <option value="all">Todos os Status</option>
              <option value="em_dia">Em dia</option>
              <option value="vence_breve">Vence em breve (&le; 30d)</option>
              <option value="vencido">Vencido</option>
            </select>
          </div>

          {/* Toggle de Vinculação com o Edital Ativo */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyLinkedToActiveGrant}
                onChange={e => setOnlyLinkedToActiveGrant(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus-ring cursor-pointer"
              />
              <span>Mostrar apenas exigências do edital ativo: <strong>"{activeGrant.title.slice(0, 35)}..."</strong></span>
            </label>

            {(searchTerm.trim() || selectedCategory !== 'all' || selectedStatus !== 'all' || onlyLinkedToActiveGrant) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setOnlyLinkedToActiveGrant(false);
                }}
                className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline cursor-pointer"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* VERIFICAÇÃO DE ESTADO VAZIO (EMPTY STATE) */}
      {vaultDocuments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 space-y-4 shadow-xs"
        >
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-2">
            <FolderLock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Seu cofre está vazio</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              A maioria dos editais de Indaiatuba e do Estado de São Paulo exige, no mínimo, um Comprovante de Residência recente e um Documento de Identificação. Que tal começar por eles?
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2 cursor-pointer shadow-xs focus-ring min-h-[44px]"
          >
            <Plus className="w-4 h-4" /> Adicionar Primeiro Documento
          </button>
        </motion.div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Nenhum documento encontrado com os critérios de filtro selecionados.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
              setOnlyLinkedToActiveGrant(false);
            }}
            className="btn-secondary px-4 py-2 text-xs"
          >
            Redefinir filtros
          </button>
        </div>
      ) : (
        <>
          {/* VISÃO CELULAR / MOBILE (< 768px): CARTÕES INDIVIDUAIS BENTO */}
          <div className="space-y-4 md:hidden">
            {filteredDocs.map(doc => {
              const addedDateFormatted = new Date(doc.addedDate).toLocaleDateString('pt-BR');
              const expiryFormatted = doc.expiryDate 
                ? new Date(doc.expiryDate).toLocaleDateString('pt-BR') 
                : 'Permanente (Sem vencimento)';

              const isMandatoryLinked = doc.requirementId && mandatoryReqIds.includes(doc.requirementId);
              const showWarningBeforeDeadline = isMandatoryLinked && isExpiringBeforeGrantDeadline(doc.expiryDate, activeGrant.deadlineDate);

              return (
                <div 
                  key={doc.id}
                  className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                        <span>{getCategoryLabel(doc.category)}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {doc.name}
                      </h3>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(doc.expiryDate)}
                    </div>
                  </div>

                  {/* Alerta: Vence antes do prazo do edital */}
                  {showWarningBeforeDeadline && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        Vence antes do prazo do edital ({formatDayMonth(doc.expiryDate)}). Renove antes de enviar.
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-white/5">
                    <div>
                      <span className="text-xs uppercase font-medium text-slate-400 block tracking-wider">Validade</span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{expiryFormatted}</span>
                    </div>
                    <div>
                      <span className="text-xs uppercase font-medium text-slate-400 block tracking-wider">Arquivo</span>
                      <span className="truncate block font-mono text-slate-500">{doc.fileName || 'documento.pdf'}</span>
                    </div>
                  </div>

                  {doc.requirementId && (
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                      Vinculado à exigência de edital
                    </p>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    {doc.expiryDate && <button onClick={() => downloadCalendarReminder(`Vencimento do documento: ${doc.name}`, doc.expiryDate!, `Renove ou confira o documento ${doc.name} no cofre do Cultura em Cena.`)} className="btn-secondary px-3 py-2 text-xs inline-flex items-center gap-1.5 min-h-[40px]"><CalendarPlus className="w-3.5 h-3.5" /> Agenda</button>}
                    <button
                      onClick={() => setEditingDoc(doc)}
                      className="btn-secondary flex-1 py-2 text-xs flex items-center justify-center gap-1.5 focus-ring min-h-[42px]"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                      <span>Atualizar</span>
                    </button>
                    <button
                      onClick={() => setDocToDelete(doc)}
                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors focus-ring min-h-[42px] min-w-[42px] flex items-center justify-center"
                      title="Remover documento"
                      aria-label={`Remover ${doc.name}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VISÃO DESKTOP E TABLET (>= 768px): TABELA BENTO */}
          <div className="hidden md:block rounded-3xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                    <th scope="col" className="py-4 px-5">Documento</th>
                    <th scope="col" className="py-4 px-4">Categoria</th>
                    <th scope="col" className="py-4 px-4">Inclusão</th>
                    <th scope="col" className="py-4 px-4">Validade</th>
                    <th scope="col" className="py-4 px-4">Situação</th>
                    <th scope="col" className="py-4 px-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
                  {filteredDocs.map(doc => {
                    const addedDateFormatted = new Date(doc.addedDate).toLocaleDateString('pt-BR');
                    const expiryFormatted = doc.expiryDate 
                      ? new Date(doc.expiryDate).toLocaleDateString('pt-BR') 
                      : 'Permanente (Sem vencimento)';

                    const isMandatoryLinked = doc.requirementId && mandatoryReqIds.includes(doc.requirementId);
                    const showWarningBeforeDeadline = isMandatoryLinked && isExpiringBeforeGrantDeadline(doc.expiryDate, activeGrant.deadlineDate);

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <p className="font-bold text-sm text-slate-900 dark:text-white">{doc.name}</p>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">
                                {doc.fileName || 'arquivo.pdf'} ({doc.fileSize || '1.0 MB'})
                              </p>
                              {showWarningBeforeDeadline && (
                                <p className="text-xs font-semibold text-amber-500 mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                  <span>Vence antes do edital ({formatDayMonth(doc.expiryDate)}). Renove antes de enviar.</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500 text-xs">
                          {getCategoryLabel(doc.category)}
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-400 text-xs">
                          {addedDateFormatted}
                        </td>
                        <td className="py-4 px-4 font-mono font-medium text-xs text-slate-700 dark:text-slate-300">
                          {expiryFormatted}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(doc.expiryDate)}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {doc.expiryDate && <button onClick={() => downloadCalendarReminder(`Vencimento do documento: ${doc.name}`, doc.expiryDate!, `Renove ou confira o documento ${doc.name} no cofre do Cultura em Cena.`)} className="btn-secondary px-2.5 py-1.5 text-xs inline-flex items-center gap-1 min-h-[38px]" title="Adicionar lembrete de vencimento à agenda"><CalendarPlus className="w-3.5 h-3.5" /> Agenda</button>}
                            <button
                              onClick={() => setEditingDoc(doc)}
                              className="btn-secondary px-3 py-1.5 text-xs focus-ring min-h-[38px]"
                              title="Atualizar validade ou substituir arquivo"
                            >
                              <span className="flex items-center gap-1.5">
                                <Edit3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                                <span>Atualizar</span>
                              </span>
                            </button>

                            <button
                              onClick={() => setDocToDelete(doc)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors focus-ring min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                              title="Remover documento"
                              aria-label={`Remover ${doc.name}`}
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Destaque para o Momento Principal da Demonstração */}
      {user?.isDemo && (
        <div className="p-6 rounded-2xl sm:rounded-3xl border border-teal-500/25 bg-teal-50/40 dark:bg-teal-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              Dica para a Demonstração de Lucas
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Localize o documento <strong>"Comprovante de Residência e Sede do Grupo (Indaiatuba)"</strong> com status <em>Vencido</em>. Clique em <strong>Atualizar</strong> e renove com uma data futura: a etapa documental é validada e o progresso salta de <strong>60% para 80%</strong>!
            </p>
          </div>

          <button
            onClick={() => setCurrentView('checklist')}
            className="btn-primary px-4 py-2.5 text-xs whitespace-nowrap shadow-xs focus-ring min-h-[44px]"
          >
            Acompanhar checklist
          </button>
        </div>
      )}

      {/* Modal de Atualização */}
      {editingDoc && (
        <DocUpdateModal
          document={editingDoc}
          onClose={() => setEditingDoc(null)}
        />
      )}

      {/* Modal de Adição */}
      <DocAddModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      {/* Confirmação de Exclusão Acessível */}
      {docToDelete && (
        <DeleteConfirmModal
          doc={docToDelete}
          onClose={() => setDocToDelete(null)}
        />
      )}

    </div>
  );
};
