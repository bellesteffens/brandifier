const express = require('express');
const OpenAI = require('openai');
const { db } = require('../config/database');
const { verifyClient } = require('../middleware/auth');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Gerar conteúdo com IA
router.post('/generate/:form_id', verifyClient, async (req, res) => {
  const form_id = req.params.form_id;
  const user_id = req.user.id;

  try {
    // Buscar o formulário
    const form = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM marketing_forms WHERE id = ? AND user_id = ?',
        [form_id, user_id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Formulário não encontrado.'
      });
    }

    // Verificar se já foi gerado conteúdo para este formulário
    const existingPosts = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM generated_posts WHERE form_id = ?',
        [form_id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    if (existingPosts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Conteúdo já foi gerado para este formulário. Acesse a página de resultados para visualizar.'
      });
    }

    // Montar prompt para a IA
    const prompt = `Você é um assistente de marketing digital. Com base nas informações abaixo, gere:

1. Um calendário com 5 sugestões de posts para Instagram. Para cada post, inclua:
   - Título
   - Legenda (até 300 caracteres)
   - Tipo de post (Reel, carrossel, imagem, vídeo curto)
   - Hashtags relevantes

2. Recomendações personalizadas:
   - Melhores horários para postar para esse público
   - Tipo de conteúdo mais indicado
   - Sugestão de frequência ideal
   - Melhor CTA para esse perfil
   - Uma dica estratégica extra para aumentar engajamento

Informações do usuário:
- Nicho: ${form.nicho}
- Objetivo: ${form.objetivo}
- Público-alvo: ${form.publico_alvo}
- Frequência desejada: ${form.frequencia_posts} vezes por semana
- Tom de voz: ${form.tom_voz}

IMPORTANTE: Responda APENAS em formato JSON válido com a seguinte estrutura:
{
  "posts": [
    {
      "titulo": "...",
      "legenda": "...",
      "tipo_post": "...",
      "hashtags": "..."
    }
  ],
  "recomendacoes": {
    "melhores_horarios": "...",
    "tipo_conteudo_indicado": "...",
    "frequencia_ideal": "...",
    "melhor_cta": "...",
    "dica_estrategica": "..."
  }
}`;

    // Chamar a API da OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em marketing digital e redes sociais. Sempre responda em JSON válido conforme solicitado."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Parse da resposta JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta da IA:', parseError);
      return res.status(500).json({
        success: false,
        message: 'Erro ao processar resposta da IA. Tente novamente.'
      });
    }

    // Salvar posts no banco
    const postsPromises = parsedResponse.posts.map(post => {
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO generated_posts (form_id, titulo, legenda, tipo_post, hashtags) VALUES (?, ?, ?, ?, ?)',
          [form_id, post.titulo, post.legenda, post.tipo_post, post.hashtags],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });
    });

    await Promise.all(postsPromises);

    // Salvar recomendações no banco
    await new Promise((resolve, reject) => {
      const rec = parsedResponse.recomendacoes;
      db.run(
        `INSERT INTO recommendations 
         (form_id, melhores_horarios, tipo_conteudo_indicado, frequencia_ideal, melhor_cta, dica_estrategica) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          form_id,
          rec.melhores_horarios,
          rec.tipo_conteudo_indicado,
          rec.frequencia_ideal,
          rec.melhor_cta,
          rec.dica_estrategica
        ],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    res.json({
      success: true,
      message: 'Conteúdo gerado com sucesso!',
      data: parsedResponse
    });

  } catch (error) {
    console.error('Erro na geração de conteúdo:', error);
    
    if (error.code === 'invalid_api_key') {
      return res.status(500).json({
        success: false,
        message: 'Erro de configuração da API OpenAI. Verifique a chave de API.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente mais tarde.'
    });
  }
});

// Editar post gerado
router.put('/posts/:post_id', verifyClient, (req, res) => {
  const post_id = req.params.post_id;
  const { titulo, legenda, tipo_post, hashtags } = req.body;
  const user_id = req.user.id;

  if (!titulo || !legenda || !tipo_post || !hashtags) {
    return res.status(400).json({
      success: false,
      message: 'Todos os campos são obrigatórios.'
    });
  }

  // Verificar se o post pertence ao usuário
  db.get(
    `SELECT p.*, f.user_id 
     FROM generated_posts p 
     JOIN marketing_forms f ON p.form_id = f.id 
     WHERE p.id = ? AND f.user_id = ?`,
    [post_id, user_id],
    (err, post) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor.'
        });
      }

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado.'
        });
      }

      // Atualizar o post
      db.run(
        'UPDATE generated_posts SET titulo = ?, legenda = ?, tipo_post = ?, hashtags = ? WHERE id = ?',
        [titulo, legenda, tipo_post, hashtags, post_id],
        function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Erro ao atualizar post.'
            });
          }

          res.json({
            success: true,
            message: 'Post atualizado com sucesso!'
          });
        }
      );
    }
  );
});

module.exports = router;