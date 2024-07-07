import { Sepolia } from "@usedapp/core";
import { addresses, abis } from "@my-app/contracts";

import eth_logo from '../img/eth_logo.png';
// import trans_log from '../img/trans_logo.png';
import adv_logo from '../img/adv-logo.png';

export const AdventureLayer = {
  // chainId: 412346,
  chainId: 242069,
  rpcUrl: "http://3.84.203.161:8515",
  wssUrl: "ws://3.84.203.161:8516",
  // rpcUrl: "https://rpc.adventurelayer.dev",
  // wssUrl: "ws://3.84.203.161:8548",
  // wssUrl: "ws://54.145.142.106:8548",
}
export const AdventureLocal1 = {
  chainId: 12340111,
  rpcUrl: "http://3.84.203.161:8547",
  wssUrl: "ws://3.84.203.161:8548",
}
export const AdventureLocal2 = {
  chainId: 12340112,
  rpcUrl: "http://3.84.203.161:8557",
  wssUrl: "ws://3.84.203.161:8558",
}

export const bridgeConfig = {
  sepolia: {
    address: addresses.depositL1,
    chainId: Sepolia.chainId,
    text: 'Sepolia Layer 1',
    target_text: 'Adventure Layer',
    logo: eth_logo,
    abi: abis['adventureSepolia'],
    rpcUrl: Sepolia.rpcUrl,
    target: ['adventure'],
    abis: {
      adventure: abis['adventureSepolia'],
    },
    addresses: {
      adventure: addresses.depositL1,
    },
  },
  adventure: {
    address: addresses.depositL2,
    chainId: AdventureLayer.chainId,
    text: 'Adventure Layer',
    target_text: 'Sepolia Layer 1',
    logo: adv_logo,
    abi: abis['adventureL2'],
    rpcUrl: AdventureLayer.rpcUrl,
    target: ['sepolia', 'local1', 'local2'],
    abis: {
      sepolia: abis['adventureL2'],
      local1: abis['adventureL2'],
      local2: abis['adventureL2'],
    },
    addresses: {
      sepolia: addresses.depositL2,
      local1: addresses.depositL2,
      local2: addresses.depositL2,
    },
  },
  local1: {
    address: addresses.depositL2,
    chainId: AdventureLocal1.chainId,
    text: 'Adventure Local 1',
    target_text: 'Adventure Layer',
    logo: adv_logo,
    abi: abis['adventureL2'],
    rpcUrl: AdventureLocal1.rpcUrl,
    target: ['adventure'],
    abis: {
      adventure: abis['adventureL2'],
    },
    addresses: {
      adventure: addresses.depositL2,
    },
  },
  local2: {
    address: addresses.depositL2,
    chainId: AdventureLocal2.chainId,
    text: 'Adventure Local 2',
    target_text: 'Adventure Layer',
    logo: adv_logo,
    abi: abis['adventureL2'],
    rpcUrl: AdventureLocal2.rpcUrl,
    target: ['adventure'],
    abis: {
      adventure: abis['adventureL2'],
    },
    addresses: {
      adventure: addresses.depositL2,
    },
  },
}

export const fromChainSelect = [{
  name: 'sepolia',
  text: 'Sepolia Layer 1',
  target: ['adventure'],
}, {
  name: 'adventure',
  text: 'Adventure Layer',
  target: ['sepolia', 'local1', 'local2'],
}, {
  name: 'local1',
  text: 'Adventure Local 1',
  target: ['adventure'],
}, {
  name: 'local2',
  text: 'Adventure Local 2',
  target: ['adventure'],
}]
