import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Inicialização segura do Firebase App (singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Escopos configurados para Google Sheets, Google Calendar, Google Forms e Google Drive
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/forms.responses.readonly',
];

const provider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach(scope => provider.addScope(scope));

// Cache em memória do access token (NUNCA em localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: FirebaseUser, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (!isSigningIn) {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogleWorkspace = async (): Promise<{ user: FirebaseUser; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Falha ao obter o token de acesso do Google Workspace.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Erro na autenticação com Google Workspace:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogleWorkspace = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// ==========================================
// 1. GOOGLE CALENDAR API INTEGRATION
// ==========================================

export interface CalendarEventPayload {
  summary: string;
  description: string;
  startDateTime: string; // ISO String
  endDateTime: string;   // ISO String
  location?: string;
}

export const listGoogleCalendarEvents = async () => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado no Google Workspace');

  const now = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=15&singleEvents=true&orderBy=startTime`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao buscar eventos do Google Calendar');
  }

  const data = await res.json();
  return data.items || [];
};

export const createGoogleCalendarEvent = async (event: CalendarEventPayload) => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado no Google Workspace');

  const payload = {
    summary: event.summary,
    description: event.description,
    location: event.location || 'Indaiatuba, SP',
    start: {
      dateTime: event.startDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: event.endDateTime,
      timeZone: 'America/Sao_Paulo',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 24 * 60 }, // 1 dia antes
        { method: 'popup', minutes: 60 },      // 1 hora antes
      ],
    },
  };

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao criar evento no Google Calendar');
  }

  return await res.json();
};

// ==========================================
// 2. GOOGLE SHEETS API INTEGRATION
// ==========================================

export interface BudgetItemPayload {
  category: string;
  item: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  notes?: string;
}

export const createGoogleSheetBudget = async (
  title: string, 
  projectName: string,
  items: BudgetItemPayload[]
) => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado no Google Workspace');

  // 1. Cria a planilha com metadados estruturados
  const createPayload = {
    properties: {
      title: `${title} - ${projectName} (Cultura em Cena)`,
    },
    sheets: [
      {
        properties: {
          title: 'Planilha Orçamentária',
          gridProperties: {
            rowCount: items.length + 10,
            columnCount: 6,
            frozenRowCount: 4,
          },
        },
      },
    ],
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao criar nova planilha no Google Sheets');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;

  // 2. Popula os valores do orçamento
  const totalBudget = items.reduce((sum, item) => sum + item.totalValue, 0);

  const values = [
    ['PLANO DE TRABALHO E PLANILHA ORÇAMENTÁRIA CULTURAL', '', '', '', ''],
    [`Projeto: ${projectName}`, '', '', '', `Gerado via Cultura em Cena em ${new Date().toLocaleDateString('pt-BR')}`],
    ['', '', '', '', ''],
    ['Categoria', 'Descrição do Item / Despesa', 'Qtd', 'Valor Unitário (R$)', 'Valor Total (R$)', 'Observações'],
    ...items.map(item => [
      item.category,
      item.item,
      item.quantity,
      item.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      item.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      item.notes || 'Conforme plano de aplicação'
    ]),
    ['', '', '', 'TOTAL DO PROJETO:', totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 }), '']
  ];

  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Planilha Orçamentária'!A1:F${values.length}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao preencher dados na planilha do Google Sheets');
  }

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    title: createPayload.properties.title
  };
};

export const listGoogleDriveSpreadsheets = async () => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado no Google Workspace');

  const q = "mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false";
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&pageSize=10&fields=files(id,name,webViewLink,createdTime,modifiedTime)`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao listar planilhas do Google Drive');
  }

  const data = await res.json();
  return data.files || [];
};

// ==========================================
// 3. GOOGLE FORMS API INTEGRATION
// ==========================================

export const createGoogleTeamIntakeForm = async (
  projectName: string,
  groupName: string
) => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado no Google Workspace');

  // 1. Cria o formulário inicial
  const createFormPayload = {
    info: {
      title: `Ficha de Integrantes e Anuência — ${projectName}`,
      documentTitle: `Formulário de Integrantes - ${groupName}`,
    },
  };

  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createFormPayload),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao criar formulário no Google Forms');
  }

  const formData = await createRes.json();
  const formId = formData.formId;

  // 2. Adiciona as perguntas essenciais usando batchUpdate
  const batchUpdatePayload = {
    includeFormInResponse: true,
    requests: [
      {
        updateFormInfo: {
          info: {
            description: `Formulário oficial do coletivo/banda "${groupName}" para coleta de dados de habilitação e termos de anuência exigidos pelos editais culturais de Indaiatuba e região. Preenchido de forma segura via Google Workspace.`,
          },
          updateMask: 'description',
        },
      },
      {
        createItem: {
          item: {
            title: 'Nome Completo do Integrante / Artista',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: false },
              },
            },
          },
          location: { index: 0 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Função Artística no Projeto (ex: Voz, Guitarra, Iluminação, Produção)',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: false },
              },
            },
          },
          location: { index: 1 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Telefone com WhatsApp para contato',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: false },
              },
            },
          },
          location: { index: 2 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Município de Residência e Comprovação Territorial',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Indaiatuba - SP (comprovante há mais de 1 ano)' },
                    { value: 'Indaiatuba - SP (menos de 1 ano)' },
                    { value: 'Outro município da Região Metropolitana de Campinas (RMC)' },
                    { value: 'Outro município do Estado de SP' }
                  ],
                },
              },
            },
          },
          location: { index: 3 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Declaro concordância integral com a Carta de Representação do grupo e autorizo o uso de imagem para fins de prestação de contas do edital.',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'CHECKBOX',
                  options: [
                    { value: 'Sim, concordo e autorizo a representação formal.' }
                  ],
                },
              },
            },
          },
          location: { index: 4 },
        },
      },
    ],
  };

  const safeFormId = encodeURIComponent(formId.trim());
  const updateRes = await fetch(`https://forms.googleapis.com/v1/forms/${safeFormId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batchUpdatePayload),
  });

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao configurar as perguntas no Google Forms');
  }

  const updatedFormData = await updateRes.json();

  return {
    formId,
    responderUri: formData.responderUri || `https://docs.google.com/forms/d/${formId}/viewform`,
    editUri: `https://docs.google.com/forms/d/${formId}/edit`,
    title: formData.info?.title || createFormPayload.info.title,
  };
};

export const listGoogleDriveForms = async () => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado no Google Workspace');

  const q = "mimeType = 'application/vnd.google-apps.form' and trashed = false";
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&pageSize=10&fields=files(id,name,webViewLink,createdTime,modifiedTime)`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao listar formulários do Google Drive');
  }

  const data = await res.json();
  return data.files || [];
};

export const getGoogleFormResponses = async (formId: string) => {
  const token = await getAccessToken();
  if (!token) throw new Error('Não autenticado no Google Workspace');

  const safeFormId = encodeURIComponent(formId.trim());
  const url = `https://forms.googleapis.com/v1/forms/${safeFormId}/responses`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao buscar respostas do formulário');
  }

  const data = await res.json();
  return data.responses || [];
};
