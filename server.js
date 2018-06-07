#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const untildify = require('untildify')
const configFile = untildify(process.argv[2] || '~/dlna-adapter.config.json')

if (!fs.existsSync(configFile)) {
  console.info(`Config file ${configFile} is not found.`)
  console.info('Please create one like this:')
  console.info(fs.readFileSync(path.join(__dirname, 'dlna-adapter.config.json.example')).toString())
  process.exit(1)
}

const config = JSON.parse(fs.readFileSync(configFile))
const express = require('express')
const bodyParser = require('body-parser')

config.deviceDescriptionPath = config.deviceDescriptionPath || '/DeviceDescription.xml'
config.dlnaHost = `${config.dlnaHostname}:${config.dlnaPort}`
config.externalHost = `${config.externalHostname}:${config.port}`
config.replaceRegExp = new RegExp(config.dlnaHost, 'g')

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

function userResDecorator(proxyRes, proxyResData) {
  const contentType = proxyRes.headers['content-type']
  if (!contentType || !contentType.includes('text/xml')) {
    return proxyResData
  }

  const xml = proxyResData.toString('utf8')
  return xml.replace(config.replaceRegExp, config.externalHost)
}

app.use('/DeviceDescription.xml', proxy(config.dlnaHost, {
  proxyReqPathResolver: () => config.deviceDescriptionPath,
  userResDecorator,
}))

app.use('/', proxy(config.dlnaHost, {
  userResDecorator,
}))

app.listen(config.port, config.listenHostname, () => {
  console.info(`Use config file ${configFile}.`)
  console.info(`Listening on ${config.listenHostname}:${config.port}.`)
  console.info(`Proxying ${config.externalHost} to ${config.dlnaHost}.`)
})
