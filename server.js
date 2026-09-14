require("dotenv").config();

const express = require("express");
const path = require("path");

const {
    processUpdate
} = require("./bot");

const app = express();

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!BOT_TOKEN) {
    throw new Error(
        "BOT_TOKEN not found in environment variables"
    );
}

if (!WEBHOOK_URL) {
    throw new Error(
        "WEBHOOK_URL not found in environment variables"
    );
}

const WEBHOOK_PATH = `/telegram/${BOT_TOKEN}`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 MIDDLEWARE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌐 PUBLIC FOLDER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❤️ HEALTH CHECK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get(
    "/api/health",
    (req, res) => {

        res.json({
            success: true,
            service: "Location Tracker",
            status: "online",
            telegram: "webhook",
            time: new Date().toISOString()
        });
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🤖 TELEGRAM WEBHOOK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.post(
    WEBHOOK_PATH,
    (req, res) => {

        try {

            processUpdate(
                req.body
            );

            res.sendStatus(200);

        } catch (error) {

            console.error(
                "❌ Telegram webhook error:",
                error
            );

            res.sendStatus(500);
        }
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📍 LOCATION API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.post(
    "/api/location",
    (req, res) => {

        const {
            deviceId,
            latitude,
            longitude
        } = req.body;

        if (
            !deviceId ||
            latitude === undefined ||
            longitude === undefined
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "deviceId, latitude and longitude are required"
            });
        }

        const location = {
            deviceId: String(deviceId),
            latitude: Number(latitude),
            longitude: Number(longitude),
            updatedAt:
                new Date().toISOString()
        };

        console.log(
            "📍 Authorized GPS location received:",
            location
        );

        res.json({
            success: true,
            message: "Location received",
            location
        });
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🏠 HOME
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "index.html"
            )
        );
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❌ 404
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use(
    (req, res) => {

        res.status(404).json({
            success: false,
            message: "Route not found"
        });
    }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 START SERVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.listen(
    PORT,
    async () => {

        console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│                                        │
│       🟢 𝐒𝐄𝐑𝐕𝐄𝐑 𝐎𝐍𝐋𝐈𝐍𝐄               │
│                                        │
│       📡 Port: ${PORT}
│       🤖 Telegram: WEBHOOK             │
│                                        │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`);

        try {

            const TelegramBot =
                require(
                    "node-telegram-bot-api"
                );

            const telegram =
                new TelegramBot(
                    BOT_TOKEN
                );

            const webhook =
                `${WEBHOOK_URL}${WEBHOOK_PATH}`;

            // Remove old webhook first
            await telegram.deleteWebHook();

            // Configure new webhook
            await telegram.setWebHook(
                webhook
            );

            const info =
                await telegram.getWebHookInfo();

            console.log(
                "🟢 Telegram webhook configured"
            );

            console.log(
                `🌐 Webhook: ${info.url}`
            );

            console.log(
                `📨 Pending updates: ${info.pending_update_count}`
            );

        } catch (error) {

            console.error(
                "❌ Webhook setup failed:",
                error.message
            );
        }
    }
);
