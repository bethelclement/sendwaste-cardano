module.exports = {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
    cardanoNetwork: process.env.CARDANO_NETWORK || 'preprod'
};
