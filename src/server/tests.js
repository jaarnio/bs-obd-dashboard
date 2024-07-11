const SerialPort = require("@serialport/stream");
const Bindings = require("@serialport/bindings");

const port = new SerialPort("/dev/ttys015", {
  baudRate: 38400,
  bindings: new Bindings({
    bindingOptions: {
      vmin: 1,
      vtime: 0,
    },
  }),
});

port.on("open", () => {
  console.log("Port /dev/ttys015 is open.");
});

port.on("error", (err) => {
  console.log("Error:", err.message);
});
