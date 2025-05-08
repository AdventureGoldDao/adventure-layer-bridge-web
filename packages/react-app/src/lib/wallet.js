import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import { mainnet, arbitrum, sepolia, berachain, berachainBepolia } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks';

import {
  AdventureLayer as l2,
  shardNetworks,
//  L1 as l1,
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

// dynamic shard network config
export const customShardNetworks = shardNetworks.map(shard => 
  defineChain({
    id: shard.chainId,
    caipNetworkId: `eip155:${shard.chainId}`,
    chainNamespace: 'eip155',
    name: shard.chainName,
    nativeCurrency: shard.nativeCurrency || {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [shard.rpcUrl],
        webSocket: [shard.wssUrl],
      },
    },
    blockExplorers: {
      default: { name: 'Adventure Layer Explorer', url: shard.blockExplorerUrl },
    },
    contracts: {},
  })
);

// export const customAdventureShardNetwork = defineChain({
//   id: shard1.chainId,
//   caipNetworkId: `eip155:${shard1.chainId}`,
//   chainNamespace: 'eip155',
//   name: shard1.chainName,
//   nativeCurrency: shard1.nativeCurrency || {
//     decimals: 18,
//     name: 'Ether',
//     symbol: 'ETH',
//   },
//   rpcUrls: {
//     default: {
//       http: [shard1.rpcUrl],
//       webSocket: [shard1.wssUrl],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'Adventure Layer Explorer', url: shard1.blockExplorerUrl },
//   },
//   contracts: {
//     // Add the contracts here
//   }
// })

// export const customL1Network = defineChain({
//   id: l1.chainId,
//   caipNetworkId: `eip155:${l1.chainId}`,
//   chainNamespace: 'eip155',
//   name: l1.chainName,
//   nativeCurrency: l1.nativeCurrency || {
//     decimals: 18,
//     name: 'Ether',
//     symbol: 'ETH',
//   },
//   rpcUrls: {
//     default: {
//       http: [l1.rpcUrl],
//       webSocket: [l1.wssUrl],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'Adventure Layer Explorer', url: l1.blockExplorerUrl },
//   },
//   contracts: {
//     // Add the contracts here
//   }
// })

export const networks = [
  // sepolia,
  mainnet,
  berachain,
  berachainBepolia,
  customAdventureLocalNetwork,
  ...customShardNetworks,
 // customAdventureShardNetwork,
//  customL1Network,
]

//console.log("networks: " +JSON.stringify(networks));

// Set up Solana Adapter
export const ethers5Adapter = new Ethers5Adapter();

export const supportChains = {
  // sepolia,
  mainnet,
  berachain,
  bepolia: berachainBepolia,
  adventure: customAdventureLocalNetwork,
  ...Object.fromEntries(
    customShardNetworks.map((network, index) => [
      shardNetworks[index].chainName,
      network
    ])
  ),
// local1: customAdventureShardNetwork,
//  l1: customL1Network
}

//console.log("supportChains: " +JSON.stringify(supportChains));
