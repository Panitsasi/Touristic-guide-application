//require all the modules needed for the functions

//require express
const express = require('express');
const app = express();
const router = express.Router();

//include the control.js file
const controller= require('../controllers/control.js');

//require body-parser
const  bodyParser= require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
var  urlencodedParser=bodyParser.urlencoded({extended: true});

//require multer for image/file uploading
var multer = require('multer');

//require express-session for control of cookies and creation of sessions for the users, when logged in 
var session = require('express-session')

//setup filepath
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.png') //Appending .png
    }
  })
  
//set upload function for uploading the images from forms to local storage './public/images/'
var upload = multer({ storage: storage });

//load main page
router.get('/',controller.sendArxiki);

//load and get posted data from forms in sign up
router.get('/sign-up',controller.sendSignUp);
router.post('/sign-up',urlencodedParser,controller.sendDataSignUp);

//load and get posted data from forms in log in
router.get('/login',controller.sendLogin);
router.post('/login',urlencodedParser,controller.sendDataLogin);

//load and get posted data from forms in sign up for owners
router.get('/sign-up-owners',controller.sendOwners);
//use function call priority... first upload image then use the request.file to obtain data
//upload image (the owner can upload the logo of the business, so later in the proposals it can be added)
router.post('/sign-up-owners',urlencodedParser,upload.single('image'),controller.sendDataOwners);

//load these .hbs files based on the selected path
router.get('/logout',controller.sendLogout);
router.get('/trainmenu',controller.sendTrainMenu);
router.get('/patra-athens',controller.sendPatraAthens);
router.get('/patra-airport',controller.sendPatraAirport);
router.get('/patra-peiraias',controller.sendPatraPeiraias);
router.get('/proastiakos',controller.sendProastiakos);
router.get('/boatmenu',controller.sendPloioMenu);
router.get('/porthmeio',controller.sendPorthmeio);
router.get('/limani',controller.sendLimani);
router.get('/marina',controller.sendMarina);
router.get('/kefalonia',controller.sendKefalonia);
router.get('/autokinhto',controller.sendAutokinhto);

//load coffee places from proposals and reviews
router.get('/kafes',controller.sendCoffee);
//post data from form about a new review
router.post('/kafes',urlencodedParser,controller.sendDataReview);

//load patisseries from proposals and reviews
router.get('/gluko',controller.sendGluko);
//post data from form about a new review
router.post('/gluko',urlencodedParser,controller.sendDataReview);

//load restaurant from proposals and reviews
router.get('/faghto',controller.sendFaghto);
//post data from form about a new review
router.post('/faghto',urlencodedParser,controller.sendDataReview);

//load bar from proposals and reviews
router.get('/poto',controller.sendPoto);
//post data from form about a new review
router.post('/poto',urlencodedParser,controller.sendDataReview);

router.get('/carnival',controller.sendCarnival);
//post data from form about a new comment and image uploading
//the user can now upload multiple images so the difference from sign-up-owner 
//is that from upload.single it is set to upload.array
router.post('/carnival',urlencodedParser,upload.array('images'), controller.sendDataReview);

//load the relevant sight based on the route
router.get('/diamonh',controller.sendDiamonh);
router.get('/achaia_clauss',controller.sendAchaiaClauss);
router.get('/agios_andreas',controller.sendAgioAndrea);
router.get('/apollon',controller.sendApollon);
router.get('/arxaio_wdeio',controller.sendWdeio);
router.get('/mouseio',controller.sendMouseio);
router.get('/faros',controller.sendFaros);
router.get('/kastro_patras',controller.sendKastro);
router.get('/kastro_riou',controller.sendKastroRiou);
router.get('/gefura',controller.sendGefura);
router.get('/udragwgeio',controller.sendUdragwgeio);

//export router
module.exports=router;