require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
    process.env.BOT_TOKEN,
    {
        polling: true
    }
);

const OWNER_ID = String(process.env.OWNER_ID);

function isOwner(msg) {
    return String(msg.from.id) === OWNER_ID;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🤖 START
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(/^\/start$/, async (msg) => {

    const text = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📍 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐓𝐑𝐀𝐂𝐊𝐄𝐑
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

👋 Welcome to Location Tracker.

📍 /track <deviceId>
📱 /devices
📜 /history <deviceId>
👑 /owner

🔐 Location tracking works only
with explicitly authorized
location sharing.
`;

    await bot.sendMessage(
        msg.chat.id,
        text
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👑 OWNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(/^\/owner$/, async (msg) => {

    if (!isOwner(msg)) {
        return bot.sendMessage(
            msg.chat.id,
            "❌ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃\n\n👑 Owner only."
        );
    }

    const text = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
          👑 𝐎𝐖𝐍𝐄𝐑
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 /devices
📍 /track <deviceId>
📜 /history <deviceId>

➕ /adddevice <deviceId>
❌ /removedevice <deviceId>

🔐 Owner access enabled.
`;

    await bot.sendMessage(
        msg.chat.id,
        text
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❌ UNKNOWN COMMAND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.on("polling_error", (error) => {
    console.error(
        "Telegram polling error:",
        error.message
    );
});

console.log(
    "🤖 Location Tracker Telegram bot is running..."
);
