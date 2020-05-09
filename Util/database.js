const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

let _db;

const mongoConect = callback => {
  mongoClient
    .connect(
      'mongodb+srv://node:XGeSsA5LgqKV8%23D@cluster0-zpnkm.mongodb.net/test?retryWrites=true&w=majority'
    )
    .then(client => {
      console.log('Conected to Mongodb !');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error('No database found!');
};

module.exports.mongoConect = mongoConect;
module.exports.getDb = getDb;
