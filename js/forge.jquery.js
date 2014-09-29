// CUSTOM JS FOR FORGE WEBSITE


$(function() {
    // Only use widthBox() during testing
    //widthBox();



    // Check width for parallax use:
    runParallax();

    // Maintain position of emblem if viewing on a phone-size screen
    smallScreenWidthMgr();

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



// Function to check screen width for parallax effect use.
function runParallax() {
    // On load, check screen width for parallax
    if( $(window).outerWidth() > 767) {
        $('#sparkScene').parallax();
    }

    // Run same function on any window resize.
    $(window).resize(function() {
       // Show parallax
       if( $(window).outerWidth() > 767) {
           $('#sparkScene').parallax();
       }
    });
}


// This function maintains the position of the logo emblem and other items on smaller screens
function smallScreenWidthMgr() {
    var w = $(window).outerWidth();
    if( w < 767) {
        $('div[role="navigation"]').css({'marginTop':'73px','position':'absolute'});

        // Correct logo placement
        $logo = $('.forge-logo-smaller');
        $logo.css({'marginLeft':((w/2) - 75)+'px'});
        // Add a border to dropdown menu
        $('#navBarMain').css({'border':'1px solid white'});
    } else
    if(w >= 767) {
        // Function to give a uniform height and alignment to grey boxes in download/os section
        alignGreyBoxes();
    }

    // Run same function on any window resize.
    $(window).resize(function() {
        var rW = $(window).outerWidth();
        if(rW < 767) {
            $('div[role="navigation"]').css({'marginTop':'73px','position':'absolute'});

            // Correct logo placement
            $logo = $('.forge-logo-smaller');
            $logo.css({'marginLeft':((rW/2)- 75)+'px'});

            // Add a border to dropdown menu
            $('#navBarMain').css({'border':'1px solid white'});

        } else
        if(rW >= 767) {
            $('div[role="navigation"]').css({'marginTop':'30px','position':'relative'});

            // Remove border from dropdown menu, if present
            $('#navBarMain').css({'border':'none'});

        }
    });
}



// Function to give a uniform height and alignment to grey boxes in download/os section
function alignGreyBoxes() {
    var _greyLtRt = [$('.grey-div.left-div').outerHeight(),$('.grey-div.right-div').outerHeight()];


    // Only perform size change if the two checked heights aren't equal
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
