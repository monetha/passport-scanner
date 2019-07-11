# Passport scanner

[![Build Status][1]][2]

[1]: https://travis-ci.org/monetha/passport-scanner.svg?branch=master
[2]: https://travis-ci.org/monetha/passport-scanner

Passport Scanner is an Monetha Platform accompanying tool which helps to explore digital identity passports and information provided by multiple data sources.

In order to better understand what a digital identity passport is and how it works please look into [Verifiable data layer](https://github.com/monetha/reputation-layer) documentation of [Monetha platform](https://www.monetha.io/monetha-framework.pdf)

You can as well checkout the latest deployed version [https://scanner.monetha.io](https://scanner.monetha.io)

**TODO:** Add screenshots after changing platform related naming

## Installation

Passport scanner depends on Node.js and version 8+ is required. It has not yet been tested 10+.

One of the easiest way to install Node is to use the [Node Version Manager](https://github.com/nvm-sh/nvm). To install NVM for Linux/OSX, simply copy paste the following in a terminal:

```shell
  nvm install v8
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
  nvm use v8
```

Once you have Node installed, you can clone the repository and install its dependencies:

```shell
  git clone https://github.com/monetha/passport-scanner.git
  cd passport-scanner
  npm install
```

## Running in development environment

The development server is a combination of Node.js Express and Webpack. In order to start the development server use the command below

```shell
  npm start
```

Once the compilation is done the web app will be available in your browser at [http://localhost:3000](http://localhost:3000). Hot Reloading is enabled so the browser will live update as you edit the source files.

Web application is pre-configured to communicate with 2 Ethereum networks: Mainnet, Ropsten. If you would like to use Rinkerby network or a local node please adjust JSON_RPC and Etherscan.io urls in the following file `src/constants/api.ts`  accordingly. **Note** In case if you are planning to explore ganache simulated Ethereum node you can ignore change of `etherscanUrls`.

Due to the reason Monetha have bootstrapped the smart contracts on Ropsten and Mainnet networks we have pre-configured `PassportFactory` contract addresses in file `src/constants/addresses.ts`.

## Running in production environment

We have prepared a script that prepares an optimized version of the app.

```shell
  npm run build
```

After typescript compilation completes a folder `build` is created with all necessary assets for website hosting. This then can be deployed to any web server of your choice or [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).

## Caveats

This tools is a work in progress and we believe there are multiple improvements that can be done to it.

- Passport scanner has a hard dependency on the version of "PassportFactory" version in order to show all passports in a "Passports registry". Meaning in case of upgrade of PassportFactory contract this web app needs to make sure of backward compatibility.
- Though platform is capable of sensitive data provisioning only public information can be read via passport scanner application.

## Security

Please disclose any vulnerabilities found responsibly - report any security problems found to the maintainers privately.

## Contribution

Please submit bug reports, suggestions and pull requests to the [GitHub issue tracker](https://github.com/monetha/passport-scanner/issues).
