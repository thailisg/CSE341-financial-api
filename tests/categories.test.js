const categoriesController = require('../controllers/categories');
const mongodb = require('../data/database');

// Database mock
jest.mock('../data/database', () => ({
  getDatabase: jest.fn()
}));

describe('Tests GET - Categories Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn()
    };
    jest.clearAllMocks();
  });

  // Test 1: GET All 
  test('1. getAllCategories should return status 200 and a list', async () => {
    const mockCategories = [
      { _id: '60d5ecb4f1b2c81184a2b123', name: 'Entertainment', description: 'Movies, games' },
      { _id: '60d5ecb4f1b2c81184a2b124', name: 'Utilities', description: 'Bills' }
    ];

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: jest.fn().mockResolvedValue(mockCategories)
          })
        })
      })
    });

    await categoriesController.getAllCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCategories);
  });

  // Test 2: GET Single category with valid ID (200)
  test('2. getSingleCategory should return status 200 with a valid ID', async () => {
    const validId = '60d5ecb4f1b2c81184a2b123';
    req.params.id = validId;
    const mockCategory = [{ _id: validId, name: 'Entertainment' }];

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: jest.fn().mockResolvedValue(mockCategory)
          })
        })
      })
    });

    await categoriesController.getSingleCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCategory);
  });

  // Test 3: GET Single category with invalid ID (400)
  test('3. getSingleCategory should return status 400 if the ID is not valid', async () => {
    req.params.id = 'id-invalido-123';

    await categoriesController.getSingleCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Must use a valid category ID.' });
  });

  // Test 4: GET Single category not found (404)
  test('4. getSingleCategory should return status 404 if the category does not exist', async () => {
    req.params.id = '60d5ecb4f1b2c81184a2b123';

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: jest.fn().mockResolvedValue([])
          })
        })
      })
    });

    await categoriesController.getSingleCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Category not found.' });
  });
});