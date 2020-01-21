const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      include: /src/,
      use: ['babel-loader', 'ts-loader']
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'index.html')
    })
  ]
}