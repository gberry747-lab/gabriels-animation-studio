#!/bin/zsh
# serve.sh <dir> <port>  -> static server in the background (python). Prints the url.
d="$1"; p="$2"; (nohup python3 -m http.server "$p" --directory "$d" >/tmp/gasqa-serve-$p.log 2>&1 &); sleep 1; echo "http://localhost:$p/index.html"
