const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Registro de usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha, dataNascimento, cpf } = req.body;

  try {
    // Verificando se o email ou CPF já estão cadastrados
    const userExistente = await User.findOne({ $or: [{ email }, { cpf }] });
    if (userExistente) {
      return res.status(400).json({ message: 'Email ou CPF já cadastrados' });
    }

    // Criando um novo usuário
    const novoUsuario = new User({ nome, email, senha, dataNascimento, cpf });
    await novoUsuario.save();
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Listar todos os usuários
router.get('/', async (req, res) => {
    try {
      const usuarios = await User.find();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar usuários' });
    }
  }); 
// Atualizar informações do usuário
router.put('/update/:id', async (req, res) => {
  const { nome, email, dataNascimento, cpf } = req.body;

  try {
    const usuarioAtualizado = await User.findByIdAndUpdate(
      req.params.id,
      { nome, email, dataNascimento, cpf },
      { new: true, runValidators: true } // Retorna o documento atualizado e valida os campos
    );

    if (!usuarioAtualizado) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário atualizado com sucesso', usuario: usuarioAtualizado });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o usuário', error: error.message });
  }
});

module.exports = router;
