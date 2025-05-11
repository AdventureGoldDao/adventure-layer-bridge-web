import { Sepolia } from "@usedapp/core";
import { berachain, berachainBepolia, mainnet } from '@reown/appkit/networks'
import { abis } from "@my-app/contracts";

import eth_logo from './img/eth_logo.png';
// import trans_log from '../img/trans_logo.png';
import adv_logo from './img/adv-logo.png';
//import { id } from "ethers/lib/utils";

import { env } from './env';

export const keyMainnet = 'mainnet'
export const keySepolia = 'sepolia'
export const keyBerachain = 'berachain'
export const keyBerachainBepolia = 'bepolia'
export const keyAdventure = 'adventure'
export const keyL1 = 'l1'

export const defaultL1NetworkKey = env.L1_NAME


export const web3ModelConfig = {
  projectId: env.WEB3_PROJECT_ID,
  metadata: {
    name: env.WEB3_NAME,
    description: env.WEB3_DESCRIPTION,
    url: env.WEB3_APP_URL, // origin must match your domain & subdomain
    icons: []
  },
}

export const chainMainnet = {
  key: 'mainnet',
  //address: '0x5121E26E9f08F176b9e9aF0BF95b3FCd8a9a4B24',
  chainId: mainnet.id,
  text: 'ETH Mainnet',
  target_text: 'ETH Mainnet',
  logo: eth_logo,
  abi: abis['L1Bridge'],
  rpcUrl: env.L1_RPC_URL ||mainnet.rpcUrls.default.http[0],
  target: ['adventure'],
  abis: {
    adventure: abis['L1Bridge'],
  },
  addresses: {
    // Sepolia ==> Adventure Layer L2 = 0x5121E26E9f08F176b9e9aF0BF95b3FCd8a9a4B24
    adventure: env.L1_CONTRACT_ADDRESS,
  },
  tokenAddress: env.ERC20_TOKEN_ADDRESS,
}

export const chainSepolia = {
  key: 'sepolia',
  //address: '0x5121E26E9f08F176b9e9aF0BF95b3FCd8a9a4B24',
  chainId: Sepolia.chainId,
  text: 'Sepolia Layer 1',
  target_text: 'Adventure Layer',
  logo: eth_logo,
  abi: abis['L1Bridge'],
  rpcUrl: env.L1_RPC_URL || Sepolia.rpcUrl,
  target: ['adventure'],
  abis: {
    adventure: abis['L1Bridge'],
  },
  addresses: {
    // Sepolia ==> Adventure Layer L2 = 0x5121E26E9f08F176b9e9aF0BF95b3FCd8a9a4B24
    adventure: env.L1_CONTRACT_ADDRESS,
  },
  tokenAddress: env.ERC20_TOKEN_ADDRESS,
}

export const chainBerachain = {
  key: 'berachain',
  //address: '0x5121E26E9f08F176b9e9aF0BF95b3FCd8a9a4B24',
  id: berachain.id,
  chainId: berachain.id,
  text: 'Berachain Layer 1',
  target_text: 'Adventure Layer',
  logo: eth_logo,
  abi: abis['L1Bridge'],
  rpcUrl: env.L1_RPC_URL || berachain.rpcUrls.default.http[0],
  target: ['adventure'],
  abis: {
    adventure: abis['L1Bridge'],
  },
  addresses: {
    // Sepolia ==> Adventure Layer L2 = 0x5121E26E9f08F176b9e9aF0BF95b3FCd8a9a4B24
    adventure: env.L1_CONTRACT_ADDRESS,
  },
  tokenAddress: env.ERC20_TOKEN_ADDRESS,
}

export const chainBerachainBepolia = {
  key: 'bepolia',
  //address: '0x5121E26E9f08F176b9e9aF0BF95b3FCd8a9a4B24', //
  id: berachainBepolia.id,
  chainId: berachainBepolia.id,
  text: 'Bepolia Layer 1',
  target_text: 'Adventure Layer',
  logo: eth_logo,
  abi: abis['L1Bridge'],
  rpcUrl: env.L1_RPC_URL ||berachainBepolia.rpcUrls.default.http[0],
  target: ['adventure'],
  abis: {
    adventure: abis['L1Bridge'],
  },
  addresses: {
    // Sepolia ==> Adventure Layer L2 = 0x5121E26E9f08F176b9e9aF0BF95b3FCd8a9a4B24
    adventure: env.L1_CONTRACT_ADDRESS,
  },
  tokenAddress: env.ERC20_TOKEN_ADDRESS,
}

