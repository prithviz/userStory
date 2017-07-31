var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//storySchema
var StorySchema = new Schema({

    creator : { type : Schema.Types.ObjectId , ref: 'User' },
    content : String,
    created : { type: Date , defalt : Date.now }
});

module.exports = mongoose.model('Story',StorySchema); //module to be exported
