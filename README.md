# View the contents of your Reputation Passport

[![Build Status][1]][2] 
                   
[1]: https://travis-ci.org/monetha/passport-scanner.svg?branch=master
[2]: https://travis-ci.org/monetha/passport-scanner

Passport Scanner displays the data your fact providers have entered about you on the blockchain.

How to run:
- `npm install`
- `npm start`

Configure factory addresses for Mainnet and Ropsten, if needed, inside `src/constants/addresses.ts`.

As well as Mainnet and Ropsten support, custom JSON-RPC compatible backend URL can be set at the top-left select box, e.g. for `ganache` it's `http://localhost:8545` by default.

Please consider how contracts and passports are being deployed with `Truffle` and available for search and facts reading during integration tests of [reputation-js-sdk](https://github.com/monetha/reputation-js-sdk).

For more information visit:
- https://github.com/monetha/reputation-contracts - what are Passport logic, Passport logic registry and Passport factory itself.
- https://github.com/monetha/decentralized-reputation-framework - how the Framework allows its users to securely store relevant information about a person or thing and lets them access it before initiating a transaction.
