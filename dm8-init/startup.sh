#!/bin/sh
set -e

DATA_DIR="/dm8/data/DAMENG"
INIT_DONE="$DATA_DIR/init_done.marker"

# 首次启动：清除镜像内预置数据库，用我们的密码重新初始化
if [ ! -f "$INIT_DONE" ]; then
    echo ">>> First run: removing pre-existing database files..."
    rm -rf "$DATA_DIR"
    mkdir -p "$DATA_DIR"
    chown -R dmdba:dinstall /dm8/data

    echo ">>> Initializing fresh DM8 database with SYSDBA password: Ajiahao987*"
    su - dmdba -c "/dm8/bin/dminit PATH=/dm8/data DB_NAME=DAMENG SYSDBA_PWD=Ajiahao987* CASE_SENSITIVE=N CHARSET=1 PAGE_SIZE=16"

    touch "$INIT_DONE"
    echo ">>> Initialization complete."
fi

echo ">>> Starting DMSERVER on port 5236..."
exec su - dmdba -c "/dm8/bin/dmserver $DATA_DIR/dm.ini"
