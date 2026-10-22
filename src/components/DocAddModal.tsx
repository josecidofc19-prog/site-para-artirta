import React, { useState, useEffect } from 'react';
import { X, Plus, UploadCloud, AlertCircle, AlertTriangle, FolderPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCivilDaysRemaining } from '../data/defaultVault';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

interface DocAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocAddModal: React.FC<DocAddModalProps> = ({ isOpen, onClose }) => {
  const { addVaultDocument, grants, selectedGrantId, user, selectedProfile } = useApp();

  const activeGrant = grants.find(g => g.id === selectedGrantId) || grants[0];
  const activeProfileType = user?.profileType || selectedProfile;

  // Exigências obrigatórias do edital ativo para este perfil
  const activeRequirements = activeGrant.requiredDocuments.filter(
    req => req.appliesToProfiles.includes(activeProfileType)
  );

  const defaultFutureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 180);
    return d.toISOString().split('T')[0];
  };

  const [name, setName] = useState('');
  const [selectedReqId, setSelectedReqId] = useState<string>('');
  const [category, setCategory] = useState<'identificacao' | 'juridico' | 'artistico' | 'financeiro_fiscal'>('identificacao');
  const [hasExpiry, setHasExpiry] = useState(true);
  const [expiryDate, setExpiryDate] = useState(defaultFutureDate);
  const [notes, setNotes] = useState('');
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [simulatedFileSize, setSimulatedFileSize] = useState('1.1 MB');
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setName('');
    setSelectedReqId('');
    setCategory('identificacao');
    setHasExpiry(true);
    setExpiryDate(defaultFutureDate());
    setNotes('');
    setSimulatedFileName('');
    setSimulatedFileSize('1.1 MB');
    setErrorMessage('');
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const modalRef = useModalAccessibility(isOpen, handleClose, '#doc-add-name');

  if (!isOpen) return null;

  const validateExpiry = (dateStr: string) => {
    if (!hasExpiry) {
      setErrorMessage('');
      return true;
    }
    const days = getCivilDaysRemaining(dateStr);
    if (days === null || days < 0) {
      setErrorMessage('Escolha uma data futura para o vencimento do documento');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleReqSelect = (reqId: string) => {
    setSelectedReqId(reqId);
    if (reqId) {
      const found = activeRequirements.find(r => r.id === reqId);
      if (found) {
        setName(found.name);
        setCategory(found.category);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setSimulatedFileName(f.name);
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      setSimulatedFileSize(`${sizeMB} MB`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('Informe o nome do documento');
      return;
    }

    if (hasExpiry && !validateExpiry(expiryDate)) {
      return;
    }

    addVaultDocument({
      name: name.trim(),
      category,
      expiryDate: hasExpiry ? `${expiryDate}T23:59:59Z` : null,
      notes: notes.trim(),
      requirementId: selectedReqId || undefined,
      fileName: simulatedFileName || 'documento.pdf',
      fileSize: simulatedFileSize,
      fileType: 'pdf',
      addedDate: new Date().toISOString(),
    });

    handleClose();
  };

  const isInvalidDate = hasExpiry && Boolean(errorMessage);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-add-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-white/10 relative my-8"
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl focus-ring min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Fechar formulário de documento"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="space-y-1.5 mb-6 pr-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono">
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Novo Registro no Cofre</span>
          </div>
          <h2 id="doc-add-title" className="text-xl sm:text-2xl font-bold tracking-tight">
            Adicionar Documento ao Cofre
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Cadastre comprovantes ou certidões para vincular automaticamente aos editais preparados.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vincular a Requisito do Edital Ativo */}
          {activeRequirements.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-500/20">
              <label 
                htmlFor="doc-add-req-select" 
                className="block text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300 mb-1"
              >
                Vincular à exigência de "{activeGrant.title.slice(0, 35)}..."
              </label>
              <select
                id="doc-add-req-select"
                value={selectedReqId}
                onChange={e => handleReqSelect(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring"
              >
                <option value="">Nenhum (Documento Geral / Avulso)</option>
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
              htmlFor="doc-add-name" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
            >
              Nome do Documento *
            </label>
            <input
              id="doc-add-name"
              type="text"
              required
              placeholder="Ex: Comprovante de Residência Atualizado"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
            />
          </div>

          {/* Categoria */}
          <div>
            <label 
              htmlFor="doc-add-cat" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
            >
              Categoria do Documento *
            </label>
            <select
              id="doc-add-cat"
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring"
            >
              <option value="identificacao">Identificação / Residência</option>
              <option value="juridico">Jurídico / Representação</option>
              <option value="artistico">Artístico / Portfólio</option>
              <option value="financeiro_fiscal">Fiscal / Tributário / CNDs</option>
            </select>
          </div>

          {/* Validade */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="doc-add-has-expiry" 
                className="text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Possui Data de Validade?
              </label>
              <input
                id="doc-add-has-expiry"
                type="checkbox"
                checked={hasExpiry}
                onChange={e => setHasExpiry(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus-ring cursor-pointer"
              />
            </div>

            {hasExpiry && (
              <div>
                <input
                  id="doc-add-expiry-input"
                  type="date"
                  required={hasExpiry}
                  value={expiryDate}
                  onChange={e => {
                    const val = e.target.value;
                    setExpiryDate(val);
                    validateExpiry(val);
                  }}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring font-mono ${
                    isInvalidDate ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-white/10'
                  }`}
                />

                {isInvalidDate && (
                  <p role="alert" className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Arquivo Digitalizado */}
          <div>
            <label 
              htmlFor="doc-add-file" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
            >
              Arquivo Digitalizado (Simulação Local)
            </label>
            <div className="border border-dashed border-slate-300 dark:border-white/15 rounded-2xl p-4 text-center relative cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <input
                id="doc-add-file"
                type="file"
                accept=".pdf,.png,.jpg"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Selecionar arquivo digitalizado"
              />
              <UploadCloud className="w-7 h-7 mx-auto text-slate-400 mb-1" aria-hidden="true" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {simulatedFileName || 'Clique ou arraste um PDF ou imagem'}
              </p>
              {simulatedFileName && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Tamanho: {simulatedFileSize}
                </p>
              )}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label 
              htmlFor="doc-add-notes" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
            >
              Observações
            </label>
            <textarea
              id="doc-add-notes"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Informações adicionais sobre o documento..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
            />
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary px-4 py-2 text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isInvalidDate}
              className="btn-primary px-5 py-2 text-xs focus-ring"
            >
              Adicionar ao cofre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
