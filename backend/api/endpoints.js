const express = require('express');
const router = express.Router();
const cardanoService = require('../contracts/cardano-service');
const validation = require('../utils/validation');

router.post('/verify', async (req, res) => {
    try {
        const { wasteType, weight, gps } = req.body;

        if (!validation.validateSubmission(req.body)) {
            return res.status(400).json({ error: 'Invalid submission data' });
        }

        const result = await cardanoService.verifyWaste(wasteType, weight, gps);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/leaderboard', (req, res) => {
    // Return mock leaderboard data
    res.json({
        leaders: [
            { rank: 1, address: 'addr1...4k9x', waste: 245, nfts: 42, tokens: 3687 },
            { rank: 2, address: 'addr1...7m2p', waste: 198, nfts: 35, tokens: 2974 },
            { rank: 3, address: 'addr1...9n5q', waste: 156, nfts: 28, tokens: 2350 }
        ]
    });
});

module.exports = router;
