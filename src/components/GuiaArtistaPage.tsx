import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  HelpCircle, 
  Shield, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight,
  MapPin,
  FileCheck,
  Calculator,
  ExternalLink,
  FolderLock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GuiaArtistaPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'passos' | 'indaiatuba' | 'cnds' | 'orcamento' | 'formatos' | 'portfolio' | 'glossario'>('passos');

  const tabs = [
    { id: 'passos', label: 'Como Ler um Edital' },
    { id: 'indaiatuba', label: 'Indaiatuba & Região' },
    { id: 'cnds', label: 'Certidões e CNDs' },
    { id: 'orcamento', label: 'Orçamento & Contas' },
    { id: 'formatos', label: 'PF, MEI e Coletivo' },
    { id: 'portfolio', label: 'Dicas de Portfólio' },
    { id: 'glossario', label: 'Glossário' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Cabeçalho */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 border-b border-slate-200/80 dark:border-white/5 pb-8"
      >
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono uppercase">
          <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          <span>Manual Prático de Fomento Cultural</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Guia do Artista
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Orientações práticas para artistas independentes, músicos, bandas e produtores culturais de Indaiatuba e região: da emissão gratuita de certidões à planilha orçamentária equilibrada.
        </p>

        {/* Abas com design limpo e alvos de toque acessíveis */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer focus-ring min-h-[42px] ${
                  isActive 
                    ? 'btn-primary shadow-xs' 
                    : 'btn-secondary'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Conteúdo Aba 1: Como Ler um Edital */}
      {activeTab === 'passos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bento-card space-y-2.5">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">PASSO 1</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Objeto e Linhas de Fomento</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Descubra com exatidão o que o edital quer financiar: circulação musical, montagem cênica, publicação de livro ou oficinas didáticas. Seu projeto deve responder diretamente a esse objetivo central.
              </p>
            </div>

            <div className="bento-card space-y-2.5">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">PASSO 2</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Elegibilidade e Vínculo Territorial</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Verifique se o edital exige CNPJ ou aceita Pessoa Física/Coletivo, além de comprovação de domicílio na cidade/estado há pelo menos 1 ou 2 anos. Uma restrição não observada desclassifica sumariamente.
              </p>
            </div>

            <div className="bento-card space-y-2.5">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">PASSO 3</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Critérios de Avaliação e Pesos</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Bancas examinadoras atribuem notas ponderadas (ex: 35% excelência artística, 35% viabilidade do cronograma, 30% contrapartida social). Dedique maior esforço de redação aos critérios com maior peso percentual.
              </p>
            </div>

            <div className="bento-card space-y-2.5">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">PASSO 4</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">4. Prazos e Validade de Certidões</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Certidões negativas e comprovantes de endereço costumam ter validade de 30 a 90 dias. Use o <strong>Cofre de Documentos</strong> do Cultura em Cena para alertá-lo antes que qualquer item expire.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Indaiatuba & Região */}
      {activeTab === 'indaiatuba' && (
        <div className="space-y-6">
          <div className="bento-card p-6 space-y-4 border-teal-500/20 bg-teal-50/30 dark:bg-teal-950/20">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Foco Municipal e Regional: Indaiatuba e Região Metropolitana de Campinas (RMC)</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Particularidades dos Editais Culturais em Indaiatuba
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              O município de Indaiatuba conta com um sistema ativo de fomento cultural liderado pela <strong>Secretaria Municipal de Cultura</strong> e pela <strong>Fundação Pró-Memória</strong>, com editais regulares da <em>Política Nacional Aldir Blanc (PNAB)</em>, <em>Prêmio Nabor Pires Camargo</em> e chamamentos da <em>Lei Paulo Gustavo</em>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bento-card space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Comprovação de Residência Local
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A maioria dos chamamentos de Indaiatuba exige comprovação de residência ou sede do coletivo no município por período mínimo de <strong>1 ano contínuo</strong>. Guarde contas de luz, água, internet ou contrato de locação em nome do proponente ou responsável artístico.
              </p>
            </div>

            <div className="bento-card space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Inscrição e Cadastro Municipal de Cultura
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Mantenha seu cadastro de artista ou espaço cultural atualizado no banco de dados da Secretaria de Cultura de Indaiatuba. Muitos editais utilizam esse cadastro como requisito prévio para homologação.
              </p>
            </div>

            <div className="bento-card space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Espaços Públicos e Contrapartidas
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Projetos com apresentações gratuitas no Parque Ecológico, Centro de Convenções Aydil Bonachella, Museu Casarão Pau Preto ou praças dos bairros recebem pontuação destacada nas bancas locais.
              </p>
            </div>

            <div className="bento-card space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Região Metropolitana de Campinas (RMC)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Artistas de Indaiatuba também podem concorrer em editais de circulação regional do Fundo de Investimentos Culturais de Campinas (FICC) e do Circuito Cultural Paulista quando houver previsão de itinerância intercomunitária.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Certidões e CNDs */}
      {activeTab === 'cnds' && (
        <div className="space-y-6">
          <div className="bento-card space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Como Emitir as Certidões Obrigatórias Gratuitamente
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Todas as certidões negativas de débito necessárias para editais públicos são gratuitas e emitidas pela internet em menos de 5 minutos. Conheça as cinco principais:
            </p>
          </div>

          <div className="space-y-4">
            <div className="bento-card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">1. CND Federal e Previdenciária (Receita Federal / PGFN)</span>
                <span className="text-xs font-mono font-semibold text-slate-500">Validade: 180 dias</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Atesta que o CPF ou CNPJ não possui débitos de tributos federais e previdência social. Emitida diretamente no portal da Receita Federal.
              </p>
            </div>

            <div className="bento-card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">2. CNDT — Certidão Negativa de Débitos Trabalhistas (Justiça do Trabalho)</span>
                <span className="text-xs font-mono font-semibold text-slate-500">Validade: 180 dias</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Comprova que o proponente não está inscrito no Banco Nacional de Devedores Trabalhistas (BNDT). Emitida no portal do Tribunal Superior do Trabalho (TST).
              </p>
            </div>

            <div className="bento-card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">3. CRF FGTS — Certificado de Regularidade do FGTS (Caixa Econômica)</span>
                <span className="text-xs font-mono font-semibold text-slate-500">Validade: 30 dias</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Obrigatório para pessoas jurídicas e MEIs culturais. Atesta regularidade com depósitos do Fundo de Garantia. Como tem prazo curto (30 dias), renove no cofre assim que expirar.
              </p>
            </div>

            <div className="bento-card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">4. CND Tributária Municipal (Prefeitura de Indaiatuba)</span>
                <span className="text-xs font-mono font-semibold text-slate-500">Validade: 30 a 90 dias</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Comprova inexistência de débitos de IPTU, ISS e taxas municipais na comarca de Indaiatuba. Emitida na aba de Cidadão do portal oficial da Prefeitura de Indaiatuba.
              </p>
            </div>

            <div className="bento-card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">5. Certidão de Débitos Tributários da Dívida Ativa Estadual (PGE-SP)</span>
                <span className="text-xs font-mono font-semibold text-slate-500">Validade: 180 dias</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Exigida em editais do ProAC e secretarias de estado. Atesta inexistência de débitos de ICMS, IPVA ou multas inscritas em dívida ativa estadual.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Orçamento e Prestação de Contas */}
      {activeTab === 'orcamento' && (
        <div className="space-y-6">
          <div className="bento-card space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Estruturação da Planilha Orçamentária Cultural
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              O orçamento é a espinha dorsal de qualquer projeto. Erros de cálculo, valores incompatíveis com o mercado ou ausência de previsão tributária são causas frequentes de corte de nota técnica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bento-card space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Cachê Artístico & Equipe Técnica</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Remunere dignamente músicos, atores, técnicos de som, iluminadores e fotógrafos. Especifique a quantidade de diárias, horas de ensaio e valores unitários de acordo com tabelas de referência do setor (ex: SATED, OMB).
              </p>
            </div>

            <div className="bento-card space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Logística, Transporte e Alimentação</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Em projetos de circulação pelo interior de SP, preveja combustível, van para transporte de instrumentos e cenário, diárias de alimentação e hospedagem para cidades distantes.
              </p>
            </div>

            <div className="bento-card space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Acessibilidade Comunicacional (Libras e Audiodescrição)</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A contratação de intérprete de Libras e audiodescrição garante pontuação extra ou cumprimento de cota obrigatória nas leis Paulo Gustavo e Aldir Blanc.
              </p>
            </div>

            <div className="bento-card space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Conta Bancária Exclusiva e Notas Fiscais</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Todo o recurso deve ser movimentado em conta bancária específica do projeto. Guarde todas as notas fiscais com descrição detalhada dos serviços prestados e comprovantes de transferência identificados.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 5: Formatos Jurídicos */}
      {activeTab === 'formatos' && (
        <div className="space-y-4">
          <div className="bento-card space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">PF</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Pessoa Física (CPF Próprio)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Ideal para artistas solo e criadores iniciantes. O valor recebido sofre retenção de Imposto de Renda na fonte conforme a tabela progressiva, mas dispensa custos de contador ou manutenção de CNPJ.
            </p>
          </div>

          <div className="bento-card space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold">MEI</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Microempreendedor Individual (MEI Cultural)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Excelente para músicos, atores e produtores que emitem nota fiscal com tributação reduzida (Simples Nacional). Atenção ao teto anual de faturamento e às atividades culturais elegíveis no CNAE.
            </p>
          </div>

          <div className="bento-card space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-xs font-bold">Coletivo</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Coletivo Cultural sem CNPJ</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Muito aceito em editais de cidades paulistas e premiações comunitárias. Exige uma <strong>Carta de Representação</strong> assinada por todos os membros delegando poderes para um integrante receber e prestar contas.
            </p>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 6: Dicas de Portfólio */}
      {activeTab === 'portfolio' && (
        <div className="bento-card space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Como Estruturar um Portfólio Artístico Vencedor
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Ordem cronológica inversa:</strong> Apresente os trabalhos mais recentes e expressivos logo nas primeiras páginas do dossiê.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Links funcionais e abertos:</strong> Vídeos e áudios devem estar no YouTube/Vimeo/Drive com acesso liberado (sem exigir login ou permissão manual).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Fichas técnicas completas:</strong> Indique o papel exato do artista em cada projeto (ex: diretor musical, arranjador, ator principal).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Comprovação de vínculo com a região:</strong> Inclua matérias de jornais locais de Indaiatuba, cartazes de apresentações no interior e certificados de participação.</span>
            </li>
          </ul>
        </div>
      )}

      {/* Conteúdo Aba 7: Glossário */}
      {activeTab === 'glossario' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bento-card">
            <h4 className="font-bold text-sm text-teal-600 dark:text-teal-400 mb-1">Contrapartida Social</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Ação gratuita de retorno à sociedade, como oficinas didáticas, ensaios abertos para estudantes ou ingressos para entidades assistenciais.
            </p>
          </div>

          <div className="bento-card">
            <h4 className="font-bold text-sm text-teal-600 dark:text-teal-400 mb-1">Dossiê e Clipping</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Conjunto de reportagens, cartazes de shows, links de vídeos e certificados comprovando a trajetória artística contínua nos anos anteriores.
            </p>
          </div>

          <div className="bento-card">
            <h4 className="font-bold text-sm text-teal-600 dark:text-teal-400 mb-1">Homologação de Resultado</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Publicação oficial em Diário Oficial tornando definitiva a lista de selecionados após a fase de recursos e julgamento das contestações.
            </p>
          </div>

          <div className="bento-card">
            <h4 className="font-bold text-sm text-teal-600 dark:text-teal-400 mb-1">CND (Certidão Negativa de Débitos)</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Documentos que comprovam que o proponente não possui pendências fiscais federais, estaduais, municipais ou trabalhistas.
            </p>
          </div>
        </div>
      )}

      {/* Ação Inferior */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-white/5">
        <button
          onClick={() => {
            setCurrentView('calendario');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="btn-secondary px-4 py-2.5 text-xs w-full sm:w-auto min-h-[44px]"
        >
          Ver Calendário Cultural Anual
        </button>
        <button
          onClick={() => {
            setCurrentView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="btn-primary px-5 py-2.5 text-xs w-full sm:w-auto min-h-[44px]"
        >
          <span>Ir para o Catálogo de Editais</span>
          <ArrowRight className="w-3.5 h-3.5 inline ml-1.5" />
        </button>
      </div>

    </div>
  );
};
