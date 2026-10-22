import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  AlertCircle, 
  FileText, 
  HelpCircle, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Grant, VaultDocument } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isOfflineExample?: boolean;
  timestamp: string;
}

const MAX_MESSAGES_PER_SESSION = 15;
const STORAGE_CHAT_KEY = 'cultura_em_cena_assistant_chat_v1';
const STORAGE_COUNT_KEY = 'cultura_em_cena_assistant_count_v1';

const SUGGESTED_QUESTIONS = [
  'O que falta no meu checklist?',
  'Esse edital serve para o meu grupo?',
  'Quais certidões do cofre precisam de renovação?',
  'Qual é o prazo do edital de música aberto?'
];

export const CulturalAssistant: React.FC = () => {
  const { 
    grants, 
    vaultDocuments, 
    activeApplication, 
    selectedProfile, 
    selectedGrantId,
    user 
  } = useApp();

  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [messageCount, setMessageCount] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_COUNT_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback to initial
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        text: 'Olá! Sou o Assistente Cultural do Cultura em Cena. Posso orientar você sobre os editais cadastrados, a situação dos documentos no seu cofre e o checklist da sua inscrição.\n\nComo posso ajudar hoje?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Verifica disponibilidade do serviço de IA ao montar ou abrir
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/assistant/status');
        if (res.ok) {
          const data = await res.json();
          setApiAvailable(Boolean(data.available));
        } else {
          setApiAvailable(false);
        }
      } catch {
        setApiAvailable(false);
      }
    }
    checkStatus();
  }, [isOpen]);

  // Salva no sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
      sessionStorage.setItem(STORAGE_COUNT_KEY, messageCount.toString());
    } catch {
      // ignore
    }
  }, [messages, messageCount]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Foco no input ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Encontrar o edital atualmente em foco
  const activeGrant = grants.find(g => g.id === (activeApplication?.grantId || selectedGrantId)) || grants[0];

  // Gerador de resposta offline para o modo de contingência
  const generateOfflineFallbackResponse = (query: string): string => {
    const q = query.toLowerCase().trim();
    const isDemo = activeGrant?.verificationStatus === 'demo' || activeGrant?.noticeType === 'simulado';
    const isForecast = activeGrant?.verificationStatus === 'forecast' || activeGrant?.noticeType === 'previsao_anual';
    const warningPrefix = isDemo 
      ? 'Aviso de Modelo Didático: Este edital é uma simulação didática educativa e não representa uma oportunidade oficial confirmada.\n\n'
      : isForecast 
        ? 'Aviso de Previsão Histórica: Este edital é uma estimativa baseada em ciclos regulares sem garantia de abertura.\n\n'
        : '';

    // 1. Pergunta sobre o Checklist
    if (q.includes('checklist') || q.includes('falta') || q.includes('etapa') || q.includes('progresso')) {
      const expiredDoc = vaultDocuments.find(d => d.status === 'vencido');
      const docName = expiredDoc ? expiredDoc.name : 'Certidão Negativa de Tributos Mobiliários';
      const grantName = activeGrant ? activeGrant.title : 'Edital de Circulação Musical SP 2026';

      return `${warningPrefix}O que o edital informa:
Conforme o ${grantName}, Seção: Documentos e Habilitação, são exigidos todos os comprovantes de representação e certidões negativas válidas na data do envio.

Sugestão de preparação:
No seu checklist atual para este edital (progresso em 60%):
• Pendência crítica: A "${docName}" no seu cofre está vencida. É necessário emitir uma nova certidão e atualizá-la no cofre para avançar.
• Restam concluir as etapas de "Proposta Artística e Cronograma" e a "Revisão Final" antes da simulação de submissão.`;
    }

    // 2. Pergunta sobre elegibilidade do grupo / perfil
    if (q.includes('serve') || q.includes('grupo') || q.includes('banda') || q.includes('perfil') || q.includes('coletivo') || q.includes('elegiv')) {
      const grantName = activeGrant ? activeGrant.title : 'Edital de Circulação Musical SP 2026';

      return `${warningPrefix}O que o edital informa:
No ${grantName}, Seção: Condições de Elegibilidade e Participação, é permitida a inscrição de grupos e bandas musicais com representação formal por pessoa física integrante do grupo ou por pessoa jurídica (MEI/Produtora).

Sugestão de preparação:
Como o seu perfil atual na plataforma é "${selectedProfile === 'banda_grupo' ? 'Banda ou Grupo' : selectedProfile}", o edital é compatível com a sua formação. Certifique-se de anexar a "Declaração de Representação do Grupo" assinada por todos os integrantes.`;
    }

    // 3. Pergunta sobre certidões / cofre
    if (q.includes('certid') || q.includes('cofre') || q.includes('validade') || q.includes('venc')) {
      const expiredDocs = vaultDocuments.filter(d => d.status === 'vencido');
      const warningDocs = vaultDocuments.filter(d => d.status === 'vence_breve');

      return `O que os registros do cofre indicam:
• Documentos vencidos: ${expiredDocs.length > 0 ? expiredDocs.map(d => `"${d.name}" (Validade expirada)`).join(', ') : 'Nenhum documento vencido.'}
• Vencendo em breve: ${warningDocs.length > 0 ? warningDocs.map(d => `"${d.name}"`).join(', ') : 'Nenhum documento em período de atenção.'}

Sugestão de preparação:
Renove certidões municipais e federais com antecedência através dos links oficiais dos portais emissores antes de fechar a proposta final.`;
    }

    // 4. Pergunta sobre prazo do edital
    if (q.includes('prazo') || q.includes('data') || q.includes('quando encerra') || q.includes('aberto')) {
      const grantName = activeGrant ? activeGrant.title : 'Edital cadastrado';
      return `${warningPrefix}O que o edital informa:
No ${grantName}, Seção: Cronograma de Inscrições, o período de inscrições está vigente com encerramento previsto para ${activeGrant?.deadlineDate ? new Date(activeGrant.deadlineDate).toLocaleDateString('pt-BR') : 'os próximos dias'} no portal do órgão emissor (${activeGrant?.issuingBody || 'Secretaria da Cultura'}).

Sugestão de preparação:
Consulte a página oficial para verificar eventuais comunicados de prorrogação ou retificação.`;
    }

    // 5. Fallback padrão estrito
    return `Não consigo confirmar essa informação nos dados oficiais cadastrados deste edital. Recomendo consultar a página oficial do órgão emissor.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawMessage = (textToSend || inputMessage).trim();
    if (!rawMessage || isLoading) return;

    if (messageCount >= MAX_MESSAGES_PER_SESSION) {
      setErrorMessage(`Você atingiu o limite de ${MAX_MESSAGES_PER_SESSION} mensagens por sessão de visitante.`);
      return;
    }

    setErrorMessage(null);
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: rawMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setMessageCount(c => c + 1);
    setIsLoading(true);

    // Preparar contexto seguro (sem dados sensíveis como CPF ou arquivos)
    const contextPayload = {
      userProfile: selectedProfile,
      userName: user?.name || 'Lucas',
      activeGrant: activeGrant ? {
        title: activeGrant.title,
        issuingBody: activeGrant.issuingBody,
        sphere: activeGrant.sphere,
        artisticArea: activeGrant.artisticArea,
        noticeType: activeGrant.noticeType,
        verificationStatus: activeGrant.verificationStatus,
        officialDocument: activeGrant.officialDocument,
        lastVerifiedAt: activeGrant.lastVerifiedAt,
        rectifications: activeGrant.rectifications,
        summary: activeGrant.summary,
        deadlineDate: activeGrant.deadlineDate,
        eligibility: [activeGrant.eligiblePublic, ...(activeGrant.restrictions || [])],
        requiredDocuments: activeGrant.requiredDocuments.map(r => ({
          name: r.name,
          category: r.category,
          mandatory: r.mandatory,
        })),
        scoringCriteria: (activeGrant.evaluationCriteria || []).map(s => ({
          title: s.title,
          weight: s.weight,
          description: s.description,
        })),
        officialUrl: activeGrant.officialUrl,
      } : undefined,
      vaultDocumentsSummary: vaultDocuments.map(d => ({
        name: d.name,
        category: d.category,
        status: d.status,
        expiryDate: d.expiryDate,
      })),
      checklistSummary: activeApplication ? {
        grantTitle: activeGrant?.title || 'Edital em preparação',
        progress: activeApplication.progressPercentage,
        completedSteps: activeApplication.steps.filter(s => s.isCompleted).length,
        totalSteps: activeApplication.steps.length,
        currentStepName: activeApplication.steps.find(s => !s.isCompleted)?.title || 'Concluído',
        pendingRequirements: activeApplication.steps
          .filter(s => !s.isCompleted)
          .map(s => s.title),
      } : undefined,
      grantsSummary: grants.slice(0, 6).map(g => ({
        id: g.id,
        title: g.title,
        sphere: g.sphere,
        artisticArea: g.artisticArea,
        noticeType: g.noticeType,
        deadlineDate: g.deadlineDate,
        issuingBody: g.issuingBody,
      })),
    };

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: rawMessage,
          history: messages.slice(-6).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            text: m.text,
          })),
          context: contextPayload,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        const errData = await response.json().catch(() => ({}));
        
        // Se a chave não estiver configurada no servidor ou se o assistente estiver indisponível
        if (response.status === 503 || errData.unavailable) {
          setApiAvailable(false);
          // Modo demonstração: gera resposta offline explicada
          const fallbackText = generateOfflineFallbackResponse(rawMessage);
          const assistantMsg: ChatMessage = {
            id: `bot-fallback-${Date.now()}`,
            role: 'assistant',
            text: fallbackText,
            isOfflineExample: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, assistantMsg]);
        } else {
          // Erro de rede ou temporário: provê resposta educativa offline da demo
          const fallbackText = generateOfflineFallbackResponse(rawMessage);
          const assistantMsg: ChatMessage = {
            id: `bot-fallback-${Date.now()}`,
            role: 'assistant',
            text: fallbackText,
            isOfflineExample: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, assistantMsg]);
        }
      }
    } catch {
      // Se o endpoint não responder, aciona a resposta offline da demonstração
      const fallbackText = generateOfflineFallbackResponse(rawMessage);
      const assistantMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        text: fallbackText,
        isOfflineExample: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const initialMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      text: 'Conversa reiniciada. Em que posso orientar você sobre editais, seu cofre ou checklist?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialMsg]);
    setMessageCount(0);
    setErrorMessage(null);
    try {
      sessionStorage.removeItem(STORAGE_CHAT_KEY);
      sessionStorage.removeItem(STORAGE_COUNT_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Botão Flutuante (Posicionado logo acima do WhatsApp) */}
      <div 
        className="fixed bottom-20 sm:bottom-22 right-4 sm:right-6 z-40 flex flex-col items-end pointer-events-none"
        role="region"
        aria-label="Assistente Cultural do Cultura em Cena"
      >
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Fechar assistente cultural' : 'Abrir assistente cultural tira-dúvidas'}
          aria-expanded={isOpen}
          whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          className="pointer-events-auto group inline-flex items-center gap-2.5 px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-full bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-red-950/20 dark:shadow-black/50 border border-red-500/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#121214] cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-200 fill-amber-200/40 shrink-0" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#991B1B]" />
          </div>
          <span className="tracking-tight whitespace-nowrap">Assistente Cultural</span>
        </motion.button>
      </div>

      {/* Painel de Conversa Flutuante */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="assistant-panel-title"
            className="fixed bottom-36 sm:bottom-38 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[620px] h-[560px] flex flex-col rounded-3xl bg-[#FAF7F2] dark:bg-[#1A1A1E] text-[#1C1917] dark:text-[#F5F3EF] border border-[#E6E0D5] dark:border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Cabeçalho */}
            <header className="p-4 bg-white dark:bg-[#121214] border-b border-[#E6E0D5] dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#991B1B] dark:text-[#E4806F]" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="assistant-panel-title" className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] dark:text-white leading-tight">
                    Assistente Cultural
                  </h2>
                  <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Consulta baseada em editais e cofre</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Limpar conversa"
                  className="p-2 rounded-xl text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
                  aria-label="Limpar conversa"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Fechar"
                  className="p-2 rounded-xl text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
                  aria-label="Fechar painel do assistente"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Aviso se o serviço de IA estiver sem chave configurada */}
            {apiAvailable === false && (
              <div 
                className="px-3.5 py-2 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2"
                role="status"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
                  <span className="leading-tight">Assistente em modo simulação offline.</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-200/50 dark:bg-amber-400/20">
                  Demo
                </span>
              </div>
            )}

            {/* Área de Mensagens */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-[#991B1B] text-white rounded-br-xs'
                        : 'bg-white dark:bg-[#242429] text-[#1C1917] dark:text-[#F5F3EF] border border-[#E6E0D5] dark:border-white/10 rounded-bl-xs'
                    }`}
                  >
                    {/* Badge se for exemplo offline */}
                    {msg.isOfflineExample && (
                      <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-400/15 text-amber-900 dark:text-amber-200 font-bold text-[10px] uppercase tracking-wider">
                        <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>Resposta de exemplo (assistente offline)</span>
                      </div>
                    )}

                    <div className="whitespace-pre-line space-y-1">
                      {msg.text}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#A8A29E] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Indicador de carregamento */}
              {isLoading && (
                <div className="flex flex-col items-start" aria-live="polite">
                  <div className="max-w-[88%] rounded-2xl p-3.5 bg-white dark:bg-[#242429] border border-[#E6E0D5] dark:border-white/10 rounded-bl-xs flex items-center gap-2">
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-[#991B1B] animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-[#991B1B] animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-[#991B1B] animate-bounce" />
                    </div>
                    <span className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                      Consultando editais e checklist...
                    </span>
                  </div>
                </div>
              )}

              {/* Erro */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-800 dark:text-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sugestões de Perguntas Rápidas */}
            <div className="px-3.5 py-2 bg-white/60 dark:bg-[#121214]/60 border-t border-[#E6E0D5] dark:border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1.5">
                Perguntas frequentes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    disabled={isLoading || messageCount >= MAX_MESSAGES_PER_SESSION}
                    onClick={() => handleSendMessage(question)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#242429] text-[#57534E] dark:text-[#D6D3D1] hover:text-[#991B1B] dark:hover:text-[#E4806F] border border-[#E6E0D5] dark:border-white/10 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Campo de Envio */}
            <footer className="p-3.5 bg-white dark:bg-[#121214] border-t border-[#E6E0D5] dark:border-white/10 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <label htmlFor="assistant-input-msg" className="sr-only">
                  Mensagem para o assistente cultural
                </label>
                <input
                  id="assistant-input-msg"
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  disabled={isLoading || messageCount >= MAX_MESSAGES_PER_SESSION}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    messageCount >= MAX_MESSAGES_PER_SESSION
                      ? 'Limite de mensagens atingido'
                      : 'Pergunte sobre editais, prazos ou cofre...'
                  }
                  className="flex-1 min-h-[42px] px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#CFC7B8] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#1A1A1E] text-[#1C1917] dark:text-white placeholder:text-[#A8A29E] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim() || messageCount >= MAX_MESSAGES_PER_SESSION}
                  className="min-h-[42px] px-3.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-40 cursor-pointer shadow-xs"
                  aria-label="Enviar mensagem"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-[#78716C] dark:text-[#A8A29E] px-1">
                <span>Consulta restrita a editais cadastrados</span>
                <span>
                  {MAX_MESSAGES_PER_SESSION - messageCount} de {MAX_MESSAGES_PER_SESSION} mensagens
                </span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
