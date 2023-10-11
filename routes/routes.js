module.exports = function(app){
	//USUARIOS
    app.set('port', process.env.PORT || 8200);
    var dyntestusers = require('.././controllers/dyntestusers');
    app.get('/dyntestusers/getAll', dyntestusers.findAll);
    app.get('/dyntestusers/getUser/:id', dyntestusers.findById);
	app.get('/dyntestusers/loginUser', dyntestusers.login);
	app.get('/dyntestusers/getLastUser', dyntestusers.findLastUserId);
    app.post('/dyntestusers/newUser', dyntestusers.add);
    app.put('/dyntestusers/updateUser/:id', dyntestusers.update);
    app.delete('/dyntestusers/deleteUser/:id', dyntestusers.delete);

    app.get('/dyntestusers/forgotPassHelp/:email', dyntestusers.findUserForgotPassword);
    app.put('/dyntestusers/userChangePass/:user_id', dyntestusers.updatePasswords);
	//EXAMENES
	var dyntestexams = require('.././controllers/dyntestexams');
    app.get('/dyntestexams/getAll', dyntestexams.findAll);
    app.get('/dyntestexams/getExam/:id', dyntestexams.findById);
    app.post('/dyntestexams/newExam', dyntestexams.add);
    app.put('/dyntestexams/updateExam/:id', dyntestexams.update);
    app.delete('/dyntestexams/deleteExam/:id', dyntestexams.delete);
	app.get('/dyntestexams/getMaxQuestionSizeByUser/:id', dyntestexams.getMaxQuestionSizeByUser);
    app.put('/dyntestexams/copyExamImagesToServer/:user', dyntestexams.copyExamImagesToServer);
	//REPORTES
	var dyntestreports = require('.././controllers/dyntestreports');
    app.get('/dyntestreports/getAllReports', dyntestreports.findAllExamsReports);
    app.get('/dyntestreports/getAllExamReportByUser/:id', dyntestreports.findExamReportByUser);
    app.get('/dyntestreports/getExamReport', dyntestreports.findExamReportByUserExamId);
    app.post('/dyntestreports/newExamReport', dyntestreports.addExamReport);
    app.put('/dyntestreports/updateExamReport', dyntestreports.updateExamReport);
}