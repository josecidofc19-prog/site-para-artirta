import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  User, 
  Grant, 
  VaultDocument, 
  Application, 
  ArtistProfileType, 
  PreparationStep,
  StepId,
  DemoToast,
  DocumentStatus,
  HistoricalSubmission,
  AppView,
  ProjectDraft
} from '../types';
import { getMockGrants } from '../data/mockGrants';
import { 
  LUCAS_DEMO_USER, 
  getDefaultLucasDocuments, 
  getDefaultLucasApplication, 
  calculateDocumentStatus,
  findDocForRequirement 
} from '../data/defaultVault';

export type { AppView };

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: User | null;
  selectedProfile: ArtistProfileType;
  setSelectedProfile: (profile: ArtistProfileType) => void;
  grants: Grant[];
  selectedGrantId: string | null;
  setSelectedGrantId: (id: string | null) => void;
  vaultDocuments: VaultDocument[];
  activeApplication: Application | null;
  historicalSubmissions: HistoricalSubmission[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  prepModalOpen: boolean;
  setPrepModalOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  workspaceModalOpen: boolean;
  setWorkspaceModalOpen: (open: boolean) => void;
  showWorkspaceButton: boolean;
  setShowWorkspaceButton: (show: boolean) => void;
  showDemoGrants: boolean;
  setShowDemoGrants: (show: boolean) => void;
  toast: DemoToast | null;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  
  // Rascunho de Projeto
  projectDraft: ProjectDraft;
  updateProjectDraft: (updates: Partial<ProjectDraft>) => void;
  updateUserProfile: (updates: Partial<User>) => void;

  // Ações de Negócio
  loginAsLucas: () => void;
  logout: () => void;
  registerSimulatedUser: (user: Omit<User, 'id'>) => void;
  startPreparationForGrant: (grantId: string) => void;
  updateVaultDocument: (id: string, updates: Partial<VaultDocument>) => void;
  addVaultDocument: (newDoc: Omit<VaultDocument, 'id' | 'status'>) => void;
  removeVaultDocument: (id: string) => void;
  toggleChecklistStep: (stepId: StepId) => void;
  submitApplicationForReview: () => void;
  resetDemoToInitialState: () => void;
  clearAllLocalStorage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'cultura_em_cena_theme',
  USER: 'cultura_em_cena_user',
  PROFILE: 'cultura_em_cena_profile',
  VAULT: 'cultura_em_cena_vault',
  APPLICATION: 'cultura_em_cena_application',
  GRANT_ID: 'cultura_em_cena_grant_id',
};

