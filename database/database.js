const fs = require("fs");
const path = require("path");

const databasePath = path.resolve(
  process.env.DATABASE_PATH || "./database/location-tracker.json"
);

const databaseDir = path.dirname(databasePath);

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

function loadDatabase() {
  if (!fs.existsSync(databasePath)) {
    const initialData = {
      devices: [],
      locations: []
    };

    fs.writeFileSync(
      databasePath,
      JSON.stringify(initialData, null, 2)
    );

    return initialData;
  }

  try {
    return JSON.parse(
      fs.readFileSync(databasePath, "utf8")
    );
  } catch {
    return {
      devices: [],
      locations: []
    };
  }
}

function saveDatabase(data) {
  fs.writeFileSync(
    databasePath,
    JSON.stringify(data, null, 2)
  );
}

function addDevice(device) {
  const db = loadDatabase();

  const exists = db.devices.find(
    d => String(d.id) === String(device.id)
  );

  if (!exists) {
    db.devices.push({
      id: String(device.id),
      name: device.name || "Unknown Device",
      authorized: Boolean(device.authorized),
      createdAt: new Date().toISOString()
    });

    saveDatabase(db);
  }

  return exists || db.devices[db.devices.length - 1];
}

function getDevice(deviceId) {
  const db = loadDatabase();

  return db.devices.find(
    d => String(d.id) === String(deviceId)
  ) || null;
}

function saveLocation(location) {
  const db = loadDatabase();

  db.locations.push({
    ...location,
    deviceId: String(location.deviceId),
    timestamp: new Date().toISOString()
  });

  saveDatabase(db);
}

function getLatestLocation(deviceId) {
  const db = loadDatabase();

  const deviceLocations = db.locations
    .filter(
      location =>
        String(location.deviceId) === String(deviceId)
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

  return deviceLocations[0] || null;
}

function getLocationHistory(deviceId) {
  const db = loadDatabase();

  return db.locations
    .filter(
      location =>
        String(location.deviceId) === String(deviceId)
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );
}

module.exports = {
  loadDatabase,
  saveDatabase,
  addDevice,
  getDevice,
  saveLocation,
  getLatestLocation,
  getLocationHistory
};

This uses a simple JSON database for now, so no SQLite driver is required. It will create:

database/
└── location-tracker.json

Your ".env" can therefore use:

DATABASE_PATH=./database/location-tracker.json

Next, we should connect "server.js" to this database so GPS locations are saved permanently instead of staying only in memory.
