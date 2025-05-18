/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const { Pool } = require("pg");
const fetch = require("node-fetch");
const swaggerUi = require("swagger-ui-express");
const manipuladorDeErros = require("./middlewares/manipuladorDeErros");
const manipulador404 = require("./middlewares/manipulador404");
const routes = require("./routes");

const app = express();
app.use(express.static(path.join(__dirname, "../public")));

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

var swaggerOptions = {
  customCssUrl: "/swagger-ui.css",
};

const swaggerDocument = require(path.join(__dirname, "../public/swagger-config.json"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

routes(app);

app.use(manipulador404);
app.use(manipuladorDeErros);

// ==============================
// CONEXÃO COM O BANCO DE DADOS (PARA AS ROTINAS CRON)
// ==============================
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "turismo-bba",
  password: "root",
  port: 5432,
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
      console.log("Nenhum evento ativo no momento (rotina de 5 minutos).");
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
      console.log("Nenhum contato com consentimento e status ativo (rotina de 5 minutos).");
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

    console.log(`Mensagens inseridas na tb_sms_control com sucesso às ${dataGravacao.toISOString()} (rotina de 5 minutos).`);

  } catch (err) {
    console.error("Erro na rotina CRON de 5 minutos:", err.message);
  } finally {
    client.release();
  }
});

// ==============================
// ROTINA CRON: A CADA 10 MINUTOS
// ==============================
cron.schedule("*/10 * * * *", async () => {
  const client = await pool.connect();
  try {
    const now = new Date();

    // 1. Buscar registros na tb_sms_control com data_envio IS NULL
    const selectQuery = `
        SELECT nr_telefone, texto
        FROM tb_sms_control
        WHERE data_envio IS NULL
    `;
    const result = await client.query(selectQuery);
    const mensagensParaEnviar = result.rows;

    if (mensagensParaEnviar.length === 0) {
      console.log("Nenhuma mensagem pendente para envio (data_envio IS NULL) na tb_sms_control (rotina de 10 minutos).");
      return;
    }

    const endpointUrl = "http://127.0.0.1:8181/enviar_sms";
    //const endpointUrl= "https://sms.comtele.com.br/api/v2/send";
    const authKey = "08f06139-561c-4135-a03c-180bac53eab0";

    for (const msg of mensagensParaEnviar) {
      const body = {
        Sender: "PI5",
        Receivers: [msg.nr_telefone],
        Content: "Novo Evento",
        message: msg.texto,
      };

      try {
        const response = await fetch(endpointUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-key": authKey,
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(`SMS enviado para ${msg.nr_telefone}:`, responseData);
          
          const updateQuery = `
              UPDATE tb_sms_control
              SET data_envio = $1
              WHERE nr_telefone = $2 AND texto = $3
          `;
          await client.query(updateQuery, [now, msg.nr_telefone, msg.texto]);
        } else {
          console.error(`Falha ao enviar SMS para ${msg.nr_telefone}. Status: ${response.status}`);
          const errorData = await response.json();
          console.error("Erro:", errorData);
        }
      } catch (error) {
        console.error(`Erro ao enviar SMS para ${msg.nr_telefone}:`, error.message);
      }
    }

    console.log(`Rotina de envio de SMS executada às ${now.toISOString()} (rotina de 10 minutos).`);

  } catch (err) {
    console.error("Erro na rotina CRON de 10 minutos:", err.message);
  } finally {
    client.release();
  }
});

module.exports = app;
