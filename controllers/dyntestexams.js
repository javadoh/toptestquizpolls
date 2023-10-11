var mongoose = require('mongoose'),
ExamTestUser = mongoose.model('ExamTestUser');

//IMAGENES DE EXAMENES NECESITAN EL PACKAGE FILE SYSTEM
var fs = require('fs');

//IMPORTAR EL MODELO MONGOOSE DESDE SU CARPETA REPOSITORIA
var ExamConfuserTest = require('.././models/dyn_exam_conf_user');

//FUNCION DE ENCONTRAR TODOS LOS USUARIOS EN LA APLICACION
exports.findAll = async function(req, res){
  console.log("Entro en controllers dyntestexams.js");
  const findAllExams = await ExamConfuserTest.find({},'user_id exam_conf').catch((error) => { 
  return console.log(error);
  });
  return res.send(findAllExams);

};

//FUNCION DE ENCONTRAR EXAMENES POR USER_ID EN LA APLICACION
exports.findById = async function(req, res) {
 var id = req.params.id;
  const findExamById = await ExamConfuserTest.findOne({'user_id':id},'user_id exam_conf').catch((error) => { 
  return console.log(error);
  });
    return res.send(findExamById);
};

//FUNCION DE ACTUALIZAR DATOS DE EXAMENES EN LA APLICACION
exports.update = async function(req, res) {
//TEST CON CURL ---> $ curl -i -X PUT -H 'Content-Type: application/json' -d '{"band": "BBQ Brawlers"}' http://localhost:3001/musicians/535fe13ac688500000c2b28b
var id = req.params.id;
  var dataBody = req.body;

 /* ExamConfuserTest.update({"user_id":id}, req.body, function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d usuarios', numberAffected);
      return res.send(202);
  });*/
   const updateExamUserConf = await ExamConfuserTest.update({'user_id':id}, {$push: {'exam_conf': dataBody} }).catch((error) => { 
      return console.log(error);
    });
      console.log("Updated usuario: "+id+", con data: "+dataBody+"...... ", updateExamUserConf);
      return res.send(202);
  
};

//FUNCION DE AGREGAR EXAMENES A LA APLICACION
exports.add = async function (req, res){
//TEST CON CURL ---> curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Joe", "band": "Abita Boys", "instrument":"voice"}' http://localhost:3001/musicians

	const addExam = await ExamConfuserTest.create(req.body).catch((error) => { 
    return console.log(error);
  });
    return res.send(addExam);
};

//FUNCION DE ELIMINAR EXAMENES EN LA APLICACION POR USER_ID
exports.delete = async function(req, res) {
var id = req.params.id;
  const deleteExamByUserId = await ExamConfuserTest.remove({'user_id':id}).catch((error) => { 
    console.log(error);
    return res.send(500);
  });
    return res.send(deleteExamByUserId);
};

//FUNCION PARA ENCONTRAR EL ARRAY DE EXAMEN CON MAYOR CANTIDAD DE PREGUNTAS PARA LA SECCION DE REPORTES
exports.getMaxQuestionSizeByUser = async function(req, res) {
	var idUser = req.params.id;
	console.log("getMaxQuestionSize -> idUser: "+idUser);
const getMaxExamQuestionsForReports = await ExamConfuserTest.aggregate( [
  { $match: { "user_id": idUser }}, 
  { $group : { "_id" : "$_id" , "maxPreguntas" : { "$max" : "$exam_conf.exam_current_config.questions.id"} , "minPreguntas" : { "$min" : "$exam_conf.exam_current_config.questions.id"}}}
]).catch((error) => { 
        console.log(error);
        return res.send(500);
});
  console.log(getMaxExamQuestionsForReports);
  return res.send(getMaxExamQuestionsForReports);
};

//FUNCION QUE COPIA LAS IMAGENES RECIBIDAS EN BASE64 A LA CARPETA PREDETERMINADA DEL SERVIDOR
exports.copyExamImagesToServer = function(req, res) {
console.log("############### ENTRO EN COPYEXAMIMAGESTOSERVER ######################");
var mkdirp = require('mkdirp');
var userLogin = req.params.user;
var dataBody = req.body;
console.log("userLogin: "+userLogin+", title: "+dataBody.examtitle+",imgList64: "+dataBody.imgList64);
//CAPTURA DEL TITULO DESDE EL JSON
var examTitle = dataBody.examtitle;
//PATH PREDEFINIDO PARA CARGA DE IMAGENES DE EXAMENES INCLUYENDO EL USUARIO POR PARAMETRO


var serverImagesPath = "./../../portal/landings/topquiztestpoll/content/"+userLogin;

try{
if (!fs.existsSync(serverImagesPath)){
      //CREAMOS EL DIRECTORIO DEL USUARIO
      console.log("no existe el directorio de usuario");
      mkdirp(serverImagesPath, function (err) {
        if (err) console.error(err)
        else {console.log('directorio de usuario creado!');
}
      });

}
else{console.log("Ya existe el directorio de usuario");

serverImagesPath = serverImagesPath+"/"+examTitle;

if (!fs.existsSync(serverImagesPath)){
      //CREAMOS EL DIRECTORIO DEL USUARIO
      console.log("no existe el directorio de examen");
      mkdirp(serverImagesPath, function (err) {
        if (err) console.error(err)
        else {console.log('directorio de examen creado!');

        //RECORREMOS EL ARREGLO JSON PARA IR IMAGEN POR IMAGEN
  for(var field in dataBody.imgList64){

  //DESDE EL BODY INTENTAMOS CAPTURAR Y ESCRIBIR LAS IMAGENES
  //var base64Data = req.body.replace(/^data:image\/png;base64,/, "");
  var nombreArchivo = dataBody.imgList64[field].nombrearchivo;
  var stringEncoded = dataBody.imgList64[field].stringencoded;
  var formatoArchivo = nombreArchivo.lastIndexOf(".", +1);

  stringEncoded = stringEncoded.replace(/^data:image\/formatoArchivo;base64,/, "");

  fs.writeFile(serverImagesPath+"/"+nombreArchivo, stringEncoded, 'base64', function(err) {
    if(err) {
    console.log("Error al guardar la imágen en el servidor: ",err);
  } else {
    console.log("Imagen grabada correctamente: "+serverImagesPath+"/"+nombreArchivo);
  }
});
  }//FIN DEL LOOP FOR
}
      });
}else{console.log("Ya existe el directorio del examen.");
    //AQUI SE MANEJARIA EL TEMA DE LA EDICION DE EXAMENES Y COPIADO DE IMAGENES PARA ESOS CASOS
}
}//FIN ELSE PPAL

  }catch(err){console.log("Error general: ",err);}
};