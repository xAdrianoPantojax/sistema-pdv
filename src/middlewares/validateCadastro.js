const db = require("../db/configdb");
const validator = require("validator");

const validateCadastro = async (req, res, next) => {
  const { nome, email, senha } = req.body;
  const nomeValido = validator.isLength(nome, { min: 4, max: 20 });
  const emailValido = validator.isEmail(email);
  const senhaValido = validator.isLength(senha, { min: 4 });

  if (!nomeValido) {
    return res.status(400).json({
      mensagem: "nome Invalido",
    });
  }

  if (!emailValido) {
    return res.status(400).json({
      mensagem: "Digite um endereço de email válido.",
    });
  }

  if (!senhaValido) {
    return res.status(400).json({
      mensagem: "Senha fraca. Deve ter pelo menos 4 caracteres.",
    });
  }
  try {
    const verificarEmail = await db.query(
      "select email from usuarios where email=$1",
      [email]
    );
    if (verificarEmail.rows.length > 0) {
      return res.status(401).json({ mensagem: "Email já possui cadastro." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ mensagem: "error interno do servidor" });
  }
};
module.exports = {
  validateCadastro,
};
