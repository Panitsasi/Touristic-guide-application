//load all models existing in the mongo db
//model about the proposals (coffee,glyko,faghto,diamonh,poto)
const Proposal = require('./proposal.js');
//model about the reviews (with images and comments)
const Review = require('./review.js');
//model about sights
const Sight = require('./sight.js');
//model about the user accounts
const User = require('./user.js');
//model about the owner accounts and their business
const Owner = require('./owner.js');
//model about the collection of uploaded images from carnival page 
const Gallery = require('./gallery.js');

//require mongoose to communicate with the db
const mongoose = require('mongoose');

//url for connection to the mongodb
const uri = "mongodb+srv://web:XXXX@cluster0-c4jof.mongodb.net/project?retryWrites=true&w=majority";

//connect to mongo
mongoose.connect(uri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true  
}).then(() => {console.log('MongoDB Connected' )}).catch(err => console.log(err));


// FUNCTIONS 

//signup function
exports.signup=function(user,callback){
  
  //find existing accounts
  User.find({ $or:[{'username': user.username},{'email':user.email}]}, function (err, data_from_database) {
        
    if (err) callback(err, null);

      let user_data=data_from_database;
      if(user_data.length!=0){
        callback(err, null)
        }

      else{

        //save the new user 
        let new_user = {username:user.username,email:user.email,password:user.password};
        var fuser= new User(new_user);
        
        fuser.save(function (err, safe) {

            if (err) return console.error(err);
            console.log( "Saved to database .");

            callback(null,safe)
          });
      }
  });
}

//find a username in db
exports.findUsername = function (username_info, callback) {
    
  User.find({ username: username_info }, (err, data) => {

      //in case of error call callback
      if (err) {
          callback(err, null)
      }
      else{
          callback(null,data)
      }
  })
}

//find user in db
exports.findUser = function (data, callback) {
  
  User.find({$and:[{ username:data.username},{password:data.password}]},(err, data) => {
      //in case of an error return callback
      if (err) callback(err, null)
      else callback(null,data)
  })
  
}


// exports.deleteUser = function (username, callback) {
  
//   User.deleteOne({username:username},(err, data) => {
//      //in case of an error return callback
//       if (err) callback(err, null)
//       console.log('Deleted')
     
//   })
  
// }


// exports.updateUser=function (username,password, callback) {
  
//   User.updateOne({username:username},{ $set: {password: password, } },(err, data) => {
//      //in case of an error return callback
//       if (err) callback(err, null)
//       console.log('Updated')
//   })
  
// }



//return Users from db
exports.returnUsers=function (callback) {
  
  User.find({},(err, users) => {
      //in case of an error return callback
      if (err) callback(err, null)
      else callback(null,users);
  })
  
}

//review handling function
exports.review=function(review,files,kind,username_for_navbar,callback){

  //get the date of review posting in the form DD/MM/YYYY
  let date = new Date();
  let day=date.getDate();
  let year=date.getFullYear();
  let month=date.getMonth()+1;
  let date_full=day+"-"+month+"-"+year;

  //check that the user is logged in
  if ( typeof username_for_navbar !== 'undefined' && username_for_navbar && review.comment)
  {
    //save the review/comment
    let new_review = {username:username_for_navbar, date:date_full, kind:kind, comment:review.comment, proposal_title: review.proposal_title};
    console.log(new_review.username);
  
    //creation of a new document Review in db collection
    var freview= new Review(new_review);
    freview.save(function (err, safe) {
        if (err) return console.error(err);
        console.log( "Saved to database.");
      });

    //initialization of a subpath
    let str = "images/";

    //for all the images uploaded in the review
    for (const image in files){
      
      //create the right path of the image
      let mystr2 = files[image].destination.concat(files[image].filename);
      gallery_image = str.concat(files[image].filename);

      //save the image urls to the gallery collection
      //the urls will be inserted src="" to load the images and display them in our app
      let new_gallery= {username:username_for_navbar, image:gallery_image};
    
      var fgallery= new Gallery(new_gallery);
      fgallery.save(function (err, safe) {
          if (err) return console.error(err);
          console.log( "Saved to database.");
        });
      }
    }
  else
  {
    console.log('Σφάλμα δημοσίευσης της αξιολόγησης σας.');
    console.log('1. Βεβαιωθείτε ότι έχετε κάνει σύνδεση πριν προχωρήσετε σε προσθήκη αξιολόγησης.');
    console.log('2. Βεβαιωθείτε ότι δεν αφήσατε κενή την αξιολόγηση και επαναλάβετε.');

  }
  
}

//return the images from the gallery and the usernames of the users that posted them
exports.returnGallery=function (callback) {
  
  //find all images in Gallery
  Gallery.find((err, review) => {
      //In case of an error return callback
      if (err) callback(err, null)
      else callback(null,review);
  })
}

//return reviews based in the kind (carnival,diamonh,poto,faghto,coffee, glyko)
exports.returnReview=function (kind,callback) {
  
  Review.find({kind:kind},(err, review) => {
      //In case of an error return callback
      if (err) callback(err, null)
      else callback(null,review);
  })
}

//return all proposals 
exports.returnProposal=function (kind,callback) {
  
  Proposal.find({kind:kind},(err, proposals) => {
      //In case of an error return callback
      if (err) callback(err, null)
      else callback(null,proposals);
  })
  
}

//return all the sights
exports.returnSight=function (type_of_sight,callback) {
  
  Sight.find({type_of_sight:type_of_sight},(err, sight) => {
      //In case of an error return callback
      if (err) callback(err, null)
      else callback(null,sight);
  })
  
}


//save the owner info 
exports.saveOwner=function(owner,callback){

  //creation of a new object with all the loaded data
  let new_owner ={
    username:owner.username,
    email:owner.email,
    password:owner.password,
    title:owner.title,
    info:owner.info,
    cuisine:owner.cuisine,
    facebook:owner.facebook,
    instagram:owner.instagram,
    site:owner.site,
    image:owner.image
    
  };

  var fowner= new Owner(new_owner);
  
  //save of the object to the db collection
  fowner.save(function (err, safe) {
      if (err) return console.error(err);
      console.log( "Saved to database .");
      callback(null,safe)
    });
        
}

//save the proposal info he inserted
exports.saveProposal=function(data,callback){
  
  //creation of a new object with all the loaded data
  let proposal_data ={
    
    title:data.title,
    info:data.info,
    cuisine:data.cuisine,
    facebook:data.facebook,
    instagram:data.instagram,
    site:data.site,
    image:data.image,
    kind:data.kind,
    stars:data.stars
  };

  var fproposal= new Proposal(proposal_data);
  
  //save of the object to the db collection
  fproposal.save(function (err, safe) {
      if (err) return console.error(err);
      console.log( "Saved to database .");
      callback(null,safe)
    });

}