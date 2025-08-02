import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formService, aiService } from '../../services/api';
import { MarketingForm } from '../../types';

const MyForms: React.FC = () => {
  const [forms, setForms] = useState<MarketingForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const location = useLocation();

  useEffect(() => {
    loadForms();
    
    // Mostrar mensagem de sucesso se veio da criação de formulário
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const loadForms = async () => {
    try {
      const response = await formService.getMyForms();
      if (response.success) {
        setForms(response.forms);
      } else {
        setError('Erro ao carregar formulários.');
      }
    } catch (err) {
      setError('Erro ao carregar formulários.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async (formId: number) => {
    setGenerating(formId);
    setError('');

    try {
      const response = await aiService.generateContent(formId);
      
      if (response.success) {
        setSuccessMessage('Conteúdo gerado com sucesso! Visualize os resultados abaixo.');
        // Recarregar a lista para atualizar o status
        loadForms();
      } else {
        setError(response.message || 'Erro ao gerar conteúdo.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar conteúdo. Tente novamente.');
    } finally {
      setGenerating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📋 Meus Formulários</h1>
              <p className="mt-2 text-gray-600">
                Gerencie seus formulários e crie conteúdo personalizado
              </p>
            </div>
            <Link
              to="/client/form"
              className="btn-primary"
            >
              + Novo Formulário
            </Link>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {successMessage}
            <button 
              onClick={() => setSuccessMessage('')}
              className="ml-2 text-green-400 hover:text-green-600"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-2 text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Forms List */}
        {forms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum formulário criado ainda
            </h3>
            <p className="text-gray-500 mb-6">
              Crie seu primeiro formulário para começar a gerar conteúdo personalizado
            </p>
            <Link to="/client/form" className="btn-primary">
              Criar Primeiro Formulário
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <div key={form.id} className="card hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {form.nicho}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Objetivo:</span> {form.objetivo}</p>
                      <p><span className="font-medium">Frequência:</span> {form.frequencia_posts}x por semana</p>
                      <p><span className="font-medium">Tom:</span> {form.tom_voz}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Público:</span> {' '}
                    {form.publico_alvo.length > 100 
                      ? `${form.publico_alvo.substring(0, 100)}...` 
                      : form.publico_alvo
                    }
                  </p>
                </div>

                <div className="flex flex-col space-y-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGenerateContent(form.id)}
                      disabled={generating === form.id}
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {generating === form.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                          Gerando...
                        </>
                      ) : (
                        '🤖 Gerar Conteúdo'
                      )}
                    </button>
                    <Link
                      to={`/client/results/${form.id}`}
                      className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200"
                    >
                      Ver Resultados
                    </Link>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    Criado em {formatDate(form.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400 text-xl">🤖</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                Como funciona a geração de conteúdo?
              </h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>1. <strong>Preencha o formulário</strong> com informações detalhadas sobre seu negócio</p>
                <p>2. <strong>Clique em "Gerar Conteúdo"</strong> para que nossa IA crie posts personalizados</p>
                <p>3. <strong>Visualize e edite</strong> o conteúdo gerado conforme necessário</p>
                <p>4. <strong>Salve e exporte</strong> os posts para usar em suas redes sociais</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyForms;