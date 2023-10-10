var mongoose = require('mongoose'),
ExamReport = mongoose.model('ExamReportSchema');

//IMPORTAR EL MODELO MONGOOSE DESDE SU CARPETA REPOSITORIA
var ExamReportByUser = require('.././models/dyn_reports_by_users');

//FUNCION DE ENCONTRAR TODOS LOS REPORTES EN LA APLICACION
exports.findAllExamsReports = function(req, res){
  console.log("### findAllExamsReports ###");
  ExamReportByUser.find({},'id user_ppal_id exams_created', function(err, results){
  if (err) return console.log(err);
  return res.send(results);
});

};

//FUNCION DE ENCONTRAR EXAMENES POR USER_ID DEL ENCUESTADOR O TITULAR DEL EXAMEN Y EXAM_ID EN LA APLICACION
exports.findExamReportByUserExamId = function(req, res) {
 var userPpalId = req.query.idUserPpal;
 var examDesignId = req.query.idExamDesign;
 
 console.log("UserPpalId: "+userPpalId+", exams_created: {$elemMatch : {exam_design_id: }: "+examDesignId);
//'exams_created.exam_design_id':examDesignId
  //ExamReportByUser.find({'user_ppal_id':userPpalId,'exams_created': {$elemMatch:{'exam_design_id': {$eq:examDesignId}}}},'id user_ppal_id exams_created',function(err, result) {
  ExamReportByUser.findOne({'user_ppal_id':userPpalId},{'exams_created': {$elemMatch:{'exam_design_id': examDesignId}}},'id user_ppal_id exams_created',function(err, result) {
  if (err) return console.log(err);
    return res.send(result);
  });
};

//FUNCION DE BUSQUEDA DE TODOS LOS EXAMENES Y REPORTES POR USUARIO ENCUESTADOR O TITULAR DEL EXAMEN
exports.findExamReportByUser = function(req, res) {
 var userPpalId = req.query.userppalid;
 
  ExamReportByUser.findOne({'user_ppal_id':userPpalId},'id user_ppal_id exam_design_id user_submitted_exam',function(err, result) {
  if (err) return console.log(err);
    return res.send(result);
  });
};

//FUNCION DE AGREGAR EXAMENES A LA APLICACION
exports.addExamReport = function (req, res){
//TEST CON CURL ---> curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Joe", "band": "Abita Boys", "instrument":"voice"}' http://localhost:3001/musicians
	ExamReportByUser.create(req.body, function (err, result) {
    if (err) return console.log(err);
    return res.send(result);
  });
  
};

