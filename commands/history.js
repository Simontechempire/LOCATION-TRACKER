const axios = require("axios");

module.exports = async function history(bot, chatId, args) {
    const deviceId = args[0];

    if (!deviceId) {
        return bot.sendMessage(
            chatId,
            "📜 Usage:\n/history <deviceId>"
        );
    }

    try {
        const response = await axios.get(
            `${process.env.TRACKER_API}/api/location/${encodeURIComponent(deviceId)}/history`
        );

        const locations = response.data.locations || [];

        if (!locations.length) {
            return bot.sendMessage(
                chatId,
                `📜 No location history found for device ${deviceId}.`
            );
        }

        const recent = locations.slice(0, 10);

        let text = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📜 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐇𝐈𝐒𝐓𝐎𝐑𝐘
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 Device: ${deviceId}
📊 Records: ${locations.length}

`;

        recent.forEach((location, index) => {
            text += `
${index + 1}. 📍 ${location.city || "Unknown"}
   🌍 ${location.country || "Unknown"}
   📌 ${location.latitude}, ${location.longitude}
   🕐 ${location.timestamp || "Unknown"}
`;
        });

        text += `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
        🔐 𝐀𝐔𝐓𝐇𝐎𝐑𝐈𝐙𝐄𝐃 𝐃𝐀𝐓𝐀
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

        return bot.sendMessage(chatId, text);

    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Unable to retrieve history.";

        return bot.sendMessage(
            chatId,
            `❌ ${message}`
        );
    }
};
