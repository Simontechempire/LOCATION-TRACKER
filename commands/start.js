require("dotenv").config();

const { spawn } = require("child_process");
const http = require("http");

const PORT = process.env.PORT || 3000;

const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const WHITE = "\x1b[37m";
const BOLD = "\x1b[1m";

function line() {
    console.log(
        `${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`
    );
}

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
    `${WHITE}⚙️  Initializing services...${RESET}\n`
);

line();

console.log(`${YELLOW}📡 SERVER${RESET}`);
console.log(`${WHITE}   Port      : ${PORT}${RESET}`);
console.log(`${WHITE}   API       : /api/location${RESET}`);
console.log(`${WHITE}   Health    : /api/health${RESET}`);

line();

console.log(`${YELLOW}🤖 TELEGRAM BOT${RESET}`);
console.log(`${WHITE}   Status    : Starting...${RESET}`);

line();

console.log(`${YELLOW}🔐 SECURITY${RESET}`);
console.log(`${WHITE}   Owner     : Protected${RESET}`);
console.log(`${WHITE}   GPS       : Consent required${RESET}`);

line();

console.log(
    `\n${GREEN}${BOLD}🚀 Starting Location Tracker...${RESET}\n`
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🖥️ START SERVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const server = spawn(
    process.execPath,
    ["server.js"],
    {
        stdio: ["inherit", "pipe", "pipe"],
        env: process.env
    }
);

server.stdout.on("data", (data) => {
    process.stdout.write(
        `${CYAN}[SERVER]${RESET} ${data}`
    );
});

server.stderr.on("data", (data) => {
    process.stderr.write(
        `${RED}[SERVER]${RESET} ${data}`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🤖 START BOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const bot = spawn(
    process.execPath,
    ["bot.js"],
    {
        stdio: ["inherit", "pipe", "pipe"],
        env: process.env
    }
);

bot.stdout.on("data", (data) => {
    process.stdout.write(
        `${GREEN}[BOT]${RESET} ${data}`
    );
});

bot.stderr.on("data", (data) => {
    process.stderr.write(
        `${RED}[BOT]${RESET} ${data}`
    );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❤️ HEALTH CHECK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

setTimeout(() => {

    const req = http.get(
        `http://127.0.0.1:${PORT}/api/health`,
        (res) => {

            if (res.statusCode === 200) {

                console.log(`
${GREEN}${BOLD}
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│                                        │
│       🟢 𝐒𝐘𝐒𝐓𝐄𝐌 𝐎𝐍𝐋𝐈𝐍𝐄               │
│                                        │
│       📡 Server: ONLINE                │
│       🤖 Bot: RUNNING                  │
│       🔐 GPS: CONSENT BASED            │
│                                        │
│       🌐 Port: ${PORT}                   │
│                                        │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
${RESET}
`);
            }
        }
    );

    req.on("error", () => {
        console.log(
            `${RED}❌ Server health check failed.${RESET}`
        );
    });

}, 1500);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🛑 SHUTDOWN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function shutdown() {

    console.log(
        `\n${YELLOW}🛑 Shutting down services...${RESET}`
    );

    server.kill("SIGTERM");
    bot.kill("SIGTERM");

    setTimeout(() => {
        process.exit(0);
    }, 1000);
}

process.on(
    "SIGINT",
    shutdown
);

process.on(
    "SIGTERM",
    shutdown
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💥 PROCESS ERRORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

server.on("exit", (code) => {

    if (code !== 0) {
        console.log(
            `${RED}❌ Server stopped with code ${code}${RESET}`
        );
    }
});

bot.on("exit", (code) => {

    if (code !== 0) {
        console.log(
            `${RED}❌ Bot stopped with code ${code}${RESET}`
        );
    }
});
