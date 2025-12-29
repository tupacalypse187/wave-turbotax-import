#!/bin/sh

# Health check script for Wave TurboTax application
# Returns 0 if healthy, 1 if unhealthy

set -e

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
    echo "❌ Nginx is not running"
    exit 1
fi

# Check if main endpoint is accessible
if ! curl -f -s http://localhost:8080/health > /dev/null; then
    echo "❌ Health endpoint is not responding"
    exit 1
fi

# Check if static files are accessible
if ! curl -f -s -I http://localhost:8080/ > /dev/null; then
    echo "❌ Static files are not accessible"
    exit 1
fi

# Check disk space (less than 90% used)
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    echo "⚠️ Disk usage is high: ${DISK_USAGE}%"
    # Don't fail health check, just warn
fi

# Check memory usage
MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ "$MEM_USAGE" -gt 85 ]; then
    echo "⚠️ Memory usage is high: ${MEM_USAGE}%"
    # Don't fail health check, just warn
fi

echo "✅ Health check passed - Nginx running, endpoint accessible"
exit 0