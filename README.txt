src folder has ready to run files.

Connect the ELM327 OBD Reader to the USB-A port of the player and power on vehicle first.

OBD Dashboard.bpfx should be opened in BA:con.  
Link in the index.html site for the main HTML Widget Zone.
Publish to player while vehicle is running.

Currently supports:
{ name: "Fuel", delimiter: "2F", length: 2 },
{ name: "RPM", delimiter: "0C", length: 4 },
{ name: "Speed", delimiter: "0D", length: 2 },
{ name: "Temperature", delimiter: "67", length: 6 },
{ name: "Voltage", delimiter: "42", length: 4 }