console.log(' abis-L1Bridge',  chainBerachainBepolia.abis.adventure)

export const L1 = {
  chainId: 1337,
  rpcUrl: env.L1_RPC_URL,
  wssUrl: env.L1_WSS_URL,
  chainName: env.L1_NAME,
  nativeCurrency: {
    name: 'AGLD',
    symbol: 'AGLD',
    decimals: 18,
  },
}

export const chainL1 = {
  key: 'l1',
  id: L1.chainId,
  chainId: L1.chainId,
  text: 'L1 dev',
  target_text: 'Adventure Layer',
  logo: adv_logo,
  abi: abis['L1Bridge'],
  rpcUrl: L1.rpcUrl,
  target: ['adventure'],
  abis: {
    adventure: abis['L1Bridge'],
  },
  addresses: {
    // Shard1 ==> Adventure Layer L2 = 0xe8b68a74d8527e650e144bfecd999302b676df2f
    adventure: env.L1_CONTRACT_ADDRESS, // addresses['depositL2'],
  },
  tokenAddress: env.ERC20_TOKEN_ADDRESS, // for query balance
}


export const AdventureLayer = {
  chainId: env.L2_CHAIN_ID,
  rpcUrl: env.L2_RPC_URL,
  wssUrl: env.L2_WSS_URL,
  chainName: env.L2_NAME,
  blockExplorerUrl: env.L2_EXPLORER_URL,
  nativeCurrency: {
    name: 'AGLD',
    symbol: 'AGLD',
    decimals: 18,
  },
}

// dynamic shard keys
//export const keyAdventureShard = 'local1'
export const shardKeys = Object.keys(env)
  .filter(key => key.startsWith('SHARD') && key.endsWith('_NAME'))
  .map(key => key.replace('_NAME', '').toLowerCase());

console.log("shardKeys: " +JSON.stringify(shardKeys));

export const shardConfigs = shardKeys.map(shardKey => {
  const upperKey = shardKey.toUpperCase();
  return {
    key: shardKey,
    chainId: env[`${upperKey}_CHAIN_ID`],
    rpcUrl: env[`${upperKey}_RPC_URL`],
    wssUrl: env[`${upperKey}_WSS_URL`],
    chainName: env[`${upperKey}_NAME`],
    contractAddress: env[`${upperKey}_CONTRACT_ADDRESS`],
    ownerAddress: env[`${upperKey}_OWNER_ADDRESS`],
    nativeCurrency: {
      name: 'AGLD',
      symbol: 'AGLD',
      decimals: 18,
    },
  };
});


//  dynamic shard networks
export const shardNetworks = shardConfigs.map(config => ({
  chainId: config.chainId,
  rpcUrl: config.rpcUrl,
  wssUrl: config.wssUrl,
  chainName: config.chainName,
  nativeCurrency: config.nativeCurrency,
}));

//console.log("shardNetworks: " +JSON.stringify(shardNetworks));

// dynamic shard chain config
export const shardChains = shardConfigs.map(config => ({
  key: config.key,
 // address: config.contractAddress,
  id: config.chainId,
  chainId: config.chainId,
  text: config.chainName,
  target_text: 'Adventure Layer',
  logo: adv_logo,
  abi: abis['adventureBridge'],
  rpcUrl: config.rpcUrl,
  target: ['adventure'],
  abis: {
    adventure: abis['adventureBridge'],
  },
  addresses: {
    adventure: env[`${config.key.toUpperCase()}_CONTRACT_ADDRESS`],
  },
}));

//console.log("shardChains: " +JSON.stringify(shardChains));

