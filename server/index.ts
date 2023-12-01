import express from 'express'
import compression from 'compression'
import { renderPage } from 'vite-plugin-ssr'
import { createPinia } from 'pinia'

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`

const fs = require("fs");
const util = require("util");
const log_file = fs.createWriteStream(__dirname + "/../logs.log", {flags: "w"});
const log_stdout = process.stdout;

console.log = function() {
    const time = new Date().toISOString().match(/(\d{2}:){2}\d{2}/)[0];
    log_file.write(`[${time}]: ${util.format.apply(null, arguments)}\n`)
    log_stdout.write(`[${time}]: ${util.format.apply(null, arguments)}\n`)
}

console.error = console.log

startServer()

async function startServer() {
  const app = express()
  require('dotenv').config();

  app.use(compression())

  if (isProduction) {
    const sirv = require('sirv')
    app.use(sirv(`${root}/dist/client`))
  } else {
    const vite = require('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType, earlyHints } = httpResponse
    if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    res.status(statusCode).type(contentType).send(body)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
