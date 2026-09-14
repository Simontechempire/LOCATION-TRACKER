const {
    removeDevice,
    getDevice
} = require("../database/database");

module.exports = async function removeDeviceCommand(
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
      ❌ 𝐑𝐄𝐌𝐎𝐕𝐄 𝐃𝐄𝐕𝐈𝐂𝐄
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

Usage:

/removedevice <deviceId>

Example:

/removedevice 234`
        );
    }

    try {
        const device = getDevice(deviceId);

        if (!device) {
            return bot.sendMessage(
                chatId,
                `❌ 𝐃𝐄𝐕𝐈𝐂𝐄 𝐍𝐎𝐓 𝐅𝐎𝐔𝐍𝐃

🆔 ID: ${deviceId}`
            );
        }

        const removed =
            removeDevice(deviceId);

        await bot.sendMessage(
            chatId,
            `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       ✅ 𝐃𝐄𝐕𝐈𝐂𝐄 𝐑𝐄𝐌𝐎𝐕𝐄𝐃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 Name: ${removed.name}
🆔 ID: ${removed.id}

🔐 Authorization: Revoked
📍 Location sharing: Disabled

The device is no longer registered
with the tracker.`
        );

    } catch (error) {

        console.error(
            "Remove device error:",
            error.message
        );

        await bot.sendMessage(
            chatId,
            "❌ Failed to remove device."
        );
    }
};
