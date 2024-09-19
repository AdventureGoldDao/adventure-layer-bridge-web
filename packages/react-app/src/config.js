import { Sepolia } from "@usedapp/core";
import { addresses, abis } from "@my-app/contracts";

import eth_logo from './img/eth_logo.png';
// import trans_log from '../img/trans_logo.png';
import adv_logo from './img/adv-logo.png';

// l2 info
// sequencer: 
// rpc     https://rpc-devnet.adventurelayer.dev
// ws     wss://rpc-devnet.adventurelayer.dev
// chainid 242069

// replica1:
// rpc     https://rpc-devnet.adventurelayer.dev/node1
// ws     wss://rpc-devnet.adventurelayer.dev/node1
// chainid 242069

// replica1:
// rpc     https://rpc-devnet.adventurelayer.dev/node2
// ws     wss://rpc-devnet.adventurelayer.dev/node2
// chainid 242069

// shard1:
// rpc     https://rpc-devnet.adventurelayer.dev/node1/shard
// ws     wss://rpc-devnet.adventurelayer.dev/node1/shard
// chainid 12340140

// shard2:
// rpc     https://rpc-devnet.adventurelayer.dev/node2/shard
// ws     wss://rpc-devnet.adventurelayer.dev/node2/shard
// chainid 12340141
export const AdventureLayer = {
  // chainId: 412346,
  chainId: 242069,
  rpcUrl: "https://rpc-devnet.adventurelayer.xyz",
  wssUrl: "wss://rpc-devnet.adventurelayer.xyz",
  chainName: 'Adventure Layer L2',
  blockExplorerUrl: 'https://explorer.adventurelayer.xyz',
  // rpcUrl: "https://rpc.adventurelayer.dev",
}
export const AdventureLocal1 = {
  chainId: 12340188,
  rpcUrl: "https://rpc-devnet.adventurelayer.xyz/node1/shard",
  wssUrl: "wss://rpc-devnet.adventurelayer.xyz/node1/shard",
  chainName: 'Adventure Local 1',
}
export const AdventureLocal2 = {
  chainId: 12340141,
  rpcUrl: "https://rpc-devnet.adventurelayer.xyz/node2/shard",
  wssUrl: "wss://rpc-devnet.adventurelayer.xyz/node2/shard",
  chainName: 'Adventure Local 2',
}

export const bridgeConfig = {
  sepolia: {
    address: addresses['depositL1'],
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
      // Sepolia ==> Adventure Layer L2 = 0x5121E26E9f08F176b9e9aF0BF95b3FCd8a9a4B24
      adventure: addresses['depositL1'],
    },
    tokenAdress: '0x4bff082a07c50724FEce17d9ecFC6dE1FF809722',
  },
  adventure: {
    address: addresses['depositL2'],
    chainId: AdventureLayer.chainId,
    text: 'Adventure Layer',
    target_text: 'Sepolia Layer 1',
    logo: adv_logo,
    abi: abis['adventureL2'],
    rpcUrl: AdventureLayer.rpcUrl,
    target: ['sepolia', 'local1'], // , 'local2'
    abis: {
      sepolia: abis['adventureL2'],
      local1: abis['adventureL2'],
      // local2: abis['adventureL2'],
    },
    addresses: {
      // Adventure Layer L2 ==> Sepolia = 0xe8b68a74d8527e650e144bfecd999302b676df2f
      // Adventure Layer L2 ==> Shard1 = 0x43f0ffca27b26dcfa02fce8ca5d97f2f85cbf3fa
      // Adventure Layer L2 ==> Shard2 = 0x7eb75992b53d5b603cc566575b5427e6d52ff6cd
      sepolia: addresses['depositL2'],
      local1: '0x43f0ffca27b26dcfa02fce8ca5d97f2f85cbf3fa',
      // local2: '0x7eb75992b53d5b603cc566575b5427e6d52ff6cd',
    },
  },
  local1: {
    address: addresses['depositL2'],
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
      // Shard1 ==> Adventure Layer L2 = 0xe8b68a74d8527e650e144bfecd999302b676df2f
      adventure: addresses['depositL2'],
    },
  },
  local2: {
    address: addresses['depositL2'],
    chainId: AdventureLocal2.chainId,
    text: 'Adventure Shard 2',
    target_text: 'Adventure Layer',
    logo: adv_logo,
    abi: abis['adventureL2'],
    rpcUrl: AdventureLocal2.rpcUrl,
    target: ['adventure'],
    abis: {
      adventure: abis['adventureL2'],
    },
    addresses: {
      // Shard2 ==> Adventure Layer L2 = 0xe8b68a74d8527e650e144bfecd999302b676df2f
      adventure: addresses['depositL2'],
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
  target: ['sepolia', 'local1'], // , 'local2'
}, {
  name: 'local1',
  text: 'Adventure Shard 1',
  target: ['adventure'],
}
// , {
//   name: 'local2',
//   text: 'Adventure Shard 2',
//   target: ['adventure'],
// }
]
