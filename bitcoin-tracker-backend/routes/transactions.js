const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");

// Middleware para validar API key (simples, via header 'x-api-key')
const authenticateToken = (req, res, next) => {
  const apiKey = req.header("x-api-key");
  console.log(
    "🔐 Middleware auth chamado - headers: ",
    req.headers["x-api-key"] ? "Presente" : "Ausente",
  );
  console.log("apiKey recebido: ", apiKey);
  if (!apiKey) return res.status(401).json({ msg: "Chave API requerida" });
  try {
    const decoded = jwt.verify(apiKey, process.env.JWT_SECRET); //Valida como JWT simples
    console.log("JWT decodado: ", decoded);
    if (Date.now >= decoded.exp * 1000) {
      console.error("X Token expirado");
      return res.status(403).json({ msg: "Chave expirada" });
    }
    req.userApiKey = decoded.key;
    next();
  } catch (err) {
    console.error("❌ Erro na verificação JWT:", err.message);
    res.status(403).json({ msg: "Chave inválida" });
  }
};

// POST /api/transaction - Inserir transação
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { type, date, btcAmount, brlPricePerBtc, notes } = req.body;
    const totalBrl = btcAmount * brlPricePerBtc;
    const transaction = new Transaction({
      userApiKey: req.userApiKey,
      type,
      date: new Date(date), //Garante que date seja um objeto Date
      btcAmount,
      brlPricePerBtc,
      totalBrl,
      notes,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// GET /api/transaction - Listar transações (com filtro por mês opcional)
router.get("/", authenticateToken, async (req, res) => {
  try {
    console.log(
      "Requisição de listagem - userApiKey: ",
      req.userApiKey,
      "Query: ",
      req.query,
    );
    const { month } = req.query; //Ex: ?month=2025-10
    let filter = { userApiKey: req.userApiKey };

    if (month) {
      //Valida formato YYYY-MM
      if (!/^\d{4}-\d{2}$/.test(month)) {
        console.error("X Formato de mês inválido: ", month);
        return res
          .status(400)
          .json({ msg: "Formato de mês inválido. Use YYYY-MM." });
      }

      const [year, mon] = month.split("-").map(Number);
      console.log("Filtro de mês: ", { year, mon });

      //Verifica se year e mon são números válidos
      if (isNaN(year) || isNaN(mon) || mon < 1 || mon > 12) {
        console.error("X Ano ou mês inválido: ", { year, mon });
        return res.status(400).json({ msh: "Ano ou mês inválido." });
      }
      // Cria intervalo de datas
      const startDate = new Date(year, mon - 1, 1);
      const endDate = new Date(year, mon, 0);
      console.log("Intervalo de filtro: ", { startDate, endDate });

      // Verifica se as datas são válidas
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error("Datas inválidas: ", { startDate, endDate });
        return res.status(400).json({ msg: "Datas inválidas no filtro." });
      }

      filter.date = {
        $gte: new Date(year, mon - 1, 1),
        $lt: new Date(year, mon, 0),
      };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    //Cálculo de resumo mensal para vendas
    const monthlySales = transactions
      .filter((t) => t.type === "venda")
      .reduce((sum, t) => sum + t.totalBrl, 0);
    const isExemt = monthlySales <= 35000;

    console.log("Transações encontradas: ", transactions.lenght);

    res.json({ transactions, summary: { monthlySales, isExemt } });
  } catch (err) {
    console.error("X erro na listagem", err.message);
    res.status(500).json({ msg: err.message });
  }
});

// Rota para gerar chave API (simples, chame uma vez)
router.get("/generate-key", (req, res) => {
  console.log("Rota generate-key HITADA! Headers recebidos", req.headers);
  console.log(
    "JWT_SECRET carregando?",
    !!process.env.JWT_SECRET ? "Sim" : "Não",
  );
  try {
    const payload = {
      key: "user_unique_id",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, //Expira em 1 ano
    };
    const apiKey = jwt.sign(payload, process.env.JWT_SECRET);
    console.log("Chave gerada com sucesso! Payload: ", payload);
    res.json({ apiKey });
  } catch (err) {
    console.error("Erro ao gerar JWT; ", err.message);
    res.status(500).json({ msg: "Erro interno ao gerar chave" });
  }
});

module.exports = router;
