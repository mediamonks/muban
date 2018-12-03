const config = require('../config/config');
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.env.production.NODE_ENV);
const detectPort = require('detect-port');
const path = require('path');
const express = require('express');
const serveIndex = require('serve-index');
const opn = require('opn');
const https = require('https');
const http = require('http');
const compression = require('compression');
const pem = require('pem');

let started = false;
function start() {
  if (started) return;
  started = true;

  module.exports = detectPort(config.devServer.port).then(port => {
    process.env.PORT = port;

    const server = express();
    const root = config.buildPath;

    // handle fallback for HTML5 history API
    // server.use(require('connect-history-api-fallback')());
    server.use(compression());

    server.use('/', express.static(root), serveIndex(root, {icons: true, view: 'details' }));

    const uri = `${config.devServer.useHttps ? 'https' : 'http'}://localhost:${port}`;

    const onServerRunning = function(err) {
      if (err) {
        console.log(err);
        return;
      }

      console.log(`Your application is running here: ${uri}`);

      if (config.devServer.autoOpenBrowser) {
        opn(uri).catch(() => {});
      }
    };

    if (config.useHttps) {
      pem.createCertificate({ days: 1, selfSigned: true }, function(err, keys) {
        if (err) {
          throw err;
        }
        https
          .createServer({ key: keys.serviceKey, cert: keys.certificate }, server)
          .listen(port, onServerRunning);
        return { server: https, key };
      });
    } else {
      http.createServer(server).listen(port, onServerRunning);
      return { server: http };
    }
  });
}

if (require.main === module) {
  start();
} else {
  module.exports = start;
}
