/**
 * Functions for use specifically on the front page of the site – these may use some of the main forge.jquery.js functions as well.
 */

// INIT Right-Left Col Spacing in "Environment" columns
function initFrontPageColSet() {
    if($('.environment-os-section-flex').length) {
        rightLeftColSpacing();
        $(window).resize(function(){rightLeftColSpacing();});
    }


    // If this is the front page, manage height/alignment of download boxes
    if($('.grey-div.right-div').length && $('.grey-div.left-div').length) {
        // Manage vert. aligns
        if($(window).width() > 767) {
            alignGreyBoxes();
        } else
        // Manage box display in single-column mode
        if($(window).width() <= 767) {
            smallerDivHeightMain();
        }
        $(window).resize(function(e){
            // Manage vert. aligns
            if($(window).width() > 767) {
                alignGreyBoxes();
            } else
            // Manage box display in single-column mode
            if($(window).width() <= 767) {
                smallerDivHeightMain();
            }
        });
    }
}


function initFrontPageNetwork() {

    if($('.network-graphic-grid-container').length) {
        // Activate this if you'd like the network display images to appear in a random order upon each page load.
        // Otherwise, deactivate and fill in images manually
        runRandomNetworkImgLoader();

        // This makes a copy of the network graphic from the reg. display size and places it in the phone breakpoint display.
        sizeLocNetworkGraphic();
    }

    // Manage the network page 'network' graphic display
    if($('.network-grid').length) {
        managePhoneNetworkPhoneWidths();
        $(window).resize(function(e) {
            managePhoneNetworkPhoneWidths();
        });
    }
}



// This function makes the right & left column div heights match.
/* Functionality works on the assumption that no vert. padding has been applied  to the l/r columns in CSS and that center
 col. is largest. Sizes are matched by reducing vertical heights of outer columns down. */
function rightLeftColSpacing() {
    $c = $('.environment-os-section-flex');
    // Collect the content div's as objects. There should only be one div in each column.
    var pad = $c.children('.center-col').css('paddingTop');
    $l = $c.children('.col.left-col');
    $r = $c.children('.col.right-col');

    var colArr = [$l,$r];

    // Find and collect the heights of the right & left column content divs
    var heightArr = new Array();

    $(colArr).each(function(i,e){
        heightArr.push($(this).children('div').outerHeight());
    });
    // New height is the max of the two outer col heights, with the same vertical padding of the center col
    var newHeight = (Math.max.apply(Math,heightArr)) + (parseInt(pad) * 2);

    // New Height is the larger of the two column height vals
    $(colArr).each(function(i,e){
        $(this).css({'height':newHeight + 'px'});
    });

}



// Function to give a uniform height and alignment to grey boxes in download/os section
// This function assumes the center div is always the tallest of the three.
function alignGreyBoxes() {
    // Two left/right divs
    var greyLtRtDivs    = [$('.grey-div.left-div'),$('.grey-div.right-div')];

    // Only perform size change if the two checked heights aren't equal
    // Whichever height is greater will become the height for both (+10 add'l px)
    if($('.grey-div.left-div').hasClass('height-matched') === false) {
        var greyLtRtHts     = [$('.grey-div.left-div').height(),$('.grey-div.right-div').height()];

        var newHeight = (Math.max.apply(Math,greyLtRtHts)) + 10;
        // Apply height to left and right div's
        $('.grey-div.left-div').css({'height':newHeight+'px'});
        $('.grey-div.right-div').css({'height':newHeight+'px'});

        $(greyLtRtDivs).each(function(i,e){
            $(this).addClass('height-matched');
        });
    }

    var centerHeight = $('.center-contain-div').height();
    var newMargin = (centerHeight - $('.grey-div.left-div').height() ) / 2;

    // Apply CSS
    $(greyLtRtDivs).each(function(i,e){
        $(this).css({'marginTop':newMargin+'px'})
    });
}

