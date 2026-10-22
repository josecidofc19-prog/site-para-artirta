import React from 'react';
import { motion } from 'framer-motion';
import { Compass, FolderLock, ListTodo, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Clock, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ComoFuncionaPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Cabeçalho */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>A Tecnologia a Favor da Cultura Independente</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Como Funciona o Cultura em Cena
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Simplificamos a burocracia dos editais públicos para que artistas, bandas e coletivos foquem no que fazem de melhor: criar arte.
        </p>
      </motion.div>

      {/* Os 4 Pilares da Plataforma - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pilar 1 */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bento-card space-y-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono block">PILAR 1</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Curadoria e Filtros Precisos
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Catálogo completo com esferas municipal, estadual e federal. Filtre editais exclusivos para cidades pequenas (&le; 50 mil hab.), oportunidades que aceitam Pessoa Física ou Coletivo sem CNPJ, e prazos restantes calculados com precisão.
          </p>
        </motion.div>

        {/* Pilar 2 */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bento-card space-y-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <FolderLock className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono block">PILAR 2</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Cofre Local Inteligente
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Seus comprovantes e certidões ficam salvos no seu próprio navegador (localStorage). O sistema detecta automaticamente documentos vencidos ou prestes a expirar e avisa se a validade terminará antes do prazo final do edital.
          </p>
        </motion.div>

        {/* Pilar 3 */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bento-card space-y-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ListTodo className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono block">PILAR 3</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Checklist Preparatório Reativo
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Cada edital possui 5 etapas bem definidas (20% cada). Quando você atualiza um documento no cofre, a etapa documental se resolve na hora, permitindo que você veja o progresso real sem atualizar a página.
          </p>
        </motion.div>

        {/* Pilar 4 */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bento-card space-y-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono block">PILAR 4</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            4. Privacidade Absoluta
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Projetada para feiras acadêmicas e respeito integral à LGPD. Nenhum dado de CPF, endereço ou arquivo é enviado para nuvens ou servidores externos. Tudo funciona 100% no seu navegador.
          </p>
        </motion.div>

      </div>

      {/* Chamada para Ação */}
      <div className="bento-card p-8 sm:p-10 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Pronto para testar na prática?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Explore as oportunidades culturais abertas ou acerte seus documentos no cofre agora mesmo.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-primary px-6 py-2.5 text-xs"
          >
            Explorar Editais Abertos
          </button>
          <button
            onClick={() => {
              setCurrentView('vault');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-secondary px-6 py-2.5 text-xs"
          >
            Acessar Cofre
          </button>
        </div>
      </div>

    </div>
  );
};
