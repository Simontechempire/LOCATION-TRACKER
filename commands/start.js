module.exports = async function startCommand(bot, msg) {

    const chatId = msg.chat.id;

    const text = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📍 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐓𝐑𝐀𝐂𝐊𝐄𝐑
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

👋 𝐖𝐄𝐋𝐂𝐎𝐌𝐄

This bot manages authorized
location-sharing devices.

📱 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒
│
├── 📍 /track <deviceId>
├── 📜 /history <deviceId>
├── 📱 /devices
└── ℹ️ /help

👑 𝐎𝐖𝐍𝐄𝐑
│
├── ➕ /adddevice <deviceId>
├── ❌ /removedevice <deviceId>
└── 👑 /owner

🔐 𝐏𝐑𝐈𝐕𝐀𝐂𝐘
│
└── GPS data is accepted only
    after the device owner
    explicitly enables location
    sharing.

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
          🟢 𝐒𝐘𝐒𝐓𝐄𝐌 𝐎𝐍𝐋𝐈𝐍𝐄
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

    await bot.sendMessage(
        chatId,
        text
    );
};
