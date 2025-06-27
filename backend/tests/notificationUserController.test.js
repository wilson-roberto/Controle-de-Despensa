const mongoose = require('mongoose');
const notificationUserController = require('../controllers/notificationUserController');

// Mock do modelo NotificationUser
jest.mock('../models/NotificationUser', () => {
  const mockUser = {
    _id: 'mock-id',
    fullName: 'João Silva',
    phone: '11999999999',
    isActive: true,
    createdAt: new Date(),
    getFormattedPhone: jest.fn().mockReturnValue('(11) 99999-9999'),
    save: jest.fn().mockResolvedValue(true),
    validateSync: jest.fn().mockReturnValue(null)
  };

  const MockNotificationUser = jest.fn().mockImplementation((data) => {
    return {
      ...mockUser,
      ...data,
      save: jest.fn().mockResolvedValue({ ...mockUser, ...data }),
      validateSync: jest.fn().mockReturnValue(null)
    };
  });

  MockNotificationUser.findOne = jest.fn();
  MockNotificationUser.create = jest.fn();
  MockNotificationUser.find = jest.fn().mockImplementation(() => {
    // Retorna um objeto com métodos encadeáveis
    return {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([])
    };
  });
  MockNotificationUser.findById = jest.fn();
  MockNotificationUser.deleteMany = jest.fn();

  return MockNotificationUser;
});

// Mock do response e request
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}) => ({
  body,
  params
});

describe('NotificationUser Controller', () => {
  let MockNotificationUser;

  beforeAll(() => {
    // Obter a referência do mock
    MockNotificationUser = require('../models/NotificationUser');
  });

  beforeEach(async () => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
    await MockNotificationUser.deleteMany({});
  });

  describe('createUser', () => {
    it('deve criar um novo usuário de notificação com dados válidos', async () => {
      MockNotificationUser.findOne.mockResolvedValue(null);
      MockNotificationUser.mockImplementation((data) => ({
        _id: 'mock-id',
        fullName: data.fullName,
        phone: data.phone,
        isActive: true,
        createdAt: new Date(),
        getFormattedPhone: jest.fn().mockReturnValue('(11) 99999-9999'),
        save: jest.fn().mockResolvedValue({ _id: 'mock-id', ...data }),
        validateSync: jest.fn().mockReturnValue(null)
      }));

      const req = mockRequest({
        fullName: 'João Silva',
        phone: '11999999999'
      });
      const res = mockResponse();

      await notificationUserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Usuário de notificação cadastrado com sucesso'
        })
      );
    });

    it('deve retornar erro quando nome completo está faltando', async () => {
      const req = mockRequest({
        phone: '11999999999'
      });
      const res = mockResponse();

      await notificationUserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nome completo e telefone são obrigatórios'
      });
    });

    it('deve retornar erro quando telefone está faltando', async () => {
      const req = mockRequest({
        fullName: 'João Silva'
      });
      const res = mockResponse();

      await notificationUserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nome completo e telefone são obrigatórios'
      });
    });

    it('deve retornar erro quando telefone já existe', async () => {
      const existingUser = {
        _id: 'existing-id',
        fullName: 'Maria Santos',
        phone: '11999999999'
      };

      MockNotificationUser.findOne.mockResolvedValue(existingUser);

      const req = mockRequest({
        fullName: 'João Silva',
        phone: '11999999999'
      });
      const res = mockResponse();

      await notificationUserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Este número de telefone já está cadastrado'
      });
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar lista de usuários de notificação', async () => {
      const mockUsers = [
        { fullName: 'João Silva', phone: '11999999999', createdAt: new Date() },
        { fullName: 'Maria Santos', phone: '11888888888', createdAt: new Date() }
      ];

      MockNotificationUser.find.mockImplementation(() => {
        return {
          select: jest.fn().mockReturnThis(),
          sort: jest.fn().mockResolvedValue(mockUsers)
        };
      });

      const req = mockRequest();
      const res = mockResponse();

      await notificationUserController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUsers
      });
    });

    it('deve retornar lista vazia quando não há usuários', async () => {
      MockNotificationUser.find.mockImplementation(() => {
        return {
          select: jest.fn().mockReturnThis(),
          sort: jest.fn().mockResolvedValue([])
        };
      });

      const req = mockRequest();
      const res = mockResponse();

      await notificationUserController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: []
      });
    });
  });

  describe('updateUser', () => {
    it('deve atualizar usuário de notificação', async () => {
      const mockUserToUpdate = {
        _id: 'mock-id',
        fullName: 'João Silva',
        phone: '11999999999',
        isActive: true,
        save: jest.fn().mockResolvedValue(true),
        getFormattedPhone: jest.fn().mockReturnValue('(11) 99999-9999')
      };

      MockNotificationUser.findById.mockResolvedValue(mockUserToUpdate);
      MockNotificationUser.findOne.mockResolvedValue(null);

      const req = mockRequest(
        { fullName: 'João Silva Atualizado' },
        { id: 'mock-id' }
      );
      const res = mockResponse();

      await notificationUserController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Usuário de notificação atualizado com sucesso'
        })
      );
    });
  });

  describe('deleteUser', () => {
    it('deve fazer soft delete do usuário de notificação', async () => {
      const mockUserToDelete = {
        _id: 'mock-id',
        fullName: 'João Silva',
        phone: '11999999999',
        isActive: true,
        save: jest.fn().mockResolvedValue(true)
      };

      MockNotificationUser.findById.mockResolvedValue(mockUserToDelete);

      const req = mockRequest({}, { id: 'mock-id' });
      const res = mockResponse();

      await notificationUserController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Usuário de notificação removido com sucesso'
      });
    });
  });
}); 