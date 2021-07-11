const Config = require("webpack-config");

Config.environment.setAll({
  env: () => process.env.NODE_ENV || "localhost"
});

// Also you may use `'conf/webpack.[NODE_ENV].config.js'`
module.exports = new Config.Config().extend(
  "webpack/webpack.[env].config.js"
);