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
const fetch = require('node-fetch')
const bodyParser = require('body-parser')

const DLNA_URL = `${config.dlnaHost}:${config.dlnaPort}`

const app = express()
app.use(bodyParser.text({type: 'text/xml'}))

app.use(function (req, res, next) {
  console.info(req.method, req.originalUrl)
  console.info(req.body)
  next()
})

app.get(['/', '/DeviceDescription.xml'], (req, res) => {
  fetch(`${DLNA_URL}/rootDesc.xml`)
    .then(body => body.text())
    .then(text => {
      res
        .type('xml')
        .send(text)
    })
    .catch(err => {
      res.status(500).send(err.message)
    })
})

app.all('*', (req, res) => {
  const {body, method} = req
  const headers = {
    'Content-Type': req.get('Content-Type'),
    Soapaction: req.get('Soapaction'),
  }
  fetch(`${DLNA_URL}${req.originalUrl}`, {body, headers, method})
    .then(body => body.text())
    .then(text => {
      res.send(text)
    })
    .catch(err => {
      res.status(500).send(err.message)
    })
})

app.listen(config.port, config.host, () => {
  console.info(`Listening on ${config.host}:${config.port}`)
})
