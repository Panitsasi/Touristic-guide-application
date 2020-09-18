//load all models and all modules needed for their editing

const model = require('../model/operations.js');
const express=require('express')
const exphbs = require('express-handlebars');
var session = require('express-session')
const app = express()
const  bodyParser= require('body-parser');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary');
var multer = require('multer');
var fileupload= require('express-fileupload');
const { ResumeToken } = require('mongodb');
var upload = multer({ dest: './public/images/'}); 
const handlebars = require('handlebars');


//username_for_navbar is a variable that keeps the username of the account for the whole session
let username_for_navbar = "";

let kind = "";
let logout="";

//returns the home page
exports.sendArxiki = function (req, res) {
    try{
       
        res.render('arxiki',{username:username_for_navbar,logout:logout});
    }

    catch(err){
        res.send(err);
    }
}

//returns the sign up page
exports.sendSignUp = function (req, res) {
    try{
       
    res.render('sign-up',{username:username_for_navbar,logout:logout});

    }
    catch(err){
        res.send(err);
    }
}

//posts the data from the sign up form
exports.sendDataSignUp = function (req, res) {
    try{
            let data_send ={}
            data_send.username=req.body.username;
            data_send.email=req.body.email;

            //encryption of the code using hashing 
            data_send.password = bcrypt.hashSync(req.body.password, 10);

            //check the data for errors
            if(check_password(req.body.password,req.body.repeat_password)==-1||check_form_data(req.body.username,req.body.email,req.body.password,req.body.repeat_password)==-1){
                res.render('sign_up_with_errors')
            }

            else{
               
                    model.signup(data_send,function(err,data_from_database){
                       
                        if(err) res.send(err);
                        if(data_from_database==null){
                            //the account already exists
                            res.render('sign_up_with_errors')
                        }
                        if(data_from_database!=null){
                            //if all went well the user is moved to log in page
                            res.render('login')
                        }

                    });
            }
    }
    catch(err){
        res.send(err);
    }
}

//returns the sign up page for store owners, so that they can insert their company
exports.sendOwners = function (req, res) {

    try{
        res.render('sign-up-owner',{username:username_for_navbar,logout:logout});
    }

    catch(err){
        res.send(err);
    }
}

//posts the data from the form completed by the owners to the owner collection and the store's data to the proposal collection
exports.sendDataOwners = function (req, res) {

        
    try{
            let str = "images/";
            let cr_password="";
            let data_send ={}

            data_send.username=req.body.username;
            data_send.email=req.body.email;

            cr_password=data_send.password = bcrypt.hashSync(req.body.password, 10);
            
            //create an array and insert all the data from the form
            let owner_data_send={};
            owner_data_send.username=req.body.username;
            owner_data_send.email=req.body.email;
            owner_data_send.password=cr_password;
            owner_data_send.title=req.body.title;
            owner_data_send.info=req.body.info;
            owner_data_send.cuisine=req.body.cuisine;
            owner_data_send.kind=req.body.kind;
            owner_data_send.facebook=req.body.facebook;
            owner_data_send.instagram=req.body.instagram;
            owner_data_send.site=req.body.site;
            owner_data_send.stars=req.body.stars;


            //creation of the right path for the uploaded image (url) to be inserted to the database
            let mystr2 = req.file.destination.concat(req.file.filename);
            owner_data_send.image = str.concat(req.file.filename);

            
            //checking for the data authentication
            if(check_password(req.body.password,req.body.repeat_password)==-1)  res.render('sign-up-owner',{username:username_for_navbar,logout:logout});
            else if(check_password(req.body.password,req.body.repeat_password)==1){
        
                
            //the function signup of the operation.js is called to get the user data saved to the collection
            model.signup(data_send,function(err,data_from_database){
               
                if(err) res.send(err);
                if(data_from_database==null){
                    //the account already exists
                    res.render('sign-up-owner')
                }
                if(data_from_database!=null){
                    //if all went well lead the user to the login page
                    res.render('login')
                }
             });


            //the function saveOwner is called from the operations.js to create a new Owner document in the data collection
            model.saveOwner(owner_data_send,function(err,data_from_database){
               
                if(err) res.send(err);
                

            });

            //the function saveProposal is called from the operations.js to create a new Proposal document in the data collection
            model.saveProposal(owner_data_send,function(err,data_from_database){
               
                if(err) res.send(err);  
            });
        }
    }
    catch(err){
        res.send(err);
    }
}


