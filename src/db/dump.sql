CREATE DATABASE pdv;

CREATE TABLE
    usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL
    );

CREATE TABLE
    produtos (
        id SERIAL PRIMARY KEY,
        descricao VARCHAR(255) NOT NULL,
        valor DECIMAL(10, 2) NOT NULL,
        produto_imagem VARCHAR(255)
    );

CREATE TABLE
    pedidos (
        id SERIAL PRIMARY KEY,
        data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valor_total DECIMAL(10, 2) NOT NULL
    );

CREATE TABLE
    pedido_produtos (
        id SERIAL PRIMARY KEY,
        pedido_id INT REFERENCES pedidos(id),
        produto_id INT REFERENCES produtos(id),
        quantidade_produto INT NOT NULL
    );