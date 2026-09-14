require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const track = require("./commands/track");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

const OWNER_ID = String(process.env.OWNER_ID);

function isOwner(msg) {
    return String(msg.from.id) === OWNER_ID;
}

// Start
bot.onText(/^\/start$/, async (msg) => {
    await bot.sendMessage(
        msg.chat.id,
        `╭━━━━━━━━━━━━━━━━━━━━━━╮
       📍 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐓𝐑𝐀𝐂𝐊𝐄𝐑
╰━━━━━━━━━━━━━━━━━━━━━━╯

🤖 Welcome to Location Tracker.

📍 /track <deviceId>
📱 /devices
📜 /history <deviceId>

🔐 Location sharing must be authorized.`
    );
});

// Track
bot.onText(/^\/track(?:\s+(.+))?$/i, async (msg, match) => {
    if (!isOwner(msg)) {
        return bot.sendMessage(
            msg.chat.id,
            "❌ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃\n\n👑 Owner access required."
        );
    }

    const deviceId = match[1];

    if (!deviceId) {
        return bot.sendMessage(
            msg.chat.id,
            "📍 Usage:\n/track <deviceId>"
        );
    }

    await track(
        {
            sendMessage: (chatId, options) =>
                bot.sendMessage(chatId, options.text, options)
        },
        msg.chat.id,
        [deviceId]
    );
});

// Owner
bot.onText(/^\/owner$/, async (msg) => {
    if (!isOwner(msg)) {
        return bot.sendMessage(msg.chat.id, "❌ Owner only.");
    }

    await bot.sendMessage(
        msg.chat.id,
        `╭━━━━━━━━━━━━━━━━━━━━━━╮
          👑 𝐎𝐖𝐍𝐄𝐑
╰━━━━━━━━━━━━━━━━━━━━━━╯

📍 /track <id>
📱 /devices
📜 /history <id>
➕ /adddevice <id>
❌ /removedevice <id>
📊 /stats

🔐 Owner access enabled.`
    );
});

console.log("🤖 Location Tracker Telegram Bot is online.");
