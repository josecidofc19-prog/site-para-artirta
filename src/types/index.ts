/**
 * Tipos centrais da plataforma Cultura em Cena
 */

export type ArtistProfileType = 
  | 'artista_solo' 
  | 'banda_grupo' 
  | 'coletivo_cultural' 
  | 'produtor_cultural';

export type ArtisticArea = 
  | 'Música' 
  | 'Teatro' 
  | 'Dança' 
  | 'Artes Visuais' 
  | 'Literatura' 
  | 'Audiovisual' 
  | 'Circo' 
  | 'Patrimônio Cultural';

export type Sphere = 'Municipal' | 'Estadual' | 'Federal';

export type LegalEligibility = 'pf' | 'mei' | 'empresa' | 'coletivo';

export interface GrantDocumentRequirement {
  id: string;
  name: string;
  category: 'identificacao' | 'juridico' | 'artistico' | 'financeiro_fiscal';
  mandatory: boolean;
  appliesToProfiles: ArtistProfileType[];
  description: string;
}

export type VerificationStatus = 
  | 'verified' 
  | 'pending_verification' 
  | 'forecast' 
  | 'demo';

export interface Grant {
  id: string;
  title: string;
  issuingBody: string;
  sphere: Sphere;
  city?: string;
  state: string;
  maxCityPopulation?: number; // Ex: 50.000 hab
  eligibleProfiles: ArtistProfileType[];
  eligibleLegal: LegalEligibility[];
  artisticArea: ArtisticArea;
  grantValue: number; // Ex: 45000 (R$ 45.000,00)
  totalBudgetFormatted: string; // Ex: "R$ 450.000,00 total"
  publishedDate: string; // ISO String
  deadlineDate: string; // ISO String (data oficial fixa para oportunidades reais)
  summary: string;
  description: string;
  objective: string;
  eligiblePublic: string;
  restrictions: string[];
  evaluationCriteria: { title: string; weight: number; description: string }[];
  requiredDocuments: GrantDocumentRequirement[];
  officialUrl?: string | null;
  officialSource?: string;
  officialDocument?: string; // Nome ou número do documento oficial (DOE, MinC, etc.)
  lastVerifiedAt?: string; // Data ISO da última checagem oficial
  rectifications?: string[]; // Retificações ou comunicados oficiais
  verificationStatus: VerificationStatus;
  noticeType?: 'real' | 'simulado' | 'previsao_anual';
  annualQuarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  cyclePeriod?: string; // Ex: "Março a Maio", "Fluxo Contínuo"
  isFictitiousNotice: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileType: ArtistProfileType;
  city: string;
  artisticArea: ArtisticArea;
  isDemo?: boolean;
}

export type DocumentStatus = 'em_dia' | 'vence_breve' | 'vencido';

export interface VaultDocument {
  id: string;
  name: string;
  category: 'identificacao' | 'juridico' | 'artistico' | 'financeiro_fiscal';
  fileType: string;
  fileSize: string;
  addedDate: string; // ISO String
  expiryDate: string | null; // ISO String or null if permanent (e.g. portfolio)
  status: DocumentStatus; // Computed or explicit
  notes?: string;
  requirementId?: string; // Vínculo estrito com GrantDocumentRequirement.id
  fileName?: string; // Nome real do arquivo digitalizado
}

export type StepId = 'requisitos' | 'documentos' | 'portfolio' | 'projeto' | 'envio';

export interface PreparationStep {
  id: StepId;
  title: string;
  description: string;
  isCompleted: boolean;
  isAutoCalculated: boolean; // Step 2 (Separar documentos) is calculated from required docs in vault
  lastUpdated?: string;
}

export interface Application {
  id: string;
  grantId: string;
  userId: string;
  profileType: ArtistProfileType;
  steps: PreparationStep[];
  progressPercentage: number;
  status: 'em_preparacao' | 'revisao_solicitada' | 'enviada_simulada';
  submittedAt?: string;
  updatedAt: string;
}

export interface DemoToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: number;
}

export interface HistoricalSubmission {
  id: string;
  grantTitle: string;
  year: number;
  value: number;
  status: 'aprovado' | 'suplente' | 'em_analise' | 'nao_selecionado';
  technicalScore: number;
  category: string;
  feedback: string;
}

export interface OpportunityRecommendation {
  grant: Grant;
  matchScore: number; // 0-100%
  matchReasons: string[];
  urgencyLevel: 'alta' | 'media' | 'planejada';
}

export type AppView = 
  | 'home' 
  | 'catalog' 
  | 'grant_detail' 
  | 'vault' 
  | 'checklist' 
  | 'dashboard' 
  | 'login' 
  | 'register' 
  | 'guia' 
  | 'apoio' 
  | 'como_funciona' 
  | 'formulario_projeto' 
  | 'perfil'
  | 'calendario'
  | 'empresas'
  | 'organizacoes_publicas'
  | 'eligibilidade';

export interface ProjectDraft {
  identificacao: string;
  objetivos: string;
  publico: string;
  execucao: string;
  orcamento: string;
  stepAtual: number;
}

