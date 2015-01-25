// CUSTOM JS FOR FORGE WEBSITE


$(function() {
    // Only use widthBox() during testing
    //widthBox();

    // Check width for parallax use:
    //runParallax();

    // Use vertical-only parallax
    runVertParallax();

    // Maintain position of emblem if viewing on a phone-size screen
    smallScreenWidthMgr();

    if($('.star-row').length) {
        uniformAddonSizes();
        addStars();

    }

});


// This function launches the modal from script. Use it to bind to other page events.
function productModal() {
    $('#productModal').modal();
}

// Vertically-oriented parallax
// Initially designed to deactivate for smaller screens but that happens automatically
function runVertParallax() {
    $('.intro-download-section').parallax({imageSrc: 'images/sparks_med_res.jpg'});
}



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


// Function to set a standard size for all the addon box descriptions (and by extension all the addon divs) based on largest description.
function uniformAddonSizes() {

    var heightArr = new Array();

    // Gather heights of all <p> elements
    $('.addon').each(function(i,e) {
       heightArr.push($(this).children('p').height());
    });

    // Determine the largest height
    var allHeight = Math.max.apply(Math,heightArr);

    // Set the height to all <p> tags
    $('.addon').each(function(i,e) {
        $(this).children('p').css({'height':allHeight+'px'});
    });
}



// Function to determine how many stars an addon has been rated.
// The function takes the data-rating value and changes that many stars for each row instance from grey to gold by adding the 'gold' class.
function addStars() {
    $('.star-row').each(function(i,e) {
        // First, insert 5 star glyphicons, with their default settings
        var basicStar = '<span class="glyphicon glyphicon-star"> </span>';

        var rating = $(this).attr('data-rating');

        // Insert 5 star glyphicon span tags
        for(i=0;i<5;i++) {
            if(i==0) {  $(this).html(basicStar);
            } else
            if(i>0) {   $(this).children('span:last-child').after(basicStar); }
        }

        // This takes the data-rating value and loops through the inserted star icons to change the given number to gold.
        if(rating > 0) {
            var starCount = parseInt(rating) + 1;
            for(i=0;i<starCount;i++) {
                $(this).children('span:nth-child('+i+')').addClass('gold');
            }
        }

    });


}
