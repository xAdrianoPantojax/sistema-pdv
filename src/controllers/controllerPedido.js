const db = require("../db/configdb");

const cadastrarPedido = async (req, res) => {
  const { data, pedido_produtos } = req.body;

  try {
    if (!pedido_produtos || pedido_produtos.length === 0) {
      return res.status(400).json({
        mensagem: "O pedido deve conter ao menos um produto vinculado",
      });
    }

    let valorTotal = 0;

    for (const pedidoProduto of pedido_produtos) {
      const { produto_id, quantidade_produto } = pedidoProduto;
      const produto = await db.query("SELECT * FROM produtos WHERE id = $1", [
        produto_id,
      ]);

      if (produto.rows.length === 0) {
        return res
          .status(404)
          .json({ mensagem: `Produto com ID ${produto_id} não encontrado` });
      }
      valorTotal += produto.rows[0].valor * quantidade_produto;
    }

    const novoPedido = await db.query(
      "INSERT INTO pedidos(data, valor_total) VALUES($1, $2) RETURNING *",
      [data || new Date(), valorTotal]
    );

    for (const pedidoProduto of pedido_produtos) {
      const { produto_id, quantidade_produto } = pedidoProduto;
      await db.query(
        "INSERT INTO pedido_produtos(pedido_id, produto_id, quantidade_produto) VALUES($1, $2, $3)",
        [novoPedido.rows[0].id, produto_id, quantidade_produto]
      );
    }

    return res.status(201).json({ mensagem: "Pedido cadastrado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listarPedidos = async (req, res) => {
  try {
    const aPartir = req.query.a_partir;
    let query = "SELECT * FROM pedidos";
    let params = [];

    if (aPartir) {
      query += " WHERE data >= $1";
      params.push(new Date(aPartir));
    }

    const pedidos = await db.query("SELECT * FROM pedidos");

    const listaPedidos = [];

    for (const pedido of pedidos.rows) {
      const pedidoDetalhado = {
        pedido: {
          id: pedido.id,
          valor_total: pedido.valor_total,
          data: pedido.data.toISOString().split("T")[0], // Formatar a data no estilo 'YYYY-MM-DD'
        },
        pedido_produtos: [],
      };

      const produtosPedido = await db.query(
        "SELECT * FROM pedido_produtos WHERE pedido_id = $1",
        [pedido.id]
      );

      for (const produtoPedido of produtosPedido.rows) {
        const produto = await db.query("SELECT * FROM produtos WHERE id = $1", [
          produtoPedido.produto_id,
        ]);

        pedidoDetalhado.pedido_produtos.push({
          id: produtoPedido.id,
          quantidade_produto: produtoPedido.quantidade_produto,
          valor_produto:
            produto.rows[0].valor * produtoPedido.quantidade_produto,
          pedido_id: produtoPedido.pedido_id,
          produto_id: produtoPedido.produto_id,
        });
      }

      listaPedidos.push(pedidoDetalhado);
    }

    return res.status(200).json(listaPedidos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarPedido,
  listarPedidos,
};
