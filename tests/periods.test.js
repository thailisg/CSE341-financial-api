const periodsController = require('../controllers/periods');
const mongodb = require('../data/database');

jest.mock('../data/database', () => ({
  getDatabase: jest.fn()
}));

describe('Tests GET - Periods Controller', () => {
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

  // Test 1: GET All Periods
  test('1. getAllPeriods should return status 200 and a list of periods', async () => {
    const mockPeriods = [
      { _id: '60d5ecb4f1b2c81184a2b123', month: 'January', year: 2026 },
      { _id: '60d5ecb4f1b2c81184a2b124', month: 'February', year: 2026 }
    ];

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: jest.fn().mockResolvedValue(mockPeriods)
          })
        })
      })
    });

    await periodsController.getAllPeriods(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPeriods);
  });

  // Test 2: GET Single Period by valid ID (200)
  test('2. getPeriodById should return status 200 and the first found element', async () => {
    const validId = '60d5ecb4f1b2c81184a2b123';
    req.params.id = validId;
    const mockPeriods = [{ _id: validId, month: 'January', year: 2026 }];

    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: jest.fn().mockResolvedValue(mockPeriods)
          })
        })
      })
    });

    await periodsController.getPeriodById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPeriods[0]);
  });

  // Test 3: GET Single Period with invalid ID (500 error)
  test('3. getPeriodById should return status 500 with an invalid ID format', async () => {
    req.params.id = 'invalid-id-format';

    await periodsController.getPeriodById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch periods' });
  });

  // Test 4: GET All Periods when an error occurs in the database
  test('4. getAllPeriods should handle database errors with status 500', async () => {
    mongodb.getDatabase.mockImplementation(() => {
      throw new Error('Database connection failed');
    });

    await periodsController.getAllPeriods(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch periods' });
  });
});