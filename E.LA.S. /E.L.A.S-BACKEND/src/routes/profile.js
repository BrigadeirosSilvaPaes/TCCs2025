const express = require('express');
const { User } = require('../models');
const router = express.Router();

// PUT /api/profile - Atualizar perfil do usuário logado
router.put('/', async (req, res) => {
  try {
    const { nome, nome_social, telefone } = req.body;

    if (!nome || !nome_social || !telefone) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos'
      });
    }

    // Usar o ID do usuário do middleware de autenticação
    const [updated] = await User.update(
      { 
        nome: nome.trim(), 
        nome_social: nome_social.trim(), 
        telefone: telefone.trim() 
      },
      { 
        where: { id: req.user.id },
        returning: true 
      }
    );

    if (updated) {
      const user = await User.findByPk(req.user.id);
      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        user: user.toJSON()
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil'
    });
  }
});

// GET /api/profile - Buscar perfil do usuário logado
router.get('/', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (user) {
      res.json({
        success: true,
        user: user.toJSON()
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/profile/:id - Buscar perfil por ID (apenas admin)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (user) {
      res.json({
        success: true,
        user: user.toJSON()
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;