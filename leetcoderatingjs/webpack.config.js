const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpack = require("webpack");
const pkg = require("./package.json");
const VERSION = pkg.version;
const srcBanner = `leetcoderatingjs ${VERSION}
index.min.css
Copyright (C) 2025  zhang-wangz and all contributors
This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.`;
module.exports = {
  mode: "production", // 'production' or development
  entry: './index.js',
  output: {
    filename: 'index.js',
  },
  module: {
    rules: [
      { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$/, loader: "file-loader" },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: "index.min.css"
    }),
    new webpack.BannerPlugin(srcBanner),
    new CopyPlugin({
      patterns: [
        { from: "LICENSE" },
        { from: "package.json" },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8000
  }
};
