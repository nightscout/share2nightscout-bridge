
var request = require('request');
var qs = require('querystring');


var Defaults = {
  "applicationId":"d89443d2-327c-4a6f-89e5-496bbb0317db"
, "agent": "Dexcom Share/3.0.2.11 CFNetwork/711.2.23 Darwin/14.0.0"
, login: 'https://share1.dexcom.com/ShareWebServices/Services/General/LoginPublisherAccountByName'
, accept: 'application/json'
, 'content-type': 'application/json'
, LatestGlucose: "https://share1.dexcom.com/ShareWebServices/Services/Publisher/ReadPublisherLatestGlucoseValues"
// ?sessionID=e59c836f-5aeb-4b95-afa2-39cf2769fede&minutes=1440&maxCount=1"
};

    // -H "Accept: application/json" -H "Content-Length: 0"

function login_payload (opts) {
  var body = {
    "password": opts.password
  , "applicationId" : opts.applicationId || Defaults.applicationId
  , "accountName": opts.accountName
  };
  return body;
}

function authorize (opts, then) {
  var url = Defaults.login;
  var body = login_payload(opts);
  var headers = { 'User-Agent': Defaults.agent
                , 'Content-Type': Defaults['content-type']
                , 'Accept': Defaults.accept };
  var req ={ uri: url, body: body, json: true, headers: headers, method: 'POST'
           , rejectUnauthorized: false }; 
  return request(req, then);
}

function fetch_query (opts) {
  // ?sessionID=e59c836f-5aeb-4b95-afa2-39cf2769fede&minutes=1440&maxCount=1"
  var q = {
    sessionID: opts.sessionID
  , minutes: opts.minutes || 1440
  , maxCount: opts.maxCount || 1
  };
  var url = Defaults.LatestGlucose + '?' + qs.stringify(q);
  return url;
}

function fetch (opts, then) {
  var url = fetch_query(opts);
  var body = "";
  var headers = { 'User-Agent': Defaults.agent
                , 'Content-Type': Defaults['content-type']
                , 'Content-Length': 0
                , 'Accept': Defaults.accept };

  var req ={ uri: url, body: body, json: true, headers: headers, method: 'POST'
           , rejectUnauthorized: false }; 
  return request(req, then);
}

function do_everything (opts, then) {
  var login_opts = opts.login;
  var fetch_opts = opts.fetch;
  authorize(login_opts, function (err, res, body) {
    fetch_opts.sessionID = body;
    fetch(fetch_opts, function (err, res, glucose) {
      then(glucose);

    });
  });

}

if (!module.parent) {
  var args = process.argv.slice(2);
  var config = {
    accountName: process.env['DEXCOM_ACCOUNT_NAME']
  , password: process.env['DEXCOM_PASSWORD']
  };
  console.log(args);
  switch (args[0]) {
    case 'login':
      authorize(config, console.log.bind(console, 'login'));
      break;
    case 'fetch':
      config = { sessionID: args[1] };
      fetch(config, console.log.bind(console, 'fetched'));
      break;
    default:
      var meta = {
        login: config
      , fetch: { }
      };
      do_everything(meta, console.log.bind(console, 'EVERYTHING'));
      break;

  }

}


