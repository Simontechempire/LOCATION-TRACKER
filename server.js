require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the public folder
app.use(express.static(path.join(__dirname, "public")));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📍 LOCATION TRACKER API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        service: "Location Tracker",
        status: "online",
        time: new Date().toISOString()
    });
});

// GPS location endpoint
// The device must explicitly share its location.
app.post("/api/location", (req, res) => {
    const {
        deviceId,
        latitude,
        longitude
    } = req.body;

    if (
        !deviceId ||
        latitude === undefined ||
        longitude === undefined
    ) {
        return res.status(400).json({
            success: false,
            message:
                "deviceId, latitude and longitude are required"
        });
    }

    const location = {
        deviceId: String(deviceId),
        latitude: Number(latitude),
        longitude: Number(longitude),
        updatedAt: new Date().toISOString()
    };

    console.log("📍 GPS location received:", location);

    res.json({
        success: true,
        message: "Location received",
        location
    });
});

// Homepage
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(
        `🚀 Location Tracker server running on port ${PORT}`
    );
});
