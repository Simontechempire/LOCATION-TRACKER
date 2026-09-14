const axios = require("axios");

module.exports = async function historyCommand(
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
       📜 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐇𝐈𝐒𝐓𝐎𝐑𝐘
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

Usage:

/history <deviceId>

Example:

/history 234`
        );
    }

    try {
        const response = await axios.get(
            `${process.env.TRACKER_API}/api/location/${encodeURIComponent(deviceId)}/history`
        );

        const locations =
            response.data.locations || [];

        if (!locations.length) {
            return bot.sendMessage(
                chatId,
                `📭 No shared location history found.

📱 Device: ${deviceId}`
            );
        }

        const recentLocations =
            locations.slice(0, 10);

        let text = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📜 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐇𝐈𝐒𝐓𝐎𝐑𝐘
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 Device: ${deviceId}
📊 Records: ${locations.length}

`;

        recentLocations.forEach(
            (location, index) => {

                text += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${index + 1}. 📍 LOCATION

🌍 Country:
${location.country || "Unknown"}

📍 Region:
${location.region || "Unknown"}

🏙️ Area:
${location.city || "Unknown"}

📌 Coordinates:
${location.latitude}, ${location.longitude}

🕐 Time:
${location.timestamp || "Unknown"}
`;
            }
        );

        text += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 Only locations explicitly
shared by the authorized device
are included.
`;

        await bot.sendMessage(
            chatId,
            text
        );

    } catch (error) {

        console.error(
            "History command error:",
            error.message
        );

        const message =
            error.response?.data?.message ||
            "Unable to retrieve location history.";

        await bot.sendMessage(
            chatId,
            `❌ 𝐇𝐈𝐒𝐓𝐎𝐑𝐘 𝐔𝐍𝐀𝐕𝐀𝐈𝐋𝐀𝐁𝐋𝐄

📱 Device: ${deviceId}

${message}`
        );
    }
};