//returns the log in page
exports.sendLogin = function (req, res) {
    try{
       res.render('login',{username:username_for_navbar,logout:logout})
    }

    catch(err){
        res.send(err);
    }
}

//posts the data from the login form
exports.sendDataLogin = function (req, res) {
    try{

        //initialization of a user array
        let user={};

        //search in the user mongo collection for the possible existance of the account
        model.findUsername(req.body.username,function(err,data_from_database){
            if(err) res.send(err);

                user=data_from_database[0];   

                //comparison of the passwords with bcrypt module
                bcrypt.compare(req.body.password, user.password, function(err, response) {
                    
                    if(response) {

                        //set username as a global variable to be used 
                        username_for_navbar=req.body.username;

                        logout="Αποσύνδεση"
                        res.render('arxiki',{username:username_for_navbar,logout:logout});
                    
                   
                    } else {
                        res.render('login_with_errors')
                    } 
                });
        });
    }

    catch(err){
        res.send(err);
    }
}

//execute the logout of a connected user, when the logout button is pressed
exports.sendLogout = function (req, res) {
    try{
       
        username_for_navbar="";
        logout="";

        //reset the username
        res.render('arxiki',{username:username_for_navbar,logout:logout})
    }

    catch(err){
        res.send(err);
    }
}

//return the train menu page 
exports.sendTrainMenu = function (req, res) {
    try{
       
        res.render('train_menu',{username:username_for_navbar,logout:logout});
    }

    catch(err){
        res.send(err);
    }
}

//return the page about patras-athens transport
exports.sendPatraAthens = function (req, res) {
    try{
       
        res.render('patra-athina',{username:username_for_navbar,logout:logout})
    }

    catch(err){
        res.send(err);
    }
}

//return the page about the path from Patras to the Athens Airport
exports.sendPatraAirport = function (req, res) {
    try{
       
         res.render('patra-aerodromio',{username:username_for_navbar,logout:logout})
    }

    catch(err){
        res.send(err);
    }
}

//return the page about the path from Patras to Peiraias
exports.sendPatraPeiraias = function (req, res) {
    try{
 
        res.render('patra-peiraias',{username:username_for_navbar,logout:logout})
    }

    catch(err){
        res.send(err);
    }
}

//returns the page of info about the train
exports.sendProastiakos = function (req, res) {
    try{
       
         res.render('proastiakos',{username:username_for_navbar,logout:logout})
         
    }

    catch(err){
        res.send(err);
    }
}

//return the boat menu page 
exports.sendPloioMenu = function (req, res) {
    try{
       
        res.render('ploiomenu',{username:username_for_navbar,logout:logout});
    }

    catch(err){
        res.send(err);
    }
}

//return page about porthmeio
exports.sendPorthmeio = function (req, res) {
    try{
       
        res.render('porthmeio',{username:username_for_navbar,logout:logout})
    }

    catch(err){
        res.send(err);
    }
}

//returns the page about the port
exports.sendLimani = function (req, res) {
    try{
       
       res.render('limani',{username:username_for_navbar,logout:logout})
    }

    catch(err){
        res.send(err);
    }
}

//returns the page about the marine
exports.sendMarina = function (req, res) {
    try{
       
       res.render('marina',{username:username_for_navbar,logout:logout})
    }

    catch(err){
        res.send(err);
    }
}

//returns the page about Kefalonia
exports.sendKefalonia = function (req, res) {
    try{
       
       res.render('kefalonia',{username:username_for_navbar,logout:logout})
    }

    catch(err){
        res.send(err);
    }
}