// This manages the div height as visible at any width below 767 (the phone breakpoint)
function smallerDivHeightMain() {
    $l = $('.grey-div.left-div');
    $r = $('.grey-div.right-div');
    var lR = [$l,$r];
    if($l.hasClass('height-matched') === true) {
        $(lR).each(function(i,e) {
            $(this).removeClass('height-matched');
            $(this).css({'height':'auto','marginTop':'0'});

        });
    }
}




// This function calculates the correct proportions for the network grid display based on given width/height
function managePhoneNetworkPhoneWidths() {
    /*
     // Proportion of total height for each of the 4 rows
     Row 1 height:19.11%
     Row 2 height:22.06%
     Row 3 height:35.29%
     Row 4 height:23.53%
     */
    // This the phone-friendly grid var (displays at smaller breakpoints)
    $p = $('.network-div-phone-width-container .network-grid');
    // This is the laptop/desktop display grid (displays at larger breakpoints)
    $g = $('.network-graphic-grid-container .network-grid');

    // This is the height of the desktop/laptop display grid
    var gH = $g.height();
    // This is the height of the phone-friendly display grid
    var pH = $p.height();



    // Set Row heights (both sets)

    // Desktop/laptop
    $p.children('.network-row-1').css({'height': (pH * .1911) +'px'});
    $p.children('.network-row-2').css({'height': (pH * .2206) +'px'});
    $p.children('.network-row-3').css({'height': (pH * .3529) +'px'});
    $p.children('.network-row-4').css({'height': (pH * .2353) +'px'});

    // Phone
    $g.children('.network-row-1').css({'height': (gH * .1911) +'px'});
    $g.children('.network-row-2').css({'height': (gH * .2206) +'px'});
    $g.children('.network-row-3').css({'height': (gH * .3529) +'px'});
    $g.children('.network-row-4').css({'height': (gH * .2353) +'px'});

    // Circular image containers

    // Proportions
    var small = .138;
    var med   = .185;
    var large = .224;

    // Laptop/Desktop grid circle heights
    var gS =    gH * small;
    var gM =    gH * med;
    var gL =    gH * large;

    // Phone-friendly grid circle heights
    var pS =    pH * small;
    var pM =    pH * med;
    var pL =    pH * large;

    // Set circle heights (both sets)

    // Reg. display grid circle heights
    $g.children().find('.sml img').css({'width':gS+'px','height':gS+'px'});
    $g.children().find('.med img').css({'width':gM+'px','height':gM+'px'});
    $g.children().find('.lrg img').css({'width':gL+'px','height':gL+'px'});


    // Phone display heights
    $p.children().find('.sml img').css({'width':pS+'px','height':pS+'px'});
    $p.children().find('.med img').css({'width':pM+'px','height':pM+'px'});
    $p.children().find('.lrg img').css({'width':pL+'px','height':pL+'px'});

}


// This takes a copy of the network-div from the reg.display and places it in the phone breakpoint container div, then adds a class
function sizeLocNetworkGraphic() {
    $p = $('.network-div-phone-width-container'); // Phone breakpoint div
    $c = $('.network-graphic-grid-container');    // Reg. Width display

    // Make a copy of the .network-grid div in the main container (which should already have images loaded), place in phone break, add class name
    var cl = $c.children('.network-grid').clone();
    $p.html(cl);

    // Now add the class tag to the phone-width version
    $p.children('.network-grid').addClass('phone-display');
}


// This pulls images from the display container for the network graphic loader and places them randomly in the network grpahic on the main page.
function runRandomNetworkImgLoader() {
    $c = $('.network-img-holder'); // Hidden container
    var imgArr = new Array();
    $c.children().each(function(i,e) {
        imgArr.push($(this));
    });

    // Length of imgArr (should be 10)
    var l = imgArr.length

    // Randomize the order of the objects in the container
    shuffleArray(imgArr);
    // Now load each item into the display container
    for(var i = 0;i < l; i++) {
        $('div[data-img-pos="'+i+'"]').html(imgArr[i]);
    }
}


