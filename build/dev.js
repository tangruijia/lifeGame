const base = require('./base')

const config = {
  mode: 'development',
  ...base,
  // devtool: 'source-map',
  devServer: {
    compress: true,
    port: 9000,
  }
}

console.log(config)

module.exports = config