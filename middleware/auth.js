const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Acesso negado. Token não fornecido.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido.' 
    });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Acesso negado. Apenas administradores podem acessar esta rota.' 
      });
    }
    next();
  });
};

const verifyClient = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.user_type !== 'client') {
      return res.status(403).json({ 
        success: false, 
        message: 'Acesso negado. Apenas clientes podem acessar esta rota.' 
      });
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin, verifyClient };