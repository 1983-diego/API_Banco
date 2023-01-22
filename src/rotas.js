const express = require("express");
const contas = require("./controladores/bancoController");
const transacoes = require("./controladores/transacoesController")

const rotas = express();

rotas.get("/contas", contas.listarContas);
rotas.post("/contas", contas.criarConta)
rotas.put("/contas/:numeroConta/usuario", contas.atualizarConta)
rotas.delete("/contas/:numeroConta", contas.deletarConta)
rotas.get("/contas/saldo", transacoes.saldo)
rotas.get("/contas/extrato", transacoes.extrato)

rotas.post("/transacoes/depositar", transacoes.depositar)
rotas.post("/transacoes/sacar", transacoes.sacar)
rotas.post("/transacoes/transferir", transacoes.transferir)

module.exports = rotas;