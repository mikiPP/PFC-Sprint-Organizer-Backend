const { getDb } = require('../Util/database');

class Company {
  constructor(name) {
    this.name = name;
  }

  save() {
    const db = getDb();
    return db
      .collection('Company')
      .insertOne(this)
      .then(result => console.log(result))
      .catch(err => console.error(err));
  }
}

module.exports = Company;
