const path = require('path');
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: './src/lifeGame.ts',
  // entry: ['babel-polyfill','./src/lifeGame.ts'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve:{
    extensions: [".ts",".js"]
  },
  module: {
    rules: [
      { 
        test: /\.ts$/,
        exclude: /node_modules/,
        include: /src/,
        use: ['babel-loader','ts-loader']
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ]
};