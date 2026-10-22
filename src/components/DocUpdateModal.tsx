import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Calendar, FileText, CheckCircle2, AlertTriangle, ExternalLink, Landmark } from 'lucide-react';
import { VaultDocument } from '../types';
import { useApp } from '../context/AppContext';
import { getCivilDaysRemaining, calculateDocumentStatus } from '../data/defaultVault';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

const getOfficialPortalLink = (docName: string, reqId?: string) => {
  const lower = `${docName} ${reqId || ''}`.toLowerCase();
  if (lower.includes('trabalh') || lower.includes('cndt') || lower.includes('tst')) {
    return {
      portal: 'Tribunal Superior do Trabalho (TST)',
      title: 'Certidão Negativa de Débitos Trabalhistas (CNDT)',
      url: 'https://cndt-certidao.tst.jus.br/inicio.faces',
    };
  }
  if (lower.includes('fgts') || lower.includes('crf') || lower.includes('caixa')) {
    return {
      portal: 'Caixa Econômica Federal',
      title: 'Certificado de Regularidade do FGTS (CRF)',
      url: 'https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf',
    };
  }
  if (lower.includes('estadual') || lower.includes('pge') || lower.includes('sefaz')) {
    return {
      portal: 'PGE-SP / Procuradoria Geral do Estado',
      title: 'Certidão de Débitos Tributários da Dívida Ativa Estadual',
      url: 'https://www.dividaativa.pge.sp.gov.br/sc/pages/crda/emitirCrda.jsf',
    };
  }
  if (lower.includes('municipal') || lower.includes('indaiatuba') || lower.includes('prefeitura') || lower.includes('tributo')) {
    return {
      portal: 'Prefeitura Municipal de Indaiatuba',
      title: 'Certidão Negativa de Débitos Municipais (ISS / IPTU)',
      url: 'https://www.indaiatuba.sp.gov.br/tributos/',
    };
  }
  if (lower.includes('federal') || lower.includes('receita') || lower.includes('inss') || lower.includes('cnd')) {
    return {
      portal: 'Receita Federal do Brasil / PGFN',
      title: 'Certidão de Débitos Federais e Dívida Ativa da União',
      url: 'https://solucoes.receita.fazenda.gov.br/servicos/certidaointernet/pj/emitir',
    };
  }
  return null;
};

interface DocUpdateModalProps {
  document: VaultDocument | null;
  onClose: () => void;
}

