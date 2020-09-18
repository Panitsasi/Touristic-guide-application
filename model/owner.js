const mongoose = require('mongoose');

const owner_data = new mongoose.Schema(
  {
  
    username: {
      type: String,
      required: true,
      
    },
    email: {
      type: String,
      required: true
         
    },
    title: {
        type: String,
        required: true,
        
      },

    info: {

        type: String,
        required: true
           
      },

    cuisine: {
        type: String,
        required: true,
        
    },
    image: {

        type: String,
        required: true
           
      },

    instagram: {
        type: String,
        required: true,
        
      },

      facebook: {
        type: String,
        required: true
           
      },

      stars: {
        type: Number
      },

      site: {
        type: String,
        required: true,
        
      },
    

    password: {
      type: String,
      required: true
    }

  },
  {collection: "owner"}
  
  );

const Owner = mongoose.model("Owner", owner_data);
module.exports = Owner;
