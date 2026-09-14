const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Temporary in-memory location storage
// We'll replace this with SQLite later.
const locations = new Map();

/*
 * HEALTH CHECK
 */
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "online",
        service: "Location Tracker"
    });
});

/*
 * DEVICE SENDS ITS AUTHORIZED GPS LOCATION
 */
app.post("/api/location", (req, res) => {
    const {
        deviceId,
        latitude,
        longitude,
        country,
        region,
        city
    } = req.body;

    if (
        !deviceId ||
        latitude === undefined ||
        longitude === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "deviceId, latitude and longitude are required"
        });
    }

    const location = {
        deviceId,
        latitude: Number(latitude),
        longitude: Number(longitude),
        country: country || "Unknown",
        region: region || "Unknown",
        city: city || "Unknown",
        updatedAt: new Date().toISOString(),
        authorized: true,
        online: true
    };

    locations.set(String(deviceId), location);

    console.log("📍 GPS location received:", location);

    res.json({
        success: true,
        message: "Location saved"
    });
});

/*
 * BOT USES THIS TO GET THE LATEST LOCATION
 */
app.get("/api/location/:deviceId", (req, res) => {
    const deviceId = String(req.params.deviceId);

    const location = locations.get(deviceId);

    if (!location) {
        return res.status(404).json({
            success: false,
            message: "No authorized location found for this device"
        });
    }

    res.json({
        success: true,
        location
    });
});

/*
 * DASHBOARD
 */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/*
 * 404
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Location Tracker running on port ${PORT}`);
});
