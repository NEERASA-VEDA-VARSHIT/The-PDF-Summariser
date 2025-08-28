#!/bin/bash

# Script to establish trusted SSH connection to GitHub
# This script adds GitHub's host keys to the known_hosts file to avoid host key verification prompts

set -e

echo "🔐 Setting up trusted SSH connection to GitHub..."

# Create SSH directory if it doesn't exist
SSH_DIR="$HOME/.ssh"
KNOWN_HOSTS="$SSH_DIR/known_hosts"

if [ ! -d "$SSH_DIR" ]; then
    echo "📁 Creating SSH directory: $SSH_DIR"
    mkdir -p "$SSH_DIR"
    chmod 700 "$SSH_DIR"
fi

echo "🔍 Adding GitHub host keys to known_hosts..."

# Try to use ssh-keyscan first (preferred method)
if command -v ssh-keyscan &> /dev/null; then
    echo "Using ssh-keyscan to fetch GitHub host keys..."
    if ssh-keyscan -H github.com >> "$KNOWN_HOSTS" 2>/dev/null; then
        echo "✅ Successfully added GitHub host keys using ssh-keyscan"
    else
        echo "⚠️  ssh-keyscan failed, falling back to manual key addition..."
        FALLBACK=true
    fi
else
    echo "⚠️  ssh-keyscan not available, using manual key addition..."
    FALLBACK=true
fi

# Fallback: Add known GitHub host keys manually
if [ "$FALLBACK" = true ]; then
    echo "📝 Adding GitHub host keys manually..."
    
    # GitHub's current host keys (as of 2024)
    echo "github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk=" >> "$KNOWN_HOSTS"
    echo "github.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=" >> "$KNOWN_HOSTS"
    echo "github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl" >> "$KNOWN_HOSTS"
    
    echo "✅ GitHub host keys added manually"
fi

# Set proper permissions
chmod 600 "$KNOWN_HOSTS"

echo "🔒 Set proper permissions for known_hosts file"

# Test the connection (optional)
echo ""
echo "🧪 Testing SSH connection to GitHub..."
echo "Note: This may show an authentication error if no SSH key is configured, but should not show host key verification errors"

if ssh -o ConnectTimeout=10 -o BatchMode=yes -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH connection successful! You're authenticated with GitHub."
elif ssh -o ConnectTimeout=10 -o BatchMode=yes -T git@github.com 2>&1 | grep -q "Permission denied"; then
    echo "⚠️  SSH connection established, but authentication failed (no SSH key configured or key not added to GitHub)"
    echo "   This is expected if you haven't set up SSH keys with GitHub yet."
    echo "   The important thing is that host key verification is now working."
elif ssh -o ConnectTimeout=10 -o BatchMode=yes -T git@github.com 2>&1 | grep -q "Connection timed out"; then
    echo "❌ SSH connection timed out. Port 22 may be blocked in this environment."
    echo "   Consider using HTTPS instead of SSH for git operations."
else
    echo "ℹ️  SSH connection test completed. Host key verification should now work."
fi

echo ""
echo "✅ GitHub SSH setup completed!"
echo ""
echo "📋 Summary:"
echo "   - GitHub host keys have been added to: $KNOWN_HOSTS"
echo "   - Host key verification will no longer prompt for GitHub connections"
echo "   - You can now use SSH URLs like: git@github.com:user/repo.git"
echo ""
echo "💡 If you need to set up SSH keys for authentication, visit:"
echo "   https://docs.github.com/en/authentication/connecting-to-github-with-ssh"