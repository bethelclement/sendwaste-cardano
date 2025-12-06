# SendWaste Investor Pitch Deck - Export Guide

## 📥 How to Export & Share

### Option 1: PDF Export (Recommended for Sharing)
1. Open: https://sendwaste-cardano.vercel.app/investor_pitch.html
2. Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
3. Select "Save as PDF"
4. Adjust: Landscape orientation, no headers/footers
5. Save as: `SendWaste_Pitch_Deck.pdf`

### Option 2: PowerPoint (.pptx)
Copy the content below into PowerPoint slides (7 slides total)

### Option 3: Canva Import
1. Go to Canva.com → Create a Presentation
2. Choose "Blank Presentation" 
3. Copy content from each slide below into Canva slides
4. Design dimensions: 1920x1080px (16:9)

---

## 🎨 Brand Guidelines

**Colors:**
- Primary Green: #10b981
- Secondary Cyan: #06b6d4
- Dark Background: #0a1628 to #0f3a2f (gradient)
- Accent Gold: #f59e0b
- Accent Purple: #8b5cf6

**Fonts:**
- Headings: Outfit (Bold/ExtraBold)
- Body: Outfit (Regular)
- Code/Tech: Space Mono

**Logo:** `/logo-merged.png` (180px width for cover slide)

---

## 📄 SLIDE CONTENT FOR COPY-PASTE

### SLIDE 1: COVER
**Layout:** Centered, dark gradient background

**Content:**
```
[Logo: 180px width, centered]

SendWaste

Blockchain-Verified Waste Recovery for Africa

Bethel Clement, Founder

CARDANO • AIKEN SMART CONTRACTS • LIVE MAINNET
```

**Design Notes:**
- Logo centered at top
- "SendWaste" as massive title (96px)
- Subtitle in lighter color
- Founder name in bold (28px)
- Tech stack in monospace font at bottom

---

### SLIDE 2: THE PROBLEM
**Slide Number:** 02 / 07 (top-right)

**Title:** The Problem

**Subtitle:** Nigeria: 32M tons waste/year. 70% uncollected.

**3 Stat Cards:**
1. **$2.3T** - Global waste market by 2030
2. **70%** - Waste uncollected in Nigeria
3. **0** - Trust in current systems

**Bullet Points:**
▸ Collectors have no proof of work
▸ Citizens get zero incentive to recycle
▸ Governments can't track environmental impact

**Design Notes:**
- 3 cards in grid layout
- Large numbers (68px)
- Cards have green border with hover effects

---

### SLIDE 3: OUR SOLUTION
**Slide Number:** 03 / 07

**Title:** Our Solution

**3-Step Process Cards:**

**Card 1:**
1
**Submit**
Photo + GPS proof creates on-chain transaction

**Card 2:**
2
**Verify**
Aiken smart contract validates automatically

**Card 3:**
3
**Earn**
Instant $WASTE tokens + NFT receipt

**Highlight Box:**
**Only platform with:**
▸ Live on Cardano mainnet
▸ Real Aiken smart contracts
▸ Sub-30-second verification

**Design Notes:**
- 3 equal-width cards
- Large step numbers
- Green highlight box at bottom

---

### SLIDE 4: BUILT ON CARDANO
**Slide Number:** 04 / 07

**Title:** Built on Cardano

**Subtitle:** Aiken smart contracts ensure transparent, tamper-proof rewards

**Code Block (use monospace font, dark background):**
```aiken
// Waste Validator (Aiken)
validator waste_submission {
  fn verify(datum: WasteData, ctx: ScriptContext) {
    // Verify GPS coordinates
    expect Some(location) = datum.gps_location
    // Verify photo hash
    expect photo_hash == blake2b_256(datum.photo)
    // Calculate & mint tokens
    let tokens = datum.weight_kg * 10
    mint_tokens(tokens, ctx.tx)
  }
}
```

**Two Columns Below Code:**

**Left Column - Why Cardano?**
▸ $0.15 fees (vs $5-50 Ethereum)
▸ 1,000 TPS capacity
▸ 99% less energy usage

**Right Column - Aiken Benefits**
▸ Formally verified (bug-proof)
▸ 83% smaller than Plutus
▸ Developer-friendly syntax

**Design Notes:**
- Code block with syntax highlighting (green/cyan colors)
- 2-column layout for benefits
- Tech-focused aesthetic

---

### SLIDE 5: REVENUE
**Slide Number:** 05 / 07

**Title:** Revenue

**3 Revenue Stream Cards:**

**Card 1:**
40%
**Platform Fees**
10% of token rewards + NFT minting fees

**Card 2:**
30%
**Corporate ESG**
White-label tracking for companies

**Card 3:**
30%
**Government SaaS**
Municipal dashboards & analytics

