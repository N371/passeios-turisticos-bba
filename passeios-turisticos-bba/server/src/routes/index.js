const bodyParser = require("body-parser");
const guiasTuristicos = require("./guiasTuristicosRoute");
const restaurantes = require("./restaurantesRoute");
const hospedagens = require("./hospedagensRoute");
const informacoesUteis = require("./informacoesUteisRoute");
const atracoesTuristicas = require("./atracoesTuristicasRoute");
const usuarios = require("./usuariosRoute");
const eventos = require("./eventosRoute");
const auth = require("./authRoute");
const sms = require("./smsRoutes");
const mensagens = require("./tb_sms_controlRoutes");
module.exports = (app) => {
  app.use(
    bodyParser.json(),
    guiasTuristicos,
    restaurantes,
    hospedagens,
    informacoesUteis,
    atracoesTuristicas,
    usuarios,
    eventos,
    auth,
    sms,
    mensagens
  );
};
