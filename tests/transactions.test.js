const transactionsController = require('../controllers/transactions');
const mongodb = require('../data/database');

jest.mock('../data/database', () => ({
  getDatabase: jest.fn()
}));

describe('Tests GET - Transactions Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // Test 1: GET All Transactions
  test('1. getAllTransactions should return status 200 and a list of transactions', async () => {
    const mockTransactions = [
      { _id: '60d5ecb4f1b2c81184a2b123', amount: 150.0, details: 'Groceries' }
    ];

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: jest.fn().mockResolvedValue(mockTransactions)
          })
        })
      })
    });

    await transactionsController.getAllTransactions(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTransactions);
  });

  // Test 2: GET Single Transaction by valid ID (200)
  test('2. getSingleTransactions should return status 200 and an object if the transaction exists', async () => {
    const validId = '60d5ecb4f1b2c81184a2b123';
    req.params.id = validId;
    const mockTransactions = [{ _id: validId, amount: 150.0, details: 'Groceries' }];

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: jest.fn().mockResolvedValue(mockTransactions)
          })
        })
      })
    });

    await transactionsController.getSingleTransactions(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTransactions[0]);
  });

  // Test 3: GET Single Transaction not found (404)
  test('3. getSingleTransactions should return status 404 if the transaction does not exist', async () => {
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

    await transactionsController.getSingleTransactions(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('transaction not found');
  });

  // Test 4: Handle invalid ID format (error passed to next)
  test('4. getSingleTransactions should pass the error to next() if the ID is not valid', async () => {
    req.params.id = 'id-invalido';

    await transactionsController.getSingleTransactions(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});