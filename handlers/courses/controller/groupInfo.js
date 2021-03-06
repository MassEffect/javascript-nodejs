var Course = require('../models/course');
var CourseGroup = require('../models/courseGroup');
var _ = require('lodash');

// Group info for a participant, with user instructions on how to login
exports.get = function*() {

  var group = this.locals.group = this.groupBySlug;

  if (!this.user) {
    this.throw(401);
  }

  var participantIds = _.pluck(group.participants, 'user').map(String);
  if (!~participantIds.indexOf(String(this.user._id))) {
    this.throw(403, "Вы не являетесь участником этой группы.");
  }

  this.body = this.render('groupInfo/' + group.course.slug);
};
