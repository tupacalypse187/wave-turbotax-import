#!/bin/sh

set -e

echo "🔧 Setting up directories and permissions..."

# Fix permissions on nginx directories (handles both bind mounts and non-mounted dirs)
mkdir -p /var/log/nginx /var/cache/nginx /var/run/nginx

# Fix ownership for bind-mounted directories
chown -R appuser:appuser /var/log/nginx /var/cache/nginx /var/run/nginx
chmod -R 755 /var/log/nginx /var/cache/nginx /var/run/nginx

echo "Permissions set:"
ls -la /var/run/nginx

# Start healthcheck in background
/usr/local/bin/healthcheck.sh &

echo "✅ Starting nginx as appuser..."
echo "Appuser UID: $(id -u appuser)"
exec su-exec appuser nginx -g 'daemon off;'
