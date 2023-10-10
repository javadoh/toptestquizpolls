var mongoose = require('mongoose'), 
Schema = mongoose.Schema;

mongoose.set('debug', true);

var UserTest = new Schema({
  //user_id: { type: Schema.Types.Number, max: 10 },
  user_id: Number, 
  user_rut: String,
  user_name: String, 
  user_lastname: String, 
  user_email: String, 
  user_login: String,  
  user_password: String, 
  user_secondary_password: String 
});

var UserTest = mongoose.model('UserTest', UserTest, 'dyn_testuser');

module.exports = UserTest;