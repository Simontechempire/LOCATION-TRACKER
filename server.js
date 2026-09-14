require("dotenv").config();

const express = require("express");
const path = require("path");

const {
    addDevice,
    getDevice,
    saveLocation,
    getLatestLocation,
    getLocationHistory
} = require("./database/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
       📍 LOCATION TRACKER
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

/*
 * HEALTH CHECK
 */
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "online",
        service: "Location Tracker",
        time: new Date().toISOString()
    });
});

/*
 * REGISTER AUTHORIZED DEVICE
 */
app.post("/api/devices", (req, res) => {
    const {
        deviceId,
        name,
        authorized
    } = req.body;

    if (!deviceId) {
        return res.status(400).json({
            success: false,
            message: "deviceId is required"
        });
    }

    const device = addDevice({
        id: deviceId,
        name: name || "Unknown Device",
        authorized: Boolean(authorized)
    });

    res.json({
        success: true,
        device
    });
});

/*
 * GET DEVICE
 */
app.get("/api/devices/:deviceId", (req, res) => {
    const device = getDevice(req.params.deviceId);

    if (!device) {
        return res.status(404).json({
            success: false,
            message: "Device not found"
        });
    }

    res.json({
        success: true,
        device
    });
});

/*
 * RECEIVE GPS LOCATION
 *
 * The device must have authorized
 * location sharing.
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
            message:
                "deviceId, latitude and longitude are required"
        });
    }

    const device = getDevice(deviceId);

    if (!device) {
        return res.status(404).json({
            success: false,
            message: "Device is not registered"
        });
    }

    if (!device.authorized) {
        return res.status(403).json({
            success: false,
            message:
                "Location sharing is not authorized"
        });
    }

    const location = {
        deviceId: String(deviceId),
        latitude: Number(latitude),
        longitude: Number(longitude),
        country: country || "Unknown",
        region: region || "Unknown",
        city: city || "Unknown",
        online: true,
        authorized: true
    };

    saveLocation(location);

    console.log(
        `📍 GPS update received from ${deviceId}`
    );

    res.json({
        success: true,
        message: "Location saved",
        location
    });
});

/*
 * GET LATEST LOCATION
 */
app.get("/api/location/:deviceId", (req, res) => {
    const deviceId = req.params.deviceId;

    const device = getDevice(deviceId);

    if (!device) {
        return res.status(404).json({
            success: false,
            message: "Device not found"
        });
    }

    if (!device.authorized) {
        return res.status(403).json({
            success: false,
            message:
                "Location sharing is not authorized"
        });
    }

    const location =
        getLatestLocation(deviceId);

    if (!location) {
        return res.status(404).json({
            success: false,
            message:
                "No location has been shared by this device"
        });
    }

    res.json({
        success: true,
        location
    });
});

/*
 * LOCATION HISTORY
 */
app.get(
    "/api/location/:deviceId/history",
    (req, res) => {

        const deviceId = req.params.deviceId;

        const device = getDevice(deviceId);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        if (!device.authorized) {
            return res.status(403).json({
                success: false,
                message:
                    "Location sharing is not authorized"
            });
        }

        const history =
            getLocationHistory(deviceId);

        res.json({
            success: true,
            count: history.length,
            locations: history
        });
    }
);

/*
 * DASHBOARD
 */
app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
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

/*
 * START SERVER
 */
app.listen(PORT, () => {
    console.log(
        `🚀 Location Tracker running on port ${PORT}`
    );

    console.log(
        `🌐 Server: http://localhost:${PORT}`
    );
});
