// CUSTOM JS FOR FORGE WEBSITE
$(function() {
    // Only use widthBox() during testing
    //widthBox();

    // Function to give a uniform height and alignment to grey boxes in download/os section
    alignGreyBoxes();
});


/* ONLY USE DURING TESTING */
// Function for running width tests
function widthBox() {
     // This is the block of code inserted into the open to contain width
     var wTxt = '<!-- TESTING WIDTH BOX --><div id="widthBox"></div><!-- / END TESTING WIDTH BOX -->';

         $('body').prepend(wTxt);

         $('#widthBox').html($(window).outerWidth());
         $(window).resize(function() {
         $('#widthBox').html($(window).outerWidth());
     });
}


// Function to give a uniform height and alignment to grey boxes in download/os section
function alignGreyBoxes() {
    var _greyLtRt = [$('.grey-div.left-div').outerHeight(),$('.grey-div.right-div').outerHeight()];

    // Whichever height is greater will become the height for both (+10 add'l px)
    var newHeight = (Math.max.apply(Math,_greyLtRt)) + 10;

    // Apply height to left and right div's
    $('.grey-div.left-div').css({'height':newHeight+'px'});
    $('.grey-div.right-div').css({'height':newHeight+'px'});

    // Get the diff. between the center box & the new height; make 1/2 diff of that the neg. top margin of center
    var centerHeight = $('.grey-div.center-div').outerHeight();
    var newMargin = (centerHeight - newHeight) / 2;

    // Apply CSS
    $('.grey-div.center-div').css({'marginTop':'-'+newMargin+'px'});
}