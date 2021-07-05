import 'regenerator-runtime/runtime'
const app = require('../src/server/server.js');
const supertest = require('supertest');
const request = supertest(app);

// Example from URL above to check if this is working
describe('Test the test Endpoint', () => {
    test('Gets the test endpoint', async done => {
        const res = await request.get('/test');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('done');
        done();
    })
})