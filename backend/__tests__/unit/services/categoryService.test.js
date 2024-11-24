const categoryService = require('../../../src/services/categoryService');
const Category = require('../../../src/models/Category');
const { ERROR_MESSAGES } = require('../../../src/utils/constants');

jest.mock('../../../src/models/Category');

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    const mockCategoryData = {
      name: 'Test Category',
      type: 'EXPENSE',
      description: 'Test description'
    };

    it('deve criar categoria com sucesso', async () => {
      Category.findOne.mockResolvedValue(null);
      Category.create.mockResolvedValue({ id: 1, ...mockCategoryData });

      const result = await categoryService.createCategory(mockCategoryData);

      expect(Category.create).toHaveBeenCalledWith(mockCategoryData);
      expect(result).toHaveProperty('id');
      expect(result.name).toBe(mockCategoryData.name);
    });

    it('deve lançar erro se categoria já existir', async () => {
      Category.findOne.mockResolvedValue({ id: 1 });

      await expect(categoryService.createCategory(mockCategoryData))
        .rejects.toThrow('Categoria já existe');
    });
  });

  describe('listCategories', () => {
    const mockFilters = { type: 'EXPENSE' };

    it('deve listar categorias com filtros', async () => {
      const mockCategories = [
        { id: 1, name: 'Category 1', type: 'EXPENSE' },
        { id: 2, name: 'Category 2', type: 'EXPENSE' }
      ];

      Category.findByType.mockResolvedValue(mockCategories);

      const result = await categoryService.listCategories(mockFilters);

      expect(Category.findByType).toHaveBeenCalledWith(mockFilters.type);
      expect(result).toEqual(mockCategories);
    });

    it('deve retornar array vazio se não encontrar categorias', async () => {
      Category.findByType.mockResolvedValue([]);

      const result = await categoryService.listCategories(mockFilters);

      expect(result).toEqual([]);
    });
  });

  describe('updateCategory', () => {
    const mockCategoryId = 1;
    const mockUpdateData = {
      name: 'Updated Category',
      description: 'Updated description'
    };

    it('deve atualizar categoria com sucesso', async () => {
      Category.findById.mockResolvedValue({ id: mockCategoryId });
      Category.update.mockResolvedValue(true);

      const result = await categoryService.updateCategory(mockCategoryId, mockUpdateData);

      expect(Category.update).toHaveBeenCalledWith(mockCategoryId, mockUpdateData);
      expect(result).toBe(true);
    });

    it('deve lançar erro se categoria não existir', async () => {
      Category.findById.mockResolvedValue(null);

      await expect(categoryService.updateCategory(mockCategoryId, mockUpdateData))
        .rejects.toThrow('Categoria não encontrada');
    });
  });

  describe('deleteCategory', () => {
    const mockCategoryId = 1;

    it('deve deletar categoria se não houver transações', async () => {
      Category.findById.mockResolvedValue({ id: mockCategoryId });
      Category.getTransactionCount.mockResolvedValue(0);
      Category.delete.mockResolvedValue(true);

      const result = await categoryService.deleteCategory(mockCategoryId);

      expect(Category.delete).toHaveBeenCalledWith(mockCategoryId);
      expect(result).toBe(true);
    });

    it('deve lançar erro se categoria tiver transações', async () => {
      Category.findById.mockResolvedValue({ id: mockCategoryId });
      Category.getTransactionCount.mockResolvedValue(5);

      await expect(categoryService.deleteCategory(mockCategoryId))
        .rejects.toThrow('Não é possível excluir categoria com transações');
    });
  });
}); 