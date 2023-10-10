var mongoose = require('mongoose'),
Schema = mongoose.Schema;

mongoose.set('debug', true);

var ExamTestUserSchema = new Schema({
  user_id: Number,
  exam_conf: Array 
});

var ExamConfUserTest = mongoose.model('ExamTestUser', ExamTestUserSchema, 'dyn_exam_conf_user');

module.exports = ExamConfUserTest;