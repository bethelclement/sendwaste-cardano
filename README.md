# SendWaste

**Every home globally produces waste, yet 70% remains uncollected in developing nations—SendWaste uses Cardano blockchain to make waste collection verifiable, trackable, and rewarding.**

**Live Demo:** https://sendwaste-cardano.vercel.app  
**Repository:** https://github.com/bethelclement/sendwaste-cardano  
**Testnet:** Cardano Preprod

---

## The Problem

Every home globally produces waste. Yet in Nigeria alone:
- **32 million tons** of waste produced annually
- **70% goes uncollected** due to broken trust systems
- Informal collectors **can't prove their work** to access credit
- Residents **can't verify** if waste was properly handled
- Government has **no real-time data** on contractor performance

This trust vacuum perpetuates poverty, unsanitary conditions, and unmet climate commitments.

## The Solution

SendWaste makes waste collection **visible, verifiable, and valuable** using Cardano blockchain.

**How it works:**
1. 📸 **Photograph your waste** - GPS location captured automatically
2. ✅ **Smart contract verifies** - Aiken validates GPS, hashes photo, checks duplicates  
3. 💰 **Instant blockchain rewards** - WASTE tokens + NFT receipt in under 30 seconds

Everything records permanently on Cardano. Transparent. Immutable. Verifiable.

## Why Cardano

**Cost:** 15¢ per transaction vs $5-50 on Ethereum—micro-transactions become viable  
**Scale:** 1,000 TPS supports 100,000+ monthly users  
**Security:** Aiken formal verification = mathematical proof code works correctly  
**Sustainability:** 99% less energy than proof-of-work chains  
**Africa Presence:** Existing partnerships in Ethiopia, Kenya, Tanzania

## Repository Structure

```
sendwaste-cardano/
├── documentation/              # All project documentation
│   ├── PROJECT_SUMMARY.md     # Executive summary
│   ├── SMART_CONTRACTS.md     # Contract technical docs
│   └── *.md                   # Additional docs
│
├── validators/                 # Aiken smart contracts
│   ├── lib/sendwaste/
│   │   ├── waste_receipt_validator.ak
│   │   └── reward_token_policy.ak
│   └── aiken.toml
│
├── public/                     # Static assets
│   ├── project_details.html
│   └── investor_pitch.html
│
├── scripts/                    # Utility scripts
│   ├── deploy.sh
│   └── quick-setup.sh
│
├── index.html                  # Main dApp (HTML + MeshSDK)
├── README.md                   # This file
├── vercel.json                 # Deployment config
└── logo-merged.png            # Branding asset
```

## Quick Start

**No installation required.** Visit https://sendwaste-cardano.vercel.app

**Test the flow:**

1. Click **"Create Account"** in navigation
2. Enter username, email, phone, address
3. System generates Cardano wallet ID
4. Navigate to **"Submit Waste"** section
5. Select waste type (PET, Aluminum, E-Waste)
6. Enter weight (try 5 kg)
7. Upload any photo
8. Click **"Submit Waste to Blockchain"**
9. Transaction confirms in ~25 seconds
10. Check **"My Dashboard"** for impact metrics

**What you'll see:**
- ✅ Instant token rewards (10 tokens per kg)
- ✅ NFT receipt with transaction hash
- ✅ ESG calculations (CO2 saved, water conserved)
- ✅ Achievement badges
- ✅ Complete waste history
- ✅ CSV export capability

## Smart Contract Details

**Deployment:** Cardano Preprod testnet  
**Language:** Aiken

**Core Functions:**
- GPS coordinate validation
- Photo hash generation (blake2b_256)
- Duplicate submission prevention
- Token calculation (tokens = weight_kg × 10)
- Automated minting to user wallet

**Security Features:**
- Single script input validation
- Signature verification
- 24-hour time locks
- Geofencing for service areas
- Photo hash registry prevents duplicates

See `documentation/SMART_CONTRACTS.md` for complete technical details.

## Technical Stack

