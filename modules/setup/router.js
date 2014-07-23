'use strict';

var mount = require('koa-mount');
var payment = require('payment');
var compose = require('koa-compose');

module.exports = function(app) {


  app.use(mount('/', require('frontpage').middleware));

  if (process.env.NODE_ENV == 'development') {
    app.use(mount('/markup', require('markup').middleware));
  }

  // need to compose, because mount takes only 1 middleware
  app.use(mount('/getpdf', compose([payment.middleware, require('getpdf').middleware])));

  app.use(mount('/webmoney', compose([payment.middleware, require('webmoney').middleware])));
  app.csrf.addIgnorePath('/webmoney/:any*');
  app.verboseLogger.addPath('/webmoney/:any*');

  app.use(mount('/yandexmoney', compose([payment.middleware, require('yandexmoney').middleware])));
  app.csrf.addIgnorePath('/yandexmoney/:any*');
  app.verboseLogger.addPath('/yandexmoney/:any*');

  app.use(mount('/payanyway', compose([payment.middleware, require('payanyway').middleware])));
  app.csrf.addIgnorePath('/payanyway/:any*');
  app.verboseLogger.addPath('/payanyway/:any*');

  app.use(mount('/paypal', compose([payment.middleware, require('paypal').middleware])));
  app.csrf.addIgnorePath('/paypal/:any*');
  app.verboseLogger.addPath('/paypal/:any*');

  // stick to bottom to detect any not-yet-processed /:slug
  app.use(mount('/', require('tutorial').middleware));

  // by default if the router didn't find anything => it yields to next middleware
  // so I throw error here manually
  app.use(function* (next) {
    this.throw(404);
  });

};
