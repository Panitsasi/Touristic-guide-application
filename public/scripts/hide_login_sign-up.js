let eggrafh = document.querySelector('.first-hide');
let sundesh = document.querySelector('.second-hide');
let buttons = document.querySelector('.buttons-hide');
let username = document.querySelector('.username-hide');


if(username.textContent!=""){
    eggrafh.style.display='none';
    sundesh.style.display='none';
    buttons.style.display='initial';
    
}
else{
    eggrafh.style.display='initial';
    sundesh.style.display='intial';
    buttons.style.display='none';
    
}