//returns page about the car info
exports.sendAutokinhto = function (req, res) {
    try{
       
       res.render('autokinhto',{username:username_for_navbar,logout:logout})
    }

    catch(err){
        res.send(err);
    }
}

//returns the proposals about cafeterias
exports.sendCoffee = function (req, res) {
    try{

        //load from the database all the stores/cafeterias
        model.returnProposal('kafe',function(err,data_from_database){
            if(err) res.send(err);

            //initialization of an array 
            let list_of_objects = [];

            let data ={ 
                title:"",
                info:"",
                image:"",
                facebook:"",
                instagram:"",
                cuisine:"",
                site:"",
            }

            //insert to array all the db objects
            for(let i =0 ; i<data_from_database.length;i++){

                data.title=data_from_database[i].title;
                data.info=data_from_database[i].info;
                data.image=data_from_database[i].image;
                data.facebook=data_from_database[i].facebook;
                data.instagram=data_from_database[i].instagram;
                data.cuisine=data_from_database[i].cuisine;
                data.site=data_from_database[i].site;

                list_of_objects.push(data);

                data={}
            }

            //return from the database all the reviews about the cafeterias
            model.returnReview('kafe',function(err,review_data_from_database){
                if(err) res.send(err);
    
                //create an array
                let list_of_reviews = [];
                let counter='';
                let review_data ={ 
                    username:"",
                    date:"",
                    comment:"",
                    proposal_title:""
                }
                for(let i =0 ; i<review_data_from_database.length;i++){

                    //insert the db objects to the array
                    review_data.username=review_data_from_database[i].username;
                    review_data.date=review_data_from_database[i].date;
                    review_data.comment=review_data_from_database[i].comment;
                    review_data.proposal_title=review_data_from_database[i].proposal_title;

                    list_of_reviews.push(review_data);

                    review_data={}
    
                }
                //calculate the amount of the comments
                counter=review_data_from_database.length;


                //if the user is logged in he can write a comment, whereas if he isn't logged in he can only see the posted ones
                if(username_for_navbar==""){
                    res.render('proposal_without_login',{data_database:list_of_objects,username:username_for_navbar,review_data_database:list_of_reviews,counter,logout:logout})
                }
                else{
                res.render('proposal',{data_database:list_of_objects,username:username_for_navbar,review_data_database:list_of_reviews,counter,logout:logout})
                
                kind='kafe';
                }
            });
        });
    }
    catch(err){
        res.send(err);
    }
}

//posts the data from the form of a review
exports.sendDataReview = function (req, res) {
    try{
        //call the review function of the operations.js to save the review if it is validated
        model.review(req.body,req.files, kind,username_for_navbar,function(err, req){
            if(err) res.send(err);
        });

        //reload the page with all the reviews 
        res.redirect('back');

    }
    catch(err){
        res.send(err);
    }
}

//returns the page about accomondation proposals
exports.sendDiamonh = function (req, res) {
    try{

        //calls the returnProposal function so that all hotels are loaded from the db
        model.returnProposal('hotel',function(err,data_from_database){
            if(err) res.send(err);

            //use of a handlebar helper, so that after the info of the hotels is returned from the db,
            //in the info the score of the stars out of five for each hotel is displayed properly.
            //If the score is 4/5, with the help of handlebars, the appearance of a filled star will be populated by 4.
            handlebars.registerHelper('times', require('handlebars-helper-repeat'));

            //return the .hbs file
            res.render('diamonh',{hotel:diamonh(data_from_database),username:username_for_navbar,logout:logout})
            
        });
      
    }
    catch(err){
        res.send(err);
    }
}


