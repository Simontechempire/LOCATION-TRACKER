const { addDevice, getDevice } = require("../database/database");

module.exports = async function addDeviceCommand(bot, chatId, args) {
    const deviceId = args[0];
    const deviceName = args.slice(1).join(" ") || "Unknown Device";

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
                `⚠️ 𝐃𝐄𝐕𝐈𝐂𝐄 𝐀𝐋𝐑𝐄𝐀𝐃𝐘 𝐑𝐄𝐆𝐈𝐒𝐓𝐄𝐑𝐄𝐃

📱 ID: ${deviceId}
🔐 Authorization: ${
                    existing.authorized
                        ? "Active"
                        : "Inactive"
                }`
            );
        }

        const device = addDevice({
            id: deviceId,
            name: deviceName,
            authorized: true
        });

        return bot.sendMessage(
            chatId,
            `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       ✅ 𝐃𝐄𝐕𝐈𝐂𝐄 𝐀𝐃𝐃𝐄𝐃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 Name: ${device.name}
🆔 ID: ${device.id}
🔐 Sharing: Authorized
🟢 Status: Registered

📡 The device can now share its
GPS location after the device
owner grants location permission.

Use:
/track ${device.id}`
        );

    } catch (error) {
        console.error("Add device error:", error);

        return bot.sendMessage(
            chatId,
            "❌ Failed to register the device."
        );
    }
};
