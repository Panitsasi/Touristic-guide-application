const mongoose = require('mongoose');

const review_data = new mongoose.Schema({
  
  username: {
    type: String,
    ref: 'User'
  },

  date: {
    type: String,
  },

  rating: {
    type: Number
  },

  kind: {
    type: String
  },

  comment: {
    type: String,
  },
  
  event_title: {
    type: String
      
  },
  images:{
    type: String
  },

  proposal_title: {
    type: String
      
  }

},
{collection: "review"}
);

const Review = mongoose.model("Review", review_data);
module.exports = Review;
