require("dotenv").config();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📍 LOCATION TRACKER
// 🚀 SINGLE PROCESS STARTUP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PORT = process.env.PORT || 3000;

const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const WHITE = "\x1b[37m";
const BOLD = "\x1b[1m";

console.clear();

console.log(`
${CYAN}${BOLD}
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│                                        │
│        📍 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 𝐓𝐑𝐀𝐂𝐊𝐄𝐑          │
│                                        │
│          🚀 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐑𝐓𝐈𝐍𝐆          │
│                                        │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
${RESET}
`);

console.log(
    `${WHITE}⚙️ Initializing services...${RESET}`
);

console.log(
    `${YELLOW}📡 Server Port: ${PORT}${RESET}`
);

console.log(
    `${YELLOW}🤖 Telegram: WEBHOOK MODE${RESET}`
);

console.log(
    `${YELLOW}🔐 GPS: CONSENT REQUIRED${RESET}`
);

console.log(
    `\n${GREEN}${BOLD}🚀 Starting Location Tracker...${RESET}\n`
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 START APPLICATION
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
${GREEN}${BOLD}
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│                                        │
│       🟢 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐑𝐓𝐄𝐃              │
│                                        │
│       📡 Server: ONLINE                │
│       🤖 Telegram: WEBHOOK             │
│       🔐 GPS: CONSENT BASED            │
│                                        │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
${RESET}
`);
