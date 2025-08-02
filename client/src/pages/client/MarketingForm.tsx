import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formService } from '../../services/api';

const MarketingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nicho: '',
    objetivo: '',
    publico_alvo: '',
    frequencia_posts: 3,
    tom_voz: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'frequencia_posts' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await formService.createForm(formData);
      
      if (response.success) {
        navigate('/client/my-forms', { 
          state: { message: 'Formulário criado com sucesso! Agora você pode gerar conteúdo.' }
        });
      } else {
        setError(response.message || 'Erro ao salvar formulário.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar formulário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📝 Formulário de Marketing</h1>
          <p className="mt-2 text-gray-600">
            Preencha as informações abaixo para gerar conteúdo personalizado para suas redes sociais
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Nicho de Mercado */}
            <div>
              <label htmlFor="nicho" className="block text-sm font-medium text-gray-700 mb-2">
                Nicho de Mercado *
              </label>
              <input
                type="text"
                id="nicho"
                name="nicho"
                required
                className="input-field"
                placeholder="Ex: estética, alimentação, moda, fitness..."
                value={formData.nicho}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                Qual é o seu segmento de atuação?
              </p>
            </div>

            {/* Objetivo Principal */}
            <div>
              <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo Principal *
              </label>
              <select
                id="objetivo"
                name="objetivo"
                required
                className="input-field"
                value={formData.objetivo}
                onChange={handleChange}
              >
                <option value="">Selecione um objetivo</option>
                <option value="vender">Vender produtos/serviços</option>
                <option value="gerar autoridade">Gerar autoridade</option>
                <option value="atrair seguidores">Atrair seguidores</option>
                <option value="educar">Educar audiência</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Qual é o principal objetivo das suas redes sociais?
              </p>
            </div>

            {/* Público-Alvo */}
            <div>
              <label htmlFor="publico_alvo" className="block text-sm font-medium text-gray-700 mb-2">
                Público-Alvo *
              </label>
              <textarea
                id="publico_alvo"
                name="publico_alvo"
                required
                rows={3}
                className="input-field"
                placeholder="Ex: mulheres de 25 a 40 anos, interessadas em beleza e autoestima..."
                value={formData.publico_alvo}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                Descreva quem é o seu público ideal (idade, gênero, interesses, etc.)
              </p>
            </div>

            {/* Frequência de Posts */}
            <div>
              <label htmlFor="frequencia_posts" className="block text-sm font-medium text-gray-700 mb-2">
                Frequência de Posts por Semana *
              </label>
              <select
                id="frequencia_posts"
                name="frequencia_posts"
                required
                className="input-field"
                value={formData.frequencia_posts}
                onChange={handleChange}
              >
                <option value={3}>3 vezes por semana</option>
                <option value={5}>5 vezes por semana</option>
                <option value={7}>7 vezes por semana (diário)</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Com que frequência você pretende postar conteúdo?
              </p>
            </div>

            {/* Tom de Voz */}
            <div>
              <label htmlFor="tom_voz" className="block text-sm font-medium text-gray-700 mb-2">
                Tom de Voz *
              </label>
              <select
                id="tom_voz"
                name="tom_voz"
                required
                className="input-field"
                value={formData.tom_voz}
                onChange={handleChange}
              >
                <option value="">Selecione um tom</option>
                <option value="profissional">Profissional</option>
                <option value="amigavel">Amigável</option>
                <option value="divertido">Divertido</option>
                <option value="inspirador">Inspirador</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Como você quer se comunicar com sua audiência?
              </p>
            </div>

            {/* Botões */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/client/dashboard')}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Salvar Formulário'}
              </button>
            </div>
          </form>
        </div>

        {/* Dica */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Dica importante
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Seja o mais específico possível nas suas respostas. Quanto mais detalhes você fornecer,
                  mais personalizado e eficaz será o conteúdo gerado pela IA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingForm;