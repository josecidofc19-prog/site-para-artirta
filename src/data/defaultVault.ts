import { VaultDocument, DocumentStatus, User, Application } from '../types';

/**
 * Interpreta uma data (ISO ou AAAA-MM-DD) como data civil no fuso local.
 * Se o formato for YYYY-MM-DD, extrai ano, mês e dia e define o fim do dia civil: 23:59:59.999.
 * Se for ISO string completa, extrai a parte da data YYYY-MM-DD para garantir interpretação civil.
 */
export function parseCivilExpiryDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== 'string' || !dateStr.trim()) {
    return null;
  }
  
  const trimmed = dateStr.trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 0-indexed
    const day = parseInt(match[3], 10);
    
    // Validar se os componentes de data são válidos (ex: dia 31 em mês de 30 dias)
    const testDate = new Date(year, month, day);
    if (testDate.getFullYear() !== year || testDate.getMonth() !== month || testDate.getDate() !== day) {
      return null;
    }
    // Fim do dia civil local (23:59:59.999)
    return new Date(year, month, day, 23, 59, 59, 999);
  }

  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) {
    return null;
  }
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 23, 59, 59, 999);
}

/**
 * Calcula a diferença em dias civis inteiros entre hoje e a data de validade.
 * Hoje é 0h00 do dia local atual.
 */
export function getCivilDaysRemaining(expiryDate: string | null | undefined): number | null {
  if (expiryDate === null || expiryDate === undefined || expiryDate === '') {
    return null;
  }
  const expiryCivil = parseCivilExpiryDate(expiryDate);
  if (!expiryCivil) return null;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const expiryDayStart = new Date(expiryCivil.getFullYear(), expiryCivil.getMonth(), expiryCivil.getDate(), 0, 0, 0, 0);

  const diffMs = expiryDayStart.getTime() - todayStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (expiryCivil.getTime() < todayStart.getTime()) {
    return diffDays < 0 ? diffDays : -1;
  }
  return diffDays;
}

/**
 * Avalia o status de um documento com base exclusivamente na data de validade atual
 * Regras:
 * - Sem validade (null/undefined): 'em_dia' (documentos permanentes)
 * - Data inválida: 'vencido'
 * - Validade anterior a hoje: 'vencido' (ex: vencido ontem -> 'vencido')
 * - Validade vence hoje ou em até 30 dias (0 <= diffDays <= 30): 'vence_breve'
 * - Validade superior a 30 dias (diffDays > 30): 'em_dia'
 */
export function calculateDocumentStatus(expiryDate: string | null | undefined): DocumentStatus {
  if (expiryDate === null || expiryDate === undefined || expiryDate === '') {
    return 'em_dia';
  }

  const expiryCivil = parseCivilExpiryDate(expiryDate);
  if (!expiryCivil) {
    return 'vencido';
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  if (expiryCivil.getTime() < todayStart.getTime()) {
    return 'vencido';
  }

  const daysRemaining = getCivilDaysRemaining(expiryDate);
  if (daysRemaining === null || daysRemaining < 0) {
    return 'vencido';
  }

  if (daysRemaining <= 30) {
    return 'vence_breve';
  }

  return 'em_dia';
}

/**
 * Formata data no padrão dd/mm para alertas
 */
export function formatDayMonth(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = parseCivilExpiryDate(dateStr);
  if (!d) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

/**
 * Verifica se um documento obrigatório vence antes do encerramento das inscrições do edital selecionado.
 * Retorna true apenas se o documento ainda estiver válido hoje, mas sua data de expiração for anterior à do edital.
 */
export function isExpiringBeforeGrantDeadline(
  docExpiryDate: string | null | undefined,
  grantDeadlineDate: string | null | undefined
): boolean {
  if (!docExpiryDate || !grantDeadlineDate) return false;

  const currentStatus = calculateDocumentStatus(docExpiryDate);
  if (currentStatus === 'vencido') return false; // Se já está vencido, é erro crítico regular

  const docExpiryCivil = parseCivilExpiryDate(docExpiryDate);
  const grantDeadlineCivil = parseCivilExpiryDate(grantDeadlineDate);
  if (!docExpiryCivil || !grantDeadlineCivil) return false;

  return docExpiryCivil.getTime() < grantDeadlineCivil.getTime();
}

/**
 * Função reutilizável obrigatória: findDocForRequirement(req, docs)
 * 1. Considera apenas documentos cujo requirementId corresponda exatamente a req.id.
 * 2. Dá preferência a um documento que esteja válido (calculateDocumentStatus !== 'vencido').
 * 3. Se todos os vinculados estiverem vencidos, retorna o primeiro vinculado para exibir qual precisa de renovação.
 * 4. Retorna undefined se não houver documento vinculado.
 */
export function findDocForRequirement(
  req: { id: string }, 
  docs: VaultDocument[]
): VaultDocument | undefined {
  if (!req || !req.id || !docs || !Array.isArray(docs)) {
    return undefined;
  }

  const linkedDocs = docs.filter(d => d.requirementId === req.id);
  if (linkedDocs.length === 0) {
    return undefined;
  }

  // Preferência por documento válido
  const validDoc = linkedDocs.find(d => calculateDocumentStatus(d.expiryDate) !== 'vencido');
  if (validDoc) {
    return validDoc;
  }

  // Se todos estiverem vencidos, retorna o primeiro para a interface permitir a renovação
  return linkedDocs[0];
}

function createDateOffset(days: number): string {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, 23, 59, 59);
  return target.toISOString();
}

function createPastDateOffset(days: number): string {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days, 23, 59, 59);
  return target.toISOString();
}

/**
 * Usuário padrão da demonstração acadêmica
 */
export const LUCAS_DEMO_USER: User = {
  id: 'user-lucas-demo',
  name: 'Lucas',
  email: 'lucas.musica@exemplo-demo.org',
  profileType: 'banda_grupo',
  city: 'Indaiatuba',
  artisticArea: 'Música',
  isDemo: true,
};

/**
 * Cofre inicial de documentos do Lucas com vínculos explícitos por ID:
 * 1. Em dia (+180 dias) -> Vinculado a 'doc-req-rep'
 * 2. Vence em 12 dias (+12 dias) -> Vinculado a 'doc-req-integrantes'
 * 3. Vencido (-15 dias) -> Vinculado a 'doc-req-residencia'
 */
export function getDefaultLucasDocuments(): VaultDocument[] {
  return [
    {
      id: 'doc-lucas-1',
      requirementId: 'doc-req-rep',
      name: 'Carta de Representação do Grupo e Responsável',
      category: 'juridico',
      fileName: 'carta_representacao_lucas_banda.pdf',
      fileType: 'PDF',
      fileSize: '1.2 MB',
      addedDate: createPastDateOffset(60),
      expiryDate: createDateOffset(180), // Em dia (> 30 dias)
      status: 'em_dia',
      notes: 'Assinada por todos os integrantes com poderes de representação formal.',
    },
    {
      id: 'doc-lucas-2',
      requirementId: 'doc-req-integrantes',
      name: 'Lista e Anuência dos Integrantes da Banda',
      category: 'juridico',
      fileName: 'lista_anuencia_integrantes_2026.pdf',
      fileType: 'PDF',
      fileSize: '840 KB',
      addedDate: createPastDateOffset(45),
      expiryDate: createDateOffset(12), // Vence em 12 dias (alerta amarelo)
      status: 'vence_breve',
      notes: 'Declaração semestral assinada pelos músicos com contato e cachê.',
    },
    {
      id: 'doc-lucas-3',
      requirementId: 'doc-req-residencia',
      name: 'Comprovante de Residência e Sede do Grupo (Indaiatuba)',
      category: 'identificacao',
      fileName: 'comprovante_residencia_antigo.pdf',
      fileType: 'PDF',
      fileSize: '620 KB',
      addedDate: createPastDateOffset(120),
      expiryDate: createPastDateOffset(15), // Vencido há 15 dias! (alerta vermelho)
      status: 'vencido',
      notes: 'Conta de consumo da sede de ensaio em Indaiatuba com prazo expirado de 90 dias.',
    },
  ];
}

/**
 * Aplicação inicial do Lucas para o Edital Principal:
 * "Edital de Circulação Musical Interior Paulista 2026"
 * 
 * Estado inicial do checklist:
 * - Conferir requisitos: Concluída (20%)
 * - Separar documentos: Pendente (0% - pois doc-lucas-3 está vencido!)
 * - Preparar portfólio: Concluída (20%)
 * - Elaborar projeto: Concluída (20%)
 * - Enviar inscrição: Pendente (0%)
 * Total: exatamente 60%!
 */
export function getDefaultLucasApplication(): Application {
  return {
    id: 'app-lucas-circulacao-musical',
    grantId: 'edital-circulacao-musical-sp',
    userId: 'user-lucas-demo',
    profileType: 'banda_grupo',
    status: 'em_preparacao',
    steps: [
      {
        id: 'requisitos',
        title: '1. Conferir requisitos',
        description: 'Revisão das regras de elegibilidade, restrições e adequação do perfil artístico.',
        isCompleted: true,
        isAutoCalculated: false,
        lastUpdated: createPastDateOffset(3),
      },
      {
        id: 'documentos',
        title: '2. Separar documentos',
        description: 'Conferência de todos os documentos obrigatórios do cofre vinculados ao edital.',
        isCompleted: false, // Inicia pendente pelo doc vencido!
        isAutoCalculated: true,
      },
      {
        id: 'portfolio',
        title: '3. Preparar portfólio',
        description: 'Seleção de repertório autoral, links de gravações ao vivo e histórico de shows.',
        isCompleted: true,
        isAutoCalculated: false,
        lastUpdated: createPastDateOffset(2),
      },
      {
        id: 'projeto',
        title: '4. Elaborar projeto',
        description: 'Redação da justificativa, plano de circulação pelas cidades e cronograma.',
        isCompleted: true,
        isAutoCalculated: false,
        lastUpdated: createPastDateOffset(1),
      },
      {
        id: 'envio',
        title: '5. Enviar inscrição',
        description: 'Revisão geral do pacote de inscrição e envio formal do dossiê para avaliação.',
        isCompleted: false,
        isAutoCalculated: false,
      },
    ],
    progressPercentage: 60, // Exatamente 60% inicial!
    updatedAt: new Date().toISOString(),
  };
}
