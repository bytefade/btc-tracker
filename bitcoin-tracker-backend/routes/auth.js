const express = require("express");
const router = express.Router();
const ApiKey = require("../models/ApiKey");

//POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ msg: "Chave é obrigatória" });
    }

    const apiKey = await ApiKey.findOne({ key });
    if (!apiKey) {
      return res.status(401).json({ msg: "Chave inválida" });
    }

    res.json({ msg: "Login bem sucedido", key });
  } catch (err) {
    res.status(500).json({ msg: "Erro interno do servidor" });
  }
});

module.exports = router;
