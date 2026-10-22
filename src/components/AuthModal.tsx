import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, ShieldCheck, Sparkles, AlertCircle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtistProfileType, ArtisticArea } from '../types';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    selectedProfile,
    registerSimulatedUser,
    loginAsLucas,
    showToast
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileType, setProfileType] = useState<ArtistProfileType>(selectedProfile);
  const [city, setCity] = useState('Indaiatuba');
  const [artisticArea, setArtisticArea] = useState<ArtisticArea>('Música');
  const [consent, setConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    if (selectedProfile) {
      setProfileType(selectedProfile);
    }
  }, [selectedProfile]);

  const handleClose = () => {
    setAuthModalOpen(false);
    setIsRecoveryMode(false);
    setRecoverySent(false);
    setErrorMsg('');
  };

  const modalRef = useModalAccessibility(authModalOpen, handleClose, '#auth-email-input');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRecoveryMode) {
      if (!email.includes('@')) {
        setErrorMsg('Informe um endereço de e-mail válido.');
        return;
      }
      setRecoverySent(true);
      showToast('Recuperação simulada', `Instruções de redefinição foram simuladas para ${email}.`, 'info');
      return;
    }

    if (authModalMode === 'login') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Preencha seu e-mail e senha simulados.');
        return;
      }
      loginAsLucas();
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Informe seu nome ou do seu grupo/banda.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Informe um endereço de e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha simulada deve conter no mínimo 6 caracteres.');
      return;
    }
    if (!consent) {
      setErrorMsg('Você precisa marcar a caixa de ciência sobre o protótipo acadêmico.');
      return;
    }

    registerSimulatedUser({
      name: name.trim(),
      email: email.trim(),
      profileType,
      city: city.trim(),
      artisticArea,
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-white/10 relative my-8"
      >
        {/* Botão Fechar com tamanho acessível */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl focus-ring min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Fechar modal de autenticação"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Cabeçalho do Modal */}
        <div className="space-y-1.5 mb-6 pr-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Simulação Local</span>
          </div>
          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight">
            {isRecoveryMode 
              ? 'Recuperação de Senha Simulada' 
              : authModalMode === 'login' 
                ? 'Acessar Conta Simulada' 
                : 'Criar Perfil Artístico'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isRecoveryMode
              ? 'Digite o e-mail cadastrado para simular o recebimento de instruções.'
              : authModalMode === 'login'
                ? 'Faça login rápido com os dados demonstrativos de Lucas ou sua conta.'
                : 'Configure seu perfil para que a plataforma calcule requisitos do edital.'}
          </p>
        </div>

        {/* Atalho Rápido para o Personagem Lucas */}
        {authModalMode === 'login' && !isRecoveryMode && (
          <div className="mb-6 p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Demonstração Recomendada (Lucas · 60%)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Carrega o estado perfeito para bancas: checklist a 60% e documento vencido para demonstrar a reatividade automática.
            </p>
            <button
              type="button"
              onClick={loginAsLucas}
              className="w-full mt-2 py-2 px-3 text-xs font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white dark:bg-teal-400 dark:hover:bg-teal-300 dark:text-slate-950 transition-colors focus-ring cursor-pointer shadow-xs min-h-[38px]"
            >
              Entrar direto como Lucas (Demo)
            </button>
          </div>
        )}

        {/* Mensagem de Erro com Alto Contraste */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Recuperação Enviada */}
        {recoverySent ? (
          <div className="space-y-4 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Instruções Simuladas com Sucesso</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Como esta aplicação opera localmente no navegador, nenhum e-mail real foi disparado. Você pode retornar ao formulário e entrar como Lucas.
            </p>
            <button
              onClick={() => {
                setIsRecoveryMode(false);
                setRecoverySent(false);
                setAuthModalMode('login');
              }}
              className="btn-primary w-full py-2.5 text-xs focus-ring"
            >
              Voltar para o Login
            </button>
          </div>
        ) : (
          /* Formulário */
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {authModalMode === 'register' && !isRecoveryMode && (
              <>
                <div>
                  <label 
                    htmlFor="auth-register-name" 
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
                  >
                    Nome do Artista ou Banda *
                  </label>
                  <input
                    id="auth-register-name"
                    type="text"
                    required
                    placeholder="Ex: Lucas Silva ou Grupo Sons do Interior"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label 
                      htmlFor="auth-register-profile" 
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
                    >
                      Formato *
                    </label>
                    <select
                      id="auth-register-profile"
                      value={profileType}
                      onChange={e => setProfileType(e.target.value as ArtistProfileType)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring"
                    >
                      <option value="artista_solo">Artista solo (PF)</option>
                      <option value="banda_grupo">Banda ou grupo</option>
                      <option value="coletivo_cultural">Coletivo sem CNPJ</option>
                      <option value="produtor_cultural">Produtor cultural (MEI/PJ)</option>
                    </select>
                  </div>

                  <div>
                    <label 
                      htmlFor="auth-register-area" 
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
                    >
                      Área *
                    </label>
                    <select
                      id="auth-register-area"
                      value={artisticArea}
                      onChange={e => setArtisticArea(e.target.value as ArtisticArea)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-ring"
                    >
                      <option value="Música">Música</option>
                      <option value="Teatro">Teatro</option>
                      <option value="Dança">Dança</option>
                      <option value="Artes Visuais">Artes Visuais</option>
                      <option value="Literatura">Literatura</option>
                      <option value="Audiovisual">Audiovisual</option>
                      <option value="Circo">Circo</option>
                      <option value="Patrimônio Cultural">Patrimônio</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label 
                    htmlFor="auth-register-city" 
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
                  >
                    Cidade / Município *
                  </label>
                  <input
                    id="auth-register-city"
                    type="text"
                    required
                    placeholder="Ex: Indaiatuba, Campinas, São Paulo..."
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
                  />
                </div>
              </>
            )}

            <div>
              <label 
                htmlFor="auth-email-input" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1"
              >
                E-mail *
              </label>
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
              />
            </div>

            {!isRecoveryMode && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label 
                    htmlFor="auth-password-input" 
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Senha Simulada *
                  </label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setIsRecoveryMode(true)}
                      className="text-xs text-teal-600 dark:text-teal-400 hover:underline focus-ring rounded cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="auth-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 min-w-[32px] min-h-[32px] flex items-center justify-center rounded cursor-pointer"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                  </button>
                </div>
              </div>
            )}

            {authModalMode === 'register' && !isRecoveryMode && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5">
                <label htmlFor="auth-register-consent" className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    id="auth-register-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-teal-600 focus-ring"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Compreendo que esta aplicação é um <strong>protótipo acadêmico para feira universitária</strong>. Nenhuma senha real ou dado sigiloso deve ser inserido.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-2.5 text-xs min-h-[44px] mt-2"
            >
              {isRecoveryMode 
                ? 'Enviar link de recuperação simulado' 
                : authModalMode === 'login' 
                  ? 'Entrar na Demonstração' 
                  : 'Concluir Cadastro e Ir para Preparação'}
            </button>
          </form>
        )}

        {/* Rodapé Alternador entre Login / Cadastro */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-center text-xs text-slate-500 dark:text-slate-400">
          {isRecoveryMode ? (
            <button
              type="button"
              onClick={() => setIsRecoveryMode(false)}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline p-1 cursor-pointer"
            >
              Voltar para o formulário de login
            </button>
          ) : authModalMode === 'login' ? (
            <span>
              Ainda não tem cadastro?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="text-teal-600 dark:text-teal-400 font-bold hover:underline p-1 cursor-pointer"
              >
                Criar conta grátis
              </button>
            </span>
          ) : (
            <span>
              Já tem cadastro ou prefere o acesso demo?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-teal-600 dark:text-teal-400 font-bold hover:underline p-1 cursor-pointer"
              >
                Fazer login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
