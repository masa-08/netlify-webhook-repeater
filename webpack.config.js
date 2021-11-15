const path = require("path")
const AwsSamPlugin = require("aws-sam-webpack-plugin");

const awsSamPlugin = new AwsSamPlugin();
const BUILT_PATH = path.resolve(__dirname, ".aws-sam/build/")

module.exports = {
  entry: () => awsSamPlugin.entry(),
  output: {
    filename: "[name]/app.js",
    path: BUILT_PATH,
    libraryTarget: "commonjs2",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
  target: "node",
  externals: process.env.NODE_ENV === "development" ? [] : ["aws-sdk"],
  mode: process.env.NODE_ENV || "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [
    awsSamPlugin,
  ],
}