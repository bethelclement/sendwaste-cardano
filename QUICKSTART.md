# SendWaste Cardano - Quick Setup Guide

Welcome! This guide will get you running locally in minutes.

## 📋 Prerequisites

- **Node.js 18+** and npm installed
- **Git** installed  
- **Cardano Wallet** (Nami recommended) with testnet ADA

##⚡ Quick Start

```bash
# 1. Navigate to project
cd /Users/mac/.gemini/antigravity/scratch/sendwaste-cardano

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Add your API keys
# Edit .env.local and add:
# - Blockfrost API key (get free at blockfrost.io)
# - NFT.Storage API key (get free at nft.storage)

# 5. Run development server
npm run dev

# 6. Open in browser
# Visit: http://localhost:3000
```

## 🎨 Visual Features

The app includes:
- ✨ **Mesh gradient backgrounds** (modern Web3 aesthetic)
- 💫 **Neon glow effects** on interactive elements  
- 🎭 **3D card transforms** with magnetic hover
- 🌈 **Vibrant eco-friendly colors** (emerald, cyan, lime)
- ♿ **Accessible design** with proper contrast ratios
- 📱 **Mobile-responsive** layout

## 🔗 Key Pages

- `/` - Homepage with stats and problem statement
- `/household` - Waste submission with photo upload & QR codes
- `/collector` - Pickup management with route optimization
- `/recycler` - Material marketplace with token redemption
- `/admin` - Analytics dashboard with charts

## 🚀 Next Steps

1. **Connect Wallet**: Click "Connect Wallet" in navbar
2. **Switch to Testnet**: Set wallet to PreProd testnet
3. **Get testnet ADA**: Use Cardano faucet
4. **Test Flow**: Submit waste → Verify pickup → View receipt

## 📚 Full Documentation

See `README.md` for complete setup instructions and architecture details.

---

**Built for DirectEd x CATS Hackathon 2025 - Abuja Hub 🇳🇬**
