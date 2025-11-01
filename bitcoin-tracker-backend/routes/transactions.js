const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const ApiKey = require("../models/ApiKey");

// Middleware de autenticação
const authenticate = async (req, res, next) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey) return res.status(401).json({ msg: "Chave requerida" });
  try {
    const keyDoc = await ApiKey.findOne({ key: apiKey });
    if (!keyDoc) {
      return res.status(403).json({ msg: "Chave inválida" });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: "Erro na autenticação" });
  }
};

// POST /api/transaction
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      type,
      date,
      btcAmount,
      brlPricePerBtc,
      totalBrl,
      brokerageFeeType,
      brokerageFeeValue,
      notes,
    } = req.body;

    if (!["compra", "venda"].includes(type)) {
      return res.status(400).json({ msg: "Tipo inválido" });
    }
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ msh: "Data inválida" });
    }
    if (!btcAmount || btcAmount <= 0) {
      return res.status(400).json({ msg: "Quantidade BTC inválida" });
    }
    if (!brlPricePerBtc || brlPricePerBtc <= 0) {
      return res.status(400).json({ msg: "Preço unitário inválido" });
    }

    let brokerageFee = 0;
    if (brokerageFeeType && brokerageFeeValue) {
      if (brokerageFeeType === "reais") {
        brokerageFee = Number(brokerageFeeValue);
      } else if (brokerageFeeType === "porcentagem") {
        brokerageFee =
          (Number(brokerageFeeValue) / 100) * (btcAmount * brlPricePerBtc);
      }
      if (isNaN(brokerageFee) || brokerageFee < 0) {
        return res.status(400).json({ msg: "Taxa inválida" });
      }
    }

    //Usa totalBrl enviado (já calculado no frontend)
    const finalTotal = totalBrl || btcAmount * brlPricePerBtc - brokerageFee;

    const transaction = new Transaction({
      type,
      date: new Date(date),
      btcAmount,
      brlPricePerBtc,
      totalBrl: finalTotal,
      brokerageFee,
      notes,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// GET /api/transaction
router.get("/", authenticate, async (req, res) => {
  try {
    const { month } = req.query; //Ex: ?month=2025-10
    let filter = {};

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [year, mon] = month.split("-").map(Number);
      const start = new Date(Date.UTC(year, mon - 1, 1)); //UTC para evitar fuso
      const end = new Date(Date.UTC(year, mon, 0, 23, 59, 59, 999)); //Último dia do mês
      filter.date = {
        $gte: start,
        $lt: end,
      };
    }

    const transactions = await Transaction.find(filter).sort({ date: 1 });

    const monthlySales = transactions
      .filter((t) => t.type === "venda")
      .reduce((sum, t) => sum + t.totalBrl, 0);
    const isExempt = monthlySales <= 35000;

    res.json({ transactions, summary: { monthlySales, isExempt } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE /api/transactions/:id
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
    });

    if (!transaction) {
      return res
        .status(400)
        .json({ msg: "Transação não encontrada ou não pertence ao usuário" });
    }

    res.json({ msg: "Excluída com sucesso" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
