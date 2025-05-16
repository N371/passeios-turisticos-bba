const express = require("express");
const cors = require("cors");
const path = require("path");
const smsRoutes = require("./routes/smsRoutes");            // rotas SMS
const tbSmsControlRoutes = require("./routes/tb_sms_controlRoutes"); // rotas tb_sms_control

const app = express();

app.use(express.json()); // para ler JSON do body

app.use(
  cors({
    origin: "https://passeiosturisticosbba.vercel.app",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Monta as rotas
app.use("/sms", smsRoutes);              // rotas SMS em /sms
app.use("/mensagens", tbSmsControlRoutes); // rotas tb_sms_control em /mensagens

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "../public") });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ mensagem: "Página não encontrada.", status: 404 });
});

module.exports = app;

