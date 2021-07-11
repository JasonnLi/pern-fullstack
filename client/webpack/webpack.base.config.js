const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Config = require("webpack-config");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports.default = new Config.Config().merge({
  name: "base",
  // entry: ["./src/index.tsx", "./src/styles/index.scss"],
  entry: ["./src/index.tsx"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, '..', './build'),
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          filename: "vendors.bundle.js",
          chunks: "all",
        },
      },
    },
  },


  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader?name=[name].[ext]",
          {
            loader: "image-webpack-loader",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "../dist/css/antd.css",
            },
          },
          {
            loader: "extract-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../index.html'),
    }),
    new CleanWebpackPlugin(),
  ],
});