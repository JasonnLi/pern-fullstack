const path = require("path");
const webpack = require("webpack");
const Config = require("webpack-config");

module.exports.default = new Config.Config()
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
      // the port should be matched to the docker expose port, otherwise, hot reloading does not work
      public: "http://localhost",
      disableHostCheck: true,
      // allowedHosts: ["localhost"],
      watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 500,
        poll: 1000,
      },
    },

    devtool: "source-map",
  });