# QNAP DLNA adapter for foobar2000 Mobile

[![npm](https://img.shields.io/npm/v/qnap-dlna-adapter-for-foobar2k-mobile.svg)](https://www.npmjs.com/package/qnap-dlna-adapter-for-foobar2k-mobile)

## Why?

Let's imagine you want to make your DLNA server running on QNAP be available through the internet and to listen to music in foobar2000 Mobile player from it.
You assigned internet address to your NAS (e.g. using DDNS service) and exposed a port of DLNA server via port forwarding in your router configuration then you can add your NAS to foobar2000 media server list like `http://mynas.myqnapcloud.com:8888`.

However most likely the player will not find it or will reject loading of any content. There are two reasons:

1. Due to your server was added manually, foobar2000 tries to fetch device description by default path `/DeviceDescription.xml`.

    DLNA server may have any other entry point, e.g. native QNAP DLNA server has `/rootDesc.xml`.
    The server informs a client about this entry point when it is discovered by the client in the local network.
    But in our case the server cannot inform foobar2000 about its entry point and so the player just uses the default one.

2. DLNA server returns XML responses containing hard-coded local URLs of the content and player is not able to reach them outside of local network.

This adapter solves these two problems.

## Requirements

1) Node.js v8 (install from QNAP App Center)

2) Export npm bin folder to `PATH`:

    ```bash
    export PATH=/share/CACHEDEV1_DATA/.qpkg/nodejsv8/node/bin:$PATH
    ```

    If you have installed [Entware](https://github.com/Entware/Entware/wiki) then it is possible to export `PATH` from `/opt/etc/profile` to make it available every time when connecting via SSH.

## Install

Connect to NAS via SSH as admin and run:

```
$ npm install -g qnap-dlna-adapter-for-foobar2k-mobile
```

## Usage

Connect to NAS via SSH.

Create [config file](https://github.com/phts/qnap-dlna-adapter-for-foobar2k-mobile/blob/master/dlna-adapter.config.json.example). Example:

```json
{
  "deviceDescriptionPath": "/DeviceDescription.xml",
  "dlnaHostname": "http://127.0.0.1",
  "dlnaPort": 8200,
  "externalHostname": "http://example.com",
  "listenHostname": "0.0.0.0",
  "port": 8888
}
```

### Start

```
$ dlna-adapter-for-foobar2k-mobile-start [options] [PATH_TO_CONFIG_FILE]
```

If `PATH_TO_CONFIG_FILE` is not specified then default path `~/dlna-adapter.config.json` will be used.

**Options**:

* `--verbose` &mdash; Print all incoming requests.

### Stop

```
$ dlna-adapter-for-foobar2k-mobile-stop
```

## How it works

The adapter is an [express](http://expressjs.com/) web-server. Once it is started it does the following:

1. Redirects `/` and `/DeviceDescription.xml` requests to `<deviceDescriptionPath>` which is understandable by the DLNA server.
All other requests are passing through the adapter without redirection.

2. Replaces all occurrences of `<dlnaHostname>:<dlnaPort>` with `<externalHostname>:<port>` in XML output of all http requests.
So the player will fetch audio files from QNAP server's external URL.

Expose `<port>` in your router and add `<externalHostname>:<port>` to foobar2000's media server list.
`<dlnaPort>` is not needed to be exposed anymore.

:rewind: :arrow_forward: :fast_forward: Now foobar2000 should find your server and be able to play music from it. :musical_note: :headphones: :thumbsup:

Theoretically this adapter can work not only with foobar2000 but I did not check that.

## Configuration

For QNAP DLNA server (native):

```json
{
  "deviceDescriptionPath": "/rootDesc.xml",
  "dlnaHostname": "<NAS local address, e.g. http://192.168.1.66>",
  "dlnaPort": 8200,
  "...": "..."
}
```

For [Asset UPnP](http://www.dbpoweramp.com/asset-upnp-dlna.htm):

```json
{
  "deviceDescriptionPath": "/DeviceDescription.xml",
  "dlnaHostname": "http://127.0.0.1",
  "dlnaPort": 26125,
  "...": "..."
}
```
