// pulling down all dependencies...
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var esl = require('modesl');


// globals....
global.fs_cli_payload="empty";
var str = "empty";
global.timer = false;

//init a an express object...
var app = express();

//the database....
mongoose.connect(config.database, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('Connected to the database');
	}
});  



//middlewares...
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));





//The routes...
app.get('/',function(req,res){
	res.sendFile(__dirname + '/public/app/views/index.html');
});

//route: create user
app.get('/create-user',function(req,res){
	res.sendFile(__dirname + '/public/app/views/createUser.html');
});

//route: for testing
app.get('/test',function(req,res){
	res.sendFile(__dirname + '/public/app/views/test.html');
});

//route: testing commands on ESL FS via AJAX, not visible to users...
app.get('/api/test/:arg?',function(req,res){
	//TODO: implement the ESL feature....
	var arg = req.params.arg;
	conn = new esl.Connection(config.FS_SERVER_IP,config.fs_esl_port,config.fs_esl_user,function(){ conn_callback(conn,arg,res);}); 
});

	
//route: default...
app.get('*',function(req,res){
	res.send("TODO: need to work on those... :P");
});


// this method is use as callback for the ESL events from freeswitch...
function conn_callback(eslConnection,command,response){
	eslConnection.api(command,function(res){console.log(res.getBody()); response.send(res.getBody()); });
}




// running the server...
app.listen(config.port,function(err){
	if(err){
		console.log(err);
	}else{
		console.log("Phonix web api is listening on port: " + config.port);
	}
});