var config = {
    "database" : "mongodb://root:tony@ds139942.mlab.com:39942/user_story_node", //databaseURI
    "port" : process.env.PORT || 3000, //port
    "secretKey" : "D33PL3ARNING" //secret for token
};

module.exports = config;
