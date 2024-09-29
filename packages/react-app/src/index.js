import "./index.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { DAppProvider, Mainnet, Sepolia, ChainId, DEFAULT_SUPPORTED_CHAINS } from "@usedapp/core";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { AdventureLayer as l2, AdventureLocal1 as shard1 } from './config'

const getAddressLink = (explorerUrl) => (address) => `${explorerUrl}/address/${address}`
const getTransactionLink = (explorerUrl) => (txnId) => `${explorerUrl}/tx/${txnId}`

const AdventureLayer = {
  chainId: l2.chainId,
  rpcUrl: l2.rpcUrl,
  wssUrl: l2.wssUrl,
  chainName: l2.chainName,
  isTestChain: false,
  isLocalChain: false,
  nativeCurrency: l2.nativeCurrency || {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrl: l2.blockExplorerUrl,
  getExplorerAddressLink: getAddressLink(l2.blockExplorerUrl),
  getExplorerTransactionLink: getTransactionLink(l2.blockExplorerUrl),
}
const AdventureLocal1 = {
  chainId: shard1.chainId,
  rpcUrl: shard1.rpcUrl,
  wssUrl: shard1.wssUrl,
  chainName: shard1.chainName,
  isTestChain: false,
  isLocalChain: false,
  nativeCurrency: shard1.nativeCurrency || {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
}

// IMPORTANT, PLEASE READ
// To avoid disruptions in your app, change this to your own Infura project id.
// https://infura.io/register
const INFURA_PROJECT_ID = "529670718fd74cd2a041466303daecd7";
const config = {
  // readOnlyChainId: Sepolia.chainId,
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: "https://mainnet.infura.io/v3/" + INFURA_PROJECT_ID,
    [Sepolia.chainId]: Sepolia.rpcUrl,
    [AdventureLayer.chainId]: AdventureLayer.rpcUrl,
    [AdventureLocal1.chainId]: AdventureLocal1.rpcUrl,
  },
  // supportedChains: [ChainId.Mainnet, ChainId.Goerli, ChainId.Kovan, ChainId.Rinkeby, ChainId.Ropsten, ChainId.Arbitrum, ChainId.Sepolia, AdventureLayer.chainId],
  networks: [...DEFAULT_SUPPORTED_CHAINS, AdventureLayer, AdventureLocal1], // AdventureLocal2
}

// You should replace this url with your own and put it into a .env file
// See all subgraphs: https://thegraph.com/explorer/
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.thegraph.com/subgraphs/name/paulrberg/create-eth-app",
});

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
