const { getPrice } = require('./updateOracle');

test('getPrice returns an integer', async () => {
  jest.setTimeout(30000);
  const price = await getPrice();
  expect(typeof price).toBe('number');
  expect(price % 1).toBe(0);
});
