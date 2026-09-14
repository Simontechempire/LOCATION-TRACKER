const axios = require("axios");

module.exports = async function track(bot, chatId, args) {
    const deviceId = args[0];

    if (!deviceId) {
        return bot.sendMessage(
            chatId,
            "📍 Usage:\n/track <deviceId>"
        );
    }

    try {
        const response = await axios.get(
            `${process.env.TRACKER_API}/api/location/${encodeURIComponent(deviceId)}`
        );

        const data = response.data.location;

        const mapUrl =
            `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;

        const message = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📡 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐓𝐑𝐀𝐂𝐊𝐄𝐑
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 𝐃𝐄𝐕𝐈𝐂𝐄
│
├── 🆔 ID: ${data.deviceId}
├── 🟢 Status: ${data.online ? "Online" : "Offline"}
└── 🔐 Sharing: Authorized

🌍 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍
│
├── 🇳🇬 Country: ${data.country}
├── 📍 Region: ${data.region}
├── 🏙️ Area: ${data.city}
├── 📌 Latitude: ${data.latitude}
└── 📌 Longitude: ${data.longitude}

🕐 𝐋𝐀𝐒𝐓 𝐔𝐏𝐃𝐀𝐓𝐄
└── ${data.timestamp || data.updatedAt || "Unknown"}

🗺️ 𝐌𝐀𝐏
└── ${mapUrl}

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
      🔒 𝐀𝐔𝐓𝐇𝐎𝐑𝐈𝐙𝐄𝐃 𝐃𝐄𝐕𝐈𝐂𝐄
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

        return bot.sendMessage(chatId, message);

    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Unable to retrieve location.";

        return bot.sendMessage(
            chatId,
            `❌ 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐔𝐍𝐀𝐕𝐀𝐈𝐋𝐀𝐁𝐋𝐄\n\n📱 Device: ${deviceId}\n\n${message}`
        );
    }
};
