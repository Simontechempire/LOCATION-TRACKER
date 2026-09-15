require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📂 COMMANDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const startCommand = require("./commands/start");
const addDeviceCommand = require("./commands/adddevice");
const devicesCommand = require("./commands/devices");
const trackCommand = require("./commands/track");
const historyCommand = require("./commands/history");
const removeDeviceCommand = require("./commands/removedevice");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔐 ENVIRONMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = String(process.env.OWNER_ID || "");

if (!BOT_TOKEN) {
    throw new Error(
        "BOT_TOKEN not found in environment variables"
    );
}

if (!OWNER_ID) {
    throw new Error(
        "OWNER_ID not found in environment variables"
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🤖 TELEGRAM BOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IMPORTANT:
// Polling is intentionally disabled.
// Render uses Telegram Webhook mode.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const bot = new TelegramBot(BOT_TOKEN);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👑 OWNER CHECK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function isOwner(msg) {
    return (
        msg &&
        msg.from &&
        String(msg.from.id) === OWNER_ID
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🤖 START
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(/^\/start(?:@\w+)?$/i, async (msg) => {
    try {
        await startCommand(bot, msg);
    } catch (error) {
        console.error("❌ /start error:", error);

        try {
            await bot.sendMessage(
                msg.chat.id,
                "❌ Unable to start the bot."
            );
        } catch (sendError) {
            console.error(
                "❌ Failed to send /start error:",
                sendError.message
            );
        }
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👑 OWNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(/^\/owner(?:@\w+)?$/i, async (msg) => {
    try {
        if (!isOwner(msg)) {
            return await bot.sendMessage(
                msg.chat.id,
                `❌ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃

👑 Owner only.`
            );
        }

        const text = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
          👑 𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 𝐃𝐄𝐕𝐈𝐂𝐄𝐒
│
├── /devices
├── /adddevice <id> <name>
└── /removedevice <id>

📍 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍
│
├── /track <id>
└── /history <id>

🔐 Authorized location sharing only.
`;

        await bot.sendMessage(
            msg.chat.id,
            text
        );

    } catch (error) {
        console.error(
            "❌ /owner error:",
            error
        );
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ➕ ADD DEVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/adddevice(?:@\w+)?(?:\s+(.+))?$/i,
    async (msg, match) => {
        try {
            const args = match[1]
                ? match[1].trim().split(/\s+/)
                : [];

            await addDeviceCommand(
                bot,
                msg,
                args
            );

        } catch (error) {
            console.error(
                "❌ /adddevice error:",
                error
            );
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📱 DEVICES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/devices(?:@\w+)?$/i,
    async (msg) => {
        try {
            await devicesCommand(
                bot,
                msg
            );

        } catch (error) {
            console.error(
                "❌ /devices error:",
                error
            );
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📍 TRACK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/track(?:@\w+)?(?:\s+(.+))?$/i,
    async (msg, match) => {
        try {
            const args = match[1]
                ? match[1].trim().split(/\s+/)
                : [];

            await trackCommand(
                bot,
                msg,
                args
            );

        } catch (error) {
            console.error(
                "❌ /track error:",
                error
            );
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📜 HISTORY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/history(?:@\w+)?(?:\s+(.+))?$/i,
    async (msg, match) => {
        try {
            const args = match[1]
                ? match[1].trim().split(/\s+/)
                : [];

            await historyCommand(
                bot,
                msg,
                args
            );

        } catch (error) {
            console.error(
                "❌ /history error:",
                error
            );
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❌ REMOVE DEVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/removedevice(?:@\w+)?(?:\s+(.+))?$/i,
    async (msg, match) => {
        try {
            const args = match[1]
                ? match[1].trim().split(/\s+/)
                : [];

            await removeDeviceCommand(
                bot,
                msg,
                args
            );

        } catch (error) {
            console.error(
                "❌ /removedevice error:",
                error
            );
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📨 TELEGRAM UPDATE PROCESSOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function processUpdate(update) {
    if (!update) {
        return;
    }

    bot.processUpdate(update);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🟢 TELEGRAM CONNECTION TEST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function initializeTelegram() {
    try {
        const me = await bot.getMe();

        console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
        🟢 𝐓𝐄𝐋𝐄𝐆𝐑𝐀𝐌 𝐎𝐍𝐋𝐈𝐍𝐄
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

🤖 Bot      : ${me.first_name}
👤 Username : @${me.username}
🆔 Bot ID   : ${me.id}
📡 Mode     : WEBHOOK
`);

    } catch (error) {
        console.error(
            "❌ Telegram connection failed:",
            error.message
        );

        process.exit(1);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 INITIALIZE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

initializeTelegram();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📤 EXPORT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports = {
    bot,
    processUpdate
};

console.log(
    "🤖 Location Tracker bot initialized."
);
