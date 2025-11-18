const express = require('express');
const { User } = require('../models');
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

    // Validação básica
    if (!nome || !cpf || !telefone || !numeroMedida || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Dados obrigatórios incompletos'
      });
    }

    // Verificar duplicidade
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

    // Criar usuário (a senha é hasheada automaticamente no hook)
    const user = await User.create({
      nome,
      nome_social: nomeSocial,
      cpf,
      telefone,
      email,
      cuidador,
      numero_medida: numeroMedida,
      senha // Será hasheada automaticamente
    });

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso',
      user: user.toJSON() // Já exclui a senha
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

    // Buscar usuário por CPF ou número da medida
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

    // Verificar senha usando o método do modelo
    const isPasswordValid = await user.validarSenha(senha);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos'
      });
    }

    res.json({
      success: true,
      message: 'Login efetuado com sucesso!',
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

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email não informado'
      });
    }

    const user = await User.findOne({ where: { email } });

    if (user) {
      console.log(`📧 Email de recuperação enviado para: ${email}`);
      
      res.json({
        success: true,
        message: `Um email de recuperação foi enviado para ${email}`
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Nenhum usuário encontrado com este email'
      });
    }

  } catch (error) {
    console.error('Erro ao recuperar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;