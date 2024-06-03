const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  watch: true,
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/site/assets/",
          to: "../site/assets/",
        },
        {
          from: "src/site/fonts/",
          to: "../site/fonts/",
        },
        {
          from: "src/site/styles/",
          to: "../site/styles/",
        },
        {
          from: "src/site/scripts/",
          to: "../site/scripts/",
        },
        {
          from: "src/site/*.html",
          to: "../site/[name][ext]",
        },
      ],
    }),
  ],
  entry: "./src/server/server.js",
  output: {
    publicPath: "./",
    filename: "server.js",
    path: path.resolve(__dirname, "dist/server"),
  },

  target: "node",

  resolve: {
    extensions: [".js"],
  },
  externals: {
    "@brightsign/serialport": "commonjs @brightsign/serialport",
  },
  module: {
    rules: [{}],
  },
};
