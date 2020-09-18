const mongoose = require('mongoose');

const gallery_data = new mongoose.Schema({
  
  username: {
    type: String,
    ref: 'User'
  },

  image:{
    type: String
  }

},
{collection: "gallery"}
);

const Gallery = mongoose.model("Gallery", gallery_data);
module.exports = Gallery;
