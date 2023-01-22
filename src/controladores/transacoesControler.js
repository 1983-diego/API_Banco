let bancodedados = require("../bancodedados");
const {format} = require("date-fns");

const depositar = (req, res) => {
    const {numero_conta, valor} = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "Número da conta e valor são obrigatórios"})
    }

    const contaEncontrada = bancodedados.contas.find((conta) => {
        return Number(conta.numero) == Number(numero_conta)
    }) 

    if (!contaEncontrada) {
        return res.status(404).json({ mensgame: "Conta não encontrada"})
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor tem que ser superior a 0"})
    }
    
    contaEncontrada.saldo += valor;

    const registroDeposito = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    }

    bancodedados.depositos.push(registroDeposito);

    return res.status(201).json();
}

const sacar = (req, res) => {
    const {numero_conta, valor, senha} = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "Número da conta, valor e senha são obrigatórios"})
    }

    const contaEncontrada = bancodedados.contas.find((conta) => {
        return Number(conta.numero) == Number(numero_conta)
    }) 

    if (!contaEncontrada) {
        return res.status(404).json({ mensgame: "Conta não encontrada"})
    }

    if (contaEncontrada.usuario.senha != senha) {
        return res.status(400).json({ mensagem: "Senha inválida"})
    }

    if (contaEncontrada.saldo < valor) {
        return res.status(403).json({ mensagem: "O saldo insuficiente"})
    }
    
    contaEncontrada.saldo -= valor;

    const registroDeposito = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    }

    bancodedados.saques.push(registroDeposito);

    return res.status(201).json();
}

const transferir = (req, res) => {
    const {numero_conta_origem, numero_conta_destino, valor, senha} = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: "A conta de origem, de destino, valor e senha são obrigatórios"})
    }

    const contaEncontradaOrigem = bancodedados.contas.find((conta) => {
        return Number(conta.numero) == Number(numero_conta_origem)
    })

    if(!contaEncontradaOrigem) {
        return res.status(404).json({ mensagem: "Conta de origem não encontrada"})
    }

    const contaEncontradaDestino = bancodedados.contas.find((conta) => {
        return Number(conta.numero) == Number(numero_conta_destino)
    })
    
    if(!contaEncontradaDestino) {
        return res.status(404).json({ mensagem: "Conta de destino não encontrada"})
    }

    if (contaEncontradaOrigem.usuario.senha != senha) {
        return res.status(400).json({ mensagem: "Senha inválida"})
    }

    if (contaEncontradaOrigem.saldo < valor) {
        return res.status(403).json({ mensagem: "Saldo insuficiente"})
    }

    contaEncontradaOrigem.saldo -= valor;
    contaEncontradaDestino.saldo += valor;

    const registroTransferencia = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    transferencias.push(registroTransferencia);

    return res.status(201).json();
}

const saldo = (req, res) => {
    const {numero_conta, senha} = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "Número de conta e senha são obrigatórios"})
    }

    const contaEncontrada = bancodedados.contas.find((conta) => {
        return Number(conta.numero) == Number(numero_conta)
    })

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta inexistente"})
    }

    if(contaEncontrada.usuario.senha != senha) {
        return res.status(400).json({ mensagem: "Senha inválida"})
    }

    return res.status(200).json({ saldo: contaEncontrada.saldo})
}

const extrato = (req, res) => {
    const {numero_conta, senha} = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "Número de conta e senha são obrigatórios"})
    }

    const contaEncontrada = bancodedados.contas.find((conta) => {
        return Number(conta.numero) == Number(numero_conta)
    })

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta inexistente"})
    }

    if(contaEncontrada.usuario.senha != senha) {
        return res.status(400).json({ mensagem: "Senha inválida"})
    }

    //-----
    const depositosRealizados = bancodedados.depositos.filter((deposito) => {
        return Number(deposito.numero_conta) == Number(numero_conta)
    })

    const saquesRealizados = bancodedados.saques.filter((saque) => {
        return Number(saque.numero_conta) == Number(numero_conta)
    })

    const transferenciasEnviadas = bancodedados.transferencias.filter((transferencia) => {
        return Number(transferencia.numero_conta_origem) == Number(numero_conta)
    })

    const transferenciasRecebidas = bancodedados.transferencias.filter((transferencia) => {
        return Number(transferencia.numero_conta_destino) == Number(numero_conta)
    })

    return res.status(201).json({
        depósitos: depositosRealizados,
        saques: saquesRealizados,
        transferenciasEnviadas,
        transferenciasRecebidas
    })
}

module.exports = {
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}