//returns the proposals about patisseries
exports.sendGluko = function (req, res) {
    try{

        //call the returnProposal function from operations.js, so that all the patisseries are returned
        model.returnProposal('gluko',function(err,data_from_database){

            if(err) res.send(err);

            //create an array
            let list_of_objects = [];

            let data ={ 
                title:"",
                info:"",
                image:"",
                facebook:"",
                instagram:"",
                cuisine:"",
                site:""
            }

            //load in the array all the objects of the db
            for(let i =0 ; i<data_from_database.length;i++){
                data.title=data_from_database[i].title;
                data.info=data_from_database[i].info;
                data.image=data_from_database[i].image;
                data.facebook=data_from_database[i].facebook;
                data.instagram=data_from_database[i].instagram;
                data.cuisine=data_from_database[i].cuisine;
                data.site=data_from_database[i].site;
                list_of_objects.push(data);
                data={}
            }

            //call the returnReview function, so that all the review about the patisseries are returned
            model.returnReview('gluko',function(err,review_data_from_database){
                if(err) res.send(err);
    
                //create an array
                let list_of_reviews = [];
    
                let review_data ={ 
                    username:"",
                    date:"",
                    comment:"",
                    proposal_title:""
                }

                //load all the objects of the db to the array
                for(let i =0 ; i<review_data_from_database.length;i++){

                    review_data.username=review_data_from_database[i].username;
                    review_data.date=review_data_from_database[i].date;
                    review_data.comment=review_data_from_database[i].comment;
                    review_data.proposal_title=review_data_from_database[i].proposal_title;

                    list_of_reviews.push(review_data);

                    review_data={}
    
                }

                //count the amount of comments 
                counter=review_data_from_database.length;

                //if the user is logged in he can leave a review/comment, otherwise he can only read the existing ones
                if(username_for_navbar==""){
                    res.render('proposal_without_login',{data_database:list_of_objects,username:username_for_navbar,review_data_database:list_of_reviews,counter,logout:logout})
                }
                else{
                    res.render('proposal',{data_database:list_of_objects,username:username_for_navbar,review_data_database:list_of_reviews,counter,logout:logout})
                    kind='gluko';

                }
            });
        });
    }

    catch(err){
        res.send(err);
    }
}

//returns the proposals about restaurants
exports.sendFaghto = function (req, res) {
    try{

        //call the returnProposal function to return all the restaurants from the db
        model.returnProposal('faghto',function(err,data_from_database){
            if(err) res.send(err);

            //creation of an array
            let list_of_objects = [];

            let data ={ 
                title:"",
                info:"",
                image:"",
                facebook:"",
                instagram:"",
                cuisine:"",
                site:""
            }
            //load all the documents to the array
            for(let i =0 ; i<data_from_database.length;i++){

                data.title=data_from_database[i].title;
                data.info=data_from_database[i].info;
                data.image=data_from_database[i].image;
                data.facebook=data_from_database[i].facebook;
                data.instagram=data_from_database[i].instagram;
                data.cuisine=data_from_database[i].cuisine;
                data.site=data_from_database[i].site;

                list_of_objects.push(data);

                data={}
            }

            //call the returnReview function to load from the db all the reviews
            model.returnReview('faghto',function(err,review_data_from_database){
                if(err) res.send(err);
    
                //creation of an array
                let list_of_reviews = [];
    
                let review_data ={ 
                    username:"",
                    date:"",
                    comment:"",
                    proposal_title:""
                }

                //load all documents to array
                for(let i =0 ; i<review_data_from_database.length;i++){

                    review_data.username=review_data_from_database[i].username;
                    review_data.date=review_data_from_database[i].date;
                    review_data.comment=review_data_from_database[i].comment;
                    review_data.proposal_title=review_data_from_database[i].proposal_title;

                    list_of_reviews.push(review_data);

                    review_data={}
    
                }

                //count the amount of comments
                counter=review_data_from_database.length;

                //if the user is logged in he can leave a review/comment, otherwise he can only read the existing ones
                if(username_for_navbar==""){
                    res.render('proposal_without_login',{data_database:list_of_objects,username:username_for_navbar,review_data_database:list_of_reviews,counter,logout:logout})
                }
                else{
                res.render('proposal',{data_database:list_of_objects,username:username_for_navbar,review_data_database:list_of_reviews,counter,logout:logout})
                kind='faghto';
                }
            });
        });
    }

    catch(err){
        res.send(err);
    }
}

