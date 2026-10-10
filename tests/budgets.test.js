const request = require('supertest');
const app = require('../server');

describe('Test Suite for Budgets GET Routes', () => {

    // Test 1 Test GET endpoint to retrieve all budget records (getAllBudgets)
    test('GET /budgets - Should return a list of budgets with status 200', async () => {
        const response = await request(app).get('/budgets');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    // Test 2 Test GET by ID endpoint with a valid format ID that likely does not exist
    test('GET /budgets/:id - Should return 404 if the budget with a valid ID does not exist', async () => {
        const nonExistentId = '65d123456789012345678901';
        const response = await request(app).get(`/budgets/${nonExistentId}`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('message', 'Budget not found.');
    });

    // Test 3 Test error handling with an invalid ID format
    test('GET /budgets/:id - Should return 400 if an invalid ID format is provided', async () => {
        const invalidId = 'invalid-id-123';
        const response = await request(app).get(`/budgets/${invalidId}`);
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain('Must use a valid budget id to find a budget.');
    });

    // Test 4 Verify response body properties if records exist
    test('GET /budgets - If records exist, they should contain the budget model properties', async () => {
        const response = await request(app).get('/budgets');
        expect(response.statusCode).toBe(200);
        
        if (response.body.length > 0) {
            const budget = response.body[0];
            expect(budget).toHaveProperty('_id');
            expect(budget).toHaveProperty('amount');
            expect(budget).toHaveProperty('category_id');
        }
    });

});