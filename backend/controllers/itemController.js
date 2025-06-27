const Item = require('../models/Item');

// @desc    Buscar todos os itens
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    console.log('Buscando todos os itens');
    const items = await Item.find();
    console.log(`Encontrados ${items.length} itens`);
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Criar um novo item
// @route   POST /api/items
// @access  Public
const createItem = async (req, res) => {
  try {
    console.log('Dados recebidos para criar item:', req.body);
    
    // Verificar se o nome é fornecido
    if (!req.body.nome || req.body.nome.trim() === '') {
      console.log('Erro: Nome do item não fornecido ou vazio');
      return res.status(400).json({ message: 'Item é obrigatório' });
    }
    
    // Verificar se a unidade é fornecida
    if (!req.body.unidade || req.body.unidade.trim() === '') {
      console.log('Erro: Unidade do item não fornecida ou vazia');
      return res.status(400).json({ message: 'Unidade é obrigatória' });
    }
    
    // Calcular o total em estoque como um número inteiro
    const quantidadeEntrada = Number(req.body.quantidadeEntrada || 0);
    const quantidadeSaida = Number(req.body.quantidadeSaida || 0);
    const totalEstoque = Math.floor(quantidadeEntrada - quantidadeSaida);
    
    // Definir valores padrão para campos opcionais
    const itemData = {
      nome: req.body.nome.trim(),
      unidade: req.body.unidade.trim(),
      quantidadeEntrada: quantidadeEntrada,
      quantidadeSaida: quantidadeSaida,
      totalEstoque: totalEstoque,
      dataValidade: req.body.dataValidade || null,
      limiteEstoque: Number(req.body.limiteEstoque || 0),
      notificado: false,
      notificadoEstoque: false,
      notificadoValidade: false
    };
    
    console.log('Dados processados para criar item:', itemData);
    
    // Verificar se já existe um item com o mesmo nome
    const existingItem = await Item.findOne({ nome: itemData.nome });
    if (existingItem) {
      console.log('Erro: Item já existe com o nome:', itemData.nome);
      return res.status(400).json({ message: 'Já existe um item com este nome' });
    }
    
    const item = await Item.create(itemData);
    console.log('Item criado com sucesso:', item);
    res.status(201).json(item);
  } catch (error) {
    console.error('Erro ao criar item:', error);
    
    // Tratar erros de validação do Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Erro de validação', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// @desc    Atualizar um item
// @route   PUT /api/items/:id
// @access  Public
const updateItem = async (req, res) => {
  try {
    console.log(`Atualizando item com ID: ${req.params.id}`);
    console.log('Dados recebidos para atualização:', req.body);
    
    // Calcular o total em estoque como um número inteiro
    const quantidadeEntrada = Number(req.body.quantidadeEntrada || 0);
    const quantidadeSaida = Number(req.body.quantidadeSaida || 0);
    const totalEstoque = Math.floor(quantidadeEntrada - quantidadeSaida);
    
    // Atualizar o totalEstoque no objeto de atualização
    const updateData = {
      ...req.body,
      totalEstoque: totalEstoque,
      limiteEstoque: Number(req.body.limiteEstoque ?? 0)
    };

    // Se o estoque foi atualizado para acima do limite, resetar a notificação de estoque
    if (totalEstoque > updateData.limiteEstoque) {
      updateData.notificadoEstoque = false;
    }

    // Se a data de validade foi atualizada para mais de 15 dias no futuro, resetar a notificação de validade
    if (updateData.dataValidade) {
      const dataValidade = new Date(updateData.dataValidade);
      const hoje = new Date();
      const diffTime = dataValidade - hoje;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 15) {
        updateData.notificadoValidade = false;
      }
    }
    
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      console.log(`Item com ID ${req.params.id} não encontrado`);
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    
    console.log('Item atualizado com sucesso:', item);
    res.json(item);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Deletar um item
// @route   DELETE /api/items/:id
// @access  Public
const deleteItem = async (req, res) => {
  try {
    console.log(`Deletando item com ID: ${req.params.id}`);
    
    const item = await Item.findByIdAndDelete(req.params.id);
    
    if (!item) {
      console.log(`Item com ID ${req.params.id} não encontrado`);
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    
    console.log('Item deletado com sucesso');
    res.json({ message: 'Item removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Buscar item por ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    console.log(`Buscando item com ID: ${req.params.id}`);
    
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      console.log(`Item com ID ${req.params.id} não encontrado`);
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    
    console.log('Item encontrado:', item);
    res.json(item);
  } catch (error) {
    console.error('Erro ao buscar item por ID:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getItemById
}; 