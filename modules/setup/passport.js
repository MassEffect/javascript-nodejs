
const mongoose = require('mongoose');
const passport = require('koa-passport');
const config = require('config');
const User = require('users').User;


// auto logs in X-Test-User-Id when testing
module.exports = function(app) {

  app.use(function* cleanEmptySessionPassport(next) {
    yield next;
    if (Object.keys(this.session.passport).length === 0) {
      delete this.session.passport;
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  if (process.env.NODE_ENV == 'test') {
    app.use(testAutoLogin);
  }

};

function* testAutoLogin(next) {
  var userId = this.get('X-Test-User-Id');
  if (!userId) {
    yield next;
    return;
  }

  var user = yield User.findById(userId).exec();

  if (!user) {
    this.throw(500, "No test user " + userId);
  }

  yield this.login(user);

  yield next;
}
