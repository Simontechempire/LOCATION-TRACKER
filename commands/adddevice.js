const {
    addDevice,
    getDevice
} = require("../database/database");

module.exports = async function addDeviceCommand(
    bot,
    msg,
    args
) {
    const chatId = msg.chat.id;

    // Owner check
    if (String(msg.from.id) !== String(process.env.OWNER_ID)) {
        return bot.sendMessage(
            chatId,
            `❌ 𝐀𝐂𝐂𝐄𝐒𝐒 𝐃𝐄𝐍𝐈𝐄𝐃

👑 This command is owner-only.`
        );
    }

    const deviceId = args[0];
    const deviceName =
        args.slice(1).join(" ") ||
        "Unknown Device";

    if (!deviceId) {
        return bot.sendMessage(
            chatId,
            `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📱 𝐀𝐃𝐃 𝐃𝐄𝐕𝐈𝐂𝐄
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

❌ Device ID is required.

Usage:
/adddevice <deviceId> <name>

Example:
/adddevice 234 My Phone`
        );
    }

    try {
        const existing = getDevice(deviceId);

        if (existing) {
            return bot.sendMessage(
                chatId,
                `⚠️ 𝐃𝐄𝐕𝐈𝐂𝐄 𝐀𝐋𝐑𝐄𝐀𝐃𝐘 𝐄𝐗𝐈𝐒𝐓𝐒

📱 Name: ${existing.name}
🆔 ID: ${existing.id}
🔐 Sharing: ${
                    existing.authorized
                        ? "Authorized"
                        : "Not authorized"
                }`
            );
        }

        const device = addDevice({
            id: deviceId,
            name: deviceName,

            // Registration does not secretly
            // obtain GPS. The device owner
            // must still explicitly share GPS.
            authorized: true
        });

        return bot.sendMessage(
            chatId,
            `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
        ✅ 𝐃𝐄𝐕𝐈𝐂𝐄 𝐀𝐃𝐃𝐄𝐃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 Name: ${device.name}
🆔 ID: ${device.id}
🔐 Registered: Yes
📡 GPS: Waiting for device owner

The device must explicitly enable
location sharing before GPS data
can be received.

📍 Track:
/track ${device.id}`
        );

    } catch (error) {
        console.error(
            "Add device error:",
            error
        );

        return bot.sendMessage(
            chatId,
            "❌ Failed to register device."
        );
    }
};
