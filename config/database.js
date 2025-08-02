const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const init = () => {
  // Tabela de usuários
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'client')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de formulários de marketing
  db.run(`CREATE TABLE IF NOT EXISTS marketing_forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    nicho TEXT NOT NULL,
    objetivo TEXT NOT NULL,
    publico_alvo TEXT NOT NULL,
    frequencia_posts INTEGER NOT NULL,
    tom_voz TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Tabela de posts gerados
  db.run(`CREATE TABLE IF NOT EXISTS generated_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    legenda TEXT NOT NULL,
    tipo_post TEXT NOT NULL,
    hashtags TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES marketing_forms (id)
  )`);

  // Tabela de recomendações personalizadas
  db.run(`CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER NOT NULL,
    melhores_horarios TEXT NOT NULL,
    tipo_conteudo_indicado TEXT NOT NULL,
    frequencia_ideal TEXT NOT NULL,
    melhor_cta TEXT NOT NULL,
    dica_estrategica TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES marketing_forms (id)
  )`);

  // Criar usuários de teste
  createTestUsers();
  
  console.log('💾 Banco de dados inicializado com sucesso!');
};

const createTestUsers = () => {
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const clientPassword = bcrypt.hashSync('cliente123', 10);

  // Verificar se usuários já existem
  db.get('SELECT id FROM users WHERE email = ?', ['admin@teste.com'], (err, row) => {
    if (!row) {
      db.run(
        'INSERT INTO users (email, password, name, user_type) VALUES (?, ?, ?, ?)',
        ['admin@teste.com', adminPassword, 'Admin Teste', 'admin'],
        function(err) {
          if (!err) {
            console.log('👤 Usuário admin criado: admin@teste.com / admin123');
          }
        }
      );
    }
  });

  db.get('SELECT id FROM users WHERE email = ?', ['cliente@teste.com'], (err, row) => {
    if (!row) {
      db.run(
        'INSERT INTO users (email, password, name, user_type) VALUES (?, ?, ?, ?)',
        ['cliente@teste.com', clientPassword, 'Cliente Teste', 'client'],
        function(err) {
          if (!err) {
            console.log('👤 Usuário cliente criado: cliente@teste.com / cliente123');
          }
        }
      );
    }
  });
};

module.exports = { db, init };