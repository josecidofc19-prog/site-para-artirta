import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  FileSpreadsheet, 
  ClipboardList, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  LogOut, 
  Sparkles, 
  Plus, 
  RefreshCw, 
  Clock, 
  Layers, 
  X,
  Share2
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  signInWithGoogleWorkspace, 
  logoutGoogleWorkspace, 
  initAuth, 
  getAccessToken,
  createGoogleCalendarEvent,
  listGoogleCalendarEvents,
  createGoogleSheetBudget,
  listGoogleDriveSpreadsheets,
  createGoogleTeamIntakeForm,
  listGoogleDriveForms,
  getGoogleFormResponses,
  BudgetItemPayload
} from '../services/googleWorkspace';
import { useApp } from '../context/AppContext';

export const WorkspaceHub: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { grants, selectedGrantId, user: localUser, showToast } = useApp();

  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'sheets' | 'forms'>('calendar');

  // Estados de dados
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [spreadsheets, setSpreadsheets] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal de confirmação para ações de mutação (exigência obrigatória do Workspace)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: async () => {},
  });

  // Inicializa listener do Firebase Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, accessToken) => {
        setGoogleUser(user);
        setToken(accessToken);
      },
      () => {
        setGoogleUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Carrega dados quando autenticado
  useEffect(() => {
    if (token && isOpen) {
      loadWorkspaceData();
    }
  }, [token, isOpen, activeTab]);

  const loadWorkspaceData = async () => {
    setIsLoadingData(true);
    try {
      if (activeTab === 'calendar') {
        const events = await listGoogleCalendarEvents();
        setCalendarEvents(events);
      } else if (activeTab === 'sheets') {
        const sheetsList = await listGoogleDriveSpreadsheets();
        setSpreadsheets(sheetsList);
      } else if (activeTab === 'forms') {
        const formsList = await listGoogleDriveForms();
        setForms(formsList);
      }
    } catch (err: any) {
      console.warn('Aviso ao carregar dados do Workspace:', err?.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    try {
      const result = await signInWithGoogleWorkspace();
      setGoogleUser(result.user);
      setToken(result.accessToken);
      showToast(
        'Google Workspace Conectado!',
        `Autenticado como ${result.user.displayName || result.user.email} com acesso a Agenda, Planilhas e Formulários.`,
        'success'
      );
    } catch (err: any) {
      showToast(
        'Falha no Login',
        err?.message || 'Não foi possível completar o login com o Google.',
        'warning'
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGoogleWorkspace();
    setGoogleUser(null);
    setToken(null);
    setCalendarEvents([]);
    setSpreadsheets([]);
    setForms([]);
    showToast('Desconectado', 'Sua conta do Google Workspace foi desconectada.', 'info');
  };

  // 1. AÇÃO CALENDAR: Sincronizar Edital na Agenda
  const handleSyncGrantToCalendar = (grantTitle: string, deadlineStr: string, issuingBody: string) => {
    const deadlineDate = new Date(deadlineStr);
    const startDate = new Date(deadlineDate);
    startDate.setHours(deadlineDate.getHours() - 2);

    setConfirmDialog({
      isOpen: true,
      title: 'Adicionar Prazo ao Google Calendar?',
      description: `Esta ação criará um evento em sua agenda principal do Google Calendar intitulado "Prazo Final: ${grantTitle}", com lembretes automáticos 24h e 1h antes do encerramento.`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await createGoogleCalendarEvent({
            summary: `Prazo Final: ${grantTitle}`,
            description: `Encerramento do prazo de inscrições para o ${grantTitle} (${issuingBody}).\nOrganizado via Cultura em Cena.`,
            startDateTime: startDate.toISOString(),
            endDateTime: deadlineDate.toISOString(),
          });
          showToast(
            'Prazo Adicionado à Google Agenda!',
            `O evento foi criado em sua agenda principal do Google com lembretes automáticos.`,
            'success'
          );
          loadWorkspaceData();
        } catch (err: any) {
          showToast('Erro ao criar evento', err?.message || 'Falha na comunicação com o Google Calendar.', 'warning');
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  // 2. AÇÃO SHEETS: Criar Planilha Orçamentária
  const handleCreateBudgetSheet = () => {
    const mockBudgetItems: BudgetItemPayload[] = [
      { category: 'Cachês Artísticos', item: 'Apresentação Musical / Músicos Titulares (4 integrantes)', quantity: 1, unitValue: 12000, totalValue: 12000, notes: 'Cachê principal da banda' },
      { category: 'Cachês Artísticos', item: 'Técnico de Som e Mixagem ao Vivo', quantity: 1, unitValue: 2500, totalValue: 2500, notes: 'Operação de som em todos os concertos' },
      { category: 'Cachês Artísticos', item: 'Técnico de Iluminação Cênica', quantity: 1, unitValue: 1800, totalValue: 1800, notes: 'Montagem e operação de luz' },
      { category: 'Produção e Logística', item: 'Transporte de Instrumentos e Van para Equipe', quantity: 3, unitValue: 1200, totalValue: 3600, notes: 'Circulação em Indaiatuba e região' },
      { category: 'Produção e Logística', item: 'Alimentação / Diárias de Produção', quantity: 6, unitValue: 150, totalValue: 900, notes: 'Alimentação nos dias de ensaio e show' },
      { category: 'Comunicação e Design', item: 'Identidade Visual, Criação de Cartazes e Clipping', quantity: 1, unitValue: 2000, totalValue: 2000, notes: 'Divulgação oficial e registro' },
      { category: 'Serviços Administrativos', item: 'Assessoria Contábil e Prestação de Contas', quantity: 1, unitValue: 1500, totalValue: 1500, notes: 'Relatório final de conformidade' },
      { category: 'Acessibilidade Cultural', item: 'Intérprete de Libras para Apresentação Pública', quantity: 1, unitValue: 1200, totalValue: 1200, notes: 'Medida obrigatória de democratização' }
    ];

    setConfirmDialog({
      isOpen: true,
      title: 'Criar Planilha Orçamentária no Google Sheets?',
      description: 'Uma nova planilha formatada será criada em seu Google Drive com todas as rubricas orçamentárias detalhadas, fórmulas automáticas e plano de aplicação cultural.',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const result = await createGoogleSheetBudget(
            'Planilha Orçamentária Cultural',
            'Circulação Musical Banda Veludo Branco',
            mockBudgetItems
          );
          showToast(
            'Planilha Criada no Google Sheets!',
            `Sua planilha está pronta no Google Drive com ${mockBudgetItems.length} rubricas orçamentárias detalhadas.`,
            'success'
          );
          loadWorkspaceData();
          window.open(result.spreadsheetUrl, '_blank', 'noopener,noreferrer');
        } catch (err: any) {
          showToast('Erro ao criar planilha', err?.message || 'Falha ao conectar com o Google Sheets.', 'warning');
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  // 3. AÇÃO FORMS: Criar Formulário de Integrantes
  const handleCreateTeamForm = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Criar Formulário no Google Forms?',
      description: 'Será gerado um novo formulário em seu Google Drive configurado para coleta de dados de integrantes, termo de anuência da carta de representação e comprovação territorial em Indaiatuba e região.',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          const result = await createGoogleTeamIntakeForm(
            'Circulação Musical SP 2026',
            'Banda Veludo Branco'
          );
          showToast(
            'Formulário Criado no Google Forms!',
            `Formulário pronto para envio aos integrantes. As respostas serão armazenadas em seu Google Drive.`,
            'success'
          );
          loadWorkspaceData();
          window.open(result.editUri, '_blank', 'noopener,noreferrer');
        } catch (err: any) {
          showToast('Erro ao criar formulário', err?.message || 'Falha ao conectar com o Google Forms.', 'warning');
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="workspace-hub-title"
    >
      <div className="bg-[#FAF7F2] dark:bg-[#1A1A1E] text-[#1C1917] dark:text-[#F5F3EF] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E6E0D5] dark:border-white/10 overflow-hidden">
        
        {/* Cabeçalho */}
        <header className="p-5 sm:p-6 bg-white dark:bg-[#121214] border-b border-[#E6E0D5] dark:border-white/10 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 text-teal-700 dark:text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="workspace-hub-title" className="font-editorial text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-white leading-tight">
                  Google Workspace Cultural
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
                  Google 1P
                </span>
              </div>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-0.5">
                Sincronize prazos no Google Agenda, orçamentos no Google Planilhas e fichas no Google Formulários
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer"
            aria-label="Fechar painel do Google Workspace"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Faixa de Status de Conexão com Google */}
        <div className="px-5 sm:px-6 py-3.5 bg-white/70 dark:bg-[#161619] border-b border-[#E6E0D5] dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          {googleUser ? (
            <div className="flex items-center gap-3">
              {googleUser.photoURL ? (
                <img 
                  src={googleUser.photoURL} 
                  alt="" 
                  className="w-8 h-8 rounded-full border border-teal-500/30 shrink-0" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {googleUser.displayName?.charAt(0) || 'G'}
                </div>
              )}
              <div className="text-xs">
                <p className="font-bold text-[#1C1917] dark:text-white flex items-center gap-1.5">
                  <span>{googleUser.displayName || 'Usuário Google'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </p>
                <p className="text-[#78716C] dark:text-[#A8A29E] text-[11px]">{googleUser.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-[#A8A29E]">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Conecte sua conta Google para sincronizar com Google Calendar, Sheets e Forms com permissão de acesso.</span>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {googleUser ? (
              <button
                type="button"
                onClick={handleGoogleLogout}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E6E0D5] dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-[#57534E] dark:text-[#D6D3D1] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Desconectar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAuthenticating}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {/* Ícone oficial do Google */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isAuthenticating ? 'Conectando...' : 'Conectar Google Workspace'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navegação entre os 3 Serviços do Workspace */}
        <div className="flex border-b border-[#E6E0D5] dark:border-white/10 bg-white/40 dark:bg-black/10 px-5 sm:px-6 pt-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'border-teal-700 text-teal-800 dark:border-teal-400 dark:text-teal-300'
                : 'border-transparent text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Google Agenda (Prazos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-teal-700 text-teal-800 dark:border-teal-400 dark:text-teal-300'
                : 'border-transparent text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Google Planilhas (Orçamentos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('forms')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'forms'
                ? 'border-teal-700 text-teal-800 dark:border-teal-400 dark:text-teal-300'
                : 'border-transparent text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Google Formulários (Integrantes)</span>
          </button>
        </div>

        {/* Conteúdo da Aba */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* ================================================= */}
          {/* ABA 1: GOOGLE CALENDAR */}
          {/* ================================================= */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#242429] p-4.5 rounded-2xl border border-[#E6E0D5] dark:border-white/10">
                <div className="space-y-1">
                  <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] dark:text-white">
                    Sincronização de Prazos Culturais
                  </h3>
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                    Adicione os prazos oficiais de inscrição dos editais diretamente na sua Google Agenda com lembretes automáticos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadWorkspaceData}
                  disabled={!token || isLoadingData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#E6E0D5] dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer self-start sm:self-center"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
                  <span>Atualizar</span>
                </button>
              </div>

              {/* Lista de Editais Prontos para Sincronizar */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                  Editais Disponíveis para Sincronizar na Google Agenda
                </h4>
                <div className="grid gap-3">
                  {grants.slice(0, 3).map((grant) => (
                    <div 
                      key={grant.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#242429] border border-[#E6E0D5] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/20">
                            {grant.sphere}
                          </span>
                          <span className="text-xs text-[#78716C] dark:text-[#A8A29E]">{grant.issuingBody}</span>
                        </div>
                        <h5 className="font-editorial text-sm sm:text-base font-bold text-[#1C1917] dark:text-white">
                          {grant.title}
                        </h5>
                        <p className="text-xs text-[#78716C] dark:text-[#A8A29E] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Prazo final: {new Date(grant.deadlineDate).toLocaleDateString('pt-BR')} às 23:59</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSyncGrantToCalendar(grant.title, grant.deadlineDate, grant.issuingBody)}
                        disabled={!token || actionLoading}
                        className="btn-editorial-primary px-4 py-2 text-xs shrink-0 self-start sm:self-center"
                      >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Sincronizar na Agenda</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Próximos Eventos Cadastrados no Calendar */}
              {token && calendarEvents.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#E6E0D5] dark:border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                    Próximos Eventos da sua Google Agenda
                  </h4>
                  <div className="grid gap-2">
                    {calendarEvents.map((ev: any) => (
                      <div key={ev.id} className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-[#E6E0D5] dark:border-white/5 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#1C1917] dark:text-white">{ev.summary}</p>
                          <p className="text-[#78716C] dark:text-[#A8A29E]">
                            {ev.start?.dateTime ? new Date(ev.start.dateTime).toLocaleString('pt-BR') : 'Horário livre'}
                          </p>
                        </div>
                        {ev.htmlLink && (
                          <a 
                            href={ev.htmlLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-teal-700 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Abrir</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================= */}
          {/* ABA 2: GOOGLE SHEETS */}
          {/* ================================================= */}
          {activeTab === 'sheets' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#242429] p-5 rounded-2xl border border-[#E6E0D5] dark:border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] dark:text-white">
                      Exportador de Planilha Orçamentária para Google Sheets
                    </h3>
                    <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                      Gera uma planilha oficial no Google Sheets com todas as rubricas orçamentárias (cachês artísticos, equipe técnica, produção, transporte e prestação de contas) calculadas e formatadas conforme as exigências dos editais.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateBudgetSheet}
                    disabled={!token || actionLoading}
                    className="btn-editorial-primary px-5 py-2.5 text-xs sm:text-sm shrink-0 self-start sm:self-center"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Gerar Planilha no Sheets</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    A planilha inclui fórmulas de soma total, campos de justificativa de despesas e medidas obrigatórias de democratização (como Intérprete de Libras), eliminando erros comuns de cálculo em bancas avaliadoras.
                  </p>
                </div>
              </div>

              {/* Planilhas Existentes no Drive */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                  Planilhas Culturais no seu Google Drive
                </h4>
                {spreadsheets.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-[#E6E0D5] dark:border-white/10 text-center text-xs text-[#78716C] dark:text-[#A8A29E]">
                    {token 
                      ? 'Nenhuma planilha cultural identificada recentemente no seu Google Drive. Clique acima para gerar a sua primeira planilha orçamentária.'
                      : 'Conecte sua conta do Google para visualizar suas planilhas de projetos.'}
                  </div>
                ) : (
                  <div className="grid gap-2.5">
                    {spreadsheets.map((sheet: any) => (
                      <div 
                        key={sheet.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-[#242429] border border-[#E6E0D5] dark:border-white/10 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div>
                            <p className="font-bold text-[#1C1917] dark:text-white">{sheet.name}</p>
                            <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                              Criada em: {sheet.createdTime ? new Date(sheet.createdTime).toLocaleDateString('pt-BR') : 'Data não informada'}
                            </p>
                          </div>
                        </div>

                        {sheet.webViewLink && (
                          <a
                            href={sheet.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 hover:underline font-semibold"
                          >
                            <span>Abrir no Sheets</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* ABA 3: GOOGLE FORMS */}
          {/* ================================================= */}
          {activeTab === 'forms' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#242429] p-5 rounded-2xl border border-[#E6E0D5] dark:border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] dark:text-white">
                      Ficha de Integrantes e Anuência no Google Forms
                    </h3>
                    <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                      Cria automaticamente um formulário estruturado no Google Forms para coletar nome, função artística, telefone e termo de anuência formal dos integrantes de bandas ou coletivos culturais.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateTeamForm}
                    disabled={!token || actionLoading}
                    className="btn-editorial-primary px-5 py-2.5 text-xs sm:text-sm shrink-0 self-start sm:self-center"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>Criar Formulário no Forms</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-[#E6E0D5] dark:border-white/5">
                    <p className="font-bold text-[#1C1917] dark:text-white">1. Envie o Link</p>
                    <p className="text-[#78716C] dark:text-[#A8A29E] mt-0.5">Compartilhe o link do formulário no grupo de WhatsApp da banda.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-[#E6E0D5] dark:border-white/5">
                    <p className="font-bold text-[#1C1917] dark:text-white">2. Coleta de Anuência</p>
                    <p className="text-[#78716C] dark:text-[#A8A29E] mt-0.5">Cada membro declara concordância com a Carta de Representação.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-[#E6E0D5] dark:border-white/5">
                    <p className="font-bold text-[#1C1917] dark:text-white">3. Anexo no Checklist</p>
                    <p className="text-[#78716C] dark:text-[#A8A29E] mt-0.5">Exporte as respostas para comprovação documental do edital.</p>
                  </div>
                </div>
              </div>

              {/* Formulários Existentes no Drive */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                  Formulários Culturais no seu Google Drive
                </h4>
                {forms.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-[#E6E0D5] dark:border-white/10 text-center text-xs text-[#78716C] dark:text-[#A8A29E]">
                    {token 
                      ? 'Nenhum formulário cultural identificado no seu Google Drive. Clique no botão acima para criar sua primeira ficha de integrantes.'
                      : 'Conecte sua conta do Google para visualizar seus formulários de coleta.'}
                  </div>
                ) : (
                  <div className="grid gap-2.5">
                    {forms.map((formItem: any) => (
                      <div 
                        key={formItem.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-[#242429] border border-[#E6E0D5] dark:border-white/10 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <ClipboardList className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                          <div>
                            <p className="font-bold text-[#1C1917] dark:text-white">{formItem.name}</p>
                            <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                              Criado em: {formItem.createdTime ? new Date(formItem.createdTime).toLocaleDateString('pt-BR') : 'Data não informada'}
                            </p>
                          </div>
                        </div>

                        {formItem.webViewLink && (
                          <div className="flex items-center gap-3">
                            <a
                              href={formItem.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 hover:underline font-semibold"
                            >
                              <span>Editar no Forms</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Rodapé com Fechamento */}
        <footer className="p-4 bg-white dark:bg-[#121214] border-t border-[#E6E0D5] dark:border-white/10 flex items-center justify-between text-xs text-[#78716C] dark:text-[#A8A29E] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>APIs Oficiais Google Calendar v3, Sheets v4 e Forms v1</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-4 py-2 text-xs"
          >
            Fechar
          </button>
        </footer>

      </div>

      {/* Modal de Confirmação para Operações com Escrita no Google Workspace */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div 
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
          >
            <div className="bg-white dark:bg-[#1A1A1E] text-[#1C1917] dark:text-[#F5F3EF] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E6E0D5] dark:border-white/10 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                </div>
                <div className="space-y-1">
                  <h3 id="confirm-dialog-title" className="font-editorial text-lg font-bold text-[#1C1917] dark:text-white">
                    {confirmDialog.title}
                  </h3>
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E] leading-relaxed">
                    {confirmDialog.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E6E0D5] dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                  disabled={actionLoading}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await confirmDialog.onConfirm();
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                  }}
                  disabled={actionLoading}
                  className="btn-editorial-primary px-4 py-2 text-xs"
                >
                  {actionLoading ? 'Processando...' : 'Confirmar e Criar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
