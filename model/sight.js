const mongoose = require('mongoose');

const sight_data = new mongoose.Schema({

  type_of_sight:{
    type: String
  },

  title: {
    type: String
   
  },
  info: {
    type: String
   
  },
  map: {
    type: String
   
    
  },
  video: {
    type: String
  
  },
  image1: {
    type: String

  },
  image2: {
    type: String

  },
  image3: {
    type: String

  }
  
},
  {collection: "sight"}
  
);

const Sight = mongoose.model("Sight", sight_data);
module.exports = Sight;
