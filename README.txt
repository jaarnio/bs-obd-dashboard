This instruction file should be properly written, and would mirror the readme on GitHub if this is hosted.

This is a pre-made starter Node project that can be run on a BrightSign. 

This is designed for a browser / on-screen presentation.

It has webpack already configured to create a folder with everything that needs to be copied to a BrightSign SD Card, or added to an HTML Widget in BrightAuthor / BrightAuthor:connected.

Ensure you have Node installed.

---------------------------------------------------------
To use:

Open project. Run "npm install" in terminal. This will download dependencies.

Work from the SRC folder

SRC
---
assets
	|_BrightSignLogo-175x85.png
fonts
	|_font-placeholder.ttf
scripts
	|_scripts.js
styles
	|_style.css
index.html
---

Edit the html, css and js files to build your app.  Load media items into the assets folder. Install additional Node modules as needed.  

---------------------------------------------------------
To publish / distribute:

When ready, run command "webpack" from terminal.
This will package up the project into the DIST folder, with the same subfolder structure.  Additionally, webpack will continue to run and "watch" your SRC folder for any changes, and will automatically rebuild your DIST folder.
Copy the contents of the DIST folder to your SD Card, or publish to an HTML Widget in BA / BA:con.
If copying to an SD card, use the "autorun.brs" found in the OPT folder.

DIST
---
assets
	|_BrightSignLogo-175x85.png
fonts
	|_font-placeholder.ttf
scripts
	|_scripts.js
styles
	|_style.css
index.html
---
