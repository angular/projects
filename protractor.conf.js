var config = require('./protractor-shared.conf').config;

config.seleniumAddress = 'http://localhost:4444/wd/hub';
config.capabilities = {
  browserName: 'chrome',
};

exports.config = config;