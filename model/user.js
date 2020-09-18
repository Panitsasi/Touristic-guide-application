const mongoose = require('mongoose');

const user_data = new mongoose.Schema(
  {
  
    username: {
      type: String,
      required: true,
      
    },
    email: {
      type: String,
      required: true
         
    },
    password: {
      type: String,
      required: true
    }

  },
  {collection: "user"}
  
  );

const User = mongoose.model("User", user_data);
module.exports = User;
