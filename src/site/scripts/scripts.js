const serialPort = new BSSerialPort(2);
serialPort.SetBaudRate(38400);
serialPort.SetDataBits(8);
serialPort.SetStopBits(1);
serialPort.SetParity("none");
serialPort.SetLineEnding("\r");
serialPort.SetGenerateLineEvent(true);

function main() {
  const speedGuageSize = document.getElementById("speed").getAttribute("data-width");
  const rpmGuageSize = document.getElementById("rpm").getAttribute("data-width");
  const tempGuageSize = document.getElementById("temp").getAttribute("data-width");
  const fuelGuageSize = document.getElementById("fuel").getAttribute("data-width");

  let animationSpeed = 200;
  const actualGaugeCount = 4;
  let initGaugeCount = 0;

  const speedGauge = new RadialGauge({
    value: 0.1,
    renderTo: "speed",
    width: speedGuageSize,
    height: speedGuageSize,
    units: "Mph",
    minValue: 0,
    maxValue: 160,
    majorTicks: ["0", "20", "40", "60", "80", "100", "120", "140", "160"],
    minorTicks: 5,
    strokeTicks: true,
    highlights: [
      {
        from: 120,
        to: 160,
        color: "rgba(200, 50, 50, .75)",
      },
    ],
    colorPlate: "#2b2b2b",
    colorMajorTicks: "#19a801",
    colorMinorTicks: "#127401",
    colorTitle: "#19a801",
    colorUnits: "#19a801",
    colorNumbers: "#19a801",
    colorNeedleStart: "rgba(240, 128, 128, 1)",
    colorNeedleEnd: "rgba(255, 160, 122, .9)",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: animationSpeed,
    animationRule: "linear",
    valueBox: true,
    valueDec: 0,
  }).draw();

  const rpmGauge = new RadialGauge({
    renderTo: "rpm",
    width: rpmGuageSize,
    height: rpmGuageSize,
    units: "rpm",
    minValue: 0,
    maxValue: 8000,
    majorTicks: ["0", "1000", "2000", "3000", "4000", "5000", "6000", "7000", "8000"],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
      {
        from: 6000,
        to: 8000,
        color: "rgba(200, 50, 50, .75)",
      },
    ],
    colorPlate: "#2b2b2b",
    colorMajorTicks: "#19a801",
    colorMinorTicks: "#127401",
    colorTitle: "#19a801",
    colorUnits: "#19a801",
    colorNumbers: "#19a801",
    colorNeedleStart: "rgba(240, 128, 128, 1)",
    colorNeedleEnd: "rgba(255, 160, 122, .9)",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: animationSpeed,
    animationRule: "linear",
    valueBox: true,
    valueDec: 0,
  }).draw();

  const tempGauge = new RadialGauge({
    renderTo: "temp",
    width: tempGuageSize,
    height: tempGuageSize,
    units: "F",
    minValue: 40,
    maxValue: 280,
    majorTicks: ["40", "80", "120", "160", "200", "240", "280"],
    minorTicks: 4,
    strokeTicks: true,
    highlights: [
      {
        from: 220,
        to: 280,
        color: "rgba(200, 50, 50, .75)",
      },
    ],
    colorPlate: "#2b2b2b",
    colorMajorTicks: "#19a801",
    colorMinorTicks: "#127401",
    colorTitle: "#19a801",
    colorUnits: "#19a801",
    colorNumbers: "#19a801",
    colorNeedleStart: "rgba(240, 128, 128, 1)",
    colorNeedleEnd: "rgba(255, 160, 122, .9)",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: animationSpeed,
    animationRule: "linear",
    valueBox: true,
    valueDec: 0,
  }).draw();

  const fuelGauge = new RadialGauge({
    renderTo: "fuel",
    width: fuelGuageSize,
    height: fuelGuageSize,
    units: "%s",
    minValue: 0,
    maxValue: 100,
    majorTicks: ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
    minorTicks: 10,
    strokeTicks: true,
    highlights: [
      {
        from: 0,
        to: 20,
        color: "rgba(200, 50, 50, .75)",
      },
    ],
    colorPlate: "#2b2b2b",
    colorMajorTicks: "#19a801",
    colorMinorTicks: "#127401",
    colorTitle: "#19a801",
    colorUnits: "#19a801",
    colorNumbers: "#19a801",
    colorNeedleStart: "rgba(240, 128, 128, 1)",
    colorNeedleEnd: "rgba(255, 160, 122, .9)",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: animationSpeed,
    animationRule: "linear",
    valueBox: true,
    valueDec: 0,
  }).draw();

  serialPort.onserialline = function (e) {
    let data = e.sdata;
    console.log("Received:", data, "(", typeof data, ")");
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
            fuelGauge.value = fuel;
            console.log(`Fuel Level: ${fuel}%`);
            break;
          case "0C": // RPM
            let rpm = parseInt(value, 16) / 4;
            rpmGauge.value = rpm;
            console.log(`RPM: ${rpm} RPM`);
            break;
          case "0D": // Speed
            let speedMPH = parseInt(value, 16) * 0.621371;
            speedGauge.value = speedMPH;
            console.log(`Speed: ${speedMPH} mph`);
            break;
          case "05": // Temperature
            // Split the last 4 characters into two pairs
            const temp1 = parseInt(value.substring(0, 2), 16);
            //const temp2 = parseInt(value.substring(2, 4), 16);

            // Convert each hex value to an integer, subtract 40 to get the value in Celsius, and convert to Fahrenheit
            const tempF1 = Math.round((temp1 - 40) * 1.8 + 32);
            //const tempF2 = Math.round((temp2 - 40) * 1.8 + 32);

            // Keep the higher of the two temperatures
            //let temp = Math.max(tempF1, tempF2);
            tempGauge.value = temp1;
            console.log(`Temperature: ${temp1}°C`);
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
      //console.log("Response does not start with '41', ignoring.");
    }
  };

  const variables = [
    { command: "obdSpeed", value: "010D" },
    { command: "obdRPM", value: "010C" },
    { command: "obdTemperature", value: "0105" },
    { command: "obdFuel", value: "012F" },
  ];

  // Define the delimiters and the number of characters to keep after each delimiter
  const delimiters = [
    { name: "Fuel", delimiter: "2F", length: 2 },
    { name: "RPM", delimiter: "0C", length: 4 },
    { name: "Speed", delimiter: "0D", length: 2 },
    { name: "Temperature", delimiter: "05", length: 2 },
    { name: "Voltage", delimiter: "42", length: 4 },
  ];

  function pause(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let isWriting = false;

  async function writeCommandsSequentially() {
    if (isWriting) return; // Prevent overlapping executions
    isWriting = true;
    for (const { value } of variables) {
      serialPort.SendBytes(value + "\r", (err) => {
        // Ensure to append \r to each command
        if (err) {
          console.error(`Error sending ${value}:`, err);
        } else {
          console.log(`${value} command sent successfully.`);
        }
      });
      await pause(1000); // Wait for 300ms before sending the next command
    }
    isWriting = false;
  }

  //  setInterval(() => {
  //    writeCommandsSequentially();
  //  }, 5000);
}

function testPID(pid) {
  serialPort.SendBytes(pid + "\r", (err) => {
    if (err) {
      console.error(`Error sending ${pid}:`, err);
    } else {
      console.log(`${pid} command sent successfully.`);
    }
  });
}

window.main = main;
