var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var Order = require('./order');
var TransactionLog = require('./transactionLog');

/**
 * Transaction is an actual payment attempt (successful or not) for something
 * - Order may exist without any transactions (pay later)
 * - Transaction has it's own separate number (payment attempt)
 * - Transaction amount can be different from order amount (partial payment)
 * - Every transaction save generates a log record
 * @type {Schema}
 */
var schema = new Schema({
  order:         {
    type: Schema.Types.ObjectId,
    ref:  'Order'
  },
  amount:        {
    type:     Number,
    required: true
  },
  module:        {
    type:     String,
    required: true
  },
  created:       {
    type:    Date,
    default: Date.now
  },
  status:        {
    type: String
  },
  statusMessage: {
    type: String
  }
});

schema.plugin(autoIncrement.plugin, {model: 'Transaction', field: 'number'});

schema.statics.STATUS_SUCCESS = 'success';
schema.statics.STATUS_PENDING = 'pending';
schema.statics.STATUS_FAIL = 'fail';

// autoupdate order to SUCCESS when succeeded
schema.pre('save', function(next) {
  if (this.status == Transaction.STATUS_SUCCESS) {
    var orderId = this.order._id || this.order;
    Order.findByIdAndUpdate(orderId, {status: Transaction.STATUS_SUCCESS}, next);
  } else {
    next();
  }
});

// autolog all changes
schema.pre('save', function(next) {

  var log = new TransactionLog({
    transaction: this._id,
    event:       'save',
    data:        {
      status:        this.status,
      statusMessage: this.statusMessage,
      amount:        this.amount
    }
  });

  log.save(function(err, doc) {
    next(err);
  });
});

schema.methods.getStatusDescription = function() {
  if (this.status == Transaction.STATUS_SUCCESS) {
    return 'оплата прошла успешно';
  }
  if (this.status == Transaction.STATUS_PENDING) {
    return 'оплата ожидается';
  }

  if (this.status == Transaction.STATUS_FAIL) {
    var result = 'оплата не прошла';
    if (this.statusMessage) result += ': ' + this.statusMessage;
    return result;
  }

  if (!this.status) {
    return 'нет информации об оплате';
  }

  throw new Error("неподдерживаемый статус транзакции");
};

// log anything related to the transaction
schema.methods.log = function*(options) {
  options.transaction = this._id;

  // for complex objects -> prior to logging make them simple (must be jsonable)
  // e.g for HTTP response (HTTP.IncomingMessage)
  if (options.data && typeof options.data == 'object') {
    // object keys may not contain "." in mongodb, so I may not store arbitrary objects
    // only json can help
    options.data = JSON.stringify(options.data);
  }

//  console.log(options);

  var log = new TransactionLog(options);
  yield log.persist();
};

/* jshint -W003 */
var Transaction = module.exports = mongoose.model('Transaction', schema);

