import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'caixinha_do_bem',
  waitForConnections: true,
  connectionLimit: 10
});

// Verifica conexão com o banco
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'conectado' });
  } catch (error) {
    res.status(500).json({ status: 'erro', mensagem: error.message || error.code });
  }
});

// ROTAS DE DOADORES
app.get('/api/doadores', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM doadores ORDER BY id DESC');
  res.json(rows);
});

app.post('/api/doadores', async (req, res) => {
  const { nome, telefone, email } = req.body;
  const [result] = await pool.query(
    'INSERT INTO doadores (nome, telefone, email) VALUES (?, ?, ?)',
    [nome, telefone, email || null]
  );
  res.status(201).json({ id: result.insertId, nome, telefone, email });
});

app.delete('/api/doadores/:id', async (req, res) => {
  await pool.query('DELETE FROM doadores WHERE id = ?', [req.params.id]);
  res.sendStatus(204);
});

// ROTAS DE ITENS
app.get('/api/itens', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM itens ORDER BY id DESC');
  res.json(rows);
});

app.post('/api/itens', async (req, res) => {
  const { nome, categoria } = req.body;
  const [result] = await pool.query(
    'INSERT INTO itens (nome, categoria) VALUES (?, ?)',
    [nome, categoria]
  );
  res.status(201).json({ id: result.insertId, nome, categoria });
});

app.delete('/api/itens/:id', async (req, res) => {
  await pool.query('DELETE FROM itens WHERE id = ?', [req.params.id]);
  res.sendStatus(204);
});

// ROTAS DE DOAÇÕES
app.get('/api/doacoes', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT d.id, d.quantidade, d.observacao, d.data_doacao,
           doa.nome AS doador, i.nome AS item
    FROM doacoes d
    JOIN doadores doa ON d.doador_id = doa.id
    JOIN itens i ON d.item_id = i.id
    ORDER BY d.id DESC
  `);
  res.json(rows);
});

app.post('/api/doacoes', async (req, res) => {
  const { doador_id, item_id, quantidade, observacao } = req.body;
  const [result] = await pool.query(
    'INSERT INTO doacoes (doador_id, item_id, quantidade, observacao) VALUES (?, ?, ?, ?)',
    [doador_id, item_id, quantidade, observacao || null]
  );
  res.status(201).json({ id: result.insertId });
});

app.delete('/api/doacoes/:id', async (req, res) => {
  await pool.query('DELETE FROM doacoes WHERE id = ?', [req.params.id]);
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Caixinha do bem rodando em http://localhost:${PORT}`);
});
