const db = require("../db/configdb");
const { upload, uploadToBackblaze } = require('./upload');
const cadastrarProduto = async (req, res) => {
  const { descricao, valor, produto_imagem } = req.body;

  try {
    /* const imagem = req.file.buffer;
    const fileName = `${Date.now()}_${req.file.originalname}`;

    const uploadResponse = await uploadToBackblaze(imagem, fileName);
 */
    const novoProduto = await db.query(
      "INSERT INTO produtos(descricao, valor, produto_imagem) VALUES($1, $2, $3) RETURNING *",
      [descricao, valor, produto_imagem /* uploadResponse.fileName */]
    );

    return res.status(201).json(novoProduto.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listarProdutos = async (req, res) => {
  try {
    const produtos = await db.query("SELECT * FROM produtos");
    return res.status(200).json(produtos.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await db.query("SELECT * FROM produtos WHERE id = $1", [
      id,
    ]);
    return res.status(200).json(produto.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const excluirProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const produto = await db.query("SELECT * FROM produtos WHERE id = $1", [
      id,
    ]);

    if (produto.rows.length === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    const imagemURL = produto.rows[0].produto_imagem;
    await db.query("DELETE FROM produtos WHERE id = $1", [id]);

    return res.status(200).json({ mensagem: "Produto excluído com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarProduto,
  listarProdutos,
  detalharProduto,
  excluirProduto,
};