**Bottom Banner:**
**Year 1:** $180K  |  **Year 2:** $850K  |  **Year 3:** $2.5M

**Design Notes:**
- Percentage in large font with gradient
- Cards in 3-column grid
- Projections centered at bottom

---

### SLIDE 6: MILESTONES
**Slide Number:** 06 / 07

**Title:** Milestones

**Two Columns:**

**Left - Delivered (green header):**
▸ Aiken contracts live on Preprod
▸ 3 wallet integrations
▸ Working demo (30-sec onboarding)

**Right - Next 12 Months (cyan header):**
▸ **Q1:** Abuja pilot (500 users)
▸ **Q2:** First corporate client
▸ **Q3:** 10K active users
▸ **Q4:** Government partnership

**Impact Box (green background, centered):**
**24-Month Impact**

4 columns:
- **500K kg** - Waste Diverted
- **600 tons** - CO₂ Avoided
- **25M L** - Water Saved
- **15K** - People Earning

**Design Notes:**
- 2-column layout for timeline
- Large impact metrics in box
- Green accent border on impact box

---

### SLIDE 7: THE ASK
**Slide Number:** 07 / 07

**Title:** The Ask

**Two Sections:**

**Left - Investment Card (larger, highlighted):**
$250K
Seed Round
18-month runway

**Right - Use of Funds:**
Engineering.......$100K
Marketing.........$75K
Operations........$50K
Legal..............$25K

**Bottom Center:**
**Live Demo**
sendwaste-cardano.vercel.app

**Design Notes:**
- Large $250K with gradient
- Investment card has stronger border
- Clean budget breakdown
- Demo link in green with underline

---

## 🎨 CANVA SPECIFIC INSTRUCTIONS

1. **Create New Presentation:**
   - Go to Canva.com
   - Click "Create a design" → "Presentation (16:9)"
   
2. **Set Background:**
   - Use gradient: #0a1628 → #0f3a2f (dark teal/green)
   - Or solid #0a1628 for simplicity

3. **Upload Logo:**
   - Upload your logo-merged.png
   - Use on Slide 1 only (180-200px width)

4. **Fonts:**
   - Primary: "Outfit" or "Montserrat" (similar alternative)
   - Code: "Courier Prime" or "Source Code Pro"

5. **Colors:**
   - Add to brand kit: #10b981, #06b6d4, #f59e0b, #8b5cf6

6. **Elements:**
   - Use Canva "Cards" elements for stat boxes
   - Add subtle shadows to cards
   - Use arrows (▸) from Canva's shapes

7. **Export:**
   - Download as PDF (for sharing)
   - Download as PPTX (for editing)
   - Share link (for online viewing)

---

## 📊 POWERPOINT SPECIFIC INSTRUCTIONS

1. **Create New Presentation:**
   - Open PowerPoint → Blank Presentation
   - Design tab → Slide Size → Widescreen (16:9)

2. **Apply Dark Theme:**
   - Design tab → Themes → Dark variant
   - Or manually set background to #0a1628

3. **Master Slide Setup:**
   - View tab → Slide Master
   - Set consistent fonts: Outfit (or Calibri as fallback)
   - Add slide numbers to top-right

4. **Insert Logo:**
   - Slide 1 only: Insert → Pictures → logo-merged.png
   - Resize to 180px width, center align

5. **Create Cards:**
   - Insert → Shapes → Rectangle with rounded corners
   - Fill: None or slight green tint (#10b981 at 6% opacity)
   - Border: 2px, #10b981
   - Shadow: Soft edge

6. **Code Block (Slide 4):**
   - Insert → Text Box
   - Font: Courier New or Consolas
   - Background: Dark gray (#1a1a1a)
   - Text color: #06b6d4
   - Border-left: Thick line #10b981

7. **Export:**
   - File → Save As → .pptx
   - File → Export → PDF (for sharing)

---

## 🔗 SHAREABLE LINKS

**Live Web Version:** https://sendwaste-cardano.vercel.app/investor_pitch.html

**How to Share:**
1. **For investors:** Export as PDF, send via email
2. **For online viewing:** Share the live link
3. **For editing:** Create Canva version, share Canva link
4. **For presentations:** Use PowerPoint file on laptop

---

## ✅ QUALITY CHECKLIST

Before sharing, verify:
- [ ] Logo displays on Slide 1
- [ ] Founder name "Bethel Clement" is bold and visible
- [ ] All stats are accurate (32M tons, $2.3T, etc.)
- [ ] Aiken code is readable with syntax highlighting
- [ ] "Abuja pilot" (not Lagos)
- [ ] Contact info or demo link on final slide
- [ ] Consistent brand colors throughout
- [ ] No typos in critical numbers

---

**Created:** December 6, 2024
**Founder:** Bethel Clement
**Version:** 1.0
