const db = require("../db/configdb");

const validateCamposObrigatorios = async (req, res, next) => {
  const { descricao, valor } = req.body;

  if (!descricao || !valor) {
    return res.status(400).json({ mensagem: "Campo descricao e valor sao obrigatorios" });
  }
  next();
};

const validateExistenceProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await db.query("SELECT * FROM produtos WHERE id = $1", [id]);

    if (produto.rows.length === 0) {
      return res.status(404).json({ mensagem: `Produto com id ${id}, não existe no banco de dados`});
    }

    return res.status(200).json(produto.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = { validateExistenceProduto, validateCamposObrigatorios };
