# dexcom webservice

Fetches data from Dexcom's webservice and puts it in Nightscout.

### Environment variables

These are required.

* **DEXCOM_ACCOUNT_NAME** - Dexcom Share user name
* **DEXCOM_PASSWORD** - Dexcom Share password
* **API_SECRET** - (already set in Azure) your Nightscout API Secret
* **NS** - Your fully qualified `https://foo.bar.example.com` endpoint with no path.

#### Features

These environment variables are optional.
* **maxCount** - default: `1`, maximum number of records to process
* **minutes** - default: `1440`, number of minutes to include

These features can be used to emulate gap sync.

* **SHARE_INTERVAL** - default: `60000 * 5`, number of ms to wait between
  updates


## Output/logs

The output looks like this when it works:
```
$ env $(cat shansel.env )  node index.js 
Entries [ { sgv: 70,
    date: 1426298639000,
    dateString: '2015-03-14T02:03:59.000Z',
    trend: 4,
    device: 'share2',
    type: 'sgv' } ]
Nightscout upload error null status 200 []

```

## How it works:

Using the Share2 app allows an iphone to push data from a Dexcom
receiver to Dexcom's webservices.  This program fetches a user's data
from Dexcom's servers, and stores it in their own Nightscout server.

By default, this program run as `node index.js`, will loop forever.
[As described Scott][blog-post], one of my many advisors, this logs in
to Dexcom Share as the data publisher.  It re-uses the token every `5`
minutes to fetch the `maxCount` latest glucose records within the last
specified `minutes`.  This information is then sent to the user's
specified Nightscout install, making the data available to the beloved
pebble watch and other equipment owned and operated by the receiver's
owner.  It will continue to re-use the same `sessionID` until it
expires, at which point it should attempt to log in again.  If it can
log in again, it will continue to re-use the new token to fetch data,
storing it into Nightscout.

[blog-post]: http://www.hanselman.com/blog/BridgingDexcomShareCGMReceiversAndNightscout.aspx

