const express = require('express');
const cors = require('cors');
const config = require('./config');
const api = require('./api/endpoints');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', api);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = config.port || 3001;
app.listen(PORT, () => {
    console.log(`SendWaste Backend running on port ${PORT}`);
});
