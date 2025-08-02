import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin, isClient } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                🤖 Assistente Marketing IA
              </Link>
            </div>

            {/* Navigation */}
            {user && (
              <nav className="hidden md:flex space-x-8">
                {isAdmin && (
                  <>
                    <Link 
                      to="/admin/dashboard" 
                      className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/users" 
                      className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Usuários
                    </Link>
                    <Link 
                      to="/admin/forms" 
                      className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Formulários
                    </Link>
                  </>
                )}
                
                {isClient && (
                  <>
                    <Link 
                      to="/client/dashboard" 
                      className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/client/form" 
                      className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Novo Formulário
                    </Link>
                    <Link 
                      to="/client/my-forms" 
                      className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Meus Formulários
                    </Link>
                  </>
                )}
              </nav>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Olá, <span className="font-medium">{user.name}</span>
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  user.user_type === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.user_type === 'admin' ? 'Admin' : 'Cliente'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Entrar
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            © 2024 Assistente Marketing IA. Criado com ❤️ para impulsionar seu marketing digital.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;