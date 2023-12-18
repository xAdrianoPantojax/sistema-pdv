const db = require("../db/configdb");
const bcrypt = require("bcrypt");
const transportador = require("../nodemailer");
require("dotenv").config();

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await db.query(
      "insert into usuarios(nome,email,senha) values($1,$2,$3) returning *",
      [nome, email, senhaCriptografada]
    );

    const dados = {
      from: "User <mailgun@sandbox-123.mailgun.org>",
      to: email,
      subject: "Cadastro Efetuado!",
      text: "Cadastro Efetuado com sucesso! Seja bem vindo :D",
      
    };

    await transportador.sendMail(dados);

    return res.status(201).json(novoUsuario.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "error interno do servidor" });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const list = await db.query("SELECT * FROM usuarios");
    res.json(list.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const obtainProfile = async (req, res) => {
  return res.json(req.user);
};

module.exports = {
  cadastrarUsuario,
  listarUsuarios,
  obtainProfile,
};
