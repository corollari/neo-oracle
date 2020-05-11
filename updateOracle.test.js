const { getPrice } = require('./updateOracle');

test('getPrice returns an integer', async () => {
  jest.setTimeout(30000);
  const price = await getPrice('BNB_BTCB-1DE'); // Ticker for BTC on Binance Chain
  expect(typeof price).toBe('number');
  expect(price % 1).toBe(0);
});
