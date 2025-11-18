const express = require('express');
const { User } = require('../models');
const { Sequelize } = require('sequelize');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      nome,
      cpf,
      telefone,
      numeroMedida,
      senha,
      nomeSocial = '',
      cuidador = '',
      email = null
    } = req.body;

    if (!nome || !cpf || !telefone || !numeroMedida || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios incompletos'
      });
    }

    // Verificar duplicidade com Sequelize
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [
          { cpf },
          { telefone },
          { numero_medida: numeroMedida }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'CPF, telefone ou número da medida já cadastrado'
      });
    }

    const user = await User.create({
      nome,
      nome_social: nomeSocial,
      cpf,
      telefone,
      email,
      cuidador,
      numero_medida: numeroMedida,
      senha
    });

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Dados duplicados'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Usuário e senha são obrigatórios'
      });
    }

    const user = await User.findOne({
      where: {
        [Sequelize.Op.or]: [
          { cpf: usuario },
          { numero_medida: usuario }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos'
      });
    }

    // Usar o método do modelo para verificar senha
    const isPasswordValid = await user.validarSenha(senha);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login efetuado com sucesso!',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ... resto do código (forgot-password) permanece similar
module.exports = router;