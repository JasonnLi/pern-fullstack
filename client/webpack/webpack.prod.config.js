const path = require("path");
const webpack = require("webpack");
const Config = require("webpack-config");

module.exports = new Config.Config()
  .extend("webpack/webpack.base.config.js")
  .merge({
    name: "prod",
    mode: "production",
    devtool: "source-map",
    plugins: [
      new webpack.DefinePlugin({
        "process.env.API_URL": JSON.stringify(`http://localhost:3000/api`),
      }),
    ],
  });
