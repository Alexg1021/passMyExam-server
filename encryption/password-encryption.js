let bcrypt = require('bcrypt');
const saltRounds = 10;

let Encryption = {
  encrypt: function (secretText) {
    return bcrypt.hash(secretText, saltRounds).then(function(hash) {
      // Store hash in your password DB.
      return hash;
    });
  },
  check: function (secretText, hash) {
    // Load hash from your password DB.

    return bcrypt.compare(secretText, hash).then(function(res) {
      return res;
    });
  }
};

module.exports = Encryption;
