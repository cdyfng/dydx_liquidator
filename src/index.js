
import './lib/env';

import AccountStore from './lib/account-store';
import MarketStore from './lib/market-store';
import LiquidationStore from './lib/liquidation-store';
import SoloLiquidator from './lib/solo-liquidator';
import PerpLiquidator from './lib/perp-liquidator';
import GasPriceUpdater from './lib/gas-price-updater';
import { loadAccounts, initializeSoloLiquidations } from './helpers/web3';

console.log(`Starting in env ${process.env.NODE_ENV}`);

if (Number(process.env.ACCOUNT_POLL_INTERVAL_MS) < 1000) {
  throw new Error('Account Poll Interval too low');
}

if (Number(process.env.MARKET_POLL_INTERVAL_MS) < 1000) {
  throw new Error('Account Poll Interval too low');
}

async function start() {
  const accountStore = new AccountStore();
  const marketStore = new MarketStore();
  const liquidationStore = new LiquidationStore();
  const soloLiquidator = new SoloLiquidator(accountStore, marketStore, liquidationStore);
  const perpLiquidator = new PerpLiquidator(accountStore, marketStore, liquidationStore);
  const gasPriceUpdater = new GasPriceUpdater();

  await loadAccounts();

  if (process.env.SOLO_LIQUIDATIONS_ENABLED === 'true') {
    await initializeSoloLiquidations();
  }

  accountStore.start();
  marketStore.start();
  gasPriceUpdater.start();

  if (
    process.env.SOLO_LIQUIDATIONS_ENABLED === 'true'
    || process.env.SOLO_EXPIRATIONS_ENABLED === 'true'
  ) {
    soloLiquidator.start();
  }

  if (process.env.PERP_LIQUIDATIONS_ENABLED === 'true') {
    perpLiquidator.start();
  }
}

start();
// import config from 'config'
//import {config} from '../config.js';
//let config = require("../config");
// var program = require('commander');
// program
//   .version('0.0.1')
//   .option('-i, --interval [n]', 'input the intervals of each transfer')
//   .option('-t, --times [n]', 'input the total times')
//   .parse(process.argv)
// console.log(program.list);
// import './lib/env';
// console.log(process.argv);
// let times = process.argv[2];
// let intervals = process.argv[3];

// console.log("transfer %s times every %s seconds", times, intervals);

