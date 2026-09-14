const fs = require("fs");
const path = require("path");

const databasePath = path.resolve(
    process.env.DATABASE_PATH ||
    "./database/location-tracker.json"
);

const databaseDir = path.dirname(databasePath);

// Create database folder if it doesn't exist
if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, {
        recursive: true
    });
}

// Create initial database
function createDatabase() {
    return {
        devices: [],
        locations: []
    };
}

// Load database
function loadDatabase() {

    if (!fs.existsSync(databasePath)) {
        const database = createDatabase();

        fs.writeFileSync(
            databasePath,
            JSON.stringify(database, null, 2)
        );

        return database;
    }

    try {
        return JSON.parse(
            fs.readFileSync(
                databasePath,
                "utf8"
            )
        );
    } catch (error) {

        console.error(
            "❌ Database read error:",
            error.message
        );

        return createDatabase();
    }
}

// Save database
function saveDatabase(database) {

    fs.writeFileSync(
        databasePath,
        JSON.stringify(
            database,
            null,
            2
        )
    );
}

// Add authorized device
function addDevice(device) {

    const database = loadDatabase();

    const id = String(device.id);

    const existing =
        database.devices.find(
            item => String(item.id) === id
        );

    if (existing) {
        return existing;
    }

    const newDevice = {
        id,
        name: device.name || "Unknown Device",
        authorized: Boolean(
            device.authorized
        ),
        createdAt:
            new Date().toISOString()
    };

    database.devices.push(newDevice);

    saveDatabase(database);

    return newDevice;
}

// Get device
function getDevice(deviceId) {

    const database = loadDatabase();

    return database.devices.find(
        device =>
            String(device.id) ===
            String(deviceId)
    ) || null;
}

// Get all devices
function getDevices() {

    const database = loadDatabase();

    return database.devices;
}

// Save GPS location
function saveLocation(location) {

    const database = loadDatabase();

    const newLocation = {
        deviceId:
            String(location.deviceId),

        latitude:
            Number(location.latitude),

        longitude:
            Number(location.longitude),

        country:
            location.country || "Unknown",

        region:
            location.region || "Unknown",

        city:
            location.city || "Unknown",

        timestamp:
            new Date().toISOString()
    };

    database.locations.push(
        newLocation
    );

    saveDatabase(database);

    return newLocation;
}

// Get latest location
function getLatestLocation(deviceId) {

    const database = loadDatabase();

    const locations =
        database.locations
            .filter(
                location =>
                    String(
                        location.deviceId
                    ) ===
                    String(deviceId)
            )
            .sort(
                (a, b) =>
                    new Date(b.timestamp) -
                    new Date(a.timestamp)
            );

    return locations[0] || null;
}

// Get location history
function getLocationHistory(deviceId) {

    const database = loadDatabase();

    return database.locations
        .filter(
            location =>
                String(
                    location.deviceId
                ) ===
                String(deviceId)
        )
        .sort(
            (a, b) =>
                new Date(b.timestamp) -
                new Date(a.timestamp)
        );
}

// Remove device
function removeDevice(deviceId) {

    const database = loadDatabase();

    const id = String(deviceId);

    const index =
        database.devices.findIndex(
            device =>
                String(device.id) === id
        );

    if (index === -1) {
        return null;
    }

    const removed =
        database.devices.splice(
            index,
            1
        )[0];

    // Remove the device's saved
    // location history as well.
    database.locations =
        database.locations.filter(
            location =>
                String(
                    location.deviceId
                ) !== id
        );

    saveDatabase(database);

    return removed;
}

module.exports = {
    loadDatabase,
    saveDatabase,
    addDevice,
    getDevice,
    getDevices,
    saveLocation,
    getLatestLocation,
    getLocationHistory,
    removeDevice
};
