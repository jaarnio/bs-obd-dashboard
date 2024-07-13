var SerialPort = require("@serialport/stream");
var BrightSignBinding = require("@brightsign/serialport");
var Readline = require("@serialport/parser-readline");
const WebSocket = require("ws");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 1234 });

// BrightSign path
var path = "/dev/ttyUSB0";

// Comment this out for prototyping on a non-BrightSign device
SerialPort.Binding = BrightSignBinding;

const options = {
  //comment the port for non BrightSign devices
  port: 2, // Port 0, 3.5mm Serial/RS232, Port 2, USB Serial
  baudRate: 38400, // Update to reflect the expected baud rate
  dataBits: 8,
  stopBits: 1,
  parity: "none",
  module_root: "/storage/sd", // Source for where serialport will look for the underlying module
};

const port = new SerialPort(path, options);
const parser = port.pipe(new Readline({ delimiter: "\r" }));
const obdCommand = "010C";
const obdCombined = "012F0C0D6742";

port.on("open", () => {
  console.log("Port is open");
  setInterval(() => {
    port.write(obdCommand + "\r", (err) => {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
    });
  }, 1000); // 1000 milliseconds = 1 second
});

let responseLines = [];
let expectedIndex = 0;
let responseObject = {};

parser.on("data", (data) => {
  console.log(typeof data, "Data:", data);
  // RPM Test
  if (data.includes("41 0C")) {
    const rpm = parseInt(data.split(" ")[2] + data.split(" ")[3], 16) / 4;
    responseObject["RPM"] = rpm;
    console.log("RPM:", rpm);
  }

  // Regular expression to match the expected pattern
  /*const pattern = /^\d+: ([0-9A-Fa-f]{2} )+/;

  // If the data does not match the expected pattern, skip processing
  if (!pattern.test(data)) {
    console.log("Data does not match expected pattern, skipping");
    return;
  }

  // Send responseObject to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(responseObject));
    }
  });
});
