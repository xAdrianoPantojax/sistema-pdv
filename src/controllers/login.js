const db = require("../db/configdb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaJwt = require("../controllers/senhaJwt");

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await db.query("SELECT * FROM usuarios WHERE email= $1", [
      email,
    ]);

    if (user.rowCount < 1) {
      return res.status(404).json({ mensagem: "Email invalido" });
    }

    const senhaValida = await bcrypt.compare(senha, user.rows[0].senha);

    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Senha invalida" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, senhaJwt, {
      expiresIn: "8h",
    });

    const { senha: _, ...usuarioLogado } = user.rows[0];

    return res.json({ user: usuarioLogado, token });
  } catch (error) {
    return res.status(500).json({ mensagem: "error interno do servidor" });
  }
};

module.exports = {
  login,
};
