// Import necessary modules
const WebSocket = require("ws");

// Initialize a WebSocket server instance
const wss = new WebSocket.Server({ port: 1234 });

// Function to generate random data for vehicle parameters
function generateVehicleData() {
  return {
    Speed: Math.floor(Math.random() * (60 - 0 + 1)) + 0,
    RPM: Math.floor(Math.random() * (3000 - 600 + 1)) + 600,
    Fuel: Math.floor(Math.random() * (60 - 10 + 1)) + 10,
    Temperature: Math.floor(Math.random() * (220 - 190 + 1)) + 190,
  };
}

// Broadcast the vehicle data to all connected clients
function broadcastVehicleData() {
  const data = JSON.stringify(generateVehicleData());
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Set an interval to broadcast vehicle data every second
setInterval(broadcastVehicleData, 500);

// Start the server on port 1234
wss.clients.forEach((client) => {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(responseObject));
  }
});

const variables = [
  { command: "obdSpeed", value: "41 0D 00" },
  { command: "obdRPM", value: "41 0C 0B 24" },
  { command: "obdFuel", value: "41 2F 23" },
  { command: "obdTemperature", value: "41 67 03 80 67" },
];

// Define the delimiters and the number of characters to keep after each delimiter
const delimiters = [
  { name: "Fuel", delimiter: "2F", length: 2 },
  { name: "RPM", delimiter: "0C", length: 4 },
  { name: "Speed", delimiter: "0D", length: 2 },
  { name: "Temperature", delimiter: "67", length: 6 },
  { name: "Voltage", delimiter: "42", length: 4 },
];

function processOBDVariables() {
  variables.forEach((variable) => {
    parseOBDResponse(variable.value);
  });
}

function parseOBDResponse(data) {
  // Remove spaces and convert to uppercase for consistency
  const formattedResp = data.replace(/\s+/g, "").toUpperCase();

  if (formattedResp.startsWith("41")) {
    // Extract the command code which follows "41"
    const commandCode = formattedResp.substring(2, 4);

    // Find the matching delimiter object
    const delimiterObj = delimiters.find(
      (delimiter) => delimiter.delimiter === commandCode
    );

    if (delimiterObj) {
      // Extract the value based on the length specified in the delimiters object
      const valueStartIndex = 4; // Start index of the value part
      const valueEndIndex = valueStartIndex + delimiterObj.length * 2; // Each character represents half a byte
      const value = formattedResp.substring(valueStartIndex, valueEndIndex);

      switch (commandCode) {
        case "2F": // Fuel
          let fuel = Math.round((parseInt(value, 16) * 100) / 255);
          console.log(`Fuel Level: ${fuel}%`);
          break;
        case "0C": // RPM
          let rpm = parseInt(value, 16) / 4;
          console.log(`RPM: ${rpm} RPM`);
          break;
        case "0D": // Speed
          let speedMPH = parseInt(value, 16) * 0.621371;
          console.log(`Speed: ${speedMPH} mph`);
          break;
        case "67": // Temperature
          // Split the last 4 characters into two pairs
          const temp1 = parseInt(value.substring(0, 2), 16);
          const temp2 = parseInt(value.substring(2, 4), 16);

          // Convert each hex value to an integer, subtract 40 to get the value in Celsius, and convert to Fahrenheit
          const tempF1 = Math.round((temp1 - 40) * 1.8 + 32);
          const tempF2 = Math.round((temp2 - 40) * 1.8 + 32);

          // Keep the higher of the two temperatures
          let temp = Math.max(tempF1, tempF2);

          console.log(`Temperature: ${temp}°C`);
          break;
        case "42": // Voltage
          console.log(`Voltage: ${parseInt(value, 16) / 1000}V`);
          break;
        default:
          console.log("Unknown command code");
      }
    } else {
      console.log("Command code does not match any known delimiter");
    }
  } else {
    console.log("Response does not start with '41', ignoring.");
  }
}

processOBDVariables();
