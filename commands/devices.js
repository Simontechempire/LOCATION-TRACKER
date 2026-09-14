const {
    getDevices
} = require("../database/database");

module.exports = async function devicesCommand(
    bot,
    msg
) {
    const chatId = msg.chat.id;

    // Owner only
    if (String(msg.from.id) !== String(process.env.OWNER_ID)) {
        return bot.sendMessage(
            chatId,
            `❌ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃

👑 This command is owner-only.`
        );
    }

    try {
        const devices = getDevices();

        if (!devices.length) {
            return bot.sendMessage(
                chatId,
                `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📱 𝐃𝐄𝐕𝐈𝐂𝐄𝐒
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📭 No devices registered.

Add one with:

/adddevice <deviceId> <name>`
            );
        }

        let text = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📱 𝐀𝐔𝐓𝐇𝐎𝐑𝐈𝐙𝐄𝐃 𝐃𝐄𝐕𝐈𝐂𝐄𝐒
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

        devices.forEach((device, index) => {

            const status =
                device.authorized
                    ? "🔐 Authorized"
                    : "🔴 Revoked";

            text += `
${index + 1}. 📱 ${device.name}
│
├── 🆔 ID: ${device.id}
├── ${status}
└── 🕐 Added: ${
                device.createdAt || "Unknown"
            }

`;
        });

        text += `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📊 TOTAL: ${devices.length}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

        await bot.sendMessage(
            chatId,
            text
        );

    } catch (error) {

        console.error(
            "Devices command error:",
            error
        );

        await bot.sendMessage(
            chatId,
            "❌ Failed to load devices."
        );
    }
};
