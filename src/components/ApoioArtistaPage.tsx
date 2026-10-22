import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, MessageSquare, Clock, Calendar, CheckCircle2, Send, HelpCircle, Users, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ApoioArtistaPage: React.FC = () => {
  const { showToast, user } = useApp();
  
  const [topic, setTopic] = useState('documentacao');
  const [message, setMessage] = useState('');
  const [scheduledDay, setScheduledDay] = useState('Quinta-feira, 15h');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      showToast(
        'Solicitação de Apoio Registrada!',
        'Sua dúvida foi registrada na simulação do plantão cultural. Um mentor técnico responderá na data selecionada.',
        'success'
      );
      setMessage('');
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Cabeçalho */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 border-b border-slate-200/80 dark:border-white/5 pb-8"
      >
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono uppercase">
          <LifeBuoy className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          <span>Rede de Acolhimento e Orientação Técnica</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Apoio ao Artista Independente
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Ninguém deve ficar de fora por não ter produtor ou advogado cultural. Conectamos artistas independentes a mentorias, plantões de dúvidas e modelos de documentos comentados.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Plantões e Formulário de Dúvida */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card Bento de Agendamento do Plantão */}
          <div className="bento-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Plantão Coletivo Tira-Dúvidas
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Gratuito e Simulado
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Encontros semanais de 40 minutos para tirar dúvidas sobre planilhas orçamentárias, certidões negativas e redação de justificativa com produtores culturais parceiros.
            </p>

            <form onSubmit={handleSupportSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="apoio-tema" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Tema da Dúvida
                  </label>
                  <select
                    id="apoio-tema"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus-ring"
                  >
                    <option value="documentacao">Documentação e Certidões</option>
                    <option value="orcamento">Montagem de Planilha Orçamentária</option>
                    <option value="justificativa">Redação de Justificativa e Objeto</option>
                    <option value="portfolio">Organização de Portfólio / Clipping</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="apoio-horario" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Próxima Sessão Disponível
                  </label>
                  <select
                    id="apoio-horario"
                    value={scheduledDay}
                    onChange={(e) => setScheduledDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus-ring font-mono"
                  >
                    <option value="Quinta-feira, 15h">Quinta-feira, 15h (Plantão Geral)</option>
                    <option value="Sexta-feira, 10h">Sexta-feira, 10h (Música e Bandas)</option>
                    <option value="Sábado, 14h">Sábado, 14h (Artes Cênicas e Visuais)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="apoio-msg" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Descreva resumidamente seu projeto ou dúvida:
                </label>
                <textarea
                  id="apoio-msg"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ex: Temos uma banda em Indaiatuba sem CNPJ. Como emitir a carta de representação para o edital municipal?"
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500">
                  {user ? `Enviando como ${user.name}` : 'Aberto a todos os participantes'}
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="btn-primary px-4 py-2 text-xs focus-ring"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Registrando...' : 'Inscrever-se no Plantão'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Modelos Comentados Disponíveis */}
          <div className="bento-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Modelos de Documentos para Download Livre
            </h3>
            <div className="space-y-2.5">
              {[
                { title: 'Declaração de Residência em Nome Próprio', format: 'DOCX / PDF', desc: 'Modelo aceito em prefeituras e no ProAC quando a conta de luz não está no nome do artista.' },
                { title: 'Carta de Representação de Grupo / Coletivo', format: 'DOCX / PDF', desc: 'Essencial para bandas e trupes sem CNPJ indicarem o integrante responsável legal.' },
                { title: 'Planilha Orçamentária Padrão com Rubricas', format: 'XLSX / Planilhas', desc: 'Separada por pré-produção, produção executiva, cachês artísticos e divulgação.' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-mono shrink-0">
                    {item.format}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Coluna Direita: Regras de Apoio & FAQ Rápido */}
        <div className="space-y-6">
          <div className="bento-card space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Quem são os Mentores?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Professores, estudantes e produtores culturais independentes voluntários da região de Campinas e interior de São Paulo.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% gratuito e acadêmico</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sem promessas de aprovação</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Foco na autonomia do artista</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
