window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    var navbar=document.getElementById("navbar");
    navbar.style.background="rgba(255, 255,255, 1)";
  } 
  else{
    var navbar=document.getElementById("navbar");
    navbar.style.background="rgba(255, 255,255, 0.3)";
  }
}