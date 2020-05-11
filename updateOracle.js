const {
  default: Neon, api, wallet,
} = require('@cityofzion/neon-js');
const fetch = require('node-fetch');

const { PRIVATE_KEY, CONTRACT_SCRIPTHASH, BNC_TICKER } = process.env;

const apiProvider = new api.neoscan.instance('MainNet');
const account = new wallet.Account(PRIVATE_KEY);

async function getJSON(url) {
  return fetch(url).then((res) => res.json());
}

async function getPrice(ticker) {
  const coingecko = (await getJSON('https://api.coingecko.com/api/v3/simple/price?ids=gas&vs_currencies=bnb')).gas.bnb;
  const messari = (await getJSON('https://data.messari.io/api/v1/assets/gas/metrics/market-data')).data.market_data.price_usd / (await getJSON('https://data.messari.io/api/v1/assets/bnb/metrics/market-data')).data.market_data.price_usd;
  const binance = (await getJSON('https://api.binance.com/api/v3/ticker/24hr?symbol=GASBTC')).weightedAvgPrice / (await getJSON('https://api.binance.com/api/v3/ticker/24hr?symbol=BNBBTC')).weightedAvgPrice; // The USDT pairs have higher volume than the BTC ones but given that everythig else is based on USDT I decided to go with BTC here, also this is a 24hr average price, while the other prices are spot, again just trying to balance things out
  const hitbtc = Number((await getJSON('https://api.hitbtc.com/api/2/public/ticker/GASUSD')).last) / Number((await getJSON('https://api.hitbtc.com/api/2/public/ticker/BNBUSD')).last);
  const gateio = (await getJSON('https://data.gateio.life/api2/1/ticker/gas_usdt')).last / (await getJSON('https://data.gateio.life/api2/1/ticker/bnb_usdt')).last;

  const medianPriceBNBGAS = [coingecko, messari, binance, hitbtc, gateio].sort()[2];

  const tickerPrice = Number((await getJSON(`https://dex-european.binance.org/api/v1/ticker/24hr?symbol=${ticker}`))[0].weightedAvgPrice);

  const tickerGASPrice = 1 / (tickerPrice * medianPriceBNBGAS);

  // The max safe integer in javascript is 9007199254740991, which is a number that should never be reached by a price (even if it is multiplied by 10**8), and, in case it is, the precision lost should be pretty small
  return Math.round(tickerGASPrice * (10 ** 8)); // Convert to BigInt, assume NEP5 decimals = 8
}

async function updateOracle() {
  const price = await getPrice(BNC_TICKER);

  const sb = Neon.create.scriptBuilder();
  // Contract script hash, function name and parameters
  sb.emitAppCall(CONTRACT_SCRIPTHASH, 'updatePrice', [price]);

  // Returns a hexstring
  const script = sb.str;

  const config = {
    api: apiProvider, // Network
    account, // Your Account
    script, // The Smart Contract invocation script
    gas: 0, // Optional, system fee
    fees: 0, // Optional, network fee
  };

  await Neon.doInvoke(config);
}

module.exports = { updateOracle, getPrice };
