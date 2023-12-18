const db = require("../db/configdb");
const jwt = require("jsonwebtoken");
const senhaJwt = require("../controllers/senhaJwt");

const verifyUserLog = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mesnagem: "Não autorizado!" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, senhaJwt);
    const { rows, rowCount } = await db.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );

    if (rowCount < 1) {
      return res.status(401).json({ mensagem: "Não autorizado" });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Não foi autorizado!" });
  }
};

module.exports = verifyUserLog;
