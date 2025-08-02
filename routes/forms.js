const express = require('express');
const { db } = require('../config/database');
const { verifyToken, verifyClient, verifyAdmin } = require('../middleware/auth');
const router = express.Router();

// Criar formulário (apenas clientes)
router.post('/', verifyClient, (req, res) => {
  const { nicho, objetivo, publico_alvo, frequencia_posts, tom_voz } = req.body;
  const user_id = req.user.id;

  if (!nicho || !objetivo || !publico_alvo || !frequencia_posts || !tom_voz) {
    return res.status(400).json({
      success: false,
      message: 'Todos os campos são obrigatórios.'
    });
  }

  if (![3, 5, 7].includes(frequencia_posts)) {
    return res.status(400).json({
      success: false,
      message: 'Frequência de posts deve ser 3, 5 ou 7.'
    });
  }

  const validTons = ['profissional', 'amigavel', 'divertido', 'inspirador'];
  if (!validTons.includes(tom_voz)) {
    return res.status(400).json({
      success: false,
      message: 'Tom de voz inválido.'
    });
  }

  db.run(
    `INSERT INTO marketing_forms 
     (user_id, nicho, objetivo, publico_alvo, frequencia_posts, tom_voz) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, nicho, objetivo, publico_alvo, frequencia_posts, tom_voz],
    function(err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao salvar formulário.'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Formulário criado com sucesso!',
        form_id: this.lastID
      });
    }
  );
});

// Listar formulários do usuário logado (clientes)
router.get('/my-forms', verifyClient, (req, res) => {
  const user_id = req.user.id;

  db.all(
    `SELECT * FROM marketing_forms WHERE user_id = ? ORDER BY created_at DESC`,
    [user_id],
    (err, forms) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar formulários.'
        });
      }

      res.json({
        success: true,
        forms
      });
    }
  );
});

// Buscar formulário específico com posts e recomendações
router.get('/:id', verifyToken, (req, res) => {
  const form_id = req.params.id;
  const user_id = req.user.id;
  const isAdmin = req.user.user_type === 'admin';

  // Query base para o formulário
  let formQuery = `
    SELECT f.*, u.name as user_name, u.email as user_email 
    FROM marketing_forms f 
    JOIN users u ON f.user_id = u.id 
    WHERE f.id = ?
  `;
  let formParams = [form_id];

  // Se não for admin, filtrar pelo user_id
  if (!isAdmin) {
    formQuery += ' AND f.user_id = ?';
    formParams.push(user_id);
  }

  db.get(formQuery, formParams, (err, form) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar formulário.'
      });
    }

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Formulário não encontrado.'
      });
    }

    // Buscar posts gerados
    db.all(
      'SELECT * FROM generated_posts WHERE form_id = ? ORDER BY created_at',
      [form_id],
      (err, posts) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Erro ao buscar posts.'
          });
        }

        // Buscar recomendações
        db.get(
          'SELECT * FROM recommendations WHERE form_id = ?',
          [form_id],
          (err, recommendations) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Erro ao buscar recomendações.'
              });
            }

            res.json({
              success: true,
              form,
              posts: posts || [],
              recommendations: recommendations || null
            });
          }
        );
      }
    );
  });
});

// Listar todos os formulários (apenas admin)
router.get('/', verifyAdmin, (req, res) => {
  db.all(
    `SELECT f.*, u.name as user_name, u.email as user_email 
     FROM marketing_forms f 
     JOIN users u ON f.user_id = u.id 
     ORDER BY f.created_at DESC`,
    [],
    (err, forms) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar formulários.'
        });
      }

      res.json({
        success: true,
        forms
      });
    }
  );
});

module.exports = router;