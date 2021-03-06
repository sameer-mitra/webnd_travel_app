import { formatDate } from '../src/client/js/helperFunctions.js';

describe('Test formatDate function', () => {
    test('Check that formatDate returns a string', () => {
        const day = 1;
        const month = 2;
        const year = 2021;

        expect(typeof(formatDate(day, month, year))).toEqual('string');
        expect(formatDate(day, month, year)).toEqual('2021-02-01');
    });
});