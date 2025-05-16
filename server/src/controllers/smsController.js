const db = require('../models');
const SMS = db.sms;

exports.createSMS = async (req, res) => {
  try {
    const {
      nome,
      email,
      telefone,
      consentimento,
      data_cadastro,
      status,
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (!nome || !email || !telefone || consentimento === undefined || status === undefined) {
      return res.status(400).json({ error: "Campos obrigatórios faltando: nome, email, telefone, consentimento e status." });
    }

    // Criar novo registro, definindo data_cadastro atual se não fornecida
    const novoSMS = await SMS.create({
      nome,
      email,
      telefone,
      consentimento,
      data_cadastro: data_cadastro ? new Date(data_cadastro) : new Date(),
      status,
    });

    return res.status(201).json(novoSMS);
  } catch (error) {
    console.error("Erro ao criar SMS:", error);
    // Retornar mensagem genérica para o usuário, sem vazar dados sensíveis
    return res.status(500).json({ error: "Erro interno ao criar SMS." });
  }
};

