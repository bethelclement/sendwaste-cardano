# SendWaste Cardano - Deployment Guide
**Deploy to Cardano PreProd Testnet + Vercel**

---

## Part 1: Cardano Smart Contract Deployment

### Prerequisites
- Aiken 1.1.3+ installed
- Cardano CLI installed (optional, for manual deployment)
- PreProd testnet wallet with ADA (minimum 100 ADA for testing)

### Step 1: Build Aiken Contracts

```bash
cd validators
aiken build
```

This generates `plutus.json` in the `validators` directory containing compiled validator scripts.

### Step 2: Extract Validator Addresses

Create deployment script (`validators/deploy.ts`):

```typescript
import { Lucid, Blockfrost, fromText } from "@lucid-evolution/lucid";
import * as fs from "fs";

async function deploy() {
  const lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      process.env.BLOCKFROST_API_KEY!
    ),
    "Preprod"
  );

  // Load wallet from seed phrase
  lucid.selectWalletFromSeed(process.env.WALLET_SEED!);

  // Read compiled validators
  const plutusJson = JSON.parse(fs.readFileSync("plutus.json", "utf-8"));

  // Get waste receipt validator
  const wasteValidator = plutusJson.validators.find(
    (v: any) => v.title === "waste_receipt.spend"
  );

  // Calculate script hash (this becomes your validator address)
  const scriptHash = lucid.utils.validatorToScriptHash(wasteValidator.compiledCode);
  const validatorAddress = lucid.utils.credentialToAddress({
    type: "Script",
    hash: scriptHash,
  });

  console.log("✅ Waste Receipt Validator Address:", validatorAddress);

  // Get NFT minting policy
  const nftPolicy = plutusJson.validators.find(
    (v: any) => v.title === "receipt_nft_policy.mint"
  );

  const policyId = lucid.utils.mintingPolicyToId(nftPolicy.compiledCode);
  console.log("✅ NFT Policy ID:", policyId);

  // Get reward token policy
  const rewardPolicy = plutusJson.validators.find(
    (v: any) => v.title === "reward_token_policy.mint"
  );

  const rewardPolicyId = lucid.utils.mintingPolicyToId(rewardPolicy.compiledCode);
  console.log("✅ Reward Token Policy ID:", rewardPolicyId);

  // Save to .env file
  const envContent = `
# Deployed Contract Addresses (PreProd Testnet)
NEXT_PUBLIC_WASTE_VALIDATOR_ADDRESS=${validatorAddress}
NEXT_PUBLIC_NFT_POLICY_ID=${policyId}
NEXT_PUBLIC_REWARD_POLICY_ID=${rewardPolicyId}
NEXT_PUBLIC_SCRIPT_HASH=${scriptHash}
`;

  fs.appendFileSync("../.env.local", envContent);
  console.log("\n✅ Contract addresses saved to .env.local");
}

deploy().catch(console.error);
```

### Step 3: Run Deployment

```bash
# Set environment variables
export BLOCKFROST_API_KEY="your_preprod_key"
export WALLET_SEED="your 24-word seed phrase"

# Run deployment script
npx ts-node deploy.ts
```

### Step 4: Verify on CardanoScan

Visit https://preprod.cardanoscan.io and search for:
- Validator address
- Policy IDs

Confirm they appear on the blockchain explorer.

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_BLOCKFROST_API_KEY": "@blockfrost_api_key",
    "NEXT_PUBLIC_NFT_STORAGE_KEY": "@nft_storage_key",
    "NEXT_PUBLIC_WASTE_VALIDATOR_ADDRESS": "@validator_address",
    "NEXT_PUBLIC_NFT_POLICY_ID": "@nft_policy_id",
    "NEXT_PUBLIC_REWARD_POLICY_ID": "@reward_policy_id"
  }
}
```

### Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 3: Deploy

```bash
# Login to Vercel
vercel login

# Deploy (first time - creates project)
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: sendwaste-cardano
# - Directory: ./
# - Override settings? No

