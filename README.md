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

### Local Build

1. Build the project:
```bash
yarn react-app:build
```

2. The build artifacts will be in `packages/react-app/build` directory.

### Production Deployment

#### Server Requirements
- Ubuntu/Debian or similar Linux distribution
- Nginx web server
- Node.js (for build process)
- SSH access to the server

#### Deployment Steps
1. ** Edit the config file **
   - edit config.js in `packages/react-app/src/config.js` to change the RPC URL to the production RPC URL

2. **Build the application locally:**
```bash
yarn react-app:build
```

3. **Set up Nginx on your server:**
   - Install Nginx if not already installed:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

4. **Create Nginx configuration:**
   - Create a new configuration file:
   ```bash
   sudo nano /etc/nginx/conf.d/adventure-layer-bridge.conf
   ```
   
   - Add the following configuration (adjust as needed):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;  # Replace with your actual domain

       location / {
           root /path/to/webroot;
           index index.html index.htm;
           try_files $uri /index.html;
       }
       
       location = /index.html {
           add_header Cache-Control no-store,no-cache;
           root /path/to/webroot;
       }
   }
   ```

5. **Enable the site:**
   ```bash
   sudo nginx -t  # Test configuration
   sudo systemctl restart nginx
   ```

6. **Create directory structure on server:**
   ```bash
   sudo chown -R $USER:$USER /path/to/webroot
   ```

7. **Deploy files to server:**
   
   Using script:
   ```bash
   ./scripts/deploy.sh
   ```
   
   Or manually using scp:
   ```bash
   scp -r -i "/path/to/your/key.pem" packages/react-app/build/* user@your-server-ip:/path/to/webroot/
   ```


8. **Verify deployment:**
   - Visit your domain or server IP at port 80 to ensure the application is running correctly

9. **Other Notes**
   - Add ssl certificate to nginx config
   - Edit the nginx config to change the port to 443
   - Edit the redirect rule in nginx config to redirect http to https

### Troubleshooting

- If you encounter 404 errors, check the Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- For permission issues: ensure proper ownership with `sudo chown -R www-data:www-data /path/to/webroot`
- For connectivity issues: verify firewall settings allow port 80 with `sudo ufw status` and adjust if needed

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