const INITIAL_HISTORICAL_SUBMISSIONS: HistoricalSubmission[] = [
  {
    id: 'sub-hist-1',
    grantTitle: 'Edital ProAC Direto — Música Popular Instrumental 2025',
    year: 2025,
    value: 40000,
    status: 'aprovado',
    technicalScore: 94.5,
    category: 'Música',
    feedback: 'Dossiê completo, planilha orçamentária equilibrada e excelente comprovação de apresentações públicas.',
  },
  {
    id: 'sub-hist-2',
    grantTitle: 'Prêmio Nelson Rodrigues de Montagens (Participação em Trilha Sonora)',
    year: 2025,
    value: 15000,
    status: 'aprovado',
    technicalScore: 91.0,
    category: 'Música/Teatro',
    feedback: 'Composição de arranjos inéditos para o espetáculo aprovada com louvor na banca técnica.',
  },
  {
    id: 'sub-hist-3',
    grantTitle: 'Edital Municipal de Festivais de Inverno de Campinas 2024',
    year: 2024,
    value: 20000,
    status: 'suplente',
    technicalScore: 86.0,
    category: 'Música',
    feedback: 'Projeto bem avaliado, figurou no quadro de suplência imediata por empate técnico de pontuação territorial.',
  },
  {
    id: 'sub-hist-4',
    grantTitle: 'Chamamento Emergencial de Circulação Musical 2024',
    year: 2024,
    value: 25000,
    status: 'nao_selecionado',
    technicalScore: 72.0,
    category: 'Música',
    feedback: 'Pendência documental na certidão de endereço e portfólio sem links verificáveis na data da homologação.',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light';
    } catch {
      return 'light';
    }
  });

  // User state (Visitante novo inicia limpo sem perfil de Lucas pré-carregado)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });

  // Selected Profile
  const [selectedProfile, setSelectedProfileState] = useState<ArtistProfileType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE) as ArtistProfileType;
      if (saved) return saved;
      return 'artista_solo';
    } catch {
      return 'artista_solo';
    }
  });

  // Grants catalog
  const [grants] = useState<Grant[]>(() => getMockGrants());

  // Selected grant
  const [selectedGrantId, setSelectedGrantIdState] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GRANT_ID);
      return saved || 'edital-cidades-criativas-pequenas';
    } catch {
      return 'edital-cidades-criativas-pequenas';
    }
  });

  // Vault documents (Visitante novo inicia com cofre vazio)
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VAULT);
      if (saved) {
        const parsed: VaultDocument[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(doc => {
            let requirementId = doc.requirementId;
            if (!requirementId) {
              if (doc.id === 'doc-lucas-1') requirementId = 'doc-req-rep';
              else if (doc.id === 'doc-lucas-2') requirementId = 'doc-req-integrantes';
              else if (doc.id === 'doc-lucas-3') requirementId = 'doc-req-residencia';
            }

            const currentStatus = calculateDocumentStatus(doc.expiryDate);

            return {
              ...doc,
              requirementId,
              fileName: doc.fileName || `${doc.name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30)}.pdf`,
              fileSize: doc.fileSize || '1.0 MB',
              status: currentStatus,
            };
          });
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Application checklist (Visitante novo inicia sem inscrição pré-iniciada)
  const [activeApplication, setActiveApplication] = useState<Application | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATION);
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });

  const [historicalSubmissions] = useState<HistoricalSubmission[]>(INITIAL_HISTORICAL_SUBMISSIONS);

  // Navigation & UI states
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [prepModalOpen, setPrepModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState<boolean>(false);
  const [showWorkspaceButton, setShowWorkspaceButton] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cultura_show_workspace_btn');
      return saved === 'true'; // false por padrão para atender à remoção solicitada
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cultura_show_workspace_btn', String(showWorkspaceButton));
    } catch (e) {
      console.warn('Erro ao salvar configuração do botão workspace:', e);
    }
  }, [showWorkspaceButton]);

  // Modelos didáticos ocultos por padrão, ativáveis apenas por opção explícita
  const [showDemoGrants, setShowDemoGrants] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cultura_show_demo_grants');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cultura_show_demo_grants', String(showDemoGrants));
    } catch (e) {
      console.warn('Erro ao salvar configuração de modelos demo:', e);
    }
  }, [showDemoGrants]);

  const [toast, setToast] = useState<DemoToast | null>(null);
  const [assistantOpen, setAssistantOpen] = useState<boolean>(false);

  // Rascunho persistido do formulário de projeto
  const [projectDraft, setProjectDraft] = useState<ProjectDraft>(() => {
    try {
      const saved = localStorage.getItem('cultura_em_cena_draft');
      return saved ? JSON.parse(saved) : { identificacao: '', objetivos: '', publico: '', execucao: '', orcamento: '', stepAtual: 1 };
    } catch {
      return { identificacao: '', objetivos: '', publico: '', execucao: '', orcamento: '', stepAtual: 1 };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cultura_em_cena_draft', JSON.stringify(projectDraft));
    } catch (e) {
      console.warn('Erro ao salvar rascunho:', e);
    }
  }, [projectDraft]);

  const updateProjectDraft = useCallback((updates: Partial<ProjectDraft>) => {
    setProjectDraft(prev => ({ ...prev, ...updates }));
  }, []);

  // Sincronização do tema no HTML
  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn('Erro ao salvar tema:', e);
    }
  }, [theme]);

  // Persistência com integridade
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.warn('Erro ao persistir usuário:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, selectedProfile);
    } catch (e) {
      console.warn('Erro ao persistir perfil:', e);
    }
  }, [selectedProfile]);

  useEffect(() => {
    try {
      if (selectedGrantId) {
        localStorage.setItem(STORAGE_KEYS.GRANT_ID, selectedGrantId);
      }
    } catch (e) {
      console.warn('Erro ao persistir edital selecionado:', e);
    }
  }, [selectedGrantId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VAULT, JSON.stringify(vaultDocuments));
    } catch (e) {
      console.warn('Erro ao persistir cofre:', e);
    }
  }, [vaultDocuments]);

  useEffect(() => {
    try {
      if (activeApplication) {
        localStorage.setItem(STORAGE_KEYS.APPLICATION, JSON.stringify(activeApplication));
      }
    } catch (e) {
      console.warn('Erro ao persistir aplicação:', e);
    }
  }, [activeApplication]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setSelectedProfile = useCallback((profile: ArtistProfileType) => {
    setSelectedProfileState(profile);
    if (user) {
      setUser(prev => (prev ? { ...prev, profileType: profile } : null));
    }
  }, [user]);

  const setSelectedGrantId = useCallback((id: string | null) => {
    setSelectedGrantIdState(id);
  }, []);

  const showToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const newToast: DemoToast = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      timestamp: Date.now(),
    };
    setToast(newToast);

    setTimeout(() => {
      setToast(current => (current?.id === newToast.id ? null : current));
    }, 4500);
  }, []);

  const updateUserProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
    showToast('Perfil atualizado', 'Suas configurações foram salvas.', 'success');
  }, [showToast]);

  /**
   * REAVALIAÇÃO DE REQUISITOS DA INSCRIÇÃO:
   * Utiliza findDocForRequirement estritamente por ID!
   * Sem comparação por aproximação de nomes ou substring.
   */
  const evaluateApplicationProgress = useCallback((
    currentApp: Application, 
    documents: VaultDocument[],
    allGrants: Grant[]
  ): Application => {
    const grant = allGrants.find(g => g.id === currentApp.grantId);
    if (!grant) return currentApp;

    // Exigências obrigatórias para o perfil
    const mandatoryRequirements = grant.requiredDocuments.filter(
      doc => doc.mandatory && doc.appliesToProfiles.includes(currentApp.profileType)
    );

    let allMandatoryValid = true;

    if (mandatoryRequirements.length === 0) {
      allMandatoryValid = true;
    } else {
      for (const req of mandatoryRequirements) {
        // Encontra o documento vinculado pelo ID da exigência
        const linkedDoc = findDocForRequirement(req, documents);

        // Se não houver documento vinculado à exigência, etapa não é atendida
        if (!linkedDoc) {
          allMandatoryValid = false;
          break;
        }

        // Se o documento vinculado estiver vencido hoje, etapa não é atendida
        const status = calculateDocumentStatus(linkedDoc.expiryDate);
        if (status === 'vencido') {
          allMandatoryValid = false;
          break;
        }
      }
    }

    const updatedSteps = currentApp.steps.map(step => {
      if (step.id === 'documentos') {
        return {
          ...step,
          isCompleted: allMandatoryValid,
          lastUpdated: new Date().toISOString(),
        };
      }
      return step;
    });

    const completedCount = updatedSteps.filter(s => s.isCompleted).length;
    const progressPercentage = completedCount * 20;

    return {
      ...currentApp,
      steps: updatedSteps,
      progressPercentage,
      updatedAt: new Date().toISOString(),
    };
  }, []);

  /**
   * ATUALIZAÇÃO DE DOCUMENTO DO COFRE (DocUpdateModal):
   * Preserva requirementId, atualiza addedDate, fileName, fileSize,
   * recalcula status dinamicamente e atualiza imediatamente o checklist.
   */
  const updateVaultDocument = useCallback((id: string, updates: Partial<VaultDocument>) => {
    setVaultDocuments(prevDocs => {
      const updatedDocs = prevDocs.map(doc => {
        if (doc.id === id) {
          const newExpiry = updates.expiryDate !== undefined ? updates.expiryDate : doc.expiryDate;
          const newStatus = calculateDocumentStatus(newExpiry);
          return {
            ...doc,
            ...updates,
            // Preserva requirementId original caso não venha no updates
            requirementId: updates.requirementId !== undefined ? updates.requirementId : doc.requirementId,
            expiryDate: newExpiry,
            status: newStatus,
            addedDate: updates.addedDate || new Date().toISOString(),
            fileName: updates.fileName || doc.fileName,
            fileSize: updates.fileSize || doc.fileSize,
          };
        }
        return doc;
      });

      // Reavaliação imediata da aplicação ativa
      setActiveApplication(prevApp => {
        if (!prevApp) return null;
        const prevDocStepCompleted = prevApp.steps.find(s => s.id === 'documentos')?.isCompleted;
        const newApp = evaluateApplicationProgress(prevApp, updatedDocs, grants);
        const newDocStepCompleted = newApp.steps.find(s => s.id === 'documentos')?.isCompleted;

        // Feedback visual do avanço 60% -> 80%
        if (!prevDocStepCompleted && newDocStepCompleted) {
          showToast(
            'Documento atualizado. Etapa concluída!',
            `A exigência foi validada com sucesso e a etapa "Separar documentos" avançou para concluída (+20% de progresso)!`,
            'success'
          );
        } else {
          showToast(
            'Documento atualizado',
            'As informações e a validade do documento foram salvas no cofre.',
            'info'
          );
        }

        return newApp;
      });

      return updatedDocs;
    });
  }, [evaluateApplicationProgress, grants, showToast]);

  const addVaultDocument = useCallback((newDocData: Omit<VaultDocument, 'id' | 'status'>) => {
    const status = calculateDocumentStatus(newDocData.expiryDate);
    const newDoc: VaultDocument = {
      ...newDocData,
      id: `doc-custom-${Date.now()}`,
      status,
      addedDate: newDocData.addedDate || new Date().toISOString(),
    };

    setVaultDocuments(prev => {
      const updated = [newDoc, ...prev];
      setActiveApplication(prevApp => {
        if (!prevApp) return null;
        return evaluateApplicationProgress(prevApp, updated, grants);
      });
      return updated;
    });

    showToast('Documento adicionado', `${newDoc.name} registrado no cofre local.`, 'success');
  }, [evaluateApplicationProgress, grants, showToast]);

  const removeVaultDocument = useCallback((id: string) => {
    setVaultDocuments(prev => {
      const updated = prev.filter(d => d.id !== id);
      setActiveApplication(prevApp => {
        if (!prevApp) return null;
        return evaluateApplicationProgress(prevApp, updated, grants);
      });
      return updated;
    });
    showToast('Documento removido', 'O item foi retirado do seu cofre local.', 'info');
  }, [evaluateApplicationProgress, grants, showToast]);

  const toggleChecklistStep = useCallback((stepId: StepId) => {
    setActiveApplication(prevApp => {
      if (!prevApp) return null;

      if (stepId === 'documentos') {
        showToast(
          'Etapa avaliada por documentos',
          'Esta etapa depende exclusivamente da validade dos documentos obrigatórios vinculados no cofre.',
          'info'
        );
        return prevApp;
      }

      const updatedSteps = prevApp.steps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            isCompleted: !step.isCompleted,
            lastUpdated: new Date().toISOString(),
          };
        }
        return step;
      });

      const completedCount = updatedSteps.filter(s => s.isCompleted).length;
      const progressPercentage = completedCount * 20;

      const newApp = {
        ...prevApp,
        steps: updatedSteps,
        progressPercentage,
        updatedAt: new Date().toISOString(),
      };

      showToast(
        'Checklist atualizado',
        `Progresso ajustado para ${progressPercentage}%.`,
        'info'
      );

      return newApp;
    });
  }, [showToast]);

  const submitApplicationForReview = useCallback(() => {
    setActiveApplication(prevApp => {
      if (!prevApp) return null;

      const updatedSteps = prevApp.steps.map(step => {
        if (step.id === 'envio') {
          return {
            ...step,
            isCompleted: true,
            lastUpdated: new Date().toISOString(),
          };
        }
        return step;
      });

      const completedCount = updatedSteps.filter(s => s.isCompleted).length;
      const progressPercentage = completedCount * 20;

      showToast(
        'Dossiê enviado para revisão simulada!',
        'Sua inscrição foi submetida internamente. Nenhum dado foi enviado a órgãos oficiais externos.',
        'success'
      );

      return {
        ...prevApp,
        steps: updatedSteps,
        progressPercentage,
        status: 'revisao_solicitada',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  }, [showToast]);

  const loginAsLucas = useCallback(() => {
    setUser(LUCAS_DEMO_USER);
    setSelectedProfileState('banda_grupo');
    setSelectedGrantIdState('edital-circulacao-musical-sp');
    const lucasDocs = getDefaultLucasDocuments();
    const lucasApp = getDefaultLucasApplication();
    setVaultDocuments(lucasDocs);
    setActiveApplication(lucasApp);
    setPrepModalOpen(false);
    setAuthModalOpen(false);
    setShowDemoGrants(true); // Permite visualizar o edital didático de Lucas

    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(LUCAS_DEMO_USER));
      localStorage.setItem(STORAGE_KEYS.PROFILE, 'banda_grupo');
      localStorage.setItem(STORAGE_KEYS.GRANT_ID, 'edital-circulacao-musical-sp');
      localStorage.setItem(STORAGE_KEYS.VAULT, JSON.stringify(lucasDocs));
      localStorage.setItem(STORAGE_KEYS.APPLICATION, JSON.stringify(lucasApp));
      localStorage.setItem('cultura_show_demo_grants', 'true');
    } catch (e) {
      console.warn('Erro ao salvar demonstração no localStorage:', e);
    }

    setCurrentView('checklist');

    showToast(
      'Demonstração carregada: Lucas',
      'Conta de Lucas ativada (Banda Veludo Branco) com checklist em 60% e comprovante de endereço vencido para teste prático.',
      'success'
    );
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setVaultDocuments([]);
    setActiveApplication(null);
    setSelectedProfileState('artista_solo');
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.VAULT);
      localStorage.removeItem(STORAGE_KEYS.APPLICATION);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    } catch {
      // ignore
    }
    setCurrentView('home');
    showToast('Sessão encerrada', 'Você retornou ao modo visitante sem perfil carregado.', 'info');
  }, [showToast]);

  const registerSimulatedUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      isDemo: false,
    };
    setUser(newUser);
    setSelectedProfileState(newUser.profileType);
    setPrepModalOpen(false);
    setAuthModalOpen(false);

    if (selectedGrantId) {
      setCurrentView('checklist');
    } else {
      setCurrentView('catalog');
    }

    showToast(
      'Cadastro simulado concluído!',
      `Bem-vindo(a), ${newUser.name}! Continuando a preparação com seu perfil.`,
      'success'
    );
  }, [selectedGrantId, showToast]);

  const startPreparationForGrant = useCallback((grantId: string) => {
    setSelectedGrantIdState(grantId);

    if (!user) {
      setPrepModalOpen(true);
      return;
    }

    if (user.id === LUCAS_DEMO_USER.id && grantId === 'edital-circulacao-musical-sp') {
      if (!activeApplication || activeApplication.grantId !== grantId) {
        setActiveApplication(getDefaultLucasApplication());
      }
    } else {
      const newApp: Application = {
        id: `app-${Date.now()}`,
        grantId,
        userId: user.id,
        profileType: user.profileType,
        status: 'em_preparacao',
        steps: [
          { id: 'requisitos', title: '1. Conferir requisitos', description: 'Revisão das regras de elegibilidade e restrições.', isCompleted: true, isAutoCalculated: false },
          { id: 'documentos', title: '2. Separar documentos', description: 'Conferência de todos os documentos obrigatórios vinculados ao edital.', isCompleted: false, isAutoCalculated: true },
          { id: 'portfolio', title: '3. Preparar portfólio', description: 'Reunião de trabalhos anteriores e links artísticos.', isCompleted: false, isAutoCalculated: false },
          { id: 'projeto', title: '4. Elaborar projeto', description: 'Redação da proposta cultural e planilha orçamentária.', isCompleted: false, isAutoCalculated: false },
          { id: 'envio', title: '5. Enviar inscrição', description: 'Revisão e envio do pacote para avaliação.', isCompleted: false, isAutoCalculated: false },
        ],
        progressPercentage: 20,
        updatedAt: new Date().toISOString(),
      };
      const evaluated = evaluateApplicationProgress(newApp, vaultDocuments, grants);
      setActiveApplication(evaluated);
    }

    setCurrentView('checklist');
  }, [user, activeApplication, vaultDocuments, grants, evaluateApplicationProgress]);

  /**
   * REINICIAR DEMONSTRAÇÃO:
   * Restaura com exatidão o cenário fixo e reproduzível de Lucas (60% inicial e comprovante vencido).
   * Preserva documentos customizados de outros usuários caso existam.
   */
  const resetDemoToInitialState = useCallback(() => {
    setUser(LUCAS_DEMO_USER);
    setSelectedProfileState('banda_grupo');
    setSelectedGrantIdState('edital-circulacao-musical-sp');

    // Restaura os 3 documentos originais de Lucas preservando eventuais documentos customizados criados por outros perfis
    setVaultDocuments(prev => {
      const customNonLucasDocs = prev.filter(d => !d.id.startsWith('doc-lucas-'));
      return [...getDefaultLucasDocuments(), ...customNonLucasDocs];
    });

    setActiveApplication(getDefaultLucasApplication());
    setSearchTerm('');
    setPrepModalOpen(false);
    setAuthModalOpen(false);

    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(LUCAS_DEMO_USER));
      localStorage.setItem(STORAGE_KEYS.PROFILE, 'banda_grupo');
      localStorage.setItem(STORAGE_KEYS.GRANT_ID, 'edital-circulacao-musical-sp');
      localStorage.setItem(STORAGE_KEYS.APPLICATION, JSON.stringify(getDefaultLucasApplication()));
    } catch (e) {
      console.warn('Erro ao restaurar demo:', e);
    }

    showToast(
      'Demonstração reiniciada',
      'Cenário inicial do Lucas restaurado (exatamente 60% e comprovante vencido pronto para teste).',
      'info'
    );
  }, [showToast]);

  const clearAllLocalStorage = useCallback(() => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Erro ao limpar localStorage:', e);
    }
    setUser(null);
    setSelectedProfileState('artista_solo');
    setVaultDocuments([]);
    setActiveApplication(null);
    setShowDemoGrants(false);
    setProjectDraft({ identificacao: '', objetivos: '', publico: '', execucao: '', orcamento: '', stepAtual: 1 });
    setCurrentView('home');
    showToast('Dados locais excluídos', 'O armazenamento do navegador foi limpo com sucesso.', 'info');
  }, [showToast]);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    user,
    selectedProfile,
    setSelectedProfile,
    grants,
    selectedGrantId,
    setSelectedGrantId,
    vaultDocuments,
    activeApplication,
    historicalSubmissions,
    searchTerm,
    setSearchTerm,
    currentView,
    setCurrentView,
    prepModalOpen,
    setPrepModalOpen,
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    workspaceModalOpen,
    setWorkspaceModalOpen,
    showWorkspaceButton,
    setShowWorkspaceButton,
    showDemoGrants,
    setShowDemoGrants,
    toast,
    showToast,
    assistantOpen,
    setAssistantOpen,
    projectDraft,
    updateProjectDraft,
    updateUserProfile,
    loginAsLucas,
    logout,
    registerSimulatedUser,
    startPreparationForGrant,
    updateVaultDocument,
    addVaultDocument,
    removeVaultDocument,
    toggleChecklistStep,
    submitApplicationForReview,
    resetDemoToInitialState,
    clearAllLocalStorage,
  }), [
    theme,
    toggleTheme,
    user,
    selectedProfile,
    setSelectedProfile,
    grants,
    selectedGrantId,
    setSelectedGrantId,
    vaultDocuments,
    activeApplication,
    historicalSubmissions,
    searchTerm,
    currentView,
    prepModalOpen,
    authModalOpen,
    authModalMode,
    workspaceModalOpen,
    showWorkspaceButton,
    setShowWorkspaceButton,
    showDemoGrants,
    setShowDemoGrants,
    toast,
    showToast,
    assistantOpen,
    setAssistantOpen,
    projectDraft,
    updateProjectDraft,
    updateUserProfile,
    loginAsLucas,
    logout,
    registerSimulatedUser,
    startPreparationForGrant,
    updateVaultDocument,
    addVaultDocument,
    removeVaultDocument,
    toggleChecklistStep,
    submitApplicationForReview,
    resetDemoToInitialState,
    clearAllLocalStorage,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
