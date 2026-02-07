require('dotenv').config();

const baseUrl = (process.env.APP_BASE_URL || '').trim().replace(/\/$/, '');

module.exports = { baseUrl };
