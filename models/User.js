const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, default: null, require:true},
//   last_name: { type: String, default: null },
  email: { type: String, unique: true,require:true },
  password: { type: String, require:true },
//   token: { type: String },
avatar:{type:String},
date:{type:Date, default:Date.now},
});

module.exports =User= mongoose.model("user", UserSchema);