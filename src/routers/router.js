const express = require("express");
const router = express();
const verifyUserLog = require("../middlewares/autenticacao");
const { upload } = require('../controllers/upload');

const { validateCamposObrigatorios, validateExistenceProduto } = require("../middlewares/validateProduto");
const { validateCadastro } = require("../middlewares/validateCadastro");

const { cadastrarUsuario,
        listarUsuarios,
        obtainProfile } = require("../controllers/controllerUsuario");

        const { cadastrarProduto,
        listarProdutos,
        detalharProduto,
        excluirProduto } = require("../controllers/controllerProduto");

const { cadastrarPedido,
        listarPedidos} = require("../controllers/controllerPedido");

const { login } = require("../controllers/login");

router.post("/usuario", validateCadastro, cadastrarUsuario);
router.post("/login", login);

router.use(verifyUserLog);

router.get("/profile", obtainProfile);
router.get("/usuarios", listarUsuarios);

router.post("/produto", /* validateCamposObrigatorios, */ upload.single('produto_imagem'),  cadastrarProduto);
router.get("/produto", listarProdutos);
router.get("/produto/:id", validateExistenceProduto, detalharProduto);
router.delete("/produto/:id", validateExistenceProduto, excluirProduto);

router.post("/pedido", cadastrarPedido);
router.get("/pedido", listarPedidos);

module.exports = router;