//FUNCION DE AGREGAR EXAMENES A LA APLICACION
exports.updateExamReport = function (req, res){

var idUser = req.query.idUser;
var idExam = req.query.idExam;
var dataBody = req.body;
var dataBodyStringify = JSON.stringify(dataBody);
var pushStringTag = '';
var flagExisteUsuario = false;

  console.log("################ ENTRAMOS EN UPDATE EXAM REPORT #####################")
  console.log("idUser: "+idUser+", idExam:"+idExam);

//BUSCAMOS PRE-EXISTENCIA DEL USUARIO CREADOR DE EXAMENES
ExamReportByUser.find({'user_ppal_id':idUser}, 'id user_ppal_id exam_design_id user_submitted_exam',function(err, result) {
  if (err) {return console.log(err);}
  else{
    if(result.length > 0){//EXISTE EL USUARIO
      console.log("###### EXISTE EL USUARIO #######");


      //BUSCAMOS PRE-EXISTENCIA DEL EXAMEN
    ExamReportByUser.find({'user_ppal_id':idUser}, {'exams_created': {$elemMatch:{'exam_design_id': idExam}}}, 'id user_ppal_id exam_design_id user_submitted_exam',function(err, result) {
    if (err) {return console.log(err);}
      else{
        if(result.length > 0){//EXISTE EL EXAMEN
          console.log("###### EXISTE EL EXAMEN #######");
          try{
  
             console.log(dataBody);
             ExamReportByUser.update({'user_ppal_id':idUser},{'exams_created': {$elemMatch:{'exam_design_id': idExam}}}, {$push: {'user_submitted_exam': dataBody} }, function (err, numberAffected) {
                if (err) return console.log(err);
                console.log("Updated reportes en examen número: "+idExam);
                return res.send(202);
            });
            
            }catch(err){console.log(err);
            return res.send(500);}

 
          }else{//NO EXISTE EL EXAMEN 
          console.log("###### NO EXISTE EL EXAMEN #######");
          dataBodyStringify = "\"exams_created\": [{\"exam_design_id\":"+idExam+", \"user_submitted_exam\":["+dataBodyStringify+"]}]";
          
          console.log(dataBodyStringify);
          dataBody = JSON.parse(dataBodyStringify);

           try{
  
             ExamReportByUser.update({'user_ppal_id':idUser}, {$push: dataBody }, function (err, numberAffected) {
                if (err) return console.log(err);
                console.log("Updated reportes en examen número: "+idExam);
                return res.send(202);
            });
            
            }catch(err){console.log(err);
            return res.send(500);}

            }
      }
      });
      

    }else{//NO EXISTE EL USUARIO
     console.log("###### NO EXISTE EL USUARIO #######");
     dataBodyStringify = "{\"_id\":"+idUser+", \"id\":"+idUser+", \"user_ppal_id\":"+idUser+", \"exams_created\": [{\"exam_design_id\":"+idExam+", \"user_submitted_exam\":["+dataBodyStringify+"]}]}"; 
     
     console.log(dataBodyStringify);
     try{
             dataBody = JSON.parse(dataBodyStringify);
             console.log("Data cambiada:"+dataBody);

             // SE CREA EL USUARIO EN LA TABLA DE REPORTES JUNTO CON LA DATA ADJUNTA
             ExamReportByUser.create(dataBody, function (err, result) {
                  if (err) return console.log(err);
                  return res.send(result);
             });
             /*ExamReportByUser.update({'user_ppal_id':idUser}, {$push: dataBody}, function (err, numberAffected) {
                if (err) return console.log(err);
                console.log("Updated reportes en examen número: "+idExam);
                return res.send(202);
            });*/
            
            }catch(err){console.log(err);
            return res.send(500);}

    }
  }
  });
    
    /*if(flagExisteUsuario){ // SOLO SI EXISTE EL USUARIO ENTRA EN ESTE BLOQUE

    //BUSCAMOS PRE-EXISTENCIA DEL EXAMEN
    ExamReportByUser.find({'user_ppal_id':idUser}, {'exams_created': {$elemMatch:{'exam_design_id': idExam}}}, 'id user_ppal_id exam_design_id user_submitted_exam',function(err, result) {
    if (err) {return console.log(err);}
      else{
        if(result.length > 0){//EXISTE EL EXAMEN
          console.log("###### EXISTE EL EXAMEN #######");
          try{
  
             ExamReportByUser.update({'user_ppal_id':idUser},{'exams_created': {$elemMatch:{'exam_design_id': idExam}}}, {$push: {'exams_created.user_submitted_exam': dataBody} }, function (err, numberAffected) {
                if (err) return console.log(err);
                console.log("Updated reportes en examen número: "+idExam);
                return res.send(202);
            });
            
            }catch(err){console.log(err);
            return res.send(500);}

 
          }else{//NO EXISTE EL EXAMEN 
          console.log("###### NO EXISTE EL EXAMEN #######");
          dataBodyStringify = "\"exams_created\": [{\"exam_design_id\":"+idExam+", \"user_submitted_exam\":["+dataBodyStringify+"]}]";
          
          console.log(dataBodyStringify);
          dataBody = JSON.parse(dataBodyStringify);

           try{
  
             ExamReportByUser.update({'user_ppal_id':idUser}, {$push: dataBody }, function (err, numberAffected) {
                if (err) return console.log(err);
                console.log("Updated reportes en examen número: "+idExam);
                return res.send(202);
            });
            
            }catch(err){console.log(err);
            return res.send(500);}

            }
      }
      });

}//FIN EXISTE EL USUARIO EN LA TABLA DE REPORTES
*/
};


//FUNCION DE ELIMINAR EXAMENES EN LA APLICACION POR USER_ID
exports.delete = function(req, res) {
var id = req.params.id;
  ExamReportByUser.remove({'user_id':id},function(result) {
    return res.send(result);
  });
};