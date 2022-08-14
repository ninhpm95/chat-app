const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PORT = 3000

module.exports = {
  context: path.resolve(__dirname),
  mode: 'development',
  devtool: false,
  entry: path.resolve(__dirname, './index.js'),
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './static/index.html'),
      favicon: path.resolve(__dirname, './static/favicon.ico'),
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          'image-webpack-loader'
        ]
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss']
  },
  output: {
    filename: 'chat-app-client.js'
  },
  devServer: {
    hot: true,
    port: PORT
  }
}
