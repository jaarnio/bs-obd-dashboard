switch (command) {
  case "412f": // Fuel
    const hexValueFuel = buffer.slice(-1).readUInt8(0);
    // Convert the hexadecimal value to an integer and divide by 4
    fuel = Math.round((hexValueFuel * 100) / 255);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ fuel }));
      }
    });
    console.log("Fuel:", fuel);
    break;

  case "410c": // RPM
    const hexValueRpm = buffer.slice(-2).toString("hex");
    // Convert the hexadecimal value to an integer and divide by 4
    rpm = Math.round(parseInt(hexValueRpm, 16) / 4);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ rpm }));
      }
    });
    console.log("RPM:", rpm);
    break;

  case "410d": // Speed in MPH
    const speedKph = buffer.slice(-1).readUInt8(0);
    // Convert KPH to MPH
    speedMph = Math.round(speedKph * 0.621371);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ speedMph }));
      }
    });
    console.log("Speed:", speedMph, "MPH");
    break;

  case "4167": // Temp
    // Get the last two bytes and for each one, convert it to a decimal value
    const temp1 = buffer.slice(-1).readUInt8(0);
    const temp2 = buffer.slice(-2).readUInt8(0);
    // Convert KPH to MPH
    tempC1 = Math.round(temp1 - 40);
    tempC2 = Math.round(temp2 - 40);
    tempF1 = Math.round(tempC1 * 1.8 + 32);
    tempF2 = Math.round(tempC2 * 1.8 + 32);
    console.log("Temp1:", tempF1, "F");
    console.log("Temp2:", tempF2, "F");
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ tempF1, tempF2 }));
      }
    });
    break;

  case "4142": // voltage
    // Get the last two bytes and join them into a single hexadecimal value
    const hexValueVoltage = buffer.slice(-2).toString("hex");

    // Convert the hexadecimal value to an integer and divide by 4
    volts = Math.round(parseInt(hexValueVoltage, 16) / 1000);

    console.log("Volts:", volts);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ volts }));
      }
    });
    break;

  default:
    //console.log("Unknown command:", command);
    break;
}
