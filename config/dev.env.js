'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.1.25:8080"',
  WEBSOCKET_URL: '"ws://192.168.1.25:8000"',
})
