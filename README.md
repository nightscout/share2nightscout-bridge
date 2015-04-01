share2nightscout-bridge
=======================

[![wercker status](https://app.wercker.com/status/1d9a86d110cb9d42c844fa60d084e5c4/m "wercker status")](https://app.wercker.com/project/bykey/1d9a86d110cb9d42c844fa60d084e5c4)
[![Gitter chat][gitter-img]][gitter-url]
[Releases][releases]

[![Deploy to Heroku][heroku-img]][heroku-url]

[releases]: https://github.com/bewest/share2nightscout-bridge/releases
[heroku-img]: https://www.herokucdn.com/deploy/button.png
[heroku-url]: https://heroku.com/deploy
[gitter-img]: https://img.shields.io/badge/Gitter-Join%20Chat%20%E2%86%92-1dce73.svg
[gitter-url]: https://gitter.im/nightscout/public
[c-r-m]: https://github.com/nightscout/cgm-remote-monitor
[wiki]: https://github.com/bewest/share2nightscout-bridge/wiki
[dexcom-eula]: http://www.dexcom.com/node/5421
[azure-environment]: https://github.com/projectkudu/kudu/wiki/Azure-runtime-environment
[blog-post]: http://www.hanselman.com/blog/BridgingDexcomShareCGMReceiversAndNightscout.aspx

The Share to Nightscout bridge copies your CGM data from Dexcom web services to
a Nightscout website.  The bridge runs as `node.js index.js` and will loop
forever, periodically querying Dexcom's Share web services for new CGM data.
The bridge relays any new data to a Nightscout website
([cgm-remote-monitor][c-r-m]) via the REST API.  The website then stores the
data in a Mongo database.

### Prerequisites

* A working Dexcom Share receiver paired to an Apple device that is
  successfully uploading data to Dexcom.  You must be able to see the Dexcom
  data in the Dexcom Follow app for the bridge to work.
* Your Dexcom Sharer username and password
* A working Nightscout website and Mongo database

### Install

The Share to Nightscout bridge is supported on both Azure and Heroku.  Please
see the [wiki][wiki] for current install information.

### Environment

`VARIABLE` (default) - description

#### Required

* `API_SECRET` - A secret passphrase that must be at least 12 characters long, and must match the `API_SECRET` from your Nightscout website
* `DEXCOM_ACCOUNT_NAME` - Your Dexcom Share2 username
* `DEXCOM_PASSWORD` - Your Dexcom Share2 password
* `WEBSITE_HOSTNAME` - The host name for your Nightscout website.  Example: sitename.herokuapp.com or sitename.azurewebsites.net.

#### Optional

* `maxCount` (1) - The maximum number of records to fetch per update
* `minutes` (1440) - The time window to search for new data per update (default is one day in minutes)
* `firstFetchCount` (3) - Changes `maxCount` during the very first update only.
* `maxFailures` (3) - The program will stop running after this many
  consecutively failed login attempts with a clear error message in the logs.
* `SHARE_INTERVAL` (150000) - The time to wait between each update (default is 2.5 minutes in milliseconds)

#### Azure Specific

* It is highly recommended that you set the `API_SECRET`, `DEXCOM_ACCOUNT_NAME` and `DEXCOM_PASSWORD` in **Connection Strings**.
* No need to set `WEBSITE_HOSTNAME` because the value is obtained from the existing [Azure website environment][azure-environment].

### More information

[As described by Scott Hanselman][blog-post], the bridge logs in to Dexcom
Share as the data publisher.  It re-uses the token every `5` minutes to fetch
the `maxCount` latest glucose records within the last specified `minutes`.
This information is then sent to the user's specified Nightscout install,
making the data available to the beloved pebble watch and other equipment owned
and operated by the receiver's owner.  It will continue to re-use the same
`sessionID` until it expires, at which point it should attempt to log in again.
If it can log in again, it will continue to re-use the new token to fetch data,
storing it into Nightscout.

This project is not FDA approved, not recommended for therapy, and not
recommended by [Dexcom][dexcom-eula].

