import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Carrega variáveis de ambiente locais caso disponíveis
  try {
    const p = process as any;
    if (typeof p.loadEnvFile === 'function') {
      const envLocal = path.resolve(__dirname, '.env.local');
      const envMain = path.resolve(__dirname, '.env');
      if (fs.existsSync(envLocal)) {
        p.loadEnvFile(envLocal);
      } else if (fs.existsSync(envMain)) {
        p.loadEnvFile(envMain);
      }
    }
  } catch {
    // Silently continue if environment already provided by container
  }

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const hasDist = fs.existsSync(path.resolve(__dirname, 'dist', 'index.html'));
  const isExplicitStart = process.env.npm_lifecycle_event === 'start';
  const isExplicitDev = process.env.npm_lifecycle_event === 'dev';
  const isDev = !isExplicitStart && (isExplicitDev || process.env.NODE_ENV === 'development');
  const isProd = isExplicitStart ||
                 process.env.NODE_ENV === 'production' || 
                 (process.env.K_SERVICE !== undefined && !process.env.K_SERVICE.startsWith('ais-dev')) ||
                 (!isDev && hasDist);

  app.use(express.json({ limit: '1mb' }));

  // Tratamento explícito de favicon para evitar 404 no console
  app.get('/favicon.ico', (req, res) => {
    const icoPath = path.resolve(__dirname, 'public', 'favicon.svg');
    if (fs.existsSync(icoPath)) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.sendFile(icoPath);
    } else {
      res.status(204).end();
    }
  });

  // 1. Status do Assistente (verifica disponibilidade da chave sem expor ao client)
  app.get('/api/assistant/status', (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const isConfigured = Boolean(
      apiKey && 
      apiKey.trim() !== '' && 
      apiKey !== 'MY_GEMINI_API_KEY'
    );
    res.json({ available: isConfigured });
  });

  // 2. Chat com o Assistente Cultural
  app.post('/api/assistant/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(503).json({
        error: 'Assistente indisponível nesta versão',
        unavailable: true,
      });
    }

    try {
      const { message, history = [], context = {} } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Mensagem inválida' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // System instruction com as 7 regras fundamentais do prompt
      const systemInstruction = `Você é o Assistente Cultural inteligente do Cultura em Cena, plataforma de preparação para editais culturais para artistas e coletivos (com foco em Indaiatuba e região).

REGRAS OBRIGATÓRIAS E ESTRITAS:
1. Responda SOMENTE com base nos dados fornecidos no contexto a seguir (editais cadastrados, checklist de inscrição e cofre de documentos do usuário).
2. CITE SEMPRE de onde veio a informação específica: mencione obrigatoriamente o nome do edital e a seção correspondente (exemplo: "[Nome do Edital], Seção: Documentos Exigidos" ou "[Nome do Edital], Seção: Critérios de Pontuação").
3. Quando a informação NÃO constar nos editais cadastrados nem nos dados fornecidos, responda exatamente: "Não consigo confirmar essa informação nos dados oficiais cadastrados deste edital. Recomendo consultar a página oficial do órgão emissor."
4. NUNCA invente prazos, valores, documentos exigidos, critérios de avaliação ou contatos.
5. NUNCA prometa aprovação nem apresente qualquer resposta como orientação jurídica ou oficial do órgão público emissor.
6. DIFERENCIE explicitamente "O que o edital informa:" e "Sugestão de preparação:", usando títulos claros ou parágrafos distintos.
7. NUNCA peça nem use números de RG, CPF, dados bancários ou o conteúdo dos arquivos do cofre; utilize apenas os nomes dos documentos e suas respectivas datas de validade.
8. Para editais do tipo "forecast" (previsão histórica) ou "demo" (modelo didático/simulado), avise expressamente o usuário no início da resposta sobre essa natureza demonstrativa para não gerar falsa expectativa de edital aberto.
9. Seja direto, didático, prestativo e use português brasileiro formal e acolhedor.`;

      // Montagem do contexto fático
      const contextText = `DADOS ATUAIS REGISTRADOS NA PLATAFORMA:

--- PERFIL DO ARTISTA / PROPONENTE ---
Perfil Selecionado: ${context.userProfile || 'banda_grupo'}
Nome: ${context.userName || 'Lucas'}

--- COFRE DE DOCUMENTOS DO USUÁRIO (Apenas nomes e validades) ---
${context.vaultDocumentsSummary && context.vaultDocumentsSummary.length > 0
  ? context.vaultDocumentsSummary.map((d: any) => `- Documento: "${d.name}" | Categoria: ${d.category} | Validade: ${d.expiryDate || 'Indeterminada'} | Situação: ${d.status === 'vencido' ? 'VENCIDO (necessita renovação)' : d.status === 'atencao' ? 'Vence em breve' : 'Válido'}`).join('\n')
  : 'Nenhum documento cadastrado no cofre no momento.'}

--- CHECKLIST DA INSCRIÇÃO ATUAL ---
${context.checklistSummary
  ? `Edital da Inscrição: "${context.checklistSummary.grantTitle}"
Progresso Geral: ${context.checklistSummary.progress}% (${context.checklistSummary.completedSteps} de ${context.checklistSummary.totalSteps} etapas concluídas)
Etapa Atual: ${context.checklistSummary.currentStepName || 'Em andamento'}
Documentos pendentes no checklist: ${context.checklistSummary.pendingRequirements && context.checklistSummary.pendingRequirements.length > 0 ? context.checklistSummary.pendingRequirements.join(', ') : 'Nenhum documento pendente'}`
  : 'Nenhum checklist ativo no momento.'}

--- EDITAL EM FOCO ---
${context.activeGrant
  ? `Nome: "${context.activeGrant.title}"
Órgão: ${context.activeGrant.issuingBody} | Esfera: ${context.activeGrant.sphere} | Área: ${context.activeGrant.artisticArea}
Classificação: ${context.activeGrant.noticeType === 'simulado' ? 'MODELO EDUCATIVO (avise o usuário que é referência educativa)' : context.activeGrant.noticeType === 'previsao_anual' ? 'PREVISÃO ANUAL' : 'OFICIAL VERIFICADO'}
Prazo: ${context.activeGrant.deadlineDate || 'A confirmar'}
Resumo: ${context.activeGrant.summary}
Elegibilidade: ${Array.isArray(context.activeGrant.eligibility) ? context.activeGrant.eligibility.join('; ') : 'Conforme edital'}
Documentos Exigidos:
${Array.isArray(context.activeGrant.requiredDocuments) ? context.activeGrant.requiredDocuments.map((r: any) => `  * ${r.name} (${r.mandatory ? 'Obrigatório' : 'Facultativo'} - ${r.category})`).join('\n') : 'Não listados'}
Critérios de Avaliação:
${Array.isArray(context.activeGrant.scoringCriteria) ? context.activeGrant.scoringCriteria.map((c: any) => `  * ${c.title} (Peso: ${c.weight}%) - ${c.description}`).join('\n') : 'Não listados'}
Fonte Oficial: ${context.activeGrant.officialUrl || 'Não informada'}`
  : 'Nenhum edital selecionado em detalhes.'}

--- CATÁLOGO DE DEMAIS EDITAIS CADASTRADOS ---
${context.grantsSummary && context.grantsSummary.length > 0
  ? context.grantsSummary.map((g: any) => `- "${g.title}" (${g.sphere} · ${g.artisticArea}) | Tipo: ${g.noticeType === 'simulado' ? 'Modelo Educativo' : g.noticeType === 'previsao_anual' ? 'Previsão Anual' : 'Oficial Verificado'} | Prazo: ${g.deadlineDate || 'A confirmar'} | Órgão: ${g.issuingBody}`).join('\n')
  : 'Sem outros editais no catálogo.'}`;

      const historyParts = Array.isArray(history)
        ? history.slice(-6).map((h: any) => ({
            role: h.role === 'model' ? 'model' : 'user',
            parts: [{ text: h.text }],
          }))
        : [];

      const currentTurn = {
        role: 'user',
        parts: [
          {
            text: `${contextText}\n\nPERGUNTA DO USUÁRIO:\n${message}`,
          },
        ],
      };

      const modelsToTry = ['gemini-3.5-flash', 'gemini-3.8-flash'];
      let response: any = null;
      let lastError: any = null;

      for (const model of modelsToTry) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Tempo limite excedido na resposta do modelo ${model}`)), 15000)
          );

          response = await Promise.race([
            ai.models.generateContent({
              model,
              contents: [...historyParts, currentTurn],
              config: {
                systemInstruction,
                temperature: 0.2,
              },
            }),
            timeoutPromise,
          ]);

          if (response?.text) {
            break;
          }
        } catch (attemptErr: any) {
          console.warn(`Tentativa com ${model} falhou:`, attemptErr?.message);
          lastError = attemptErr;
        }
      }

      if (!response && lastError) {
        throw lastError;
      }

      const reply = response?.text || 'Não consigo confirmar essa informação nos dados oficiais cadastrados deste edital. Recomendo consultar a página oficial do órgão emissor.';
      return res.json({ reply });
    } catch (err: any) {
      console.error('Erro na chamada ao Gemini:', err);
      return res.status(503).json({
        error: 'Erro temporário ao consultar o assistente',
        details: err?.message,
      });
    }
  });

  // Integração com Vite em desenvolvimento ou arquivos estáticos em produção
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.use((req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cultura em Cena rodando na porta ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});
