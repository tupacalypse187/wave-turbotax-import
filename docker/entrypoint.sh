#!/bin/sh

set -e

echo "🔧 Starting Wave TurboTax application..."

# Ensure nginx can write to its directories
mkdir -p /var/log/nginx /var/cache/nginx /var/run/nginx

# Healthcheck runs in background
/usr/local/bin/healthcheck.sh &

# Start nginx
echo "✅ Starting nginx..."
exec nginx -g 'daemon off;'
