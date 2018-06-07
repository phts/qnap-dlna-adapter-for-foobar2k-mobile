#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const untildify = require('untildify')
const configFile = untildify(process.argv[2] || '~/dlna-adapter-config.json')

if (!fs.existsSync(configFile)) {
  console.info(`Config file ${configFile} is not found.`)
  console.info('Please create one like this:')
  console.info(fs.readFileSync(path.join(__dirname, 'dlna-adapter-config.json.example')).toString())
  process.exit(1)
}

const config = JSON.parse(fs.readFileSync(configFile))
const express = require('express')
const bodyParser = require('body-parser')

const DLNA_URL = `${config.dlnaHost}:${config.dlnaPort}`
config.deviceDescriptionPath = config.deviceDescriptionPath || '/DeviceDescription.xml'

const proxy = require('express-http-proxy')
const app = express()
app.use(bodyParser.text({type: 'text/xml'}))

app.use(function (req, res, next) {
  console.info(req.method, req.originalUrl)
  if (req.body && typeof req.body === 'string') {
    console.info(req.body)
  }
  next()
})

app.use('/DeviceDescription.xml', proxy(DLNA_URL, {
  proxyReqPathResolver: () => config.deviceDescriptionPath,
}))

app.use('/', proxy(DLNA_URL))

app.listen(config.port, config.host, () => {
  console.info(`Listening on ${config.host}:${config.port}`)
})
