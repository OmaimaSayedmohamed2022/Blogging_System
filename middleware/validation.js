
const validator = require('validator');

function validateEmail(email) {
  return validator.isEmail(email);
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  return passwordRegex.test(password);
}

function validateString(data) {
  return typeof data === 'string';
}

function validateType(type){
  const validTypes = ['like', 'dislike', 'love','care']
  return validTypes.includes(type);
}

module.exports = {
    validateEmail,
    validatePassword,
    validateString,
    validateType
 
  };