//returns the proposals about bars
exports.sendPoto = function (req, res) {
    try{

        //call the returnProposal function to return all the bars from the db
        model.returnProposal('poto',function(err,data_from_database){

            if(err) res.send(err);

            //creation of an array
            let list_of_objects = [];

            let data ={ 
                title:"",
                info:"",
                image:"",
                facebook:"",
                instagram:"",
                cuisine:"",
                site:""
            }
            //load all documents from db to the array
            for(let i =0 ; i<data_from_database.length;i++){

                data.title=data_from_database[i].title;
                data.info=data_from_database[i].info;
                data.image=data_from_database[i].image;
                data.facebook=data_from_database[i].facebook;
                data.instagram=data_from_database[i].instagram;
                data.cuisine=data_from_database[i].cuisine;
                data.site=data_from_database[i].site;

                list_of_objects.push(data);

                data={}
            }

            //call the returnReview function to return all the reviews about the bars from the db
            model.returnReview('poto',function(err,review_data_from_database){
                if(err) res.send(err);
    
                let list_of_reviews = [];
    
                let review_data ={ 
                    username:"",
                    date:"",
                    comment:"",
                    proposal_title:""
                }
                for(let i =0 ; i<review_data_from_database.length;i++){
                    review_data.username=review_data_from_database[i].username;
                    review_data.date=review_data_from_database[i].date;
                    review_data.comment=review_data_from_database[i].comment;
                    review_data.proposal_title=review_data_from_database[i].proposal_title;
                    list_of_reviews.push(review_data);
                    review_data={}
    
                }
                //count the amount of comments
                counter=review_data_from_database.length;

                //if the user is logged in he can leave a review/comment, otherwise he can only read the existing ones
                if(username_for_navbar==""){
                    res.render('proposal_without_login',{data_database:list_of_objects,username:username_for_navbar,review_data_database:list_of_reviews,counter,logout:logout})
                }
                else{
                res.render('proposal',{data_database:list_of_objects,username:username_for_navbar,review_data_database:list_of_reviews,counter,logout:logout})
                
                kind='poto';
                }

            });
        });
    }

    catch(err){
        res.send(err);
    }
}


//returns the saint andreas page
exports.sendAgioAndrea = function (req, res) {
    try{
        //returnSight is called to return all info associated to the 'Agios_Andreas' sight
        model.returnSight('Agios_Andreas',function(err,data_from_database){
            if(err) res.send(err);

            res.render('aksiotheata',{data:list_objects(data_from_database),username:username_for_navbar,logout:logout})
            
        });
   
    }

    catch(err){
        res.send(err);
    }
}


//returns the achaia clauss page
exports.sendAchaiaClauss = function (req, res) {
    try{

        //returnSight is called to return all info associated to the 'Achaia_Clauss' sight
        model.returnSight('Achaia_Clauss',function(err,data_from_database){
            if(err) res.send(err);
            res.render('aksiotheata',{data:list_objects(data_from_database),username:username_for_navbar,logout:logout})

        });
    }

    catch(err){
        res.send(err);
    }
}

