const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../config/database');
const { verifyAdmin, verifyToken } = require('../middleware/auth');
const router = express.Router();

// Listar todos os usuários (apenas admin)
router.get('/', verifyAdmin, (req, res) => {
  db.all(
    `SELECT id, email, name, user_type, created_at 
     FROM users 
     ORDER BY created_at DESC`,
    [],
    (err, users) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar usuários.'
        });
      }

      res.json({
        success: true,
        users
      });
    }
  );
});

// Buscar usuário específico (admin pode ver qualquer um, cliente só a si mesmo)
router.get('/:id', verifyToken, (req, res) => {
  const userId = req.params.id;
  const requestingUserId = req.user.id;
  const isAdmin = req.user.user_type === 'admin';

  // Se não for admin, só pode ver seus próprios dados
  if (!isAdmin && userId != requestingUserId) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado.'
    });
  }

  db.get(
    'SELECT id, email, name, user_type, created_at FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar usuário.'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado.'
        });
      }

      res.json({
        success: true,
        user
      });
    }
  );
});

// Atualizar usuário (admin pode editar qualquer um, cliente só a si mesmo)
router.put('/:id', verifyToken, (req, res) => {
  const userId = req.params.id;
  const requestingUserId = req.user.id;
  const isAdmin = req.user.user_type === 'admin';
  const { name, email, password } = req.body;

  // Se não for admin, só pode editar seus próprios dados
  if (!isAdmin && userId != requestingUserId) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado.'
    });
  }

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Nome e email são obrigatórios.'
    });
  }

  // Verificar se o usuário existe
  db.get(
    'SELECT id FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor.'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado.'
        });
      }

      // Verificar se o email já está em uso por outro usuário
      db.get(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId],
        (err, existingUser) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Erro interno do servidor.'
            });
          }

          if (existingUser) {
            return res.status(409).json({
              success: false,
              message: 'Email já está em uso por outro usuário.'
            });
          }

          // Preparar a query de update
          let updateQuery = 'UPDATE users SET name = ?, email = ?';
          let params = [name, email];

          // Se foi fornecida uma nova senha, incluir na atualização
          if (password && password.trim() !== '') {
            const hashedPassword = bcrypt.hashSync(password, 10);
            updateQuery += ', password = ?';
            params.push(hashedPassword);
          }

          updateQuery += ' WHERE id = ?';
          params.push(userId);

          db.run(updateQuery, params, function(err) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar usuário.'
              });
            }

            res.json({
              success: true,
              message: 'Usuário atualizado com sucesso!'
            });
          });
        }
      );
    }
  );
});

// Deletar usuário (apenas admin)
router.delete('/:id', verifyAdmin, (req, res) => {
  const userId = req.params.id;

  // Não permitir que o admin delete a si mesmo
  if (userId == req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Você não pode deletar sua própria conta.'
    });
  }

  // Verificar se o usuário existe
  db.get(
    'SELECT id FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor.'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado.'
        });
      }

      // Deletar o usuário (as tabelas relacionadas devem ser limpas também)
      db.serialize(() => {
        db.run('DELETE FROM recommendations WHERE form_id IN (SELECT id FROM marketing_forms WHERE user_id = ?)', [userId]);
        db.run('DELETE FROM generated_posts WHERE form_id IN (SELECT id FROM marketing_forms WHERE user_id = ?)', [userId]);
        db.run('DELETE FROM marketing_forms WHERE user_id = ?', [userId]);
        db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Erro ao deletar usuário.'
            });
          }

          res.json({
            success: true,
            message: 'Usuário deletado com sucesso!'
          });
        });
      });
    }
  );
});

// Estatísticas do sistema (apenas admin)
router.get('/stats/overview', verifyAdmin, (req, res) => {
  db.serialize(() => {
    let stats = {};

    // Contar usuários por tipo
    db.get(
      'SELECT COUNT(*) as total FROM users',
      [],
      (err, totalUsers) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Erro ao buscar estatísticas.'
          });
        }
        stats.totalUsers = totalUsers.total;

        db.get(
          "SELECT COUNT(*) as total FROM users WHERE user_type = 'client'",
          [],
          (err, totalClients) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Erro ao buscar estatísticas.'
              });
            }
            stats.totalClients = totalClients.total;

            // Contar formulários
            db.get(
              'SELECT COUNT(*) as total FROM marketing_forms',
              [],
              (err, totalForms) => {
                if (err) {
                  return res.status(500).json({
                    success: false,
                    message: 'Erro ao buscar estatísticas.'
                  });
                }
                stats.totalForms = totalForms.total;

                // Contar posts gerados
                db.get(
                  'SELECT COUNT(*) as total FROM generated_posts',
                  [],
                  (err, totalPosts) => {
                    if (err) {
                      return res.status(500).json({
                        success: false,
                        message: 'Erro ao buscar estatísticas.'
                      });
                    }
                    stats.totalPosts = totalPosts.total;

                    res.json({
                      success: true,
                      stats
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

module.exports = router;