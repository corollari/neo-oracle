const { getPrice, getBNBGASPrice } = require('./updateOracle');

test('getPrice returns an integer', async () => {
  jest.setTimeout(30000);
  const price = await getPrice('BNB_BTCB-1DE'); // Ticker for BTC on Binance Chain
  expect(typeof price).toBe('number');
  expect(price % 1).toBe(0);
});

test('getBNBGASPrice returns similar values', async () => {
  jest.setTimeout(30000);
  const price = await getBNBGASPrice();
  price.forEach((p, i) => {
    const precision = i === 3 ? 1 : 2; // HitBTC is less precise, don't enforce high precision on that one
    expect(price[0]).toBeCloseTo(p, precision); // All values should be similar
  });
});
