// 
export const env = {

    //get a new project id here: https://cloud.reown.com/
    WEB3_PROJECT_ID: '2eff4539a640aba672e06ccdbbae8002',
    WEB3_NAME : 'Adventure Layer Bridge',
    WEB3_DESCRIPTION : 'Bridge',
    WEB3_APP_URL : 'https://bridge.adventurelayer.xyz', // origin must match your domain & subdomain

    // Menu URLs
    MENU_FAUCET_URL: "https://faucet-devnet.adventurelayer.xyz",
    MENU_EXPLORER_URL: "https://explorer-devnet.adventurelayer.xyz",
    MENU_BRIDGE_URL: "https://bridge-devnet.adventurelayer.xyz",
    MENU_DOCS_URL: "https://docs.adventurelayer.xyz",
    MENU_RPC_URL: "https://rpc-devnet.adventurelayer.xyz",
    MENU_WSS_RPC_URL: "wss://rpc-devnet.adventurelayer.xyz",

    L1_NAME: 'sepolia', //must be  mainnet sepolia berachain or bepolia
    L1_WSS_URL: 'wss://sepolia.drpc.org',
    L1_RPC_URL: 'https://rpc.sepolia.org',
    L1_CONTRACT_ADDRESS: '0x5121E26E9f08F176b9e9aF0BF95b3FCd8a9a4B24',
    ERC20_TOKEN_ADDRESS: '0x4bff082a07c50724FEce17d9ecFC6dE1FF809722',

    
    L2_NAME: 'Adventure Layer L2',
    L2_CHAIN_ID: 242070,
    L2_RPC_URL: 'https://rpc-devnet.adventurelayer.xyz',
    L2_WSS_URL: 'wss://rpc-devnet.adventurelayer.xyz',
    L2_EXPLORER_URL : 'https://explorer.adventurelayer.xyz',
    L2_CONTRACT_ADDRESS: '0xe8b68a74d8527e650e144bfecd999302b676df2f',

    // Shard 1 Configuration
    SHARD1_NAME : 'shard1' ,  //   Name of the first shard
    SHARD1_CHAIN_ID: 12340188,
    SHARD1_RPC_URL: 'https://rpc-devnet.adventurelayer.xyz/node1/shard' ,  //  RPC URL for shard 1
    SHARD1_WSS_URL: 'wss://rpc-devnet.adventurelayer.xyz/node1/shard' ,  //  WebSocket URL for shard 1
    SHARD1_CONTRACT_ADDRESS: '0x43f0ffca27b26dcfa02fce8ca5d97f2f85cbf3fa' ,  //  Contract address on shard 1
    L2_TO_SHARD1_CONTRACT_ADDRESS: '0x43f0ffca27b26dcfa02fce8ca5d97f2f85cbf3fa' ,  //              L2 to shard 1 contract address

    // Shard 2 Configuration
    SHARD2_NAME: 'shard2' ,  //  Name of the second shard
    SHARD2_CHAIN_ID: 12340189 ,
    SHARD2_CONTRACT_ADDRESS: '0xe8b68a74d8527e650e144bfecd999302b676df2f' ,  //  Contract address on shard 2
    L2_TO_SHARD2_CONTRACT_ADDRESS: '0x7eb75992b53d5b603cc566575b5427e6d52ff6cd' ,  //  L2 to shard 2 contract address
    SHARD2_RPC_URL: 'https://rpc-devnet.adventurelayer.dev/node2/shard' ,  //  RPC URL for shard 2
    SHARD2_WSS_URL: 'wss://rpc-devnet.adventurelayer.dev/node2/shard' ,  //  WebSocket URL for shard 2

    // Shard 3 Configuration
    SHARD3_NAME: 'shard3' ,  //  Name of the third shard
    SHARD3_CHAIN_ID: 12340190 ,
    SHARD3_CONTRACT_ADDRESS: '0xe8b68a74d8527e650e144bfecd999302b676df2f' ,  //  Contract address on shard 3
    L2_TO_SHARD3_CONTRACT_ADDRESS: '0x7eb75992b53d5b603cc566575b5427e6d52ff6cd' ,  //  L2 to shard 3 contract address
    SHARD3_RPC_URL: 'https://rpc-devnet.adventurelayer.dev/node3/shard' ,  //  RPC URL for shard 3
    SHARD3_WSS_URL: 'wss://rpc-devnet.adventurelayer.dev/node3/shard' ,  //  WebSocket URL for shard 3
};