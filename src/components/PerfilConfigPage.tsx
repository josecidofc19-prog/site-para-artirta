import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Settings, Save, RotateCcw, Trash2, CheckCircle2, Sparkles, Building, MapPin, AlertCircle, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtistProfileType, ArtisticArea } from '../types';

export const PerfilConfigPage: React.FC = () => {
  const { 
    user, 
    updateUserProfile, 
    resetDemoToInitialState, 
    clearAllLocalStorage, 
    setCurrentView,
    showWorkspaceButton,
    setShowWorkspaceButton
  } = useApp();

  const [name, setName] = useState(user?.name || 'Lucas');
  const [email, setEmail] = useState(user?.email || 'lucas.musica@exemplo-demo.org');
  const [profileType, setProfileType] = useState<ArtistProfileType>(user?.profileType || 'banda_grupo');
  const [artisticArea, setArtisticArea] = useState<ArtisticArea>(user?.artisticArea || 'Música');
  const [city, setCity] = useState(user?.city || 'Indaiatuba');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setProfileType(user.profileType);
      setArtisticArea(user.artisticArea);
      setCity(user.city);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      profileType,
      artisticArea,
      city: city.trim(),
    });
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
          <Settings className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          <span>Configurações e Cadastro</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Perfil Artístico & Preferências
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Atualize seus dados cadastrais. As alterações refletem imediatamente nos filtros de editais e nas exigências documentais.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Formulário Principal Bento */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bento-card space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Dados do Artista ou Grupo
            </h2>

            <div>
              <label htmlFor="perfil-nome" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Nome do Artista ou Proponente *
              </label>
              <input
                id="perfil-nome"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
              />
            </div>

            <div>
              <label htmlFor="perfil-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                E-mail de Contato *
              </label>
              <input
                id="perfil-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="perfil-tipo" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Tipo de Proponente *
                </label>
                <select
                  id="perfil-tipo"
                  value={profileType}
                  onChange={(e) => setProfileType(e.target.value as ArtistProfileType)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring"
                >
                  <option value="artista_solo">Artista solo (Pessoa Física)</option>
                  <option value="banda_grupo">Banda ou grupo musical</option>
                  <option value="coletivo_cultural">Coletivo cultural sem CNPJ</option>
                  <option value="produtor_cultural">Produtor cultural (MEI ou PJ)</option>
                </select>
              </div>

              <div>
                <label htmlFor="perfil-area" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Área Artística Principal *
                </label>
                <select
                  id="perfil-area"
                  value={artisticArea}
                  onChange={(e) => setArtisticArea(e.target.value as ArtisticArea)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring"
                >
                  <option value="Música">Música</option>
                  <option value="Teatro">Teatro</option>
                  <option value="Dança">Dança</option>
                  <option value="Artes Visuais">Artes Visuais</option>
                  <option value="Literatura">Literatura</option>
                  <option value="Audiovisual">Audiovisual</option>
                  <option value="Circo">Circo</option>
                  <option value="Patrimônio Cultural">Patrimônio Cultural</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="perfil-cidade" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Município e Estado de Sede *
              </label>
              <input
                id="perfil-cidade"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
                placeholder="Ex: Indaiatuba, SP"
              />
              <p className="text-xs text-slate-400 mt-1">
                Editais municipais verificam a sede para comprovação de elegibilidade territorial.
              </p>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="btn-primary px-6 py-2.5 text-xs focus-ring"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </form>
        </div>

        {/* Coluna Lateral Bento: Status & Gestão */}
        <div className="space-y-6">
          <div className="bento-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Status da Conta
            </h3>
            <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <p>
                <strong>Tipo:</strong> {user?.isDemo ? 'Conta de Demonstração (Lucas)' : 'Conta Simulada Ativa'}
              </p>
              <p>
                <strong>Armazenamento:</strong> 100% no navegador (localStorage)
              </p>
            </div>
          </div>

          {/* Configuração de Interface & Integrações */}
          <div className="bento-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Interface e Navegação
            </h3>
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="pr-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Botão Google Workspace
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight block mt-0.5">
                  Exibir botão na barra de navegação superior
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={showWorkspaceButton}
                onClick={() => setShowWorkspaceButton(!showWorkspaceButton)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  showWorkspaceButton ? 'bg-[#991B1B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    showWorkspaceButton ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bento-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ações Rápidas de Demonstração
            </h3>
            <div className="space-y-2">
              <button
                onClick={resetDemoToInitialState}
                className="btn-secondary w-full py-2.5 px-3 text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Restaurar Lucas (60%)</span>
              </button>
              <button
                onClick={clearAllLocalStorage}
                className="w-full py-2.5 px-3 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors focus-ring"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Todos os Dados</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
