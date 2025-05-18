const express = require("express");
const router = express.Router();
const tbSmsControlController = require("../controllers/tb_sms_controlController");

router.post("/mensagens", tbSmsControlController.createTbSmsControl);

module.exports = router;

