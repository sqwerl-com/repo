/**
 * Proxies requests for help information during development to a help content server.
 */
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = app => {
  app.use(
    '/help',
    createProxyMiddleware({
      target: 'http://localhost:8000/',
      changeOrigin: true
    })
  )
}
