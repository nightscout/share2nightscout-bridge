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

## Output/logs

The output looks like this when it works:
```
$ env $(cat shansel.env )  node index.js 
From Dexcom null [ { DT: '/Date(1426298616000-0700)/',
    ST: '/Date(1426302216000)/',
    Trend: 4,
    Value: 70,
    WT: '/Date(1426298639000)/' } ]
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

