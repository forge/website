// CUSTOM JS FOR FORGE WEBSITE

// INIT FUNCTIONS
$(initializeUI); 

function initializeUI() {

    // Only use widthBox() during testing
    //widthBox();

    // Use vertical-only parallax
    setTimeout('runVertParallax()',300);

    // Maintain position of emblem if viewing on a phone-size screen
    smallScreenWidthMgr();


    // Init flyover menu functionality – assumes this menu will be on every page (no .class check)
    initFlyOver();

    // This .class check assumes that since there's an advanced search area, there will also be a 'reset options' button so that event is assigned here as well.
    if($('.advanced-search-button-link').length) {
       // Add functionality to control the appearance of the up/down arrows
       $('.advanced-search-button-link').click(function(e) {
           e.preventDefault();
           initAriaCollapseDetect();
       });

       // Add the 'reset' functionality to the reset checkboxes button
       $('.reset-button').click(function(e) {
           e.preventDefault();

           $s = $('.advanced-search-checkbox-area');
           $s.children().find('input[type="checkbox"]').attr('checked',false);

       });
    }

    // Padding fix
    initBodyPaddingFix();
}
// Close init functions


// This is used in the runRandomNetworkImgLoader() and manageCommunityGridDisplay() functions
function shuffleArray(array) {

    var currIndex = array.length, temVal, randIndex ;

    // While there remain elements to shuffle...
    while (0 !== currIndex) {

        // Pick a remaining element...
        randIndex = Math.floor(Math.random() * currIndex);
        currIndex -= 1;

        // And swap it with the current element.
        tempVal = array[currIndex];
        array[currIndex] = array[randIndex];
        array[randIndex] = tempVal;
    }

    return array;
}


// This function attempts to correct an issue in some browsers, where right padding is added to the <body> tag.
function initBodyPaddingFix() {
    // Detect Body CSS
    $b = $('body');
    var p = $b.css('paddingRight');
    if(p == '15px') {
        $b.css({"paddingRight":"0"});
    }
}


// Since the aria-expanded attribute wasn't working, this function detects the button state and changes the expansion button from an up-arrow to a down-arrow and vice versa.
function initAriaCollapseDetect() {
    // Check to see if associated button's panel is opening or closing
    $a = $('.advanced-search-button-link').children('.white-chevron');
    $o = $('.advanced-search-button-link').children('.white-chevron-outline');

    $s = $('.advanced-search-section');
    // The button appearance change waits a split-second until after the slide-out/slide-in is complete.
    setTimeout(function(e){
        var c = $s.hasClass('in');
        (c === true) ? $a.addClass('up') : $a.removeClass('up');
        (c === true) ? $o.addClass('up') : $o.removeClass('up');
    },400)
}


// Inits Fly Over Menu
function initFlyOver() {

    var flyDivs = '<div class="flyover-menu"></div><div class="flyover-backdrop"></div>';
    $('body').prepend(flyDivs);

    // Backdrop overlay layer
    $b = $('.flyover-backdrop');
    // Flyover menu
    $f = $('.flyover-menu');

    // On load: obtain whatever main menu <li>'s and duplicate to the fly-over container.
    var navClone = $('.main-menu-ul').clone().html();
    $('.flyover-menu').html('<ul>'+navClone+'</ul>');


    // Resize the fly-over content to match the full height of the current page content (with resize() changes)
    sizeFlyoverMenus();
    $(window).resize(function(){
        sizeFlyoverMenus();
    });

    $('#btnFlyOver').click(function(e) {
        e.preventDefault();
        if($f.hasClass('active') === false) {
            activateFlyOver();
        }
    });

    // Allows a left swipe on the side flyover menu
    $f.swipe({
        swipeLeft:function(){
            deActivateFlyOver();
        }
    });

    // Bind deactivation to any touch to the main area overlay
    $b.click(function(e) {
        deActivateFlyOver();
    } );
}

// Shows Fly Over Menu & transparent page overlay div
function activateFlyOver() {
    // Backdrop overlay layer
    $b = $('.flyover-backdrop');
    // Flyover menu
    $f = $('.flyover-menu');

    // Add 'active' classes
    $b.addClass('active');
    $f.addClass('active');

    // Animate overlay opacity. This and the fly-over should give the appearance of animating concurrently.
    $b.animate({'opacity':.5},200);

    // Animate fly-over
    $f.animate({'marginLeft':0},{duration:400});
}

// Shows Fly Over Menu & transparent page overlay div
function deActivateFlyOver() {
    // Backdrop overlay layer
    $b = $('.flyover-backdrop');
    // Flyover menu
    $f = $('.flyover-menu');

    // Animate overlay opacity. This and the fly-over should give the appearance of animating concurrently.
    $b.animate({'opacity':.5},400);

    // Animate fly-over
    $f.animate({'marginLeft':'-195px'},{duration:200});

    // Add 'active' classes
    $b.removeClass('active');
    $f.removeClass('active');
}


// Function to resize the flyover menu and window overlay
function sizeFlyoverMenus() {
    // Backdrop overlay layer
    $b = $('.flyover-backdrop');
    // Flyover menu
    $f = $('.flyover-menu');

    var h = $('body').outerHeight();

    // Array of each fly-over var
    var arr = [$b,$f];

    $(arr).each(function(i,e) {
        $(this).css({'height':h+'px'});
    });

}


// This function launches the modal from script. It's used with other page events as needed.
function productModal() {
    $('#productModal').modal();
}

// Vertically-oriented parallax
// Initially designed to deactivate for smaller screens but that happens automatically
function runVertParallax() {
    $('.intro-download-section').parallax({imageSrc: 'images/sparks_large_res.jpg'});
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
    if( w <= 767) {
        $('div[role="navigation"]').css({'marginTop':'73px','position':'absolute'});

        // Correct logo placement
        $logo = $('.forge-logo-smaller');
        $logo.css({'marginLeft':((w/2) - 75)+'px'});
        // Add a border to dropdown menu
        //$('#navBarMain').css({'border':'1px solid white'});
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



// Function to sum up numerical values of an array (all values must be numbers).
function sumArray(x) {
    var t = 0;
    $(x).each(function(i,e) {
        t += e;
    });
    return t;
}