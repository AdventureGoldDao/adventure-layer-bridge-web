#!/usr/bin/env bash

## Run in the project root directory
# Define local and remote directories
LOCAL_DIR="./packages/react-app/build"
REMOTE_DIR="/data/www/adventure-layer-bridge/front"
KEY_PATH="./secrets/key.pem"

# Check if the index.html file exists in the local directory
if [ -f "${LOCAL_DIR}/index.html" ]; then
    # Check if the scp command exists
    if command -v scp &> /dev/null; then
        # Use scp to upload the files
        echo "Deploying SCP"
        scp -r -i "${KEY_PATH}" -o StrictHostKeyChecking=no "${LOCAL_DIR}/"* ubuntu@3.84.203.161:"${REMOTE_DIR}"

        # Check if the upload was successful
        if [ $? -eq 0 ]; then
            echo "Files have been successfully uploaded to the remote server."
        else
            echo "Upload failed, please check the network or private key file."
        fi
    else
        # Check if the sftp command exists
        if command -v sftp &> /dev/null; then
            # Use sftp to upload the files
            sftp -r -i "${KEY_PATH}" -o StrictHostKeyChecking=no ubuntu@3.84.203.161 << EOF
            cd "${REMOTE_DIR}"
            put -r "${LOCAL_DIR}/"*
            exit
EOF

            # Check if the upload was successful
            if [ $? -eq 0 ]; then
                echo "Files have been successfully uploaded to the remote server."
            else
                echo "Upload failed, please check the network or private key file."
            fi
        else
            echo "Both scp and sftp commands are missing, please install them."
            exit 1
        fi
    fi
else
    echo "No index.html file found in the local directory."
fi
