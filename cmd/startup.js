require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Initialize bot
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN not found in environment variables');
}

const bot = new TelegramBot(token, { polling: true });

// Initialize express app (if needed for webhook or API)
const app = express();
const PORT = process.env.PORT || 3000;

// Bot command handlers can go here
bot.on('message', (msg) => {
  console.log('Received message:', msg.text);
  // Add your message handling logic
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Bot polling active...');
});
