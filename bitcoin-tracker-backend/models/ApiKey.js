const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ApiKey", apiKeySchema);
