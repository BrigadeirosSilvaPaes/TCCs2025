const express = require('express');
const { User } = require('../models');
const router = express.Router();

// PUT /api/profile
router.put('/', async (req, res) => {
  try {
    const {
      cpf,
      nome,
      nome_social,
      telefone
    } = req.body;

    if (!cpf || !nome || !nome_social || !telefone) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos'
      });
    }

    // Atualizar usuário
    const [updated] = await User.update(
      { 
        nome: nome.trim(), 
        nome_social: nome_social.trim(), 
        telefone: telefone.trim() 
      },
      { 
        where: { cpf },
        returning: true 
      }
    );

    if (updated) {
      const user = await User.findOne({ where: { cpf } });
      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        user: user.toJSON()
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'CPF não encontrado'
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

// GET /api/profile/:id
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