const axios = require("axios");

module.exports = async function trackCommand(
    bot,
    msg,
    args
) {
    const chatId = msg.chat.id;

    // Owner only
    if (
        String(msg.from.id) !==
        String(process.env.OWNER_ID)
    ) {
        return bot.sendMessage(
            chatId,
            `❌ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃

👑 This command is owner-only.`
        );
    }

    const deviceId = args[0];

    if (!deviceId) {
        return bot.sendMessage(
            chatId,
            `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
        📍 𝐓𝐑𝐀𝐂𝐊 𝐃𝐄𝐕𝐈𝐂𝐄
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

Usage:

/track <deviceId>

Example:

/track 234`
        );
    }

    try {

        const response = await axios.get(
            `${process.env.TRACKER_API}/api/location/${encodeURIComponent(deviceId)}`
        );

        const location =
            response.data.location;

        if (!location) {
            return bot.sendMessage(
                chatId,
                "📭 No shared location found."
            );
        }

        const mapUrl =
            `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

        const updated =
            location.timestamp ||
            location.updatedAt ||
            "Unknown";

        const text = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📡 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐑𝐄𝐒𝐔𝐋𝐓
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 𝐃𝐄𝐕𝐈𝐂𝐄
│
├── 🆔 ID: ${location.deviceId}
└── 🟢 Status: Shared GPS available

🌍 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍
│
├── 🌐 Country: ${location.country || "Unknown"}
├── 📍 Region: ${location.region || "Unknown"}
└── 🏙️ Area: ${location.city || "Unknown"}

📌 𝐆𝐏𝐒
│
├── Latitude: ${location.latitude}
└── Longitude: ${location.longitude}

🕐 𝐋𝐀𝐒𝐓 𝐔𝐏𝐃𝐀𝐓𝐄
└── ${updated}

🗺️ 𝐌𝐀𝐏
└── ${mapUrl}

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
   🔐 𝐀𝐔𝐓𝐇𝐎𝐑𝐈𝐙𝐄𝐃 𝐒𝐇𝐀𝐑𝐈𝐍𝐆
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

        await bot.sendMessage(
            chatId,
            text
        );

    } catch (error) {

        console.error(
            "Track command error:",
            error.message
        );

        const message =
            error.response?.data?.message ||
            "No shared location is available.";

        await bot.sendMessage(
            chatId,
            `❌ 𝐓𝐑𝐀𝐂𝐊𝐈𝐍𝐆 𝐔𝐍𝐀𝐕𝐀𝐈𝐋𝐀𝐁𝐋𝐄

📱 Device: ${deviceId}

${message}`
        );
    }
};
