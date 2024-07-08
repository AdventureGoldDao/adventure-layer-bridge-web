#!/usr/bin/env bash

## 在项目根目录下执行
# 定义本地和远程目录
LOCAL_DIR="./packages/react-app/build"
REMOTE_DIR="/home/ubuntu/liuwill/webserver/sites/bridge"
KEY_PATH="./secrets/key.pem"

# 检查本地目录是否存在 index.html 文件
if [ -f "${LOCAL_DIR}/index.html" ]; then
    # 检查 scp 命令是否存在
    if command -v scp &> /dev/null; then
        # 使用 scp 命令上传文件
	echo "Deploying SCP"
        scp -r -i "${KEY_PATH}" -o StrictHostKeyChecking=no "${LOCAL_DIR}/"* ubuntu@52.206.132.165:"${REMOTE_DIR}"

        # 检查上传是否成功
        if [ $? -eq 0 ]; then
            echo "文件已成功上传到远程服务器。"
        else
            echo "上传失败，请检查网络或私钥文件。"
        fi
    else
        # 检查 sftp 命令是否存在
        if command -v sftp &> /dev/null; then
            # 使用 sftp 命令上传文件
            sftp -r -i "${KEY_PATH}" -o StrictHostKeyChecking=no ubuntu@52.206.132.165 << EOF
            cd "${REMOTE_DIR}"
            put -r "${LOCAL_DIR}/"*
            exit
EOF

            # 检查上传是否成功
            if [ $? -eq 0 ]; then
                echo "文件已成功上传到远程服务器。"
            else
                echo "上传失败，请检查网络或私钥文件。"
            fi
        else
            echo "scp 和 sftp 命令都不存在，请安装它们。"
            exit 1
        fi
    fi
else
    echo "本地目录中没有找到 index.html 文件。"
fi