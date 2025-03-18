import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import { mainnet, arbitrum, sepolia, berachain } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks';

import {
  AdventureLayer as l2,
  AdventureLocal1 as shard1,
  web3ModelConfig,
} from '../config'

// 1. Get projectId
export const projectId = web3ModelConfig.projectId

// Create a metadata object - optional
export const metadata = {
  ...web3ModelConfig.metadata,
}

// Define the custom network
export const customAdventureLocalNetwork = defineChain({
  id: l2.chainId,
  caipNetworkId: `eip155:${l2.chainId}`,
  chainNamespace: 'eip155',
  name: l2.chainName,
  nativeCurrency: l2.nativeCurrency || {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [l2.rpcUrl],
      webSocket: [l2.wssUrl],
    },
  },
  blockExplorers: {
    default: { name: 'Adventure Layer Explorer', url: l2.blockExplorerUrl },
  },
  contracts: {
    // Add the contracts here
  }
})

export const customAdventureShardNetwork = defineChain({
  id: shard1.chainId,
  caipNetworkId: `eip155:${shard1.chainId}`,
  chainNamespace: 'eip155',
  name: shard1.chainName,
  nativeCurrency: shard1.nativeCurrency || {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [shard1.rpcUrl],
      webSocket: [shard1.wssUrl],
    },
  },
  blockExplorers: {
    default: { name: 'Adventure Layer Explorer', url: shard1.blockExplorerUrl },
  },
  contracts: {
    // Add the contracts here
  }
})

export const networks = [
  // sepolia,
  berachain,
  customAdventureLocalNetwork,
  customAdventureShardNetwork,
]

// Set up Solana Adapter
export const ethers5Adapter = new Ethers5Adapter();

export const supportChains = {
  // sepolia,
  berachain,
  adventure: customAdventureLocalNetwork,
  local1: customAdventureShardNetwork,
}