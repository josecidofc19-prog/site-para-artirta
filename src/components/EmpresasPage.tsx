import React, { useState } from 'react';
import { 
  Building2, 
  Calculator, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  FileCheck2, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  Coins, 
  Send,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmpresasPage: React.FC = () => {
  const { showToast } = useApp();

  // Estado do Simulador Fiscal
  const [incentiveType, setIncentiveType] = useState<'rouanet' | 'proac'>('rouanet');
  const [irpjDevido, setIrpjDevido] = useState<number>(2500000); // 2.5 milhões de IRPJ
  const [icmsDevido, setIcmsDevido] = useState<number>(3000000); // 3 milhões de ICMS
  const [aporteDesejado, setAporteDesejado] = useState<number>(100000);

  // Estado do Formulário Corporativo
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    empresa: '',
    cnpj: '',
    responsavel: '',
    cargo: '',
    email: '',
    telefone: '',
    leiInteresse: 'todas',
    faixaInvestimento: '100k_500k',
    mensagem: ''
  });

  // Cálculos do Simulador
  const maxRouanet = Math.round(irpjDevido * 0.04);
  const maxProac = Math.round(icmsDevido * 0.03);
  const tetoLegal = incentiveType === 'rouanet' ? maxRouanet : maxProac;
  const valorEfetivoAporte = Math.min(aporteDesejado, tetoLegal);
  const abatimentoImposto = valorEfetivoAporte;
  const custoLiquidoEmpresa = 0;

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.empresa || !formData.email) {
      showToast(
        'Campos obrigatórios',
        'Por favor, preencha o nome da empresa e o e-mail de contato.',
        'warning'
      );
      return;
    }
    setFormSubmitted(true);
    showToast(
      'Solicitação Recebida',
      'Recebemos sua solicitação de dossiê de patrocínio com sucesso.',
      'success'
    );
  };

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#121214] text-[#1C1917] dark:text-[#F5F3EF] min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HERO SECTION CORPORATIVA */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1E3A2F] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-900/60 border border-red-700/50 text-red-200 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-red-400" />
              <span>Portal de Patrocinadores & Fomento Privado</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight">
              Transforme seus impostos em <span className="italic text-red-400">impacto cultural</span> com custo líquido zero.
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
              Utilize os mecanismos da <strong>Lei Rouanet (Federal)</strong> e do <strong>ProAC ICMS (São Paulo)</strong> para apoiar projetos culturais pré-auditados, fortalecer sua marca em comunidades estratégicas e cumprir metas ESG com 100% de dedução fiscal.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#simulador"
                className="px-6 py-3 rounded-xl bg-[#991B1B] hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-colors"
              >
                <Calculator className="w-4 h-4" />
                <span>Simular Incentivo Fiscal Agora</span>
              </a>
              <a
                href="#vitrine"
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ver Projetos Aprovados</span>
              </a>
            </div>

            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Dedutível no IRPJ ou ICMS</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Certidões e CNDs Pré-validadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Métricas de Impacto ESG</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Trilha de Auditoria Digital</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 1: SIMULADOR FISCAL EM TEMPO REAL */}
        <section id="simulador" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#991B1B] dark:text-red-400">
              Planejamento Tributário & Fomento Cultural
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold">
              Simulador Fiscal em Tempo Real
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
              Descubra quanto sua empresa pode destinar a projetos culturais sem desembolsar nenhum centavo a mais do que o imposto já devido ao Estado.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Controles do Simulador (7 colunas) */}
            <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#1A1A1E] border border-stone-200 dark:border-white/10 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-white/10">
                <span className="text-sm font-bold uppercase tracking-wider text-stone-500">Mecanismo de Incentivo</span>
                <div className="inline-flex rounded-xl p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIncentiveType('rouanet')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      incentiveType === 'rouanet'
                        ? 'bg-[#991B1B] text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    Lei Rouanet (IRPJ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncentiveType('proac')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      incentiveType === 'proac'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    ProAC ICMS (SP)
                  </button>
                </div>
              </div>

              {incentiveType === 'rouanet' ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <label>Previsão de IRPJ Devido Anual (Lucro Real):</label>
                    <span className="font-mono text-base font-bold text-[#991B1B] dark:text-red-400">{formatCurrency(irpjDevido)}</span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={20000000}
                    step={100000}
                    value={irpjDevido}
                    onChange={(e) => setIrpjDevido(Number(e.target.value))}
                    className="w-full accent-[#991B1B] cursor-pointer"
                  />
                  <p className="text-xs text-stone-500">
                    Art. 18 da Lei Federal nº 8.313/91: permite até 4% do IRPJ com 100% de abatimento no imposto.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <label>Previsão de Saldo Devedor de ICMS SP Anual:</label>
                    <span className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(icmsDevido)}</span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={20000000}
                    step={100000}
                    value={icmsDevido}
                    onChange={(e) => setIcmsDevido(Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <p className="text-xs text-stone-500">
                    Lei Estadual nº 12.268/06: permite destinar até ~3% do ICMS a recolher para projetos aprovados no ProAC.
                  </p>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <label>Valor que sua Empresa Deseja Aportar no Projeto:</label>
                  <span className="font-mono text-base font-bold text-stone-900 dark:text-white">{formatCurrency(aporteDesejado)}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={Math.max(tetoLegal, 200000)}
                  step={5000}
                  value={aporteDesejado}
                  onChange={(e) => setAporteDesejado(Number(e.target.value))}
                  className="w-full accent-stone-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Painel de Resultados Fiscais (5 colunas) */}
            <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 text-white p-6 sm:p-8 space-y-6 shadow-xl border border-white/10">
              <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold">Diagnóstico Tributário</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-400">Teto Legal Máximo Permitido:</span>
                  <span className="font-mono font-bold text-amber-300">{formatCurrency(tetoLegal)}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-400">Aporte Simulado:</span>
                  <span className="font-mono font-bold">{formatCurrency(valorEfetivoAporte)}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-400 font-semibold">Abatimento Fiscal (100%):</span>
                  <span className="font-mono font-bold text-emerald-400">- {formatCurrency(abatimentoImposto)}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="block text-xs uppercase font-bold tracking-wider text-stone-400">Custo Efetivo da Empresa:</span>
                    <span className="text-2xl font-black text-white">R$ 0,00</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    100% Dedução
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                O valor destinado ao projeto é descontado integralmente do tributo a ser recolhido à Fazenda Pública. A sua marca ganha visibilidade cultural sem elevar despesas.
              </p>

              <a
                href="#contato-corporativo"
                className="w-full py-3 rounded-xl font-bold text-xs bg-[#991B1B] hover:bg-red-700 text-white flex items-center justify-center gap-2 transition-colors"
              >
                <span>Solicitar Proposta Formal de Patrocínio</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: VITRINE DE PROJETOS APTOS A PATROCÍNIO */}
        <section id="vitrine" className="scroll-mt-24 space-y-8">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#991B1B] dark:text-red-400">Curadoria Cultural</span>
            <h2 className="text-3xl font-serif font-bold">Projetos Pré-aprovados e Aptos para Captação</h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Iniciativas com chancela técnica, CNDs válidas e contrapartidas sociais para a sua marca.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1A1A1E] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                  Lei Rouanet (Pronac 26.1142)
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">100% CNDs Válidas</span>
              </div>
              <h3 className="text-xl font-bold font-serif">Circulação Musical e Formativa — Banda Veludo Branco</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Turnê de shows gratuitos e oficinas de instrumentos para 1.200 estudantes de escolas públicas do interior paulista (Indaiatuba e região).
              </p>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span>Captação Autorizada: <strong>R$ 180.000,00</strong></span>
                <a href="#contato-corporativo" className="text-[#991B1B] font-bold hover:underline">Patrocinar Projeto &rarr;</a>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1A1A1E] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ProAC ICMS SP
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">100% CNDs Válidas</span>
              </div>
              <h3 className="text-xl font-bold font-serif">Festival de Artes Integradas e Patrimônio Histórico</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Apresentações de música autoral, artes visuais e feira de economia criativa no Centro Histórico de Indaiatuba.
              </p>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span>Captação Autorizada: <strong>R$ 120.000,00</strong></span>
                <a href="#contato-corporativo" className="text-emerald-700 font-bold hover:underline">Patrocinar Projeto &rarr;</a>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: FORMULÁRIO DE CONTATO CORPORATIVO */}
        <section id="contato-corporativo" className="scroll-mt-24 rounded-3xl bg-white dark:bg-[#1A1A1E] border border-stone-200 dark:border-white/10 p-8 sm:p-12 space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-2xl font-serif font-bold">Solicitar Proposta Customizada de Patrocínio</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Nossa equipe prepara um dossiê com os projetos adequados ao perfil da sua empresa e a rota de dedução fiscal.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 space-y-2">
              <h4 className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Solicitação Recebida com Sucesso!
              </h4>
              <p className="text-xs leading-relaxed">
                Entraremos em contato com a documentação pré-auditada do projeto selecionado e a orientação para recolhimento via DARF/DAE com dedução fiscal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Razão Social ou Nome da Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Indústria Metalúrgica Paulista S.A."
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-white/10 bg-stone-50 dark:bg-stone-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">E-mail Corporativo *</label>
                <input
                  type="email"
                  required
                  placeholder="responsavel@empresa.com.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-white/10 bg-stone-50 dark:bg-stone-900 text-xs"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#991B1B] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Solicitação de Dossiê Fiscal</span>
                </button>
              </div>
            </form>
          )}
        </section>

      </div>
    </div>
  );
};
