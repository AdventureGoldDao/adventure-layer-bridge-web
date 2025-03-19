# Adventure Layer Bridge Web

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

For set the config for networks and bridge strategies, we need to change some default configurations.

The setting is placed in the `packages/react-app/src/` directory, which contains the `config.js` file:

```js
// Wallet connection config
// If you want to change the l1 network, you can change the config here
// available options:
//   const keyMainnet = 'mainnet'
//   const keySepolia = 'sepolia'
//   const keyBerachain = 'berachain'
//   const keyBerachainBepolia = 'bepolia'
export const defaultL1NetworkKey = keyBerachain

// we use web3modal to connect wallet, please set your project id here
// and bridge metadata should be change as online bridge metadata
// get a new project id here: https://cloud.reown.com/
export const web3ModelConfig = {
  projectId: 'enter project id',
  metadata: {
    name: 'Adventure Layer Bridge',
    description: 'Bridge',
    url: 'https://bridge.adventurelayer.xyz', // origin must match your domain & subdomain
    icons: []
  },
}

// the basic config for adventure l2 and shard 
export const AdventureLayer = {
  ...
}
export const AdventureLocal1 = {
  ...
}

// If you want to change pulldown text and icon
// and the bridge contract address is modified,
// you can change the config here
export const chainMainnet = {
   ...
   // if a er20 token is bridged to adventure layer l2
   tokenAddress: '0x4xxxxx',
}

export const chainSepolia = {
  ...
  // if a er20 token is bridged to adventure layer l2
  tokenAddress: '0x4xxxxx',
}

export const chainBerachain = {
  ...
  addresses: {
    adventure: '0x start contract address',
  },
}

export const chainAdventureLayerL2 = {
  ...
  addresses: {
    berachain: '0x start contract address',
    local1: '0x start contract address',
  },
}

export const chainAdventureShard1 = {
  ...
  addresses: {
    adventure: '0x start contract address',
  },
}
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

There are two ways to deploy the application to production:

#### 1. Automated Deployment (Recommended)

We provide a deployment script that automates the entire process. To use it:

1. **Set up SSH access to your production server**
   - Ensure you have SSH access to your production server
   - Make sure your SSH key is properly configured

2. **Configure deployment variables**
   Create a `.env.production` file in the root directory with the following variables:
   ```
   DEPLOY_USER=ubuntu          # Your server's SSH user
   DEPLOY_HOST=example.com     # Your production server hostname
   DEPLOY_PATH=/var/www/bridge # Deployment path on the server
   SSH_KEY=~/.ssh/id_rsa      # Path to your SSH key
   ```

3. **Make the deployment script executable**
   ```bash
   chmod +x scripts/deploy-pro.sh
   ```

4. **Run the deployment script**
   ```bash
   ./scripts/deploy-pro.sh
   ```

The script will:
- Build the application
- Create necessary directories on the server
- Deploy the files
- Set proper permissions
- Restart Nginx

#### 2. Manual Deployment

If you prefer to deploy manually, follow these steps:

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

