OBD Vehicle Dashboard for BrightSign

![elm-plus--brightsign](https://github.com/user-attachments/assets/3151031a-29db-48a9-adcc-e0cacef8938a)

Connect ELM327 to vehicle and power on vehicle.
Connect the ELM327 OBD Reader to the USB-A port of BrightSign player and power on.

Using DIST files:
OBD JS.bpfx should be opened in BA:con.  
Link in the server.js as a Support File, and link the index.html site for the main HTML Widget Zone.
Publish to player while vehicle is running.

The server.js will connect to the OBD port via serial and will retreive PIDs, and send to the front end via Websocket.  

The HTML page uses a Guage library to visualize the incoming data stream.
https://canvas-gauges.com/

Currently supports:
{ name: "Fuel", delimiter: "2F", length: 2 },
{ name: "RPM", delimiter: "0C", length: 4 },
{ name: "Speed", delimiter: "0D", length: 2 },
{ name: "Temperature", delimiter: "67", length: 6 },
{ name: "Voltage", delimiter: "42", length: 4 }

<img width="1435" alt="image (1)" src="https://github.com/jaarnio/bs-obd-dashboard/assets/46546462/dfa7cbb6-7eb4-4c5a-9527-09e74060aab8">
