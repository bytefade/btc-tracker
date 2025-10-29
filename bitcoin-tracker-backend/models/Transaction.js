const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userApiKey: { type: String, required: false }, //Para autenticação por usuário
    type: { type: String, enum: ["compra", "venda"], required: true },
    date: { type: Date, default: Date.now },
    btcAmount: { type: Number, required: true },
    brlPricePerBtc: { type: Number, required: true }, //Preço unitário em BRL
    totalBrl: { type: Number, required: true }, //Total da transação em BRL
    brokerageFee: { type: Number, default: 0 }, //Taxa em reais
    notes: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
