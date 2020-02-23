const https = require("https")
const { default: Neon, api, wallet, sc } = require("@cityofzion/neon-js")
const PRIVATE_KEY = process.env["PRIVATE_KEY"]

const CONTRACT_SCRIPTHASH = process.env["CONTRACT_SCRIPTHASH"]

const apiProvider = new api.neoscan.instance("MainNet")
const account = new wallet.Account(PRIVATE_KEY)

module.exports = updateOracle

async function updateOracle(){
	const coingecko = (await getJSON("https://api.coingecko.com/api/v3/simple/price?ids=neo&vs_currencies=bnb")).neo.bnb
	const messari = (await getJSON("https://data.messari.io/api/v1/assets/bnb/metrics/market-data")).data.market_data.price_usd / (await getJSON("https://data.messari.io/api/v1/assets/neo/metrics/market-data")).data.market_data.price_usd
	const binance = (await getJSON("https://api.binance.com/api/v3/ticker/24hr?symbol=BNBBTC")).weightedAvgPrice/(await getJSON("https://api.binance.com/api/v3/ticker/24hr?symbol=NEOBTC")).weightedAvgPrice // The USDT pairs have higher volume than the BTC ones but given that everythig else is based on USDT I decided to go with BTC here, also this is a 24hr average price, while the other prices are spot
	const hitbtc = Number((await getJSON("https://api.hitbtc.com/api/2/public/ticker/NEOUSD")).last)/Number((await getJSON("https://api.hitbtc.com/api/2/public/ticker/BNBUSD")).last)
	const bitfinex_gateio = (await getJSON("https://api-pub.bitfinex.com/v2/ticker/tNEOUSD"))[6]/(await getJSON("https://data.gateio.life/api2/1/ticker/bnb_usdt")).last

	let medianPrice = [coingecko, messari, binance, hitbtc, bitfinex_gateio].sort()[2]

	medianPrice = Math.round(medianPrice*(10**8)) // Convert to BigInt, assume NEP5 decimals = 8

	const sb = Neon.create.scriptBuilder()
	// Your contract script hash, function name and parameters
	sb.emitAppCall(CONTRACT_SCRIPTHASH, "updatePrice", [medianPrice])

	// Returns a hexstring
	const script = sb.str

	const config = {
		api: apiProvider, // Network
		account: account, // Your Account
		script: script, // The Smart Contract invocation script
		gas: 0, // Optional, system fee
		fees: 0 // Optional, network fee
	}

	// Neon API
	await Neon.doInvoke(config)
}

function getJSON(url){
	return new Promise((resolve, reject) => {
		let output = ''
		https.get(url, (res) => {
			res.setEncoding('utf8')

			res.on('data', (chunk) => {
				output += chunk
			})

			res.on('end', () => {
				let obj = JSON.parse(output)
				if(res.statusCode != 200){
					reject("status: "+ res.statusCode)
				} else {
					resolve(obj)
				}
			})
		}).on('error', (err) => {
			reject('error: ' + err.message)
		})
	})
}
