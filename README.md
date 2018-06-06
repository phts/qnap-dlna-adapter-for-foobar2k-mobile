# QNAP DLNA adapter for foobar2000 Mobile

[![npm](https://img.shields.io/npm/v/qnap-dlna-adapter-for-foobar2k-mobile.svg)](https://www.npmjs.com/package/qnap-dlna-adapter-for-foobar2k-mobile)

## Requirements

1) Node.js v8 (install from QNAP App Center)

2) [Entware](https://github.com/Entware/Entware/wiki/Install-on-QNAP-NAS)

3) `nohup`

    Connect to NAS via SSH as admin and run:

    ```
    opkg update
    opkg install coreutils-nohup
    ```

4) Export npm bin folder to `$PATH`:

    ```
    export PATH=/share/CACHEDEV1_DATA/.qpkg/nodejsv8/node/bin:$PATH
    ```


## Install

Connect to NAS via SSH as admin and run:

```
npm install -g qnap-dlna-adapter-for-foobar2k-mobile
```

## Usage

Create [config file](https://github.com/phts/qnap-dlna-adapter-for-foobar2k-mobile/blob/master/dlna-adapter-config.json.example). Example:

```
{
  "host": "0.0.0.0",
  "port": 8888,
  "dlnaHost": "http://localhost",
  "dlnaPort": 8200
}

```

Start:

```
dlna-adapter-for-foobar2k-mobile-start [PATH_TO_CONFIG_FILE]
```

If `PATH_TO_CONFIG_FILE` is not specified then `~/dlna-adapter-config.json` will be used.

Stop:

```
dlna-adapter-for-foobar2k-mobile-stop
```