export const DocUpdateModal: React.FC<DocUpdateModalProps> = ({ document: doc, onClose }) => {
  const { updateVaultDocument, grants, selectedGrantId, user, selectedProfile } = useApp();

  const activeGrant = grants.find(g => g.id === selectedGrantId) || grants[0];
  const activeProfileType = user?.profileType || selectedProfile;

  const activeRequirements = activeGrant.requiredDocuments.filter(
    req => req.appliesToProfiles.includes(activeProfileType)
  );

  // Data futura padrão para renovação rápida (+180 dias)
  const defaultFutureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 180);
    return d.toISOString().split('T')[0];
  };

  const [name, setName] = useState(doc?.name || '');
  const [selectedReqId, setSelectedReqId] = useState<string>(doc?.requirementId || '');
  const [expiryDate, setExpiryDate] = useState(() => {
    if (doc?.expiryDate) {
      return doc.expiryDate.split('T')[0];
    }
    return defaultFutureDate();
  });
  const [notes, setNotes] = useState(doc?.notes || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [simulatedFileName, setSimulatedFileName] = useState<string>(doc?.fileName || 'documento.pdf');
  const [simulatedFileSize, setSimulatedFileSize] = useState<string>(doc?.fileSize || '1.0 MB');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const officialPortal = doc ? getOfficialPortalLink(name || doc.name, selectedReqId || doc.requirementId) : null;

  // Atualiza os estados locais quando o doc muda
  useEffect(() => {
    if (doc) {
      setName(doc.name);
      setSelectedReqId(doc.requirementId || '');
      setExpiryDate(doc.expiryDate ? doc.expiryDate.split('T')[0] : defaultFutureDate());
      setNotes(doc.notes || '');
      setSimulatedFileName(doc.fileName || 'documento.pdf');
      setSimulatedFileSize(doc.fileSize || '1.0 MB');
      setErrorMessage('');
    }
  }, [doc]);

  // Hook de acessibilidade
  const modalRef = useModalAccessibility(Boolean(doc), onClose, '#doc-update-expiry');

  if (!doc) return null;

  // Validação reativa da data de vencimento
  const validateExpiry = (dateStr: string) => {
    const daysRemaining = getCivilDaysRemaining(dateStr);
    if (daysRemaining === null || daysRemaining < 0) {
      setErrorMessage('Escolha uma data futura para renovar o documento');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleDateChange = (newDate: string) => {
    setExpiryDate(newDate);
    validateExpiry(newDate);
  };

  const handleQuickAddDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const dateStr = d.toISOString().split('T')[0];
    setExpiryDate(dateStr);
    setErrorMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSimulatedFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setSimulatedFileSize(`${sizeMB} MB`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (doc.expiryDate && !validateExpiry(expiryDate)) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      updateVaultDocument(doc.id, {
        name: name.trim() || doc.name,
        expiryDate: doc.expiryDate ? `${expiryDate}T23:59:59Z` : null,
        notes: notes.trim(),
        requirementId: selectedReqId || undefined,
        fileName: simulatedFileName,
        fileSize: simulatedFileSize,
      });

      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  const daysRemaining = getCivilDaysRemaining(expiryDate);
  const isInvalidDate = Boolean(errorMessage);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-update-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-white/10 relative my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl focus-ring min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Fechar janela de atualização"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="space-y-1.5 mb-6 pr-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>Atualização de Documento</span>
          </div>
          <h2 id="doc-update-title" className="text-xl sm:text-2xl font-bold tracking-tight">
            {doc.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Atualize o vencimento ou substitua o arquivo digitalizado. Se este documento estiver vinculado ao edital ativo, o checklist será atualizado em tempo real.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vínculo com Exigência do Edital Ativo */}
          {activeRequirements.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-500/20">
              <label 
                htmlFor="doc-update-req-select" 
                className="block text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300 mb-1"
              >
                Vínculo com o edital "{activeGrant.title.slice(0, 35)}..."
              </label>
              <select
                id="doc-update-req-select"
                value={selectedReqId}
                onChange={e => setSelectedReqId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring"
              >
                <option value="">Nenhum vínculo específico (Geral)</option>
                {activeRequirements.map(req => (
                  <option key={req.id} value={req.id}>
                    {req.name} {req.mandatory ? '(Obrigatório)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Nome do Documento */}
          <div>
            <label 
              htmlFor="doc-update-name" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
            >
              Nome do Documento no Cofre *
            </label>
            <input
              id="doc-update-name"
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
            />
          </div>

          {/* Emissão Direta no Portal Oficial */}
          {officialPortal && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                  <Landmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Emissão Oficial: {officialPortal.portal}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {officialPortal.title}
                </p>
              </div>
              <a
                href={officialPortal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition-colors shadow-2xs focus-ring min-h-[36px]"
              >
                <span>Emitir no Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Validade */}
          <div>
            <label 
              htmlFor="doc-update-expiry" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
            >
              Nova Data de Validade *
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                id="doc-update-expiry"
                type="date"
                required
                value={expiryDate}
                onChange={e => handleDateChange(e.target.value)}
                className={`w-full sm:w-auto flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring font-mono ${
                  isInvalidDate ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-white/10'
                }`}
              />

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleQuickAddDays(90)}
                  className="btn-secondary px-2.5 py-2 text-xs"
                >
                  +90 dias
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddDays(180)}
                  className="btn-secondary px-2.5 py-2 text-xs"
                >
                  +180 dias
                </button>
              </div>
            </div>

            {isInvalidDate ? (
              <p role="alert" className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errorMessage}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Validades com mais de 30 dias à frente são classificadas com status "Em dia".
              </p>
            )}
          </div>

          {/* Substituir Arquivo */}
          <div>
            <label 
              htmlFor="doc-update-file" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
            >
              Substituir Arquivo Digitalizado (Simulação Local)
            </label>
            <div className="border border-dashed border-slate-300 dark:border-white/15 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors relative cursor-pointer">
              <input
                id="doc-update-file"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Selecionar arquivo digitalizado"
              />
              <UploadCloud className="w-7 h-7 mx-auto text-slate-400 mb-1" aria-hidden="true" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {simulatedFileName}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Tamanho: {simulatedFileSize} · Armazenado localmente
              </p>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label 
              htmlFor="doc-update-notes" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
            >
              Observações ou Protocolo
            </label>
            <textarea
              id="doc-update-notes"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Conta de consumo recente atestando endereço em Indaiatuba."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
            />
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2 text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isInvalidDate}
              className="btn-primary px-5 py-2 text-xs focus-ring"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Salvar e Atualizar Checklist</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
