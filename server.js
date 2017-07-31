var express =  require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//Create new instance of express object to run server.js

var app = express();

mongoose.connect(config.database , function (err) {
   if(err) {
       console.log(err);
   } else {
       console.log('Successfully Connected to Database......');
   }
});

//parsing content
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

var api = require('./app/routes/api')(app,express);
app.use('/api',api);

app.get('*',function (req,res) {
    res.sendFile(__dirname + '/public/app/views/index.html');
});

app.listen(config.port,function (err) {
    if(err){
        console.log(err);
    } else {
        console.log('Listning on Port:',config.port);
    }
});