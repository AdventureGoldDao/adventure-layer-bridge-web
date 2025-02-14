# Adventure Layer Bridge Web

This is the bridge web application for Adventure Layer, built with [Create Eth App](https://github.com/paulrberg/create-eth-app). The application enables users to transfer assets between different chains, currently supporting:

- Sepolia Layer 1 
- Adventure Layer L2
- Adventure Shard 1

## Project Structure

The project uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to manage multiple packages:

```
adventure-layer-bridge-web/
├── README.md
├── package.json
├── node_modules/
└── packages/
    ├── contracts/           # Contract ABIs and address configurations
    │   ├── src/
    │   │   ├── abis/       # Contract ABI files
    │   │   ├── addresses.js # Contract address configurations
    │   │   └── index.js
    │   └── package.json
    ├── react-app/          # React frontend application
    │   ├── public/         # Static assets
    │   ├── src/           
    │   │   ├── pages/      # Page components
    │   │   ├── img/        # Image assets
    │   │   └── config.js   # Configuration file
    │   └── package.json
    └── subgraph/           # Graph Protocol indexing configuration
        ├── src/
        ├── schema.graphql
        └── package.json
```

## Development Setup

### Prerequisites

- Node.js >= 14
- Yarn >= 1.22
- MetaMask wallet

### Installing Dependencies

```bash
yarn install
```

### Environment Configuration

Create a `.env` file in the `packages/react-app` directory:

```
REACT_APP_RPC_URL=<your RPC URL>
REACT_APP_CHAIN_ID=<chain ID>
```

### Local Development

```bash
# Start development server
yarn react-app:start

# Run tests
yarn react-app:test

# Build production version
yarn react-app:build
```

## Deployment

The project provides multiple deployment scripts in the `scripts/` directory:

- `deploy.sh`: Deploy to main server
- `deploy-xyz.sh`: Deploy to backup server
- `deploy-al.sh`: Deploy to Adventure Layer server

Deployment steps:

1. Build the project:
```bash
yarn react-app:build
```

2. Configure deployment keys:
- Place deployment private key file in the `secrets/` directory
- Ensure correct permissions for key files

3. Execute deployment:
```bash
./scripts/deploy.sh
```

## Available Scripts

### React App

#### `yarn react-app:start`

Runs the React app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.
You will see build errors and lint warnings in the console.

#### `yarn react-app:test`

Runs the test watcher in an interactive mode.
By default, runs tests related to files changed since the last commit.

#### `yarn react-app:build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### Subgraph

The Graph is a tool for indexing events emitted on the Ethereum blockchain. It provides you with an easy-to-use GraphQL API.

#### `yarn subgraph:codegen`

Generates AssemblyScript types for smart contract ABIs and the subgraph schema.

#### `yarn subgraph:build`

Compiles the subgraph to WebAssembly.

#### `yarn subgraph:auth`

Before deploying your subgraph, you need to register on [Graph Explorer](https://thegraph.com/explorer/). You will receive an access token there. Use it in the following command:

```sh
GRAPH_ACCESS_TOKEN=your-access-token-here yarn subgraph:auth
```

#### `yarn subgraph:deploy`

Deploys the subgraph to the official Graph Node.

## Security Notes

- Deployment key files should be kept secure and not committed to the repository
- `.env` file contains sensitive configurations and is excluded in `.gitignore`

## Browser Support

- Latest versions of Chrome/Firefox/Safari
- MetaMask plugin required

## Related Resources

- [Adventure Layer Documentation](https://docs.adventurelayer.xyz)
- [Bridge Testnet](https://bridge-devnet.adventurelayer.xyz)
- [Explorer](https://explorer-devnet.adventurelayer.xyz)

## Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Submit a pull request
