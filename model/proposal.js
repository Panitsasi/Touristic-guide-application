const mongoose = require('mongoose');

const proposal_data = new mongoose.Schema({
  title: {
    type: String
   
  },
  info: {
    type: String
   
  },
 
  kind: {
    type: String
  
  },
  site: {
    type: String
  
  },
  
  stars: {
    type: Number
  },

  image: {
    type: String
  
  },

  instagram: {
    type: String
  
  },
  facebook: {
    type: String
  
  },
  cuisine: {
    type: String
  
  },
  
  
  
},
{collection: "proposal"}
);

const Proposal = mongoose.model("Proposal",  proposal_data);
module.exports = Proposal;
