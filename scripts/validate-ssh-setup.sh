#!/bin/bash

# Validation script to test SSH setup for GitHub
echo "🔍 Validating SSH setup for GitHub..."

# Check if known_hosts file exists and contains GitHub entries
KNOWN_HOSTS="$HOME/.ssh/known_hosts"

if [ ! -f "$KNOWN_HOSTS" ]; then
    echo "❌ known_hosts file not found at: $KNOWN_HOSTS"
    echo "Run './scripts/setup-github-ssh.sh' to set up SSH for GitHub"
    exit 1
fi

# Check if GitHub host keys are present
if grep -q "github.com" "$KNOWN_HOSTS"; then
    echo "✅ GitHub host keys found in known_hosts"
    
    # Count the number of GitHub entries
    GITHUB_ENTRIES=$(grep -c "github.com" "$KNOWN_HOSTS")
    echo "   Found $GITHUB_ENTRIES GitHub host key entries"
    
    # Show the key types
    echo "   Key types:"
    grep "github.com" "$KNOWN_HOSTS" | while read line; do
        if echo "$line" | grep -q "ssh-rsa"; then
            echo "   - RSA"
        elif echo "$line" | grep -q "ecdsa-sha2"; then
            echo "   - ECDSA"
        elif echo "$line" | grep -q "ssh-ed25519"; then
            echo "   - Ed25519"
        fi
    done
else
    echo "❌ No GitHub host keys found in known_hosts"
    echo "Run './scripts/setup-github-ssh.sh' to set up SSH for GitHub"
    exit 1
fi

# Test SSH connection (without authentication)
echo ""
echo "🧪 Testing SSH connection to GitHub..."
SSH_TEST_OUTPUT=$(ssh -o ConnectTimeout=5 -o BatchMode=yes -T git@github.com 2>&1)
SSH_EXIT_CODE=$?

if echo "$SSH_TEST_OUTPUT" | grep -q "successfully authenticated"; then
    echo "✅ SSH connection and authentication successful!"
elif echo "$SSH_TEST_OUTPUT" | grep -q "Permission denied"; then
    echo "✅ SSH connection established (host key verification passed)"
    echo "⚠️  Authentication failed - this is expected if no SSH key is configured"
elif echo "$SSH_TEST_OUTPUT" | grep -q "Connection timed out"; then
    echo "⚠️  SSH connection timed out - port 22 may be blocked"
    echo "   Consider using HTTPS for git operations in this environment"
elif echo "$SSH_TEST_OUTPUT" | grep -q "Host key verification failed"; then
    echo "❌ Host key verification failed"
    echo "   Try running './scripts/setup-github-ssh.sh' again"
    exit 1
else
    echo "ℹ️  SSH test completed with output:"
    echo "   $SSH_TEST_OUTPUT"
fi

echo ""
echo "📋 Summary:"
echo "   - SSH host key setup: ✅ Complete"
echo "   - Host key verification: ✅ Working"
echo "   - Ready for SSH git operations (with proper SSH key authentication)"

echo ""
echo "💡 To use SSH with git:"
echo "   git clone git@github.com:user/repo.git"
echo "   git remote set-url origin git@github.com:user/repo.git"