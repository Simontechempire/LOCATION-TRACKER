require("dotenv").config();

const express = require("express");
const path = require("path");

const {
    bot,
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
const WEBHOOK = `${WEBHOOK_URL}${WEBHOOK_PATH}`;

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
// 🌐 PUBLIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❤️ HEALTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        service: "Location Tracker",
        status: "online",
        telegram: "webhook",
        time: new Date().toISOString()
    });

});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🤖 TELEGRAM WEBHOOK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.post(
    WEBHOOK_PATH,
    (req, res) => {

        try {

            processUpdate(req.body);

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

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❌ 404
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 START
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.listen(PORT, async () => {

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

        // Remove any previous webhook
        await bot.deleteWebHook();

        // Set the new webhook
        await bot.setWebHook(WEBHOOK);

        const info =
            await bot.getWebHookInfo();

        console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│     🟢 𝐖𝐄𝐁𝐇𝐎𝐎𝐊 𝐀𝐂𝐓𝐈𝐕𝐄       │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

🌐 URL:
${info.url}

📨 Pending:
${info.pending_update_count}
`);

    } catch (error) {

        console.error(
            "❌ Webhook setup failed:",
            error.message
        );

    }

});
