var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/apna-twitter');

var db = mongoose.connection;

// User Schema
var UserSchema = new Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	profileimage:{
		type: String
	},
	followers:[{type: Schema.ObjectId, ref:"User"}],
    following:[{type: Schema.ObjectId, ref:"User"}],
	tweets: Number

},{usePushEach: true});

module.exports = mongoose.model('User', UserSchema);

