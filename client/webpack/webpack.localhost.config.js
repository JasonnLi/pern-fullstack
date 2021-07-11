const path = require("path");
const webpack = require("webpack");
const Config = require("webpack-config");

module.exports = new Config.Config()
  .extend("webpack/webpack.base.config.js")
  .merge({
    mode: "development",
    plugins: [
      new webpack.DefinePlugin({
        "process.env.API_URL": JSON.stringify(`http://localhost:3000/api`),
      }),
    ],

    devServer: {
      index: "index.html",
      contentBase: path.join(__dirname, "../dist"),
      compress: true,
      port: 3001,
      host: "0.0.0.0",
      hot: true,
      historyApiFallback: true,
      publicPath: "/",
      allowedHosts: ["localhost"],
    },

    devtool: "source-map",
  });