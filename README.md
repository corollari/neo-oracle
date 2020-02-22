# NEO Oracle
> Price oracle for NEO smart contracts

## Set up
1. Create a private key with any NEO wallet (eg: [ansy](https://snowypowers.github.io/ansy/))
2. Compute the address associated with the private key you just created with [ansy](https://snowypowers.github.io/ansy/) or neon-js
3. Update the variable `Owner` in `Oracle.cs` to use the address you just computed instead of the one that is hardcoded
4. Publish the contract `Oracle.cs` (or a contract that implements the same interface) on a blockchain
5. Install the dependencies with `npm install`

## Run
```bash
PRIVATE_KEY="9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69" # Replace with the private key you generated during setup
CONTRACT_SCRIPTHASH="5b7074e873973a6ed3708862f219a6fbf4d1c411" # Replace with the scripthash of the contract you deployed
export PRIVATE_KEY CONTRACT_SCRIPTHASH
node clock.js
```

## Deploy
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
