

let text_title = document.querySelector(".text-title");
let data = document.querySelector(".data");


function info(){
     if(window.innerWidth>600)
     text_title.style.fontSize="1.6em";
     else text_title.style.fontSize="1.2em";
    
    data.innerHTML="O νέος Ιερός Ναός του Αγίου Ανδρέα εγκαινιάστηκε τον Σεπτέμβριο του 1974 από τον τότε Αρχιεπίσκοπο Αθηνών Σεραφείμ. Το έργο της αγιογραφήσεώς του, ξεκίνησε το 1985 επί αρχιερατείας του Μητροπολίτου Πατρών Νικόδημου, διακόπηκε για περίπου δεκατρία έτη (1993 – 2006) όταν με πρωτοβουλία του Σεβασμιώτατου Μητροπολίτη Πατρών κ.κ Χρυσόστομου η αγιογράφηση ξεκίνησε και πάλι.Ο νέος Ιερός Ναός του Αγίου Ανδρέα του Πρωτόκλητου ο οποίος καταστέφεται με Σταυρό ύψους πέντε μέτρων και δώδεκα καμπανιαριά δεσπόζει την πόλη της Πάτρας.Οι διαστάσεις του είναι 60μ. το μήκος, 52μ. το πλάτος και 46μ. το ύψος. Το συνολικό εμβαδόν της Εκκλσίας είναι 2500 τ.μ. και η χωρητικότητά του είναι άνω των 8000 ατόμων."

   if(window.innerWidth>600){
    data.style.fontSize="1.4em";
    data.style.fontFamily="Arial";
    data.style.overflowY="scroll";
    data.style.textAlign="justify";
    data.style.padding=" 0.3em 1em";
    data.style.lineheight="2";
   }

   else{
    data.style.fontSize="1em";
    data.style.fontFamily="Arial";
    data.style.overflowY="scroll";
    data.style.textAlign="justify";
    data.style.padding=" 0.1em 0.3em";
    data.style.lineheight="1.1";

   }
   
}

function xarths(){

    if(window.innerWidth>600)
     text_title.style.fontSize="1.6em";
    else {
        text_title.style.fontSize="1.2em";
    }
    data.innerHTML=' <iframe  src="https://maps.google.com/maps?q=%CE%AC%CE%B3%CE%B9%CE%BF%CF%82%20%CE%B1%CE%BD%CE%B4%CF%81%CE%AD%CE%B1%CF%82%20%CF%80%CE%AC%CF%84%CF%81%CE%B1&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" style="border:0" allowfullscreen></iframe>'

}

function video (){
    if(window.innerWidth>600)
     text_title.style.fontSize="1.6em";
    else {
        text_title.style.fontSize="1.2em";
    }
    data.innerHTML='   <iframe  src="https://www.youtube.com/embed/Rc99ukbdo6E" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
}


info();
