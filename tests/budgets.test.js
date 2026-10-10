const budgetsController = require('../controllers/budgets');
const mongodb = require('../data/database');

jest.mock('../data/database', () => ({
    getDatabase: jest.fn()
}));

describe('Tests GET - Budgets Controller', () => {
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

    // Test 1: GET All Budgets
    test('getAllBudgets should return status 200 and a list', async () => {
        const mockBudgets = [
            {
                _id: '60d5ecb4f1b2c81184a2b123',
                amount: 50000,
                category_id: 'category123',
                period_id: 'period123',
                start_date: '2026-10-01',
                end_date: '2026-10-31'
            },
            {
                _id: '60d5ecb4f1b2c81184a2b124',
                amount: 30000,
                category_id: 'category456',
                period_id: 'period456',
                start_date: '2026-10-01',
                end_date: '2026-10-31'
            }
        ];

        mongodb.getDatabase.mockReturnValue({
            db: () => ({
                collection: () => ({
                    find: () => ({
                        toArray: jest.fn().mockResolvedValue(mockBudgets)
                    })
                })
            })
        });

        await budgetsController.getAllBudgets(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBudgets);
    });

    // Test 2: GET Single Budget by valid ID (200)
    test('2. getSingleBudget should return status 200 and the budget found', async () => {
        const validId = '60d5ecb4f1b2c81184a2b123';
        req.params.id = validId;

        const mockBudgets = [{
            _id: validId,
            amount: 50000,
            category_id: 'category123',
            period_id: 'period123',
            start_date: '2026-10-01',
            end_date: '2026-10-31'
        }];

        mongodb.getDatabase.mockReturnValue({
            db: () => ({
                collection: () => ({
                    find: () => ({
                        toArray: jest.fn().mockResolvedValue(mockBudgets)
                    })
                })
            })
        });

        await budgetsController.getSingleBudget(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBudgets[0]);
  });

    // Test 3: GET Single Budget is not found
    test('getSingleBudget should return status 404 if the budget does not exist', async () => {
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

        await budgetsController.getSingleBudget(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Budget not found.'
        });
    });

    // Test 4: GET Single Budget when an error occurs in the database
    test('4. getSingleBudget should handle database errors with status 500', async () => {
        req.params.id = '60d5ecb4f1b2c81184a2b123';

        mongodb.getDatabase.mockImplementation(() => {
            throw new Error('Database connection failed');
        });

        await budgetsController.getSingleBudget(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Database connection failed'
        });
    });
})