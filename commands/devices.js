const { loadDatabase } = require("../database/database");

module.exports = async function devices(bot, chatId) {
    try {
        const db = loadDatabase();
        const devices = db.devices || [];

        if (devices.length === 0) {
            return bot.sendMessage(
                chatId,
                `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📱 𝐀𝐔𝐓𝐇𝐎𝐑𝐈𝐙𝐄𝐃 𝐃𝐄𝐕𝐈𝐂𝐄𝐒
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📭 No authorized devices registered.

Use:
/adddevice <deviceId>`
            );
        }

        let text = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📱 𝐀𝐔𝐓𝐇𝐎𝐑𝐈𝐙𝐄𝐃 𝐃𝐄𝐕𝐈𝐂𝐄𝐒
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

        devices.forEach((device, index) => {
            text += `
${index + 1}. 📱 ${device.name || "Unknown Device"}
   🆔 ID: ${device.id}
   🔐 Sharing: ${
       device.authorized ? "Authorized" : "Not authorized"
   }
   🕐 Added: ${device.createdAt || "Unknown"}
`;
        });

        text += `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📊 Total: ${devices.length}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

        return bot.sendMessage(chatId, text);

    } catch (error) {
        console.error("Devices error:", error);

        return bot.sendMessage(
            chatId,
            "❌ Unable to load registered devices."
        );
    }
};
