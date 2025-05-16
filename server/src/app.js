const express = require("express");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const { Pool } = require("pg");

const smsRoutes = require("./routes/smsRoutes");
const tbSmsControlRoutes = require("./routes/tb_sms_controlRoutes");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://passeiosturisticosbba.vercel.app",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/sms", smsRoutes);
app.use("/mensagens", tbSmsControlRoutes);

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "../public") });
});

app.use((req, res) => {
  res.status(404).json({ mensagem: "Página não encontrada.", status: 404 });
});

// ==============================
// CONEXÃO COM O BANCO DE DADOS
// ==============================
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "turismo-bba",
  password: "root",
  port: 5432, // padrão PostgreSQL
});

// ==============================
// ROTINA CRON: A CADA 5 MINUTOS
// ==============================
cron.schedule("*/5 * * * *", async () => {
  const client = await pool.connect();
  try {
    const agora = new Date();

    // 1. Buscar eventos ativos
    const eventosQuery = `
      SELECT nome, descricao, endereco
      FROM eventos
      WHERE $1 BETWEEN data_inicio AND data_fim
    `;
    const eventosResult = await client.query(eventosQuery, [agora]);

    if (eventosResult.rows.length === 0) {
      console.log("Nenhum evento ativo no momento.");
      return;
    }

    const mensagens = eventosResult.rows.map(e => `${e.nome} ${e.descricao} ${e.endereco}`);

    // 2. Buscar contatos válidos
    const contatosQuery = `
      SELECT telefone
      FROM sms
      WHERE status = true AND consentimento = true
    `;
    const contatosResult = await client.query(contatosQuery);

    if (contatosResult.rows.length === 0) {
      console.log("Nenhum contato com consentimento e status ativo.");
      return;
    }

    // 3. Inserir mensagens na tb_sms_control
    const insertQuery = `
      INSERT INTO tb_sms_control (nr_telefone, texto, data_gravacao, data_envio, status)
      VALUES ($1, $2, $3, NULL, NULL)
    `;

    const dataGravacao = new Date();

    for (const msg of mensagens) {
      for (const contato of contatosResult.rows) {
        await client.query(insertQuery, [
          contato.telefone,
          msg,
          dataGravacao
        ]);
      }
    }

    console.log(`Mensagens inseridas com sucesso às ${dataGravacao.toISOString()}`);

  } catch (err) {
    console.error("Erro na rotina CRON:", err.message);
  } finally {
    client.release();
  }
});

module.exports = app;

