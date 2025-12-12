#!/bin/bash
# COPY AND PASTE THESE COMMANDS ONE BY ONE IN YOUR TERMINAL

echo "🚀 SendWaste Cardano - Quick Investor Demo Setup"
echo "================================================"
echo ""

# Step 1: Check if Node.js is installed
echo "Step 1: Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js $(node --version) installed"
else
    echo "❌ Node.js NOT installed"
    echo "👉 Download from: https://nodejs.org"
    echo "   Click the GREEN 'LTS' button and install"
    echo ""
    echo "After installing, come back and run this script again!"
    exit 1
fi

# Step 2: Navigate to project
echo ""
echo "Step 2: Setting up project..."
cd /Users/mac/.gemini/antigravity/scratch/sendwaste-cardano

# Step 3: Install dependencies
echo ""
echo "Step 3: Installing dependencies (this takes 2-3 minutes)..."
npm install

# Step 4: Create environment file with demo keys
echo ""
echo "Step 4: Creating demo environment..."
cat > .env.local << 'EOF'
# Demo keys for investor presentation (UI will load, blockchain features need real keys)
NEXT_PUBLIC_BLOCKFROST_API_KEY=preprodDemoKey123ForUIOnly
NEXT_PUBLIC_NFT_STORAGE_KEY=demo_nft_storage_key_ui_only
EOF

echo "✅ Environment configured"

# Step 5: Build the app
echo ""
echo "Step 5: Building production app..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "================================================"
echo "🎉 READY TO DEPLOY!"
echo "================================================"
echo ""
echo "Next: Deploy to Vercel"
echo ""
echo "Run these commands:"
echo "  npm install -g vercel"
echo "  vercel login"
echo "  vercel --prod"
echo ""
echo "You'll get a live URL to share with your investor!"
echo ""
