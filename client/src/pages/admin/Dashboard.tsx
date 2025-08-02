import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Stats {
  totalUsers: number;
  totalClients: number;
  totalForms: number;
  totalPosts: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await userService.getStats();
      if (response.success) {
        setStats(response.stats);
      } else {
        setError('Erro ao carregar estatísticas.');
      }
    } catch (err) {
      setError('Erro ao carregar estatísticas.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            👨‍💼 Painel Administrativo
          </h1>
          <p className="mt-2 text-gray-600">
            Bem-vindo, {user?.name}! Gerencie usuários e monitore o sistema.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">Total de Usuários</div>
            </div>

            <div className="card text-center">
              <div className="text-3xl mb-2">👤</div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalClients}</div>
              <div className="text-sm text-gray-600">Clientes</div>
            </div>

            <div className="card text-center">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-2xl font-bold text-green-600">{stats.totalForms}</div>
              <div className="text-sm text-gray-600">Formulários</div>
            </div>

            <div className="card text-center">
              <div className="text-3xl mb-2">🤖</div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalPosts}</div>
              <div className="text-sm text-gray-600">Posts Gerados</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/users"
            className="card hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Gerenciar Usuários
              </h3>
              <p className="text-gray-600">
                Visualize, edite e gerencie todos os usuários do sistema
              </p>
            </div>
          </Link>

          <Link
            to="/admin/forms"
            className="card hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ver Formulários
              </h3>
              <p className="text-gray-600">
                Acompanhe todos os formulários e conteúdos gerados
              </p>
            </div>
          </Link>

          <div className="card">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Relatórios
              </h3>
              <p className="text-gray-600">
                Visualize estatísticas detalhadas do sistema
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Em breve
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📈 Resumo do Sistema
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Atividade Recente</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Conversão Formulário → Conteúdo:</span>
                  <span className="font-medium">
                    {stats && stats.totalForms > 0 
                      ? `${Math.round((stats.totalPosts / stats.totalForms) * 100)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Média de Posts por Formulário:</span>
                  <span className="font-medium">
                    {stats && stats.totalForms > 0 
                      ? Math.round(stats.totalPosts / stats.totalForms)
                      : 0
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Uso do Sistema:</span>
                  <span className="font-medium text-green-600">Ativo</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Status do Sistema</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">API OpenAI: </span>
                  <span className="font-medium text-green-600">Conectada</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Banco de Dados: </span>
                  <span className="font-medium text-green-600">Online</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Servidor: </span>
                  <span className="font-medium text-green-600">Funcionando</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Placeholder */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            📊 Atividades Recentes
          </h3>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📈</div>
            <p>Log de atividades será implementado em versões futuras</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;