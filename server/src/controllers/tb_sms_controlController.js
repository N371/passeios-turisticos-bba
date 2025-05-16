const db = require("../models");
const TbSmsControl = db.tb_sms_control;

exports.createTbSmsControl = async (req, res) => {
  try {
    const {
      nr_telefone,
      texto,
      data_gravacao,
      data_envio,
      status,
    } = req.body;

    // Validação dos campos obrigatórios
    if (!nr_telefone || !texto || !data_gravacao || !status) {
      return res.status(400).json({
        error:
          "Campos obrigatórios faltando: nr_telefone, texto, data_gravacao e status.",
      });
    }

    const novoRegistro = await TbSmsControl.create({
      nr_telefone,
      texto,
      data_gravacao: new Date(data_gravacao),
      data_envio: data_envio ? new Date(data_envio) : null,
      status,
    });

    return res.status(201).json(novoRegistro);
  } catch (error) {
    console.error("Erro ao criar tb_sms_control:", error);
    return res.status(500).json({ error: "Erro interno ao criar registro." });
  }
};

