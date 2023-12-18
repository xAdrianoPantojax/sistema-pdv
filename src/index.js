require("dotenv").config();
const express = require("express");
const router = require("./routers/router.js");

const app = express();

app.use(express.json());
app.use(router);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
