const axios = require("axios");

module.exports = async function track(sock, chatId, args) {
    if (!args[0]) {
        return sock.sendMessage(chatId, {
            text: "📍 Usage: /track <deviceId>"
        });
    }

    const deviceId = args[0];

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
└── ${data.updatedAt}

🗺️ 𝐌𝐀𝐏
└── ${mapUrl}

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
      🔒 𝐀𝐔𝐓𝐇𝐎𝐑𝐈𝐙𝐄𝐃 𝐃𝐄𝐕𝐈𝐂𝐄
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

        await sock.sendMessage(chatId, { text: message });

    } catch (error) {
        await sock.sendMessage(chatId, {
            text:
`❌ 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐀𝐕𝐀𝐈𝐋𝐀𝐁𝐋𝐄

📱 Device: ${deviceId}

🔐 authorized GPS location
was found for this device.`
        });
    }
};
