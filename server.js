const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");

var app = Express();

var mongoUri = 'mongodb://localhost/ll_dynamic_test';

Mongoose.connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true });
var db = Mongoose.connection;
db.on('error', function (error) {
	console.log('Error: '+error);
  throw new Error('unable to connect to database at ' + mongoUri);
});

// CONNECTION EVENTS
// When successfully connected
Mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ll_dynamic_test database');
}); 

// If the connection throws an error
Mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
Mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  Mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination to the database ll_dynamic_test'); 
    process.exit(0); 
  }); 
});

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//OBTENEMOS LOS MODELOS DE BD
require('./models/dyn_testuser');
require('./models/dyn_exam_conf_user');
require('./models/dyn_reports_by_users');

require('./routes/routes')(app);

//app.listen(app.get('port'), '0.0.0.0');
app.listen(8200);
console.log('Listening on port 8200...');