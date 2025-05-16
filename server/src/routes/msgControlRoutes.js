const db = require("../db");

exports.createMensagem = async (req, res) => {
  const { nr_telefone, texto, data_gravacao, data_envio, status } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO tb_msg_control 
       (nr_telefone, texto, data_gravacao, data_envio, status) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [nr_telefone, texto, data_gravacao, data_envio, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao inserir mensagem." });
  }
};

