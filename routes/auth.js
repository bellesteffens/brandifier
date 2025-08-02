const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios.'
    });
  }

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor.'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos.'
        });
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha incorretos.'
        });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          name: user.name,
          user_type: user.user_type 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login realizado com sucesso!',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type
        }
      });
    }
  );
});

// Registro
router.post('/register', (req, res) => {
  const { email, password, name, user_type } = req.body;

  if (!email || !password || !name || !user_type) {
    return res.status(400).json({
      success: false,
      message: 'Todos os campos são obrigatórios.'
    });
  }

  if (!['admin', 'client'].includes(user_type)) {
    return res.status(400).json({
      success: false,
      message: 'Tipo de usuário inválido.'
    });
  }

  // Verificar se o email já existe
  db.get(
    'SELECT id FROM users WHERE email = ?',
    [email],
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
          message: 'Email já está cadastrado.'
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      db.run(
        'INSERT INTO users (email, password, name, user_type) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, name, user_type],
        function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Erro ao criar usuário.'
            });
          }

          const token = jwt.sign(
            { 
              id: this.lastID, 
              email, 
              name,
              user_type 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso!',
            token,
            user: {
              id: this.lastID,
              email,
              name,
              user_type
            }
          });
        }
      );
    }
  );
});

module.exports = router;