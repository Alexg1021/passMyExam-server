let bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

let Encryption = {
  encrypt: function (secretText) {
    console.log('inside the encrypt');
    //Secret text is the new desired password
    new Promise((resolve)=>{
      bcrypt.hash(secretText, saltRounds, (err, hash)=>{
        resolve(hash);
      })
    })
  },

  check: function (secretText, hash) {
    console.log('inside the check');
    //secret text is the sent password
    //hash is the old password on user model
    let response;
    new Promise((resolve)=>{
      bcrypt.compare(secretText, hash, (err, resp)=>{

        resolve(resp);
      });
    })
  }
};

module.exports = Encryption;
