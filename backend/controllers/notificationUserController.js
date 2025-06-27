const NotificationUser = require('../models/NotificationUser');

// Listar todos os usuários de notificação
exports.getAllUsers = async (req, res) => {
  try {
    const users = await NotificationUser.find({ isActive: true })
      .select('fullName phone createdAt lastNotification')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('[GET ALL NOTIFICATION USERS ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuários de notificação'
    });
  }
};

// Criar novo usuário de notificação
exports.createUser = async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    // Validações básicas
    if (!fullName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Nome completo e telefone são obrigatórios'
      });
    }

    // Verificar se o telefone já existe
    const existingUser = await NotificationUser.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este número de telefone já está cadastrado'
      });
    }

    // Criar novo usuário
    const newUser = new NotificationUser({
      fullName: fullName.trim(),
      phone: phone.trim()
    });

    // Validar antes de salvar
    const validationError = newUser.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors
      });
    }

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Usuário de notificação cadastrado com sucesso',
      data: {
        id: newUser._id,
        fullName: newUser.fullName,
        phone: newUser.getFormattedPhone(),
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('[CREATE NOTIFICATION USER ERROR]', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar usuário de notificação'
    });
  }
};

// Atualizar usuário de notificação
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, isActive } = req.body;

    const user = await NotificationUser.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário de notificação não encontrado'
      });
    }

    // Verificar se o telefone já existe em outro usuário
    if (phone && phone !== user.phone) {
      const existingUser = await NotificationUser.findOne({ phone, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Este número de telefone já está cadastrado para outro usuário'
        });
      }
    }

    // Atualizar campos
    if (fullName) user.fullName = fullName.trim();
    if (phone) user.phone = phone.trim();
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Usuário de notificação atualizado com sucesso',
      data: {
        id: user._id,
        fullName: user.fullName,
        phone: user.getFormattedPhone(),
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('[UPDATE NOTIFICATION USER ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário de notificação'
    });
  }
};

// Deletar usuário de notificação (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await NotificationUser.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário de notificação não encontrado'
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Usuário de notificação removido com sucesso'
    });
  } catch (error) {
    console.error('[DELETE NOTIFICATION USER ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover usuário de notificação'
    });
  }
};

// Buscar usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await NotificationUser.findById(id);
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Usuário de notificação não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        phone: user.getFormattedPhone(),
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastNotification: user.lastNotification
      }
    });
  } catch (error) {
    console.error('[GET NOTIFICATION USER BY ID ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário de notificação'
    });
  }
};

// Verificar status das notificações
exports.getNotificationStatus = async (req, res) => {
  try {
    const totalUsers = await NotificationUser.countDocuments({ isActive: true });
    const recentUsers = await NotificationUser.find({ isActive: true })
      .select('fullName phone lastNotification')
      .sort({ lastNotification: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        recentUsers,
        hasUsers: totalUsers > 0
      }
    });
  } catch (error) {
    console.error('[GET NOTIFICATION STATUS ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar status das notificações'
    });
  }
};

// Criar usuário de teste
exports.createTestUser = async (req, res) => {
  try {
    const testUser = new NotificationUser({
      fullName: 'Usuário Teste',
      phone: '11999999999'
    });

    await testUser.save();

    res.status(201).json({
      success: true,
      message: 'Usuário de teste criado com sucesso',
      data: testUser
    });
  } catch (error) {
    console.error('[CREATE TEST USER ERROR]', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário de teste'
    });
  }
}; 