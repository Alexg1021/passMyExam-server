let bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

let Encryption = {
  encrypt: function (secretText) {
    return bcrypt.hash(secretText, saltRounds).then(function(hash) {
      console.log(hash);
      // Store hash in your password DB.
      return hash;
    });
  },
  check: function (secretText, hash) {
    // Load hash from your password DB.

    return bcrypt.compare(secretText, hash)
        .then((res)=>{
          console.log('the res', res);
          return res;

        }, (err)=>{
          console.log('the err', err);
        });
  }
};

module.exports = Encryption;
