console.log('##### LLEGO A CONTROLLER #####');

var mongoose = require('mongoose'),
UserTest = mongoose.model('UserTest');

var UserTest = require('.././models/dyn_testuser');
mongoose.set('debug', true);

exports.findAll = async function(req, res){
  
  console.log('##### FIND ALL #####');
  const findAllUsers = await UserTest.find({},'user_id user_rut user_name user_lastname user_email user_login user_password user_secondary_password').catch((error) => { 
    console.log(error);
    throw error;
  });
  console.log(findAllUsers);
  return res.send(findAllUsers);
};

//FUNCION DE ENCONTRAR USUARIOS EN LA APLICACION
exports.findById = async function(req, res) {

  console.log('##### FIND BY ID #####');
 var id = req.params.id;
  const findUserById = await UserTest.findOne({'user_id':id},'user_id user_rut user_name user_lastname user_login user_password user_email user_secondary_password').catch((error) => { 
    console.log(error);
  throw error;
  });
    return res.send(findUserById);
};

//FUNCION DE LOGIN
exports.login = async function(req, res) {

  console.log('##### LOGIN #####');
 var user_login = req.query.user_login;
 var user_password = req.query.user_password;
 
  const loginAttempt = await UserTest.findOne({$and: [{'user_login':user_login },{$or: [{'user_password':user_password}, {'user_secondary_password':user_password}]}]},'user_id user_rut user_name user_lastname user_login user_password user_email user_secondary_password').catch((error) => { 
    console.log(error);
	return res.send(error);
  });
    return res.send(loginAttempt);
};

//FUNCION DE ACTUALIZAR DATOS DE USUARIOS EN LA APLICACION
exports.update = async function(req, res) {
//TEST CON CURL ---> $ curl -i -X PUT -H 'Content-Type: application/json' -d '{"band": "BBQ Brawlers"}' http://localhost:3001/musicians/535fe13ac688500000c2b28b

var id = req.params.id;
  var updates = req.body;

  const updateUser = await UserTest.update({"user_id":id}, req.body).catch((error) => { 
		console.log(error);
		return res.send(error);
  });
		  
      console.log('Updated %d usuarios', updateUser);
      return res.send(202);
};

//FUNCION DE ENCONTRAR ULTIMO USUARIO EN LA APLICACION
exports.findLastUserId = async function (req, res){
	
	const findLastUserId = await UserTest.findOne({$query:{},$orderby:{_id:-1}}, 'user_id user_rut user_name user_lastname user_login user_password user_email user_secondary_password').catch((error) => {
	
	console.log(error);
	return res.send(error);
  });
  return res.send(findLastUserId);
  }


//FUNCION DE AGREGAR USUARIOS A LA APLICACION
exports.add = async function (req, res){
//TEST CON CURL ---> curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Joe", "band": "Abita Boys", "instrument":"voice"}' http://localhost:3001/musicians
	
	const addUser = await UserTest.create(req.body).catch((error) => {
		console.log(error);
    if (error.name === 'MongoError' && error.code === 11000) {
      // Duplicate username
      return res.status(500).send('El email o el login del usuario ya existe, por favor escoge otro.');
    }
    // Some other error
    return res.status(500).send('El email o el login del usuario ya existe, por favor escoge otro.');
    });

    return res.send(addUser);
  
    };

//FUNCION DE ELIMINAR USUARIOS EN LA APLICACION POR USER_ID
exports.delete = async function(req, res) {
var id = req.params.id;
  const deleteUser = await UserTest.remove({'user_id':id}).catch((error) => {
    console.log(error);
    return res.send(500);
    
  });
  return res.send(deleteUser);
};

//FUNCION DE AYUDA PARA ENVIAR PASSWORD A EMAIL
exports.findUserForgotPassword = async function(req, res) {

  console.log('# FIND USER FORGOT PASSWORD #');
 var email = req.params.email;
 var prefixEmailDivision = email.indexOf("@");
 email = email.substring(0, prefixEmailDivision);
 console.log("Email: " +email);
    const findUserForgotPassword = await UserTest.findOne({$text: {$search: email}},'user_id user_rut user_name user_lastname user_login user_password user_email user_secondary_password').catch((error) => { 
	  console.log(error);
		return res.send(error);

  });
    return res.send(findUserForgotPassword);
};

//FUNCION DE CAMBIO DE PASSWORDS EN SESION
exports.updatePasswords = async function(req, res) {

  console.log('# UPDATE PASSWORDS #');
  var user = req.params.user_id;
  var dataBody = req.body;

   const updatePasswords = await UserTest.update({'user_id':user_id}, {$push: {'user_password': dataBody.user_password, 'user_secondary_password': dataBody.user_secondary_password}}).catch((error) => {
      console.log(error);
      return res.send(500);
  });
  console.log("Se actualizaron los passwords del usuario: "+user, numberAffected);
      return res.send(202);
};