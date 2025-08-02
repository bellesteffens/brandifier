import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo, {user?.name}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Seu assistente de marketing digital com IA está pronto para criar conteúdo incrível
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Link
            to="/client/form"
            className="card hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Criar Formulário
              </h3>
              <p className="text-gray-600">
                Preencha um novo formulário para gerar conteúdo personalizado
              </p>
            </div>
          </Link>

          <Link
            to="/client/my-forms"
            className="card hover:shadow-xl transition-shadow group"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Meus Formulários
              </h3>
              <p className="text-gray-600">
                Visualize e gerencie seus formulários e conteúdos gerados
              </p>
            </div>
          </Link>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🤖 Como funciona nosso assistente de IA?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Preencha o Formulário</h3>
              <p className="text-sm text-gray-600">
                Conte-nos sobre seu nicho, público-alvo e objetivos
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IA Gera Conteúdo</h3>
              <p className="text-sm text-gray-600">
                Nossa IA cria posts personalizados e recomendações estratégicas
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Use e Edite</h3>
              <p className="text-sm text-gray-600">
                Visualize, edite e exporte o conteúdo para suas redes sociais
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">✨</span>
              O que você receberá
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                5 sugestões de posts personalizados
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Legendas até 300 caracteres
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Hashtags relevantes
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Tipos de post (Reel, Carrossel, etc.)
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Dicas Inteligentes
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">💡</span>
                Melhores horários para postar
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">💡</span>
                Tipo de conteúdo mais indicado
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">💡</span>
                CTAs mais eficazes
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">💡</span>
                Estratégias de engajamento
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;