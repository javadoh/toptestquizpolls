var mongoose = require('mongoose'),
Schema = mongoose.Schema;

mongoose.set('debug', true);

var ExamsCreatedSchema = new Schema({
exam_design_id: Number, 
user_submitted_exam: Array 
});

var ExamReportSchema = new Schema({
  _id: Number, 
  id: Number, 
  user_ppal_id: Number, 
  exams_created: [ExamsCreatedSchema] 
});

var ExamReportByUser = mongoose.model('ExamReportSchema', ExamReportSchema, 'dyn_reports_by_users');

module.exports = ExamReportByUser;