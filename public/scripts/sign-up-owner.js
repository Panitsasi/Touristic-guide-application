$('#validatedLogo').on('change',function(){
    //get the file name
    var fileName = $(this).val();
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
})

function hotelCheck(that) {
    if (that.value == "hotel") {
        document.getElementById("stars").style.display = "block";
    } else {
        document.getElementById("stars").style.display = "none";
    }
}