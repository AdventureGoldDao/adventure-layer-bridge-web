import { Sepolia } from "@usedapp/core";
import { addresses, abis } from "@agld-bridge/contracts";

import eth_logo from './img/eth_logo.png';
import adv_logo from './img/adv-logo.png';

import config from './config.json'

export const AdventureLayer = config.Networks.L2
export const AdventureLocal1 = config.Networks.Shard1

export const BridgeContracts = config.ContractAddress

export const bridgeConfig = {
  sepolia: {
    address: config.ContractAddress['depositL1'],
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
      adventure: config.ContractAddress['depositL1'],
    },
    tokenAddress: config.Networks.sepolia.tokenAddress,
  },
  adventure: {
    address: config.ContractAddress['depositL2'],
    chainId: AdventureLayer.chainId,
    text: 'Adventure Layer',
    target_text: 'Sepolia Layer 1',
    logo: adv_logo,
    abi: abis['adventureL2'],
    rpcUrl: AdventureLayer.rpcUrl,
    target: ['sepolia', 'local1'],
    abis: {
      sepolia: abis['adventureL2'],
      local1: abis['adventureL2'],
    },
    addresses: {
      sepolia: config.ContractAddress['depositL2'],
      local1: config.ContractAddress['local1'],
    },
  },
  local1: {
    address: config.ContractAddress['depositL2'],
    chainId: AdventureLocal1.chainId,
    text: 'Adventure Shard 1',
    target_text: 'Adventure Layer',
    logo: adv_logo,
    abi: abis['adventureL2'],
    rpcUrl: AdventureLocal1.rpcUrl,
    target: ['adventure'],
    abis: {
      adventure: abis['adventureL2'],
    },
    addresses: {
      adventure: config.ContractAddress['depositL2'],
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
  target: ['sepolia', 'local1'],
}, {
  name: 'local1',
  text: 'Adventure Shard 1',
  target: ['adventure'],
}]

export const MenuURL = config.MenuURL
