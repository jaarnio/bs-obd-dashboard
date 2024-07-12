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

  // Send command every 1 second
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

  // Extract the index and the content from the received line
  const [index, content] = data.split(": ");
  // Log the extracted index and content
  console.log("Extracted Index:", index);
  console.log("Extracted Content:", content);

  // If the index of the received line is the expected index
  if (parseInt(index) === expectedIndex) {
    // Store the content in the responseLines array
    console.log("index matches expected index of ", expectedIndex);
    responseLines.push(content);
    console.log("Response Lines:", responseLines);
    // Increment the expected index
    expectedIndex++;
  }

  // If we have received all three lines
  if (responseLines.length === 3) {
    // Combine the lines into a single string and remove spaces
    const combinedResponse = responseLines.join("").replace(/\s/g, "");
    console.log("Combined Response:", combinedResponse);

    // Remove the "41" prefix from combinedResponse
    let strippedResponse = combinedResponse.slice(2);

    // Define the delimiters and the number of characters to keep after each delimiter
    const delimiters = [
      { name: "Fuel", delimiter: "2F", length: 2 },
      { name: "RPM", delimiter: "0C", length: 4 },
      { name: "Speed", delimiter: "0D", length: 2 },
      { name: "Temperature", delimiter: "67", length: 6 },
      { name: "Voltage", delimiter: "42", length: 4 },
    ];

    // Initialize responseObject
    let responseObject = {};

    // For each delimiter
    for (let i = 0; i < delimiters.length; i++) {
      // Find the index of the delimiter in strippedResponse
      const index = strippedResponse.indexOf(delimiters[i].delimiter);

      // If the delimiter is found
      if (index !== -1) {
        // Extract the specified number of characters after the delimiter
        const value = strippedResponse.slice(index + 2, index + 2 + delimiters[i].length);

        // Add the value to responseObject with the corresponding name
        responseObject[delimiters[i].name] = value;

        // Remove the processed part from strippedResponse
        strippedResponse = strippedResponse.slice(index + 2 + delimiters[i].length);
      }
    }

    // Iterate through responseObject
    for (let key in responseObject) {
      // Convert the hex value to an integer
      let value = parseInt(responseObject[key], 16);

      switch (key) {
        case "Fuel":
          // Perform the calculation for Fuel
          value = Math.round((value * 100) / 255);
          break;

        case "RPM":
          // Perform the calculation for RPM
          value = Math.round(value / 4);
          break;

        case "Speed":
          // Perform the calculation for Speed
          value = Math.round(value * 0.621371);
          break;

        case "Temperature":
          // Split the last 4 characters into two pairs
          const temp1 = parseInt(responseObject[key].substring(0, 2), 16);
          const temp2 = parseInt(responseObject[key].substring(2, 4), 16);

          // Convert each hex value to an integer, subtract 40 to get the value in Celsius, and convert to Fahrenheit
          const tempF1 = Math.round((temp1 - 40) * 1.8 + 32);
          const tempF2 = Math.round((temp2 - 40) * 1.8 + 32);

          // Keep the higher of the two temperatures
          value = Math.max(tempF1, tempF2);
          break;

        case "Voltage":
          // Perform the calculation for Voltage
          value = value / 1000;
          break;
      }

      // Update the value in responseObject
      responseObject[key] = value;
    }

    console.log("Final Response Object:", responseObject);
*/
  // Send responseObject to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(responseObject));
    }
  });

  // Reset responseLines and expectedIndex for the next set of lines
  //responseLines = [];
  //expectedIndex = 0;
  //}
});
