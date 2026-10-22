import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ArrowRight, ArrowLeft, Save, CheckCircle2, FileText, AlertCircle, Sparkles } from 'lucide-react';

export const FormularioProjetoPage: React.FC = () => {
  const { projectDraft, updateProjectDraft, showToast, setCurrentView } = useApp();
  
  const steps = [
    { id: 1, title: 'Identificação' },
    { id: 2, title: 'Objetivos e Justificativa' },
    { id: 3, title: 'Público-alvo e Impacto' },
    { id: 4, title: 'Plano de Execução' },
    { id: 5, title: 'Orçamento' },
    { id: 6, title: 'Revisão Final' }
  ];

  const handleNext = () => {
    updateProjectDraft({ stepAtual: Math.min(6, projectDraft.stepAtual + 1) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    updateProjectDraft({ stepAtual: Math.max(1, projectDraft.stepAtual - 1) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    showToast('Projeto Salvo', 'Seu rascunho de projeto está pronto para ser anexado à inscrição!', 'success');
    updateProjectDraft({ stepAtual: 1 });
    setCurrentView('checklist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Cabeçalho */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 border-b border-slate-200/80 dark:border-white/5 pb-8"
      >
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono uppercase">
          <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          <span>Elaboração de Proposta Cultural</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Formulário de Projeto Cultural
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Construa sua proposta por etapas. O progresso é salvo automaticamente de forma local no seu navegador.
        </p>
      </motion.div>

      {/* Progress Stepper Bento */}
      <div className="bento-card p-4 sm:p-6">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-2">
          {steps.map(step => (
            <button 
              key={step.id} 
              onClick={() => updateProjectDraft({ stepAtual: step.id })}
              className="flex flex-col items-center gap-2 flex-1 min-w-[70px] cursor-pointer group focus-ring rounded-xl py-1"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                projectDraft.stepAtual === step.id
                  ? 'ring-4 ring-teal-500/30 bg-teal-700 text-white dark:bg-teal-400 dark:text-slate-950 shadow-xs'
                  : projectDraft.stepAtual > step.id 
                    ? 'bg-teal-700 text-white dark:bg-teal-400 dark:text-slate-950' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-white/5'
              }`}>
                {projectDraft.stepAtual > step.id ? <CheckCircle2 className="w-4 h-4" /> : step.id}
              </div>
              <span className={`text-xs uppercase font-semibold text-center transition-colors hidden sm:block ${
                projectDraft.stepAtual === step.id ? 'text-teal-700 dark:text-teal-300 font-bold' : 'text-slate-400'
              }`}>
                {step.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Content Bento */}
      <div className="bento-card min-h-[420px] flex flex-col justify-between space-y-6">
        
        {/* Etapa 1 */}
        {projectDraft.stepAtual === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Identificação do Projeto e Apresentação
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Dê um título expressivo e apresente a síntese do que será realizado.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Nome do Projeto e Síntese Geral
              </label>
              <textarea
                rows={8}
                value={projectDraft.identificacao}
                onChange={e => updateProjectDraft({ identificacao: e.target.value })}
                placeholder="Ex: Turnê 'Vozes da Terra' - Circulação de 4 apresentações musicais acústicas com repertório autoral de música instrumental brasileira em praças públicas..."
                className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
            </div>
          </div>
        )}

        {/* Etapa 2 */}
        {projectDraft.stepAtual === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Objetivos Gerais, Específicos e Justificativa
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Por que este projeto é relevante e o que você pretende alcançar concretamente?
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Justificativa Artística e Relevância Cultural
              </label>
              <textarea
                rows={8}
                value={projectDraft.objetivos}
                onChange={e => updateProjectDraft({ objetivos: e.target.value })}
                placeholder="Ex: O projeto resgata tradições orais e composições regionais paulistas, democratizando o acesso cultural para comunidades periféricas..."
                className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
            </div>
          </div>
        )}

        {/* Etapa 3 */}
        {projectDraft.stepAtual === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Público-alvo, Acessibilidade e Contrapartida Social
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Quem participará e como o projeto garante acessibilidade e retorno social gratuito?
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Plano de Acessibilidade e Contrapartida
              </label>
              <textarea
                rows={8}
                value={projectDraft.publico}
                onChange={e => updateProjectDraft({ publico: e.target.value })}
                placeholder="Ex: Estimativa de 800 espectadores presenciais. Ofereceremos intérprete de Libras em 2 apresentações e 1 oficina gratuita de iniciação musical para jovens da rede pública..."
                className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
            </div>
          </div>
        )}

        {/* Etapa 4 */}
        {projectDraft.stepAtual === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Plano de Execução, Cronograma e Metodologia
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Divida as atividades nas etapas: pré-produção, produção/execução e pós-produção/prestação de contas.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Cronograma Detalhado por Meses
              </label>
              <textarea
                rows={8}
                value={projectDraft.execucao}
                onChange={e => updateProjectDraft({ execucao: e.target.value })}
                placeholder="Ex: Mês 1: Ensaios, contratação de som e alvarás. Mês 2: Realização dos concertos e oficina. Mês 3: Compilação do relatório final de prestação de contas..."
                className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
              />
            </div>
          </div>
        )}

        {/* Etapa 5 */}
        {projectDraft.stepAtual === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Previsão Orçamentária e Rubricas
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Descreva os custos estimados por itens (cachês, locação técnica, transporte, divulgação).
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Rubricas de Despesas
              </label>
              <textarea
                rows={8}
                value={projectDraft.orcamento}
                onChange={e => updateProjectDraft({ orcamento: e.target.value })}
                placeholder="Ex:&#10;- Cachê dos Músicos (4 integrantes x 4 shows): R$ 16.000,00&#10;- Sonorização e Iluminação: R$ 4.000,00&#10;- Produção Executiva: R$ 3.000,00&#10;- Divulgação e Design Gráfico: R$ 2.000,00&#10;Total: R$ 25.000,00"
                className="w-full p-4 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring font-mono"
              />
            </div>
          </div>
        )}

        {/* Etapa 6: Revisão Final */}
        {projectDraft.stepAtual === 6 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Revisão Completa da Proposta
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Confira o conteúdo consolidado antes de salvar e vincular ao dossiê preparatório.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40 space-y-4 text-xs">
              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">Identificação do Projeto</span>
                <p className="text-xs sm:text-sm mt-1 whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                  {projectDraft.identificacao || <span className="text-slate-400 italic">Não preenchido</span>}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">Objetivos e Justificativa</span>
                <p className="text-xs sm:text-sm mt-1 whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                  {projectDraft.objetivos || <span className="text-slate-400 italic">Não preenchido</span>}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">Público e Contrapartida</span>
                <p className="text-xs sm:text-sm mt-1 whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                  {projectDraft.publico || <span className="text-slate-400 italic">Não preenchido</span>}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">Plano de Execução</span>
                <p className="text-xs sm:text-sm mt-1 whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                  {projectDraft.execucao || <span className="text-slate-400 italic">Não preenchido</span>}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase font-semibold text-slate-400 block tracking-wider">Orçamento Estimado</span>
                <p className="text-xs sm:text-sm mt-1 whitespace-pre-wrap font-mono text-slate-800 dark:text-slate-200">
                  {projectDraft.orcamento || <span className="text-slate-400 italic">Não preenchido</span>}
                </p>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Verifique atentamente os dados. As informações preenchidas constarão no dossiê simulado da sua inscrição ativa.
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Navegação Inferior com Auto-Guardado */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-200/80 dark:border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            disabled={projectDraft.stepAtual === 1}
            className="btn-secondary px-4 py-2.5 text-xs disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1.5" /> Anterior
          </button>
          
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Rascunho salvo no navegador
          </span>
        </div>
        
        {projectDraft.stepAtual < 6 ? (
          <button 
            onClick={handleNext}
            className="btn-primary px-6 py-2.5 text-xs"
          >
            Próximo <ArrowRight className="w-4 h-4 inline ml-1.5" />
          </button>
        ) : (
          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFinalSubmit}
            className="btn-primary px-6 py-2.5 text-xs bg-emerald-600 hover:bg-emerald-500"
          >
            <Save className="w-4 h-4 inline mr-1.5" /> Salvar Projeto
          </motion.button>
        )}
      </div>
    </div>
  );
};