# Production deployment
vercel --prod
```

### Step 4: Set Environment Variables

In Vercel dashboard (vercel.com):
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add:
   - `NEXT_PUBLIC_BLOCKFROST_API_KEY` = your PreProd API key
   - `NEXT_PUBLIC_NFT_STORAGE_KEY` = your NFT.Storage key
   - `NEXT_PUBLIC_WASTE_VALIDATOR_ADDRESS` = from deployment script
   - `NEXT_PUBLIC_NFT_POLICY_ID` = from deployment script
   - `NEXT_PUBLIC_REWARD_POLICY_ID` = from deployment script

4. Redeploy to apply environment variables

---

## Part 3: Alternative Hosting (Netlify)

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## Part 4: Post-Deployment Testing

### Test Checklist

#### Smart Contracts
- [ ] Send test ADA to validator address
- [ ] Create mock waste submission transaction
- [ ] Verify transaction appears on CardanoScan
- [ ] Test NFT minting with CIP-25 metadata
- [ ] Confirm token minting works
- [ ] Test validator logic (verify/cancel paths)

#### Frontend
- [ ] Connect wallet (Nami testnet mode)
- [ ] Submit waste as household
- [ ] Verify as collector
- [ ] Check NFT appears in wallet
- [ ] Confirm tokens transferred
- [ ] Test all dashboard pages load
- [ ] Mobile responsiveness check

#### Integration
- [ ] IPFS uploads work (check CID accessibility)
- [ ] Geolocation captures correctly
- [ ] QR codes generate and scan
- [ ] Analytics update in real-time
- [ ] Error handling works (network failures)

---

## Part 5: Monitoring & Analytics

### Vercel Analytics

Enable in Vercel dashboard:
- Web Vitals tracking
- Error logging
- Performance metrics

### Cardano Transaction Monitoring

Use CardanoScan webhooks:
```javascript
// Example webhook handler (app/api/webhook/cardano/route.ts)
export async function POST(request: Request) {
  const event = await request.json();
  
  if (event.type === "transaction.confirmed") {
    // Update database
    // Send notification
    // Update analytics
  }
  
  return Response.json({ success: true });
}
```

### Custom Monitoring Script

```typescript
// Monitor validator UTxOs
async function monitorValidator() {
  const utxos = await lucid.utxosAt(validatorAddress);
  console.log(`Pending submissions: ${utxos.length}`);
  
  utxos.forEach((utxo) => {
    const datum = utxo.datum;
    // Parse and display
  });
}

setInterval(monitorValidator, 60000); // Every minute
```

---

## Part 6: Security Hardening

### Environment Variables

Never commit `.env.local` to git:
```bash
# .gitignore already includes this, but verify:
echo ".env.local" >> .gitignore
```

### Rate Limiting

Add to `middleware.ts`:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? 'unknown';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const max = 100; // 100 requests per minute

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
  } else {
    const record = rateLimit.get(ip);
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count++;
      if (record.count > max) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      }
    }
  }

  return NextResponse.next();
}
```

### Content Security Policy

Add headers in `next.config.mjs`:
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## Part 7: Maintenance & Updates

### Regular Tasks

**Daily:**
- Check Vercel deployment status
- Monitor error logs
- Verify testnet ADA balance

**Weekly:**
- Review analytics (user growth, transaction volume)
- Update dependencies (`npm audit fix`)
- Backup `.env.local` securely

**Monthly:**
- Security audit smart contracts
- Performance optimization
- User feedback implementation

### Updating Smart Contracts

**IMPORTANT:** Deployed validators are immutable. To update:

1. Deploy NEW validator with changes
2. Migrate existing UTxOs to new contract
3. Update frontend to use new addresses
4. Notify users of migration

---

## Troubleshooting

### Issue: "Transaction failed to submit"
**Solution:** Check wallet has sufficient testnet ADA (minimum 5 ADA)

### Issue: "NFT metadata not displaying"
**Solution:** Verify IPFS CID is accessible at ipfs.io/ipfs/{CID}

### Issue: "Vercel build fails"
**Solution:** 
```bash
# Clear Next.js cache locally
rm -rf .next
npm run build

# If succeeds locally, redeploy
vercel --force
```

### Issue: "Wallet won't connect"
**Solution:** Ensure wallet is in PreProd testnet mode, not mainnet

---

## 📊 Success Metrics

After deployment, track:
- ✅ Uptime (target: 99.9%)
- ✅ Transaction success rate (target: >95%)
- ✅ Page load time (target: <3s)
- ✅ Wallet connection time (target: <2s)
- ✅ User completion rate (submission → receipt)

---

**🎯 Deployment Checklist:**
- [ ] Aiken contracts built successfully
- [ ] Validator addresses deployed to PreProd
- [ ] NFT policy ID generated
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variables configured
- [ ] Test transaction completed end-to-end
- [ ] Monitoring enabled
- [ ] Security headers configured
- [ ] Demo video recorded with live deployment
- [ ] README updated with deployment URL

**Congratulations! SendWaste Cardano is LIVE! 🚀🇳🇬**