//returns the Carnival page
exports.sendCarnival = function (req, res) {
    try{

        //call the returnReview function so that all reviews related the carnival are returned
        model.returnReview('carnival',function(err,review_data_from_database){
            if(err) res.send(err);

            //create an array
            let list_of_reviews = [];
            let counter='';

            let review_data ={ 
                username:"",
                date:"",
                comment:"",
            }

            //load all documents to array
            for(let i =0 ; i<review_data_from_database.length;i++){

                review_data.username=review_data_from_database[i].username;
                review_data.date=review_data_from_database[i].date;
                review_data.comment=review_data_from_database[i].comment;
                review_data.proposal_title=review_data_from_database[i].proposal_title;

                list_of_reviews.push(review_data);

                review_data={}

            }
            //count the amount of comments
            counter=review_data_from_database.length;

            //call the returnGallery function, so that a gallery is created by images uploaded by users
            model.returnGallery(function(err,gallery_data_from_database){
                if(err) res.send(err);
    
                //create an array
                let list_of_images = [];
                
                //return the images and the users who uploaded them
                let gallery_data ={ 
                    username:"",
                    image:"",
                }

                //load all the documents to the array
                for(let i =0 ; i<gallery_data_from_database.length;i++){

                    gallery_data.username=gallery_data_from_database[i].username;
                    gallery_data.image=gallery_data_from_database[i].image;

                    list_of_images.push(gallery_data);

                    gallery_data={}
    
                }

                //if the user is logged in, he can leave a comment/story or/and upload at least one image 
                //whereas if he isn't conected he can only see the existing images and comments
                if(username_for_navbar==""){

                    res.render('carnival_without_login',{username:username_for_navbar,gallery_data_database:list_of_images,review_data_database:list_of_reviews,counter,logout:logout});
                    console.log('Παρακαλώ βεβαιωθείτε ότι είστε συνδεδεμένος.');
                }
                else{
                    res.render('carnival',{username:username_for_navbar,gallery_data_database:list_of_images,review_data_database:list_of_reviews,counter,logout:logout});
                    kind='carnival';
                }
            
            });
        });
    }

    catch(err){
        res.send(err);
    }
}

//return the Apollon sight
exports.sendApollon = function (req, res) {
    try{
        //return info about the sight 'Apollon'
        model.returnSight('Apollon',function(err,data_from_database){

            if(err) res.send(err);

            res.render('aksiotheata',{data:list_objects(data_from_database),username:username_for_navbar,logout:logout})         
        });
    }
    catch(err){
        res.send(err);
    }
}

//return the Wdeio sight
exports.sendWdeio = function (req, res) {
    try{
        
        //return info about the sight 'Wdeio'
        model.returnSight('Wdeio',function(err,data_from_database){

            if(err) res.send(err);
            
            res.render('aksiotheata',{data:list_objects(data_from_database),username:username_for_navbar,logout:logout})
            
        });

    }

    catch(err){
        res.send(err);
    }
}

//return the Mouseio sight
exports.sendMouseio = function (req, res) {
    try{
        
        //return info about the sight 'Mouseio'
        model.returnSight('Mouseio',function(err,data_from_database){
            if(err) res.send(err);
            
            res.render('aksiotheata',{data:list_objects(data_from_database),username:username_for_navbar,logout:logout})
            
            
        });

    }

    catch(err){
        res.send(err);
    }
}

//return the Faros sight
exports.sendFaros = function (req, res) {
    try{
        
        //return info about the sight 'Faros'
        model.returnSight('Faros',function(err,data_from_database){

            if(err) res.send(err);
            
            res.render('aksiotheata',{data:list_objects(data_from_database),username:username_for_navbar,logout:logout})
            
        });
    }

    catch(err){
        res.send(err);
    }
}


//return the Kastro sight
exports.sendKastro = function (req, res) {
    try{
        
        //return info about the sight 'Kastro'
        model.returnSight('Kastro',function(err,data_from_database){

            if(err) res.send(err);
            
            res.render('aksiotheata',{data:list_objects(data_from_database),username:username_for_navbar,logout:logout})
            
        });
    }

    catch(err){
        res.send(err);
    }
}

//return the Kastro Riou sight
exports.sendKastroRiou = function (req, res) {
    try{
        
        //return info about the sight 'Kastro Riou'
        model.returnSight('Kastro_riou',function(err,data_from_database){
            if(err) res.send(err);
            
            res.render('aksiotheata',{data:list_objects(data_from_database),username:username_for_navbar,logout:logout})
            
        });
    }

    catch(err){
        res.send(err);
    }
}

