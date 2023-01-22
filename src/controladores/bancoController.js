let bancodedados = require("../bancodedados");

const listarContas = (req, res) => {
    const {senha_banco} = req.query;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: "Senha é obrigatória"})
    }

    if (senha_banco !== bancodedados.banco.senha) {
        return res.status(400).json({ mensagem: "Senha inválida"})
    }

    return res.status(200).json(bancodedados.contas);
}

const criarConta = (req, res) => {
    let {nome, email, cpf, data_nascimento, telefone, senha} = req.body;

    if (!nome || !email || !cpf || !data_nascimento || !telefone || !senha) {
        return res.status(400).json({ mensagem : "Todos os campos são obrigatórios"})
    }

    const contaExistente = bancodedados.contas.find((conta) => {
        return conta.usuario.cpf === cpf || conta.usuario.email === email
    })

    if (contaExistente) {
        return res.status(400).json({ mensagem: "Cpf ou email já existe"})
    }

    const novaConta = {
        numero: bancodedados.ultimoID++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    bancodedados.contas.push(novaConta);

    return res.status(201).json()
}

const atualizarConta = (req, res) => {
    let {nome, email, cpf, data_nascimento, telefone, senha} = req.body;
    const {numeroConta} = req.params;

    if (!nome || !email || !cpf || !data_nascimento || !telefone || !senha) {
        return res.status(400).json({ mensagem : "Todos os campos são obrigatórios"})
    }

    const contaEncontrada = bancodedados.contas.find((conta) => {
        return conta.numero == Number(numeroConta);
    })

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta inexistente"})
    }

    if (cpf !== contaEncontrada.usuario.cpf) {
        const existeCpf = bancodedados.contas.find((conta) => {
            return conta.usuario.cpf == cpf
        })
        if (existeCpf) {
            return res.status(400).json({ mensagem: "CPF já existe"})
        }
    }

    if (email !== contaEncontrada.usuario.email) {
        const existeEmail = bancodedados.contas.find((conta) => {
            return conta.usuario.email == email
        })
        if (existeEmail) {
            return res.status(400).json({ mensagem: "Email já existe"})
        }
    }

    contaEncontrada.usuario = {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
    }

    return res.status(204).json()
}

const deletarConta = (req, res) => {
    const {numeroConta} = req.params;

    const contaEncontrada = bancodedados.contas.find((conta) => {
        return conta.numero == Number(numeroConta);
    })

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta inexistente"})
    }

    if (contaEncontrada.saldo != 0) {
        return res.status(403).json({ mensagem: "A conta só pode ser excluída se o saldo for 0"})
    }

    bancodedados.contas = bancodedados.contas.filter((conta) => {
        return conta.numero != Number(numeroConta);
    })

    return res.status(204).json()
}

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta
}