**Blockchain:**
- Cardano Preprod testnet
- Aiken smart contracts
- MeshSDK for wallet connectivity

**Frontend:**
- Static HTML/CSS/JavaScript
- MeshSDK wallet integration (Nami, Eternl, Lace, Yoroi, Flint, etc.)
- Mobile-responsive design

**Data Storage:**
- On-chain transaction records
- Local storage for user profiles
- Future: IPFS for photo storage

## Revenue Model

**Platform Fees (40%):** 10% commission on rewards + NFT minting fees  
→ At 100K transactions/month: **$15K MRR**

**Corporate ESG (30%):** White-label tracking for companies  
→ Average contract: **$600-2,400/year**

**Government SaaS (20%):** Municipal dashboards  
→ **$5K-12K per city/year**

**Marketplace (10%):** Commission on token redemptions

**Projections:**
- Year 1: $180K ARR
- Year 2: $850K ARR  
- Year 3: $2.5M ARR

## Community Research

Project built on **6 weeks of field research** in Abuja, Nigeria:

- 23 conversations with collectors, residents, officials
- 4 neighborhoods: Kubwa, Gwarimpa, Dutse, Lugbe
- October-December 2024

**Key insight:** Communities don't need saving—they need infrastructure that makes existing efforts visible, verifiable, and valuable.

Documentation: `documentation/STAGE1_COMMUNITY_ESSENCE_MAP.md`

## Development Roadmap

**Q1 2025:** Mainnet deployment + Abuja pilot (500 users)  
**Q2 2025:** First corporate ESG client  
**Q3 2025:** Scale to 10K users across 3 cities  
**Q4 2025:** First government contract  
**Year 2:** National expansion to 40K users  
**Year 3:** 100K users, $2.5M ARR

## Impact Targets (24 Months)

**Environmental:**
- 500,000 kg waste diverted from landfills
- 600 tons CO2 emissions avoided
- 25 million liters water conserved

**Economic:**
- 15,000 people earning documented income
- 40% average income increase for collectors
- Bank account access for informal workers

**Social:**
- Trust infrastructure rebuilt through transparency
- Formal recognition for informal labor
- Verifiable ESG data for climate commitments

## Local Development

**For main dApp:**

```bash
git clone https://github.com/bethelclement/sendwaste-cardano.git
cd sendwaste-cardano
open index.html  # Or use any local server
```

**For smart contract development:**

```bash
cd validators
aiken check   # Run tests
aiken build   # Compile contracts
```

**Requirements:**
- Modern web browser
- Cardano wallet (Nami, Eternl, Lace, etc.) for blockchain interactions
- Testnet ADA for contract testing

## Testing

**Smart Contract Tests:**

```bash
cd validators
aiken check
```

**Coverage includes:**
- Valid submission verification
- Duplicate prevention
- Unauthorized access rejection
- Time lock enforcement
- GPS validation
- Token calculation accuracy

**Frontend Testing:**

Visit live demo and follow test flow in Quick Start section.

## Security

**Anti-Fraud Measures:**
- Single script input validation
- Photo hash duplicate detection
- GPS geofencing
- 24-hour verification windows
- Signature verification for collectors

**Privacy:**
- User data stored locally
- On-chain records use pseudonymous wallet addresses
- Photo hashes recorded, not original images

## Documentation

All project documentation is in the `/documentation` folder:

- **PROJECT_SUMMARY.md** - Executive summary
- **SMART_CONTRACTS.md** - Technical contract documentation
- **STAGE1_*.md** - Community research findings
- **PITCH_DECK.md** - Presentation materials
- **DEPLOYMENT.md** - Deployment guide

## License

MIT License

## Contact

**Project Lead:** Bethel Clement  
**Location:** Abuja, Nigeria  
**Repository:** https://github.com/bethelclement/sendwaste-cardano  
**Live Demo:** https://sendwaste-cardano.vercel.app

Built for Cardano Regenerative Exploration Hackathon 2024.
