import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Landmark, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Clock, 
  Award, 
  Send, 
  ArrowRight, 
  Scale, 
  Sparkles, 
  BarChart3, 
  Layers, 
  AlertTriangle,
  HelpCircle,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tooltip } from './Tooltip';

export const OrganizacoesPublicasPage: React.FC = () => {
  const { setCurrentView, showToast } = useApp();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    municipioEstado: '',
    orgaoSecretaria: '',
    nomeGestor: '',
    cargo: '',
    emailInstitucional: '',
    telefone: '',
    porteMunicipio: '50k_200k',
    editaisPrevistos: 'pnab_e_proprios',
    mensagem: ''
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.municipioEstado || !formData.emailInstitucional) {
      showToast(
        'Campos Obrigatórios',
        'Por favor, informe o Município/Órgão e o Email Institucional.',
        'warning'
      );
      return;
    }

    setFormSubmitted(true);
    showToast(
      'Solicitação de Demonstração Registrada!',
      'Nossa equipe de relações governamentais entrará em contato para agendar a apresentação técnica.',
      'success'
    );
  };

  const steps = [
    {
      num: 1,
      title: 'Parametrização & Publicação',
      tag: 'Agilidade & Conformidade',
      description: 'Configure regras do edital, baremas objetivos de notas, cotas afirmativas (PCD, raça, gênero) e minuta padronizada em minutos, com publicação simplificada.',
      details: [
        'Modelos prontos para PNAB (Política Nacional Aldir Blanc) e editais municipais',
        'Definição de pesos para critérios artísticos, sociais e de acessibilidade',
        'Formulários acessíveis que orientam o artista a evitar erros'
      ]
    },
    {
      num: 2,
      title: 'Inscrição com Pré-Auditoria',
      tag: 'Redução de 78% dos Recursos',
      description: 'Diferencial exclusivo do Cultura em Cena: o sistema audita certidões e comprovantes do artista antes da confirmação final do envio da proposta.',
      details: [
        'Aviso imediato se a certidão CND ou certidão de quitação eleitoral estiver vencida',
        'Validação automática de formato e anexos obrigatórios',
        'Fim da sobrecarga das comissões com inabilitações evitáveis por erro formal'
      ]
    },
    {
      num: 3,
      title: 'Pareceres & Notas Cegas',
      tag: 'Transparência Republicana',
      description: 'Distribuição automatizada de propostas para pareceristas externos com avaliação duplo-cega, mantendo o anonimato de avaliadores e proponentes quando exigido.',
      details: [
        'Barema com notas fragmentadas por critério e justificativa obrigatória',
        'Cálculo automático de notas médias e aplicação instantânea de cotas',
        'Geração automática das atas de habilitação e resultado preliminar'
      ]
    },
    {
      num: 4,
      title: 'Monitoramento & Prestação de Contas',
      tag: 'Segurança aos Órgãos de Controle',
      description: 'Acompanhamento da execução física e financeira em tempo real, com upload rastreável de notas fiscais, fotos e relatórios de cumprimento do objeto.',
      details: [
        'Painel de conformidade pronto para fiscalização do TCE, TCU e Câmaras Municipais',
        'Histórico e trilha digital auditável de todos os atos e desembolsos',
        'Geração de relatórios públicos de transparência e balanço cultural'
      ]
    }
  ];

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#121214] text-[#1C1917] dark:text-[#F5F3EF] min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HERO SECTION GESTÃO PÚBLICA */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1E3A2F] via-[#142A22] to-[#1C1917] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>Gestão Pública Cultural & Secretarias Municipais</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-tight">
              A plataforma oficial de <span className="italic text-emerald-400">editais transparentes</span> para prefeituras e estados.
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
              Desenvolvida especialmente para municípios operarem a <strong>PNAB (Política Nacional Aldir Blanc)</strong>, a <strong>Lei Paulo Gustavo</strong> e seus fundos municipais de cultura (como o FICC Indaiatuba) com total segurança jurídica, pareceres objetivos e pré-auditoria documental.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#ciclo-edital"
                className="px-6 py-3 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Layers className="w-4 h-4" />
                <span>Explorar o Ciclo de 4 Etapas</span>
              </a>

              <a
                href="#solicitar-demo"
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Building className="w-4 h-4 text-emerald-300" />
                <span>Agendar Demonstração para Municípios</span>
              </a>
            </div>

            {/* Métricas de Impacto no Setor Público */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-300">
              <div className="space-y-0.5">
                <div className="font-editorial text-2xl font-bold text-emerald-400">-78%</div>
                <span className="text-stone-300">Menos recursos e impugnações</span>
              </div>
              <div className="space-y-0.5">
                <div className="font-editorial text-2xl font-bold text-emerald-400">80%</div>
                <span className="text-stone-300">Economia no tempo de triagem</span>
              </div>
              <div className="space-y-0.5">
                <div className="font-editorial text-2xl font-bold text-emerald-400">100%</div>
                <span className="text-stone-300">Conformidade com TCU e TCE</span>
              </div>
              <div className="space-y-0.5">
                <div className="font-editorial text-2xl font-bold text-emerald-400">PNAB</div>
                <span className="text-stone-300">Pronto para Ciclos 2024-2027</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 1: O CICLO DE 4 ETAPAS DO EDITAL PÚBLICO */}
        <section id="ciclo-edital" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-400">
              Metodologia de Governança
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold">
              O Ciclo de 4 Etapas do Edital Público
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
              Do lançamento da portaria de fomento à homologação final da prestação de contas, cada fase é parametrizada para eliminar riscos de inabilitação injusta e garantir equidade.
            </p>
          </div>

          {/* Abas Interativas das Etapas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeStep === s.num
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-600/20'
                    : 'border-[#E6E0D5] dark:border-white/10 bg-white dark:bg-[#1A1A1E] hover:bg-[#FAF7F2] dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    activeStep === s.num 
                      ? 'bg-emerald-700 text-white' 
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}>
                    {s.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    Etapa {s.num}
                  </span>
                </div>
                <div className="font-bold text-sm text-[#1C1917] dark:text-[#F5F3EF] mt-2">
                  {s.title}
                </div>
              </button>
            ))}
          </div>

          {/* Detalhe da Etapa Selecionada */}
          {(() => {
            const current = steps.find((s) => s.num === activeStep) || steps[0];
            return (
              <div className="bg-white dark:bg-[#1A1A1E] rounded-3xl p-6 sm:p-10 border border-[#E6E0D5] dark:border-white/10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{current.tag}</span>
                  </div>

                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
                    {current.num}. {current.title}
                  </h3>

                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {current.description}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Recursos Operacionais Integrados:
                    </span>
                    <ul className="space-y-2">
                      {current.details.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Visual Ilustrativo da Etapa */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#121214] border border-[#E6E0D5] dark:border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase text-stone-500 border-b border-[#E6E0D5] dark:border-white/10 pb-2">
                    <span>Visão da Secretaria</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono">Modo Administrador</span>
                  </div>

                  {current.num === 1 && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-white dark:bg-[#1A1A1E] rounded-xl border border-stone-200 dark:border-white/5 space-y-1">
                        <span className="font-bold text-[#1C1917] dark:text-[#F5F3EF]">Edital PNAB Indaiatuba 2026/01</span>
                        <p className="text-stone-500">Valor global: R$ 850.000,00 · 40 vagas · Cota étnico-racial: 25%</p>
                      </div>
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-800 dark:text-emerald-300 font-medium">
                        ✓ Minuta aprovada pela Procuradoria Jurídica
                      </div>
                    </div>
                  )}

                  {current.num === 2 && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-300 dark:border-emerald-700/50 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Pré-Auditoria Ativa no Envio</span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-300">
                          "Seu CND Estadual vence em 3 dias. Atualize no Cofre para garantir habilitação sem recurso."
                        </p>
                      </div>
                      <p className="text-[11px] text-stone-500 italic">
                        O proponente é avisado em tempo real, zerando desclassificações por certidão esquecida.
                      </p>
                    </div>
                  )}

                  {current.num === 3 && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-white dark:bg-[#1A1A1E] rounded-xl border border-stone-200 dark:border-white/5 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-stone-800 dark:text-stone-200">Proposta #8492 (Anônima)</span>
                          <span className="font-mono text-emerald-600 font-bold">Nota: 94.5</span>
                        </div>
                        <p className="text-stone-500">Avaliador 03 · Barema Artístico: 38/40 · Acessibilidade: 20/20</p>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Critérios técnicos pautados sem identificação partidária ou pessoal.
                      </p>
                    </div>
                  )}

                  {current.num === 4 && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-white dark:bg-[#1A1A1E] rounded-xl border border-stone-200 dark:border-white/5 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-stone-800 dark:text-stone-200">Cumprimento do Objeto: 100%</span>
                          <span className="text-emerald-600 font-bold">Aprovado</span>
                        </div>
                        <p className="text-stone-500">Relatório fotográfico + notas fiscais eletrônicas homologadas.</p>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Exportação de dossiê completo para prestar contas no TransfereGov em 1 clique.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </section>

        {/* SEÇÃO 2: CASOS DE USO EM MUNICÍPIOS (PNAB E EDITAIS LOCAIS) */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-400">
              Aderência Total às Políticas Federais e Municipais
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold">
              Feito para as Demandas Reais da Secretaria
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1A1A1E] rounded-3xl p-6 sm:p-8 border border-[#E6E0D5] dark:border-white/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-xl font-bold">PNAB (Aldir Blanc 2024-2027)</h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Repasses contínuos da União com exigência de planos anuais e metas de descentralização cultural. Nossa plataforma mapeia territórios periféricos e garante a aplicação de cotas com transparência.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1A1A1E] rounded-3xl p-6 sm:p-8 border border-[#E6E0D5] dark:border-white/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-[#991B1B] dark:text-red-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-xl font-bold">Fundos Locais (FICC Indaiatuba)</h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Fomento direto com recursos do orçamento municipal. Formulários adaptáveis à realidade orçamentária da cidade, permitindo fomento a artistas solo, coletivos sem CNPJ e microempresas culturais.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1A1A1E] rounded-3xl p-6 sm:p-8 border border-[#E6E0D5] dark:border-white/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-xl font-bold">Pontos de Cultura & Premiações</h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Inscrições orais e simplificadas por vídeo para mestres da cultura popular, comunidades tradicionais e grupos indígenas, eliminando barreiras burocráticas no acesso aos recursos.
              </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: FORMULÁRIO DE DEMONSTRAÇÃO PARA MUNICÍPIOS */}
        <section id="solicitar-demo" className="scroll-mt-24 max-w-4xl mx-auto bg-white dark:bg-[#1A1A1E] rounded-3xl border border-[#E6E0D5] dark:border-white/10 p-8 sm:p-12 shadow-lg space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-400">
              Modernização da Gestão Cultural Pública
            </span>
            <h2 className="font-editorial text-3xl font-bold">
              Solicitar Demonstração para seu Município
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
              Apresentamos a plataforma para o secretário(a), comissões e procuradoria municipal, com simulação prática de lançamento de edital PNAB.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                Demonstração Solicitada com Sucesso!
              </h3>
              <p className="text-sm text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                Recebemos o contato da gestão de <strong>{formData.municipioEstado}</strong>. Nossa equipe técnica de suporte governamental enviará o link para agendamento e o modelo de termo de adesão para o email <strong>{formData.emailInstitucional}</strong>.
              </p>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="text-xs font-bold text-emerald-800 dark:text-emerald-300 underline cursor-pointer"
              >
                Cadastrar outro município
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Município / Estado *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Prefeitura Municipal de Indaiatuba / SP"
                    value={formData.municipioEstado}
                    onChange={(e) => setFormData({ ...formData, municipioEstado: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Secretaria / Fundação / Órgão
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Secretaria Municipal de Cultura"
                    value={formData.orgaoSecretaria}
                    onChange={(e) => setFormData({ ...formData, orgaoSecretaria: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Nome do Gestor(a) ou Representante
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Eduardo"
                    value={formData.nomeGestor}
                    onChange={(e) => setFormData({ ...formData, nomeGestor: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Cargo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Secretário(a), Diretor(a) de Fomento, Assessor(a)"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Email Institucional (.gov.br ou oficial) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="cultura@indaiatuba.sp.gov.br"
                    value={formData.emailInstitucional}
                    onChange={(e) => setFormData({ ...formData, emailInstitucional: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Telefone Institucional / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="(19) 3834-0000"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Porte Populacional do Município
                  </label>
                  <select
                    value={formData.porteMunicipio}
                    onChange={(e) => setFormData({ ...formData, porteMunicipio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="ate_50k">Até 50.000 habitantes</option>
                    <option value="50k_200k">De 50.000 a 200.000 habitantes</option>
                    <option value="200k_500k">De 200.000 a 500.000 habitantes</option>
                    <option value="acima_500k">Acima de 500.000 habitantes ou Secretaria Estadual</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Editais Previstos para Operar
                  </label>
                  <select
                    value={formData.editaisPrevistos}
                    onChange={(e) => setFormData({ ...formData, editaisPrevistos: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="pnab_e_proprios">PNAB (Aldir Blanc) + Editais Próprios do Município</option>
                    <option value="apenas_pnab">Apenas PNAB (Ciclo 2026)</option>
                    <option value="apenas_proprios">Fundo Municipal de Cultura / Premiações Locais</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Demandas Específicas ou Observações
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Necessitamos de assessoria técnica para a parametrização dos baremas da PNAB e capacitação para artistas locais..."
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-700 hover:bg-emerald-600 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Solicitar Demonstração Técnica Institucional</span>
              </button>
            </form>
          )}
        </section>

      </div>
    </div>
  );
};
