#!/bin/bash

# Bunがインストールされているか確認
if ! command -v bun &> /dev/null
then
    echo "Bunがインストールされていません。"
    exit 1
fi

echo "🚀 Bunテストを開始します..."

# パスとして認識させるため、先頭に ./ を付与して実行
bun test ./test/error-class.js --coverage
