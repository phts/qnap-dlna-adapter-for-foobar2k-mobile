# QNAP DLNA adapter for foobar2000 Mobile

[![npm](https://img.shields.io/npm/v/qnap-dlna-adapter-for-foobar2k-mobile.svg)](https://www.npmjs.com/package/qnap-dlna-adapter-for-foobar2k-mobile)

## Requirements

1) Node.js v8 (install from QNAP App Center)

2) Export npm bin folder to `$PATH`:

    ```
    export PATH=/share/CACHEDEV1_DATA/.qpkg/nodejsv8/node/bin:$PATH
    ```

## Install

Connect to NAS via SSH as admin and run:

```
npm install -g qnap-dlna-adapter-for-foobar2k-mobile
```

## Usage

Connect to NAS via SSH.

Create [config file](https://github.com/phts/qnap-dlna-adapter-for-foobar2k-mobile/blob/master/dlna-adapter-config.json.example). Example:

```
{
  "host": "0.0.0.0",
  "port": 8888,
  "deviceDescriptionPath": "/DeviceDescription.xml",
  "dlnaHost": "http://localhost",
  "dlnaPort": 8200
}

```

Start:

```
dlna-adapter-for-foobar2k-mobile-start [PATH_TO_CONFIG_FILE]
```

If `PATH_TO_CONFIG_FILE` is not specified then default path `~/dlna-adapter-config.json` will be used.

Stop:

```
dlna-adapter-for-foobar2k-mobile-stop
```

## How it works

foobar2000 Mobile allows to add a custom media server. However most likely foobar will not find it.
Thats's because it tries to fetch device description on hard-coded URLs which cannot be amended in foobar application.

The adapter redirects `/` and `/DeviceDescription.xml` requests to `{deviceDescriptionPath}` which is understandable by QNAP DLNA server.
All other requests are being redirected to QNAP DLNA server without modification.

## Configuration

For QNAP DLNA server (native):

```
"deviceDescriptionPath": "/rootDesc.xml"
"dlnaHost": "http://192.168.0.10"
"dlnaPort": 8200
```

For [Asset UPnP](http://www.dbpoweramp.com/asset-upnp-dlna.htm):

```
"deviceDescriptionPath": "/DeviceDescription.xml"
"dlnaHost": "http://127.0.0.1"
"dlnaPort": 26125
```
