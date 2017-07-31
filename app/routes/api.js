var User = require('../models/user'); //importing user.js
var config = require('../../config'); //importing config.js
var secretKey = config.secretKey; // accessing secretKey from config.js
var jsonwebtoken = require('jsonwebtoken'); // Json Token library
var StoryScema = require('../../app/models/story'); //importing StorySchema


function  createToken(user) {
    var token = jsonwebtoken.sign({
        id : user._id,
        name : user.name,
        username : user.username
    },secretKey,{
        expiresIn : 60*60*24 //token will expire in 24 hours
    });
    return token;
}


module.exports = function (app,express) {
    var api = express.Router();

    //post request signup new user
    api.post('/signup/', function (req,res) {
        var user = new User({
            name : req.body.name,
            username : req.body.username,
            password : req.body.password
        });

        user.save(function (err) {
            if(err){
                res.send(err);
                return;
            }
            res.json({message: 'User has been created !!!'});
        })
    });

    //get request api for fetch all users
    api.get('/users', function (req,res) {
        User.find({},function (err,users) {
           if(err) {
               res.send(err);
               return;
           }
           res.json(users);
        });
    });

    //post request api to login with tokens
    api.post('/login',function (req,res) {

        //to find specific (user) object
        User.findOne({
            username : req.body.username
        }).select('password').exec(function (err,user) {

            if(err) throw err;
            if(!user) {
                res.send({message:"User does not Exist.."});
            }
            else if(user) {

                var validPassword = user.comparePassword(req.body.password);

                if (!validPassword) {
                    res.send({message: "Invalid Password"});
                } else {
                    // TOKEN it will return token
                    var token = createToken(user);
                    res.json({
                        success : true,
                        message : "Successfuly loged in !!",
                        token : token
                    });
                }
            }
        });
    });
    //custom middleware to check every HTTP requests for login
    api.use(function (req,res,next) {
        console.log("Somebody visited app");
        //check request(header's content) for token
        var token = req.body.token || req.params.token || req.header('x-access-token');
        if(token) {
            jsonwebtoken.verify(token,secretKey,function (err , decoded) {

                if(err){
                    res.status(403).send({ success : false , message : "Failed To Authenticate User"});
                } else {
                    // successfully authenticated
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else {
            res.status(403).send({ success : false , message : "No Token Provided" });
        }
    });

    // Desination B //to go through provide legitimate token
    //get request api to get stories
    api.route('/')
        .post(function (req ,res) {
            var story = new StoryScema({

                creator : req.decoded.id, //current user's decoded data
                content : req.body.content //Content of user story
            });
            story.save(function (err) {
               if(err) {
                   res.send(err);
                   return
               }
               res.json({ message : "New Story Created" });
            });
        })

        .get(function (req,res) {
            StoryScema.find({creator : req.decoded.id}, function (err , stories) {

                if(err) {
                    res.send(err);
                    return;
                }
                res.json(stories);
            })
    });

    //api to Authenticate user for angular(GUI/FrontEnd)

    api.get('/me',function (req,res) {
        res.json(req.decoded);
    });

    return api;
};
