require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 COMMANDS
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
    console.error("❌ BOT_TOKEN not found in environment variables.");
    process.exit(1);
}

if (!OWNER_ID) {
    console.error("❌ OWNER_ID not found in environment variables.");
    process.exit(1);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🤖 TELEGRAM BOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const bot = new TelegramBot(BOT_TOKEN, {
    polling: true
});

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

bot.onText(/^\/start$/i, async (msg) => {
    try {
        await startCommand(bot, msg);
    } catch (error) {
        console.error("❌ /start error:", error);

        await bot.sendMessage(
            msg.chat.id,
            "❌ An error occurred while processing /start."
        );
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👑 OWNER MENU
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

        await bot.sendMessage(
            msg.chat.id,
            text
        );

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

            await bot.sendMessage(
                msg.chat.id,
                "❌ Unable to add the device."
            );
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📱 DEVICES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(/^\/devices$/i, async (msg) => {

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

        await bot.sendMessage(
            msg.chat.id,
            "❌ Unable to load devices."
        );
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

            await bot.sendMessage(
                msg.chat.id,
                "❌ Unable to retrieve the authorized location."
            );
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

            await bot.sendMessage(
                msg.chat.id,
                "❌ Unable to load location history."
            );
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

            await bot.sendMessage(
                msg.chat.id,
                "❌ Unable to remove the device."
            );
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📨 MESSAGE DEBUG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.on("message", (msg) => {

    console.log(
        `📩 Telegram message received: ${
            msg.text || "[non-text]"
        }`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚠️ POLLING ERROR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.on("polling_error", (error) => {

    console.error(
        "❌ Telegram polling error:",
        error.message
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚠️ BOT ERROR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.on("error", (error) => {

    console.error(
        "❌ Telegram bot error:",
        error.message
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🟢 TELEGRAM CONNECTION TEST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.getMe()
    .then((me) => {

        console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
        🟢 𝐓𝐄𝐋𝐄𝐆𝐑𝐀𝐌 𝐎𝐍𝐋𝐈𝐍𝐄
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

🤖 Bot      : ${me.first_name}
👤 Username : @${me.username}
🆔 Bot ID   : ${me.id}

📡 Polling  : ACTIVE
🔐 Owner    : CONFIGURED
`);

    })
    .catch((error) => {

        console.error(
            "❌ Telegram connection failed:",
            error.message
        );

    });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🟢 STARTUP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log(
    "🤖 Location Tracker Telegram bot is running..."
);