//return the Gefura sight
exports.sendGefura = function (req, res) {
    try{
        
        //return info about the sight 'Gefura'
        model.returnSight('Gefura',function(err,data_from_database){

            if(err) res.send(err);
            
            res.render('aksiotheata',{data:list_objects(data_from_database),username:username_for_navbar,logout:logout})
            
        });
    }

    catch(err){
        res.send(err);
    }
}

//return the Udragwgeio sight
exports.sendUdragwgeio = function (req, res) {
    try{
        //return info about the sight 'Udragwgeio'
        model.returnSight('udragwgeio',function(err,data_from_database){

            if(err) res.send(err);
            
            res.render('aksiotheata',{data:list_objects(data_from_database),username:username_for_navbar,logout:logout})
            
        });
    }

    catch(err){
        res.send(err);
    }
}

//functions to handle the retrieval of proposals/sights from the db

function diamonh(data_from_database){
    
    let list_of_objects = [];

    let data ={ 
        title:"",
        info:"",
        image:"",
        site:"",
        stars:0
    }

    for(let i =0 ; i<data_from_database.length;i++){
        data.title=data_from_database[i].title;
        data.info=data_from_database[i].info;
        data.image=data_from_database[i].image;
        data.site=data_from_database[i].site;
        data.stars=data_from_database[i].stars;
        list_of_objects.push(data);
        data={}
   
    }
    return list_of_objects;
}


function list_of_all_objects(data_from_database){
    let list_of_objects = [];

    let data ={ 
        title:"",
        info:"",
        image:"",
        facebook:"",
        instagram:"",
        cuisine:"",
        site:""

    }

    for(let i =0 ; i<data_from_database.length;i++){
        data.title=data_from_database[i].title;
        data.info=data_from_database[i].info;
        data.image=data_from_database[i].image;
        data.facebook=data_from_database[i].facebook;
        data.instagram=data_from_database[i].instagram;
        data.cuisine=data_from_database[i].cuisine;
        data.site=data_from_database[i].site;
        list_of_objects.push(data);
        data={}
   
    }
    return list_of_objects ;

}



function list_objects(data_from_database){
            let list=[];
           
            let data ={ 
                title:"",
                info:"",
                image1:"",
                image2:"",
                image3:"",
                video:"",
                map:""

            }

            data.title=data_from_database[0].title;
            data.info=data_from_database[0].info;
            data.image1=data_from_database[0].image1;
            data.image2=data_from_database[0].image2;
            data.image3=data_from_database[0].image3;
            data.video=data_from_database[0].video;
            data.map=data_from_database[0].map;
            list.push(data)

            return list;
}



//functions for validation

function check_password(password,repeat_password){

    var str = 0 ;
    var num = 0 ;
    var types = ['number','string']
  
    //check the repeatation of the password
    if(password!==repeat_password){
      console.log('Οι κωδικοί πρόσβασης δεν είναι ίδιοι');
      return -1 ;
    }
  
  
    //check the length of the password
    if (password.length<7){
      console.log('Ο κωδικός πρόσβασης πρέπει να έχει περισσότερα από 7 σύμβολα');
      return -1 ;
    }
  
    
    for (let i =0 ; i <password.length;i++){
     
          var integer =parseInt(password[i]);
          var string =password[i];
          if(!isNaN(integer)) num++ ;
          else str++ ;
    }
    //check the structure of the password
     if (num==0 || str==0){
      console.log('Ο κωδικός πρόσβασης πρέπει να έχει και χαρακτήρες και αριθμούς.');
      return -1 ;
     }
  
     return 1 ;
  }
  
  //check that none of the inputs is null
  function check_form_data(username,email,password,repeat_password){
         if(username==""||email==""|| password==""||repeat_password==""){
           console.log('Συμπλήρωσε τα στοιχεία σου, μην παραλείψεις κάποιο.');
           return -1;
         }
         else return 1 ;
  
  }