// export const AdventureLocal1 = {
//   chainId: env.SHARD1_CHAIN_ID,
//   rpcUrl: env.SHARD1_RPC_URL,
//   wssUrl: env.SHARD1_WSS_URL,
//   chainName: env.SHARD1_NAME,
//   nativeCurrency: {
//     name: 'AGLD',
//     symbol: 'AGLD',
//     decimals: 18,
//   },
// }
// export const AdventureLocal2 = {
//   chainId: 12340141,
//   rpcUrl: "https://rpc-devnet.adventurelayer.xyz/node2/shard",
//   wssUrl: "wss://rpc-devnet.adventurelayer.xyz/node2/shard",
//   chainName: 'Adventure Local 2',
// }


export const chainAdventureLayerL2 = {
  key: 'adventure',
  //address: '0xe8b68a74d8527e650e144bfecd999302b676df2f',
  id: AdventureLayer.chainId,
  chainId: AdventureLayer.chainId,
  text: 'Adventure Layer',
  target_text: env.L1_NAME,
  logo: adv_logo,
  abi: abis['adventureBridge'],
  rpcUrl: AdventureLayer.rpcUrl,
  target: [env.L1_NAME, ...shardKeys],
  abis: shardKeys.reduce((acc, shardKey) => {
    acc[shardKey] = abis['adventureBridge'];
    return acc;
  }, { [env.L1_NAME]: abis['adventureBridge'] }),
  addresses: shardKeys.reduce((acc, shardKey) => {
    acc[shardKey] = env[`L2_TO_${shardKey.toUpperCase()}_CONTRACT_ADDRESS`];
    return acc;
  }, {[env.L1_NAME]: env.L2_CONTRACT_ADDRESS }),
}


// export const chainAdventureShard1 = {
//   key: 'local1',
//   address: '0xe8b68a74d8527e650e144bfecd999302b676df2f',
//   id: AdventureLocal1.chainId,
//   chainId: AdventureLocal1.chainId,
//   text: 'Adventure Shard 1',
//   target_text: 'Adventure Layer',
//   logo: adv_logo,
//   abi: abis['adventureBridge'],
//   rpcUrl: AdventureLocal1.rpcUrl,
//   target: ['adventure'],
//   abis: {
//     adventure: abis['adventureBridge'],
//   },
//   addresses: {
//     // Shard1 ==> Adventure Layer L2 = 0xe8b68a74d8527e650e144bfecd999302b676df2f
//     adventure: '0x43f0ffca27b26dcfa02fce8ca5d97f2f85cbf3fa', // addresses['depositL2'],
//   },
// }


export const bridgeConfig = {
  mainnet: chainMainnet,
  sepolia: chainSepolia,
  berachain: chainBerachain,
  adventure: chainAdventureLayerL2,
  l1: chainL1,
  //local1: chainAdventureShard1,
  [keyBerachainBepolia]: chainBerachainBepolia,
  ...Object.fromEntries(shardChains.map(chain => [chain.key, chain])),
  // l1: chainL1
}

const chainByKeys = {
  [keyMainnet]: chainMainnet,
  [keySepolia]: chainSepolia,
  [keyBerachain]: chainBerachain,
  [keyAdventure]: chainAdventureLayerL2,
  [keyL1]: chainL1,
  //[keyAdventureShard]: chainAdventureShard1,
  [keyBerachainBepolia]: chainBerachainBepolia,
  ...Object.fromEntries(shardChains.map(chain => [chain.key, chain])),
}

export const defaultSourceChain = chainByKeys[defaultL1NetworkKey]

export const configNetworks = [defaultSourceChain, chainAdventureLayerL2, ...shardChains]
export const fromChainSelect = configNetworks.map(item => {
  return {
    name: item.key,
    text: item.text,
    target: item.target,
  }
})


export const MenuURL = {
  faucetUrl: env.MENU_FAUCET_URL,
  explorerUrl: env.MENU_EXPLORER_URL,
  bridgeUrl: env.MENU_BRIDGE_URL,
  docsUrl: env.MENU_DOCS_URL,
  rpcUrl: env.MENU_RPC_URL,
  wssRpcUrl: env.MENU_WSS_RPC_URL,
};