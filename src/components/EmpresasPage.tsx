import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Calculator, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Award, 
  FileCheck2, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  Coins, 
  Send,
  HelpCircle,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tooltip } from './Tooltip';

export const EmpresasPage: React.FC = () => {
  const { setCurrentView, showToast } = useApp();

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
  // Rouanet Art. 18: até 4% do IRPJ devido, 100% dedutível
  const maxRouanet = Math.round(irpjDevido * 0.04);
  // ProAC ICMS: faixa média de 3% do saldo devedor anual
  const maxProac = Math.round(icmsDevido * 0.03);

  const tetoLegal = incentiveType === 'rouanet' ? maxRouanet : maxProac;
  const valorEfetivoAporte = Math.min(aporteDesejado, tetoLegal);
  const abatimentoImposto = valorEfetivoAporte;
  const custoLiquidoEmpresa = 0; // 100% dedutível em ambos

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.empresa || !formData.email) {
      showToast(
        'Campos obrigatórios',
        'Por favor, preencha o nome da empresa e o email institucional.',
        'warning'
      );
      return;
    }

    setFormSubmitted(true);
    showToast(
      'Solicitação Corporativa Enviada!',
      'Nossa equipe de assessoria fiscal e curadoria cultural entrará em contato em até 24 horas.',
      'success'
    );
  };

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#121214] text-[#1C1917] dark:text-[#F5F3EF] min-h-screen py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HERO SECTION CORPORATIVA */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1E3A2F] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-900/60 border border-red-700/50 text-red-200 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-red-400" />
              <span>Portal de Patrocinadores & Fomento Privado</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-tight">
              Transforme seus impostos em <span className="italic text-red-400">impacto cultural</span> com custo líquido zero.
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
              Utilize os mecanismos da <strong>Lei Rouanet (Federal)</strong> e do <strong>ProAC ICMS (São Paulo)</strong> para apoiar projetos culturais pré-auditados, fortalecer sua marca em comunidades estratégicas e cumprir metas ESG com 100% de dedução fiscal.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#simulador"
                className="btn-editorial-primary px-6 py-3 text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Calculator className="w-4 h-4" />
                <span>Simular Incentivo Fiscal Agora</span>
              </a>

              <a
                href="#vitrine"
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ver Vitrine de Projetos Aprovados</span>
              </a>
            </div>

            {/* Badges de Garantia Fiscal */}
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
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold">
              Simulador Fiscal em Tempo Real
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
              Descubra quanto sua empresa pode destinar a projetos culturais sem desembolsar nenhum centavo a mais do que o imposto já devido ao Estado.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Controles de Simulação */}
            <div className="lg:col-span-7 bg-white dark:bg-[#1A1A1E] rounded-3xl p-6 sm:p-8 border border-[#E6E0D5] dark:border-white/10 shadow-sm space-y-6">
              
              {/* Seletor de Mecanismo */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center justify-between">
                  <span>Escolha a Legislação de Fomento:</span>
                  <Tooltip content="A Lei Rouanet abate 100% do valor no IRPJ devido (Lucro Real). O ProAC SP abate 100% no saldo devedor do ICMS estadual.">
                    <span className="text-[11px] text-[#991B1B] dark:text-red-400 cursor-pointer flex items-center gap-1 font-semibold">
                      <HelpCircle className="w-3.5 h-3.5" /> Entenda as leis
                    </span>
                  </Tooltip>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIncentiveType('rouanet')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      incentiveType === 'rouanet'
                        ? 'border-[#991B1B] bg-red-50/60 dark:bg-red-950/30 ring-2 ring-red-700/20'
                        : 'border-[#E6E0D5] dark:border-white/10 hover:bg-[#FAF7F2] dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1C1917] dark:text-[#F5F3EF]">Lei Rouanet Federal</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/60 text-[#991B1B] dark:text-red-300 font-bold">
                        Artigo 18
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      Dedução de 100% do valor no IRPJ devido (limite de até 4%).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIncentiveType('proac')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      incentiveType === 'proac'
                        ? 'border-[#1E3A2F] bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-700/20'
                        : 'border-[#E6E0D5] dark:border-white/10 hover:bg-[#FAF7F2] dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#1C1917] dark:text-[#F5F3EF]">ProAC ICMS SP</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                        Estadual SP
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      Dedução de 100% no saldo devedor do ICMS no Estado de SP.
                    </p>
                  </button>
                </div>
              </div>

              {/* Slider 1: Base de Cálculo de Imposto */}
              {incentiveType === 'rouanet' ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-stone-700 dark:text-stone-200">
                      IRPJ Anual Estimado (Lucro Real):
                    </span>
                    <span className="font-mono font-bold text-lg text-[#991B1B] dark:text-red-400">
                      {irpjDevido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={20000000}
                    step={250000}
                    value={irpjDevido}
                    onChange={(e) => setIrpjDevido(Number(e.target.value))}
                    className="w-full accent-[#991B1B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                    <span>R$ 500 mil</span>
                    <span>R$ 10 milhões</span>
                    <span>R$ 20 milhões</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-stone-700 dark:text-stone-200">
                      Saldo Devedor Anual de ICMS em SP:
                    </span>
                    <span className="font-mono font-bold text-lg text-emerald-700 dark:text-emerald-400">
                      {icmsDevido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={20000000}
                    step={250000}
                    value={icmsDevido}
                    onChange={(e) => setIcmsDevido(Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                    <span>R$ 500 mil</span>
                    <span>R$ 10 milhões</span>
                    <span>R$ 20 milhões</span>
                  </div>
                </div>
              )}

              {/* Slider 2: Valor do Aporte Cultural Pretendido */}
              <div className="space-y-3 pt-3 border-t border-[#E6E0D5] dark:border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-stone-700 dark:text-stone-200">
                    Aporte Desejado em Projetos Culturais:
                  </span>
                  <span className="font-mono font-bold text-lg text-stone-900 dark:text-stone-100">
                    {aporteDesejado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={Math.max(tetoLegal, 200000)}
                  step={10000}
                  value={aporteDesejado}
                  onChange={(e) => setAporteDesejado(Number(e.target.value))}
                  className="w-full accent-stone-700 dark:accent-stone-300 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                  <span>R$ 10.000</span>
                  <span>Teto Legal Permitido: {tetoLegal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Informação Técnica */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#121214] border border-[#E6E0D5] dark:border-white/10 text-xs text-stone-600 dark:text-stone-400 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#1C1917] dark:text-[#F5F3EF]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Amparo Jurídico Garantido</span>
                </div>
                <p>
                  {incentiveType === 'rouanet'
                    ? 'Projetos enquadrados no Artigo 18 da Lei Federal 8.313/91 permitem abater 100% da doação ou patrocínio diretamente do IRPJ apurado pela empresa sob o regime de Lucro Real.'
                    : 'A Lei Estadual 12.268/06 (ProAC ICMS SP) autoriza a apropriação de 100% do patrocínio na forma de crédito financeiro para liquidação do ICMS a recolher.'}
                </p>
              </div>

            </div>

            {/* Painel de Resultados do Simulador */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#1C1917] to-[#292524] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                    Balanço Fiscal Estimado
                  </span>
                  <h3 className="font-editorial text-2xl font-bold">Resumo da Operação</h3>
                </div>
                <Coins className="w-8 h-8 text-amber-400" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm py-2 border-b border-white/10">
                  <span className="text-stone-300">Aporte no Projeto Cultural:</span>
                  <span className="font-mono font-bold text-base text-white">
                    {valorEfetivoAporte.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-2 border-b border-white/10">
                  <span className="text-stone-300">Abatimento Tributário Direto:</span>
                  <span className="font-mono font-bold text-base text-emerald-400">
                    - {abatimentoImposto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                {/* DESTAQUE PRINCIPAL: CUSTO LÍQUIDO ZERO */}
                <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-1">
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">
                    Custo Real Líquido para a Empresa
                  </span>
                  <div className="font-editorial text-4xl sm:text-5xl font-black text-emerald-400">
                    R$ 0,00
                  </div>
                  <p className="text-[11px] text-emerald-200">
                    100% do aporte é compensado pelo imposto que sua empresa já pagaria.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-stone-300 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Sparkles className="w-4 h-4" />
                    <span>Benefícios Gerados para a Marca:</span>
                  </div>
                  <ul className="space-y-1 pl-4 list-disc text-stone-300">
                    <li>Exposição da marca em materiais gráficos, palco e redes sociais;</li>
                    <li>Selo oficial de Patrocinador Cultural Responsável;</li>
                    <li>Cotas de ingressos VIP e ações de relacionamento com clientes;</li>
                    <li>Pontuação comprovada para relatórios de Governança e ESG.</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('contato-corporativo');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-red-700 to-[#991B1B] hover:from-red-600 hover:to-red-700 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Aportar com Assessoria Tributária Gratuita</span>
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* SEÇÃO 2: VITRINE DE PROJETOS PRONTOS PARA APORTE */}
        <section id="vitrine" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#991B1B] dark:text-red-400">
                Curadoria Pré-Aprovada
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold">
                Vitrine de Projetos Prontos para Aporte
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
                Projetos culturais já analisados com parecer favorável, enquadramento homologado no Diário Oficial e documentação 100% conferida pelo Cofre Digital do Cultura em Cena.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('catalog')}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-[#E6E0D5] dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <span>Ver Catálogo Geral de Editais</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PROJETO DESTAQUE: BANDA VELUDO BRANCO (LUCAS) */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="md:col-span-2 bg-white dark:bg-[#1A1A1E] rounded-3xl border-2 border-red-700/40 dark:border-red-600/40 p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Projeto em Evidência · Indaiatuba/SP
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Certidões 100% Validadas
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    Pronac: 241982 / ProAC ICMS
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300">
                    Música & Educação
                  </span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-bold leading-snug">
                  Banda Veludo Branco: Turnê Cultural e Oficinas de Música nas Escolas Públicas
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  <strong>Proponente:</strong> Lucas de Souza & Coletivo Veludo Branco (Indaiatuba/SP).<br />
                  Projeto concebido para levar shows de rock autoral e 10 oficinas práticas de instrumentos musicais para mais de 1.200 alunos da rede municipal de Indaiatuba e região metropolitana de Campinas.
                </p>

                {/* Contrapartidas ESG */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#121214] border border-[#E6E0D5] dark:border-white/10">
                    <span className="text-[11px] uppercase font-bold text-stone-500">Acessibilidade</span>
                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
                      100% com Intérprete de Libras e Áudio-descrição
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#121214] border border-[#E6E0D5] dark:border-white/10">
                    <span className="text-[11px] uppercase font-bold text-stone-500">Impacto Educacional</span>
                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
                      10 oficinas gratuitas para jovens da periferia
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#121214] border border-[#E6E0D5] dark:border-white/10">
                    <span className="text-[11px] uppercase font-bold text-stone-500">Exposição de Marca</span>
                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
                      Naming rights e estande institucional nos shows
                    </p>
                  </div>
                </div>

                {/* Barra de Captação */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Orçamento Homologado: <strong>R$ 150.000,00</strong></span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">R$ 60.000,00 já captados (40%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#991B1B] to-emerald-600 rounded-full w-[40%]" />
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>Disponível para Aporte IRPJ/ICMS: <strong>R$ 90.000,00</strong></span>
                    <span>Prazo de Captação: Dezembro/2026</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E6E0D5] dark:border-white/10 mt-6">
                <div className="text-xs text-stone-500">
                  Certidões no Cofre: CND Federal (ativa), FGTS (ativo), CADIN SP (limpo).
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      showToast(
                        'Dossiê Técnico Baixado',
                        'O Plano de Trabalho completo e pareceres da Banda Veludo Branco foram simulados.',
                        'info'
                      );
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-white/5 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Dossiê Técnico</span>
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('contato-corporativo');
                      el?.scrollIntoView({ behavior: 'smooth' });
                      setFormData(prev => ({ ...prev, mensagem: 'Gostaria de patrocinar o projeto da Banda Veludo Branco (Pronac 241982).' }));
                    }}
                    className="btn-editorial-primary text-xs px-4 py-2 font-bold cursor-pointer"
                  >
                    Aportar Neste Projeto
                  </button>
                </div>
              </div>
            </motion.div>

            {/* PROJETO 2: CIRCUITO DE TEATRO DE BONECOS */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-[#E6E0D5] dark:border-white/10 p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Auditado
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">ProAC SP 12/2026</span>
                </div>

                <h3 className="font-editorial text-xl font-bold leading-tight">
                  Festival de Teatro Itinerante no Interior Paulista
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  12 apresentações gratuitas em praças públicas de Indaiatuba, Salto e Itu, com foco em preservação ambiental e conscientização sobre recursos hídricos.
                </p>

                <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#121214] text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>Meta Total:</span>
                    <span className="font-mono font-bold">R$ 85.000,00</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Público Estimado:</span>
                    <span>4.500 pessoas</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6E0D5] dark:border-white/10 mt-4">
                <button
                  onClick={() => {
                    const el = document.getElementById('contato-corporativo');
                    el?.scrollIntoView({ behavior: 'smooth' });
                    setFormData(prev => ({ ...prev, mensagem: 'Interesse no Festival de Teatro Itinerante no Interior Paulista.' }));
                  }}
                  className="w-full py-2.5 text-xs font-bold rounded-xl border border-[#991B1B] text-[#991B1B] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-center cursor-pointer"
                >
                  Solicitar Detalhes do Projeto
                </button>
              </div>
            </motion.div>

          </div>
        </section>

        {/* SEÇÃO 3: OS 3 PILARES CORPORATIVOS (BENCHMARKING PROSAS) */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#991B1B] dark:text-red-400">
              Soluções Sob Medida para Grandes e Médias Empresas
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold">
              3 Pilares de Governança para Patrocinadores
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
              Inspirado no modelo de excelência do Prosas, oferecemos infraestrutura completa para sua empresa lançar chamadas próprias ou patrocinar com total compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pilar 1 */}
            <div className="bg-white dark:bg-[#1A1A1E] rounded-3xl p-8 border border-[#E6E0D5] dark:border-white/10 shadow-sm space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-[#991B1B] dark:text-red-400 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold">
                1. Editais Privados Customizados
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Desenvolva uma chamada de projetos exclusiva com o logotipo e o propósito da sua marca. Definimos em conjunto os territórios prioritários (ex: cidades onde sua empresa opera), regras de pontuação e categorias temáticas.
              </p>
              <ul className="text-xs space-y-2 text-stone-700 dark:text-stone-300 pt-2 border-t border-[#E6E0D5] dark:border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Formulário de inscrição personalizado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Divulgação para rede de milhares de artistas</span>
                </li>
              </ul>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white dark:bg-[#1A1A1E] rounded-3xl p-8 border border-[#E6E0D5] dark:border-white/10 shadow-sm space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold">
                2. Curadoria com Métricas ESG
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Cada real investido é mapeado em relatórios analíticos: número de pessoas beneficiadas, diversidade de proponentes, alcance geográfico e alinhamento com os 17 Objetivos de Desenvolvimento Sustentável (ODS) da ONU.
              </p>
              <ul className="text-xs space-y-2 text-stone-700 dark:text-stone-300 pt-2 border-t border-[#E6E0D5] dark:border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Relatórios prontos para balanço social</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Indicadores ODS 4, 8, 10 e 11</span>
                </li>
              </ul>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white dark:bg-[#1A1A1E] rounded-3xl p-8 border border-[#E6E0D5] dark:border-white/10 shadow-sm space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold">
                3. Trilha de Auditoria Digital & Compliance
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Segurança jurídica total para o setor tributário da sua empresa. Nosso Cofre Digital monitora a validade de certidões negativas (CND Trabalhista, FGTS, Receita Federal) durante todo o ciclo do projeto, evitando glosas fiscais.
              </p>
              <ul className="text-xs space-y-2 text-stone-700 dark:text-stone-300 pt-2 border-t border-[#E6E0D5] dark:border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Atestados de homologação e diário oficial</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Recibo de Mecenato sem burocracia</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* SEÇÃO 4: FORMULÁRIO DE CONTATO CORPORATIVO */}
        <section id="contato-corporativo" className="scroll-mt-24 max-w-4xl mx-auto bg-white dark:bg-[#1A1A1E] rounded-3xl border border-[#E6E0D5] dark:border-white/10 p-8 sm:p-12 shadow-lg space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#991B1B] dark:text-red-400">
              Atendimento Especializado para Patrocinadores
            </span>
            <h2 className="font-editorial text-3xl font-bold">
              Fale com a Curadoria Corporativa
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
              Preencha o formulário abaixo para receber uma consultoria fiscal preliminar e a curadoria personalizada de projetos alinhados à sua marca.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                Obrigado pelo seu interesse!
              </h3>
              <p className="text-sm text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                Recebemos sua mensagem institucional. Um consultor especialista em Lei Rouanet e ProAC ICMS entrará em contato pelo email <strong>{formData.email}</strong> com a memória de cálculo e o dossiê dos projetos selecionados.
              </p>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="text-xs font-bold text-emerald-800 dark:text-emerald-300 underline cursor-pointer"
              >
                Enviar nova simulação
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Razão Social ou Nome Fantasia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Indústria Paulista de Alimentos S.A."
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    CNPJ da Empresa
                  </label>
                  <input
                    type="text"
                    placeholder="00.000.000/0001-00"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Nome do Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mariana Silva"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Cargo / Departamento
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Gerente de ESG / Marketing / Tributário"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Email Corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="mariana@empresa.com.br"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Telefone / WhatsApp Comercial
                  </label>
                  <input
                    type="tel"
                    placeholder="(19) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Legislação de Preferência
                  </label>
                  <select
                    value={formData.leiInteresse}
                    onChange={(e) => setFormData({ ...formData, leiInteresse: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B]"
                  >
                    <option value="todas">Todas / Quero recomendação mista</option>
                    <option value="rouanet">Lei Rouanet Federal (IRPJ Lucro Real)</option>
                    <option value="proac">ProAC ICMS SP (Estadual de SP)</option>
                    <option value="proprio">Desejamos lançar um edital privado exclusivo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Previsão Anual de Fomento
                  </label>
                  <select
                    value={formData.faixaInvestimento}
                    onChange={(e) => setFormData({ ...formData, faixaInvestimento: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B]"
                  >
                    <option value="ate_100k">Até R$ 100.000,00</option>
                    <option value="100k_500k">De R$ 100.000,00 a R$ 500.000,00</option>
                    <option value="500k_1m">De R$ 500.000,00 a R$ 1.000.000,00</option>
                    <option value="acima_1m">Acima de R$ 1.000.000,00</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Comentários ou Foco Específico da Empresa
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Queremos apoiar ações musicais no município de Indaiatuba com foco em juventude e sustentabilidade..."
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-[#121214] text-sm focus:outline-none focus:ring-2 focus:ring-[#991B1B]"
                />
              </div>

              <button
                type="submit"
                className="btn-editorial-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Solicitar Curadoria e Atendimento Corporativo</span>
              </button>
            </form>
          )}
        </section>

      </div>
    </div>
  );
};
