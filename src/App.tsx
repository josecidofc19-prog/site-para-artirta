import React from 'react';
import { MotionConfig } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { BannerAviso } from './components/BannerAviso';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CulturalAssistant } from './components/CulturalAssistant';
import { HomePage } from './components/HomePage';
import { CatalogPage } from './components/CatalogPage';
import { GrantDetailPage } from './components/GrantDetailPage';
import { VaultPage } from './components/VaultPage';
import { ChecklistPage } from './components/ChecklistPage';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { GuiaArtistaPage } from './components/GuiaArtistaPage';
import { ApoioArtistaPage } from './components/ApoioArtistaPage';
import { ComoFuncionaPage } from './components/ComoFuncionaPage';
import { FormularioProjetoPage } from './components/FormularioProjetoPage';
import { PerfilConfigPage } from './components/PerfilConfigPage';
import { PrepChoiceModal } from './components/PrepChoiceModal';
import { AuthModal } from './components/AuthModal';
import { ToastNotification } from './components/ToastNotification';
import { CalendarioCulturalPage } from './components/CalendarioCulturalPage';
import { WorkspaceHub } from './components/WorkspaceHub';
import { EmpresasPage } from './components/EmpresasPage';
import { OrganizacoesPublicasPage } from './components/OrganizacoesPublicasPage';
import { EligibilityPage } from './components/EligibilityPage';

const WorkspaceModalRenderer: React.FC = () => {
  const { workspaceModalOpen, setWorkspaceModalOpen } = useApp();
  return <WorkspaceHub isOpen={workspaceModalOpen} onClose={() => setWorkspaceModalOpen(false)} />;
};

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="min-h-[calc(100vh-140px)]">
      {currentView === 'home' && <HomePage />}
      {currentView === 'catalog' && <CatalogPage />}
      {currentView === 'calendario' && <CalendarioCulturalPage />}
      {currentView === 'grant_detail' && <GrantDetailPage />}
      {currentView === 'vault' && <VaultPage />}
      {currentView === 'checklist' && <ChecklistPage />}
      {currentView === 'dashboard' && <PerformanceDashboard />}
      {currentView === 'guia' && <GuiaArtistaPage />}
      {currentView === 'apoio' && <ApoioArtistaPage />}
      {currentView === 'como_funciona' && <ComoFuncionaPage />}
      {currentView === 'formulario_projeto' && <FormularioProjetoPage />}
      {currentView === 'perfil' && <PerfilConfigPage />}
      {currentView === 'empresas' && <EmpresasPage />}
      {currentView === 'organizacoes_publicas' && <OrganizacoesPublicasPage />}
      {currentView === 'eligibilidade' && <EligibilityPage />}
    </main>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-[#faf7f2] dark:bg-[#121214] text-[#1c1917] dark:text-[#f5f3ef] transition-colors">
          {/* Banner de Aviso Acadêmico e Ações de Demonstração */}
          <BannerAviso />

          {/* Barra de Navegação Superior */}
          <Navbar />

          {/* Conteúdo Principal com Troca de Telas */}
          <div className="flex-1">
            <MainContent />
          </div>

          {/* Rodapé Global Estruturado */}
          <Footer />

          {/* Botão Flutuante do Assistente Cultural (acima do WhatsApp) */}
          <CulturalAssistant />

          {/* Botão Flutuante de Atendimento WhatsApp */}
          <WhatsAppButton />

          {/* Modais Globais e Notificações Flutuantes */}
          <PrepChoiceModal />
          <AuthModal />
          <WorkspaceModalRenderer />
          <ToastNotification />
        </div>
      </AppProvider>
    </MotionConfig>
  );
}
