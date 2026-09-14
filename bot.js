require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

// Commands
const startCommand = require("./commands/start");
const addDeviceCommand = require("./commands/adddevice");
const devicesCommand = require("./commands/devices");
const trackCommand = require("./commands/track");
const historyCommand = require("./commands/history");
const removeDeviceCommand = require("./commands/removedevice");

const bot = new TelegramBot(
    process.env.BOT_TOKEN,
    {
        polling: true
    }
);

const OWNER_ID = String(
    process.env.OWNER_ID
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👑 OWNER CHECK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function isOwner(msg) {
    return (
        String(msg.from.id) ===
        OWNER_ID
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🤖 START
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(/^\/start$/, async (msg) => {

    await startCommand(
        bot,
        msg
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👑 OWNER MENU
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(/^\/owner$/, async (msg) => {

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
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ➕ ADD DEVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/adddevice(?:\s+(.+))?$/i,
    async (msg, match) => {

        const args = match[1]
            ? match[1]
                .trim()
                .split(/\s+/)
            : [];

        await addDeviceCommand(
            bot,
            msg,
            args
        );
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📱 DEVICES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(/^\/devices$/i, async (msg) => {

    await devicesCommand(
        bot,
        msg
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📍 TRACK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/track(?:\s+(.+))?$/i,
    async (msg, match) => {

        const args = match[1]
            ? match[1]
                .trim()
                .split(/\s+/)
            : [];

        await trackCommand(
            bot,
            msg,
            args
        );
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📜 HISTORY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/history(?:\s+(.+))?$/i,
    async (msg, match) => {

        const args = match[1]
            ? match[1]
                .trim()
                .split(/\s+/)
            : [];

        await historyCommand(
            bot,
            msg,
            args
        );
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❌ REMOVE DEVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.onText(
    /^\/removedevice(?:\s+(.+))?$/i,
    async (msg, match) => {

        const args = match[1]
            ? match[1]
                .trim()
                .split(/\s+/)
            : [];

        await removeDeviceCommand(
            bot,
            msg,
            args
        );
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚠️ POLLING ERROR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

bot.on(
    "polling_error",
    (error) => {
        console.error(
            "Telegram polling error:",
            error.message
        );
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🟢 BOT ONLINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log(
    "🤖 Location Tracker Telegram bot is running..."
);
