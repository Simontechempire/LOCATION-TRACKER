require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

// Commands
const startCommand = require("./commands/start");
const addDeviceCommand = require("./commands/adddevice");
const devicesCommand = require("./commands/devices");
const trackCommand = require("./commands/track");
const historyCommand = require("./commands/history");
const removeDeviceCommand = require("./commands/removedevice");

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = String(process.env.OWNER_ID || "");
const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!BOT_TOKEN) {
    console.error("❌ BOT_TOKEN is missing.");
    process.exit(1);
}

if (!OWNER_ID) {
    console.error("❌ OWNER_ID is missing.");
    process.exit(1);
}

if (!WEBHOOK_URL) {
    console.error("❌ WEBHOOK_URL is missing.");
    process.exit(1);
}

// Telegram bot WITHOUT polling
const bot = new TelegramBot(BOT_TOKEN);

// Owner check
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

bot.onText(/^\/start$/i, async (msg) => {
    try {
        await startCommand(bot, msg);
    } catch (error) {
        console.error("❌ /start error:", error);
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👑 OWNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(/^\/owner$/i, async (msg) => {
    try {
        if (!isOwner(msg)) {
            return bot.sendMessage(
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

🔐 Authorized location sharing
only.
`;

        await bot.sendMessage(msg.chat.id, text);

    } catch (error) {
        console.error("❌ /owner error:", error);
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ➕ ADD DEVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/adddevice(?:\s+(.+))?$/i,
    async (msg, match) => {
        try {
            const args = match[1]
                ? match[1].trim().split(/\s+/)
                : [];

            await addDeviceCommand(bot, msg, args);

        } catch (error) {
            console.error("❌ /adddevice error:", error);
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📱 DEVICES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(/^\/devices$/i, async (msg) => {
    try {
        await devicesCommand(bot, msg);
    } catch (error) {
        console.error("❌ /devices error:", error);
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📍 TRACK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/track(?:\s+(.+))?$/i,
    async (msg, match) => {
        try {
            const args = match[1]
                ? match[1].trim().split(/\s+/)
                : [];

            await trackCommand(bot, msg, args);

        } catch (error) {
            console.error("❌ /track error:", error);
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📜 HISTORY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/history(?:\s+(.+))?$/i,
    async (msg, match) => {
        try {
            const args = match[1]
                ? match[1].trim().split(/\s+/)
                : [];

            await historyCommand(bot, msg, args);

        } catch (error) {
            console.error("❌ /history error:", error);
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❌ REMOVE DEVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/removedevice(?:\s+(.+))?$/i,
    async (msg, match) => {
        try {
            const args = match[1]
                ? match[1].trim().split(/\s+/)
                : [];

            await removeDeviceCommand(bot, msg, args);

        } catch (error) {
            console.error("❌ /removedevice error:", error);
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌐 WEBHOOK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const webhookPath = `/telegram/${BOT_TOKEN}`;

async function setupWebhook() {
    try {
        await bot.deleteWebHook();

        await bot.setWebHook(
            `${WEBHOOK_URL}${webhookPath}`
        );

        const info = await bot.getWebHookInfo();

        console.log("🟢 Telegram webhook active");
        console.log(`🌐 URL: ${info.url}`);
        console.log(`📡 Pending updates: ${info.pending_update_count}`);

    } catch (error) {
        console.error(
            "❌ Webhook setup failed:",
            error.message
        );
    }
}

setupWebhook();

console.log("🤖 Location Tracker Telegram bot started.");
