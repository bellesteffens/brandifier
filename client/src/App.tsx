import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Login from './pages/Login';
import ClientDashboard from './pages/client/Dashboard';
import MarketingForm from './pages/client/MarketingForm';
import MyForms from './pages/client/MyForms';
import AdminDashboard from './pages/admin/Dashboard';

// Simple pages for missing routes
const HomePage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-6">🤖</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Assistente Marketing IA
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Gere conteúdo personalizado para suas redes sociais com o poder da inteligência artificial.
        Nossa IA analisa seu nicho e cria posts estratégicos para engajar sua audiência.
      </p>
      <div className="space-x-4">
        <a href="/login" className="btn-primary">
          Começar Agora
        </a>
        <a href="/register" className="btn-secondary">
          Criar Conta
        </a>
      </div>
    </div>
  );
};

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Criar Nova Conta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Funcionalidade em desenvolvimento. Use as contas de teste disponíveis na página de login.
          </p>
          <div className="mt-6">
            <a href="/login" className="btn-primary">
              Voltar ao Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-6">🚫</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Acesso Negado
      </h1>
      <p className="text-gray-600 mb-8">
        Você não tem permissão para acessar esta página.
      </p>
      <a href="/" className="btn-primary">
        Voltar ao Início
      </a>
    </div>
  );
};

const ClientResults: React.FC = () => {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-6">🚧</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Página de Resultados
      </h1>
      <p className="text-gray-600 mb-8">
        Esta página está sendo desenvolvida. Visualize seus formulários na página "Meus Formulários".
      </p>
      <a href="/client/my-forms" className="btn-primary">
        Ver Meus Formulários
      </a>
    </div>
  );
};

const AdminUsers: React.FC = () => {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-6">👥</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Gerenciar Usuários
      </h1>
      <p className="text-gray-600 mb-8">
        Interface de gerenciamento de usuários em desenvolvimento.
      </p>
      <a href="/admin/dashboard" className="btn-primary">
        Voltar ao Dashboard
      </a>
    </div>
  );
};

const AdminForms: React.FC = () => {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-6">📋</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Formulários do Sistema
      </h1>
      <p className="text-gray-600 mb-8">
        Visualização de formulários administrativos em desenvolvimento.
      </p>
      <a href="/admin/dashboard" className="btn-primary">
        Voltar ao Dashboard
      </a>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Client Routes */}
            <Route path="/client/dashboard" element={
              <ProtectedRoute clientOnly>
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/client/form" element={
              <ProtectedRoute clientOnly>
                <MarketingForm />
              </ProtectedRoute>
            } />
            <Route path="/client/my-forms" element={
              <ProtectedRoute clientOnly>
                <MyForms />
              </ProtectedRoute>
            } />
            <Route path="/client/results/:id" element={
              <ProtectedRoute clientOnly>
                <ClientResults />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/forms" element={
              <ProtectedRoute adminOnly>
                <AdminForms />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
