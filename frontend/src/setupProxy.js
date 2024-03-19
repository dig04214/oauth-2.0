
const {createProxyMiddleware} = require('http-proxy-middleware')
module.exports = function(app) {
  app.use(
    '/console',
    createProxyMiddleware({
      target: 'http://localhost:9000',
      changeOrigin: true,
    })
  )
  app.use(
    '/oauth',
    createProxyMiddleware({
      target: 'http://localhost:9000',
      changeOrigin: true,
    })
  )

}
