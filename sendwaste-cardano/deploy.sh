#!/bin/bash

# SendWaste Cardano - Automated Deployment Script
# Run this on YOUR Mac (requires Node.js, Aiken, and accounts set up)

set -e  # Exit on error

echo "🚀 SendWaste Cardano - Deployment Script"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js not found. Install from: https://nodejs.org${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}❌ npm not found. Install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo -e "${GREEN}✅ npm $(npm --version)${NC}"

# Step 2: Install dependencies
echo ""
echo -e "${BLUE}Step 2: Installing dependencies...${NC}"
npm install

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Check environment variables
echo ""
echo -e "${BLUE}Step 3: Checking environment variables...${NC}"

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from template...${NC}"
    cp .env.example .env.local
    echo -e "${YELLOW}📝 Please edit .env.local and add your API keys:${NC}"
    echo "   - NEXT_PUBLIC_BLOCKFROST_API_KEY (get from blockfrost.io)"
    echo "   - NEXT_PUBLIC_NFT_STORAGE_KEY (get from nft.storage)"
    echo ""
    read -p "Press enter after you've added your API keys..."
fi

echo -e "${GREEN}✅ Environment configured${NC}"

# Step 4: Build project
echo ""
echo -e "${BLUE}Step 4: Building Next.js application...${NC}"
npm run build

echo -e "${GREEN}✅ Build successful${NC}"

# Step 5: Deploy to Vercel (if Vercel CLI installed)
echo ""
echo -e "${BLUE}Step 5: Deploying to Vercel...${NC}"

if command -v vercel &> /dev/null; then
    echo "Vercel CLI detected. Deploying..."
    vercel --prod
    echo -e "${GREEN}✅ Deployed to Vercel${NC}"
else
    echo -e "${YELLOW}⚠️  Vercel CLI not found.${NC}"
    echo "Install with: npm install -g vercel"
    echo "Then run: vercel --prod"
fi

# Step 6: Summary
echo ""
echo -e "${GREEN}========================================"
echo "✅ Deployment Complete!"
echo "========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Open your Nami wallet and switch to PreProd testnet"
echo "2. Get testnet ADA from: https://docs.cardano.org/cardano-testnet/tools/faucet/"
echo "3. Visit your deployed app"
echo "4. Connect wallet and test transactions"
echo "5. Record demo video following DEMO_SCRIPT.md"
echo "6. Create pitch deck using PITCH_DECK.md"
echo ""
echo -e "${BLUE}🎯 Hackathon Day: December 6, 2025${NC}"
echo -e "${GREEN}Good luck! 🚀🇳🇬${NC}"
