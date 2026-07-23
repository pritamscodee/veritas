#!/usr/bin/env bash
set -euo pipefail

# 1) Start the Veritas backend stack (API gateway + microservices) via Docker.
docker compose up -d

# 2) Expose the API gateway publicly through an ngrok tunnel.
#    Make sure you've added your token once:  ngrok config add-authtoken <TOKEN>
echo "Backend stack is up. Starting ngrok tunnel on :3000 ..."
ngrok start --all --config ngrok.yml
