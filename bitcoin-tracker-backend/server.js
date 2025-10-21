const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { collection } = require("./models/Transaction");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Middleware global de log (para todas as rotas)
app.use((req, res, next) => {
  console.log(
    `🌐 Requisição: ${req.method} ${req.originalUrl} - IP: ${req.ip}`,
  );
  res.on("finish", () => {
    console.log(
      `Resposta: ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`,
    );
  });
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

app.use("/api/transactions", require("./routes/transactions"));

// Rota de health check (para testar base)
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    env: { jwtSecretLoaded: !!process.env.JWT_SECRET },
  });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
