console.log('##### LLEGO A CONTROLLER #####');

var mongoose = require('mongoose'),
UserTest = mongoose.model('UserTest');

var UserTest = require('.././models/dyn_testuser');
mongoose.set('debug', true);

exports.findAll = function(req, res){
  
  console.log('##### FIND ALL #####');
  UserTest.find({},'user_id user_rut user_name user_lastname user_email user_login user_password user_secondary_password',function(err, results){
  
  if (err) {throw err;
    console.log(err);
	return res.send(err);}
  
  console.log(results);
  return res.send(results);
});

};

//FUNCION DE ENCONTRAR USUARIOS EN LA APLICACION
exports.findById = function(req, res) {

  console.log('##### FIND BY ID #####');
 var id = req.params.id;
  UserTest.findOne({'user_id':id},'user_id user_rut user_name user_lastname user_login user_password user_email user_secondary_password',function(err, result) {
  
  if (err) {throw err;
    console.log(err);}
    return res.send(result);
  });
};

//FUNCION DE LOGIN
exports.login = function(req, res) {

  console.log('##### LOGIN #####');
 var user_login = req.query.user_login;
 var user_password = req.query.user_password;
 
  UserTest.findOne({$and: [{'user_login':user_login },{$or: [{'user_password':user_password}, {'user_secondary_password':user_password}]}]},'user_id user_rut user_name user_lastname user_login user_password user_email user_secondary_password',function(err, result) {
  if (err) {
    console.log(err);//throw err;
	return res.send(err);
	}
    return res.send(result);
  });
};

//FUNCION DE ACTUALIZAR DATOS DE USUARIOS EN LA APLICACION
exports.update = function(req, res) {
//TEST CON CURL ---> $ curl -i -X PUT -H 'Content-Type: application/json' -d '{"band": "BBQ Brawlers"}' http://localhost:3001/musicians/535fe13ac688500000c2b28b

var id = req.params.id;
  var updates = req.body;

  UserTest.update({"user_id":id}, req.body, function (err, numberAffected) {
      if (err) {
		console.log(err);
		return res.send(err);
	  }
		  
      console.log('Updated %d usuarios', numberAffected);
      return res.send(202);
  });
};

//FUNCION DE ENCONTRAR ULTIMO USUARIO EN LA APLICACION
exports.findLastUserId = function (req, res){
	
	UserTest.findOne({$query:{},$orderby:{_id:-1}}, 'user_id user_rut user_name user_lastname user_login user_password user_email user_secondary_password',function(err, result) { 
	
	if (err) {
	console.log(err);
	return res.send(err);
	}
    return res.send(result);
	
	});
}


//FUNCION DE AGREGAR USUARIOS A LA APLICACION
exports.add = function (req, res){
//TEST CON CURL ---> curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Joe", "band": "Abita Boys", "instrument":"voice"}' http://localhost:3001/musicians
	
	UserTest.create(req.body, function (err, result) {
		var message;
    if (err) {
		console.log(err);
	
		
		if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate username
        return res.status(500).send('El email o el login del usuario ya existe, por favor escoge otro.');
      }

      // Some other error
      return res.status(500).send('El email o el login del usuario ya existe, por favor escoge otro.');
	}
    return res.send(result);
  });
  
};

//FUNCION DE ELIMINAR USUARIOS EN LA APLICACION POR USER_ID
exports.delete = function(req, res) {
var id = req.params.id;
  UserTest.remove({'user_id':id},function(result) {
    return res.send(result);
  });
};

//FUNCION DE AYUDA PARA ENVIAR PASSWORD A EMAIL
exports.findUserForgotPassword = function(req, res) {

  console.log('# FIND USER FORGOT PASSWORD #');
 var email = req.params.email;
 var prefixEmailDivision = email.indexOf("@");
 email = email.substring(0, prefixEmailDivision);
 console.log("Email: " +email);
    UserTest.findOne({$text: {$search: email}},'user_id user_rut user_name user_lastname user_login user_password user_email user_secondary_password', function(err, result) {

  if (err) {
	  console.log(err);
		return res.send(err);
    }
    return res.send(result);
  });
};

//FUNCION DE CAMBIO DE PASSWORDS EN SESION
exports.updatePasswords = function(req, res) {

  console.log('# UPDATE PASSWORDS #');
  var user = req.params.user_id;
  var dataBody = req.body;
  
  try{
   UserTest.update({'user_id':user_id}, {$push: {'user_password': dataBody.user_password, 'user_secondary_password': dataBody.user_secondary_password}}, function (err, numberAffected) {
      if (err) return console.log(err);
      console.log("Se actualizaron los passwords del usuario: "+user, numberAffected);
      return res.send(202);
  });
  }catch(err){console.log(err);}
};