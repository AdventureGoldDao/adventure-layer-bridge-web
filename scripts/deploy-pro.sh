#!/bin/bash

# Exit on error
set -e

# Configuration
DEPLOY_USER=${DEPLOY_USER:-"ubuntu"}
DEPLOY_HOST=${DEPLOY_HOST:-"your-production-server.com"}
DEPLOY_PATH=${DEPLOY_PATH:-"/var/www/adventure-layer-bridge"}
SSH_KEY=${SSH_KEY:-"~/.ssh/id_rsa"}

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting production deployment...${NC}"

# Check if required environment variables are set
if [ -z "$DEPLOY_HOST" ] || [ "$DEPLOY_HOST" = "your-production-server.com" ]; then
    echo -e "${RED}Error: Please set the DEPLOY_HOST environment variable${NC}"
    exit 1
fi

# Build the application
echo -e "${GREEN}Building application...${NC}"
yarn install
yarn react-app:build

# Create necessary directories on the remote server
echo -e "${GREEN}Creating directories on remote server...${NC}"
ssh -i "$SSH_KEY" "$DEPLOY_USER@$DEPLOY_HOST" "sudo mkdir -p $DEPLOY_PATH && sudo chown -R $DEPLOY_USER:$DEPLOY_USER $DEPLOY_PATH"

# Deploy the build files
echo -e "${GREEN}Deploying files to production server...${NC}"
rsync -avz --delete -e "ssh -i $SSH_KEY" packages/react-app/build/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"

# Set proper permissions
echo -e "${GREEN}Setting proper permissions...${NC}"
ssh -i "$SSH_KEY" "$DEPLOY_USER@$DEPLOY_HOST" "sudo chown -R www-data:www-data $DEPLOY_PATH"

# Restart Nginx
echo -e "${GREEN}Restarting Nginx...${NC}"
ssh -i "$SSH_KEY" "$DEPLOY_USER@$DEPLOY_HOST" "sudo systemctl restart nginx"

echo -e "${GREEN}Deployment completed successfully!${NC}" 