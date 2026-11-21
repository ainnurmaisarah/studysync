const path = require('path');
const express = require('express');
const helmet = require('helmet');
const env = require('./config/env');

const app = express();

const clientDir = path.join(__dirname, '..', 'client');
const modulesDir = path.join(__dirname, '..', 'node_modules');

// Security headers. In development we drop "upgrade-insecure-requests",
// which can break plain-HTTP localhost in some browsers.
const cspDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();
if (env.nodeEnv !== 'production') {
  delete cspDirectives['upgrade-insecure-requests'];
}
app.use(helmet({ contentSecurityPolicy: { directives: cspDirectives } }));

// Third-party browser libraries, served straight from node_modules
app.use('/vendor/bootstrap', express.static(path.join(modulesDir, 'bootstrap', 'dist')));
app.use('/vendor/bootstrap-icons', express.static(path.join(modulesDir, 'bootstrap-icons', 'font')));
app.use('/vendor/chartjs', express.static(path.join(modulesDir, 'chart.js', 'dist')));
app.use('/vendor/fullcalendar', express.static(path.join(modulesDir, 'fullcalendar')));

// Our own frontend files
app.use('/assets', express.static(path.join(clientDir, 'assets')));
app.use('/components', express.static(path.join(clientDir, 'components')));
app.use(express.static(path.join(clientDir, 'pages'), { extensions: ['html'] }));

module.exports = app;