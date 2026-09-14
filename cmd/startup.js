require("dotenv").config();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📍 LOCATION TRACKER
// 🚀 SINGLE PROCESS STARTUP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PORT = process.env.PORT || 3000;

console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│                                        │
│        📍 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐓𝐑𝐀𝐂𝐊𝐄𝐑          │
│                                        │
│          🚀 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐑𝐓𝐈𝐍𝐆          │
│                                        │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`);

console.log("⚙️ Initializing services...");
console.log(`📡 Port: ${PORT}`);
console.log("🤖 Telegram: WEBHOOK MODE");
console.log("🔐 GPS: CONSENT REQUIRED");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 START SERVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

try {

    require("../server.js");

} catch (error) {

    console.error(
        "❌ Startup failed:",
        error
    );

    process.exit(1);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🟢 STARTUP COMPLETE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│                                        │
│       🟢 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐑𝐓𝐄𝐃              │
│                                        │
│       📡 Server: ONLINE                │
│       🤖 Telegram: WEBHOOK             │
│       🔐 GPS: CONSENT BASED            │
│                                        │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`);
