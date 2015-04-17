// CUSTOM JS FOR FORGE WEBSITE


// Array of language choices for documents page (since this is a demo version, the 'english' item will be used as the default).
var langObj = {
    0: {type :"english",
        label:"English",
        class:"language-usa"
    },
    1:{
        type :"francais",
        label:"Francais",
        class:"language-francais"
    },
    2:{
        type :"japanese",
        label:"日本の",
        class:"language-japanese"
    },
   3:{   type:"german",
        label:"Deutsch",
        class:"language-german"
    },
    4:{
        type: "espanol",
        label:"Espa&ntilde;ol",
        class:"language-espanol"
    }
};

var langObj = {
    "english": {type :"english",
        label:"English",
        class:"language-usa"
    },
    "francais":{
        type :"francais",
        label:"Fran&ccedil;ais",
        class:"language-francais"
    },
    "japanese":{
        type :"japanese",
        label:"日本の",
        class:"language-japanese"
    },
    "german":{   type:"german",
        label:"Deutsch",
        class:"language-german"
    },
    "espanol":{
        type: "espanol",
        label:"Espa&ntilde;ol",
        class:"language-espanol"
    }
};


// INIT FUNCTIONS
$(initializeUI); 

function initializeUI() {
    // Only use widthBox() during testing
    //widthBox();

    // Use vertical-only parallax
    runVertParallax();

    // Maintain position of emblem if viewing on a phone-size screen
    smallScreenWidthMgr();

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


    // Init Rating Star display script
    if($('.star-row').length) {
        uniformAddonSizes();
        addStars();
    }

    // Init Contribute page column sizing – works in the larger (lg or md) breakpoints only
    var cLen = $('.contribute-columns').length;
    if(cLen && $(window).outerWidth() > 767) {
        sizeContributeSection();
        $(window).resize(function(){
            if($(window).width() > 767) {
                sizeContributeSection();
            } else
            // This has been added to remove a gap that was showing up in the bottom of the "Build An Addon" box.
            if($(window).width() <= 767) {
                $('.build-an-addon').css({'height':'auto','paddingTop':'1em','paddingBottom':'1em'});
            }
        });
    } else
    if(cLen && $(window).outerWidth() <= 767) {
        $dCol = $('.left-col-container .display-div.left-col');
        // Add Padding to the .left-col-container
        $dCol.css({'paddingTop':'24px','paddingBottom':'24px'});
        $(window).resize(function(){
            if($(window).outerWidth() <= 767) {
                $dCol.css({'paddingTop':'24px','paddingBottom':'24px'});
            }
        });

    }

    // Init community grid row "connection bar" row column sizing
    // As of this setup, the vertical bar row and its two <span> objects must be present
    if($('.community-grid-row').length && $('.vertical-bar-row').length) {
       communityVertBars();
    }

    // If this is a document page, init column sizing for tablet/desktop size screens
    if($('.doc-content').length && $(window).outerWidth() > 767) {
       docContentHeightFix();
       $(window).resize(function(){
           if($(window).outerWidth() > 767) {
               docContentHeightFix();
           }
       });
    }

    // Determine whether the language selection menu is present
    if($('.language-select-container').length) {
       languageSelectMenu();
    }

    // Init sibling switch menu
    if($('.sibling-switch-menu').length) {
        siblingSwitchMenu();
    }

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

    // Manage the community page image grid display
    if($('.community-grid').length) {
        manageCommunityGridDisplay();
    }

    // Padding fix
    initBodyPaddingFix();
}
// Close init functions

// This function loads the community grid display (at both sizes) with images in a hidden container
/*
Like the Network page template grid function, the content to be loaded could
also be swapped for a JSON object. Note that this function will limit
the quantities of images – for the laptop/desktop monitor setting, it'll only show
groups of slides that are counted in multiples of 5 (5 images per row)
for the smaller phone-widths, multiples of two (2 images per row)
*/

// *This display assumes there will be at least enough images for 1 row (currently 5 images per row at regular display)
function manageCommunityGridDisplay() {
    // Hidden image holder
    $c = $('.community-images-holder');
    // Regular (ie laptop/desktop) display grid (visible @ larger breakpoints)
    $rG = $('.community-grid.reg-display');
    // Phone-friendly display grid (visible @ smaller-width breakpoints)
    $pG = $('.community-grid.phone-display');

    var imgArr = new Array();
    // Insert all present images into array
    $c.children().each(function(i,e) {
        imgArr.push($(this));
    });

    // Shuffle array with shuffle() function
    shuffleArray(imgArr);


    // FILL REGULAR DISPLAY GRID

    // The regular/laptop display will have rows of 5 (exactly 5 cols per row – no more, no less).
    var rCols = 5;

    // Turn the main Array into a group that's divisible only by 5
    var regArr = imgArr;

    // Slice off the remaining divs that can't fill an entire row
    regArr.slice(0,setToMultiple(imgArr.length,rCols));

    // Begin HTML content that will be filled into the display area on the page
    var rLen = regArr.length;

    var rContent = '';
    for(var i = 0; i< rLen ;i++) {
        // Modulo for this item
        var modq = i % rCols ;

        var u = regArr[i][0].outerHTML; // current array key

        if(i == 0) {
            rContent += '<div class="row"><div>'+ u +'</div>';
        }
        if(i > 0 && modq > 0  && i < rLen) {
            rContent += '<div>'+ u +'</div>';
        } else
        if(i > 0 && modq == 0  && (i + 1) < rLen) {
            rContent += '</div><div class="row"><div>'+ u +'</div>';
        } else
        if(i > 0 && modq == 0 && (i+1) == rLen) {
            rContent += '<div>'+ u +'</div></div>';
        }
    }
    // Place content in page
    $rG.html(rContent);

    // Now that HTML is in place, assign the necessary class types
    $rG.children('.row').children('div').each(function(i,e) {
        $(this).addClass('col-sm-2');
    });

    $rG.children('.row').children('div.col-sm-2:first-child').addClass('col-sm-offset-1');


    // FILL PHONE DISPLAY GRID

    // The phone display will have rows of 3 (exactly 3 cols per row – no more, no less).
    var pCols = 2;

    // Turn the main Array into a group that's divisible only by 5
    var pArr = imgArr;

    // Slice off the remaining divs that can't fill an entire row
    pArr.slice(0,setToMultiple(pArr.length,pCols));

    // Begin HTML content that will be filled into the display area on the page
    var pLen = pArr.length;

    var pContent = '';
    for(var i = 0; i< pLen ;i++) {
        // Modulo for this item
        var modq = i % pCols ;


        var u = pArr[i][0].outerHTML; // current array key

        // Only three types of div's for this row dislay: left, center, right
        switch(modq) {
            case 0:
                pContent += '<div class="row"><div class="col-xs-6">'+ u +'</div>';
                break;
            case 1:
              //  pContent += '<div class="center col-xs-1">&nbsp;</div>';
              // break;
            case 2:
                pContent += '<div class="col-xs-6">'+ u +'</div></div>';

        }
    }
    // Place content in page
    $pG.html(pContent);

    // Make all center

}




// Used with the community grid to round the array count up or down to a multiple of 5
// x = array total length, m = multiple to set to
function setToMultiple(x,m) {
    // var to return
    var r;
    // Determine if there's a remainder
    var modq = x % m;

    // If the value is already a multiple of m, then return it
    if(modq == 0) {
        r = x;
    } else
    // If value isn't a multiple of m, then find the next lower multiple of m
    if(modq != 0) {
        var r = Math.floor(x/5)*5;
    }
    return r;
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
    $a = $('.advanced-search-button-link').children().find('span.white-chevron');
    $o = $('.advanced-search-button-link').children().find('span.white-chevron-outline');

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


// Function to set a standard size for all the addon box descriptions (and by extension all the addon divs) based on largest description.
function uniformAddonSizes() {

    var pHeightArr = new Array(); // For all the <p> tags in the rows.

    // Gather heights of all <p> elements
    $('.click-modal').each(function(i,e) {
       pHeightArr.push($(this).children('p').height());
    });

    // Determine the largest height
    var allHeight = Math.max.apply(Math,pHeightArr);

    // Set the height to all <p> tags
    $('.click-modal').each(function(i,e) {
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


// Updated version of this function
/* New version of this assumes that there are two sets of columns (inner two and outer two)
and that of the inner two, the default height of the left column is shorter than the right
and that of the outer two, the default height of the left column is higher than the far-right column.
 */
function sizeContributeSection() {

    // 1. Inner Columns

    // Inner Left/Right display divs
    $iLCol = $('.build-an-addon');
    $iRCol = $('.three-row-col-div');

    // To Start, get the height of the right box and set the padding on the left to result in a matching height

    // Determine difference in heights
    var iDiff = ($iRCol.height() - $iLCol.height()) / 2;

    // Now add iDiff to the top padding of first item and bottom padding of last item
    $iLCol.first().css({'paddingTop':iDiff+'px'});
    $iLCol.last().css({'paddingBottom':iDiff+'px'});


    // 2. Outer Columns

    // Far Left / Far Right Display divs
    $oLCol =  $('.display-div.left-col'); // Far Left Col Display
    $oRCol =  $('.display-div.right-col'); // Far Right Col Display


    // Match the heights of the outer right/left columns. This assumes the far-right col will always be shorter than far-left.
    // This only acts if the heights aren't already matched; otherwise it causes the heights to be applied incorrectly.

    // Pad outer-left column

    // Establish the placement of the outer-left div first, since it will be larger.
    $oLCol.css({'paddingTop':'10px','paddingBottom':'20px'});
    var lch     = $oLCol.outerHeight();
    var lchPad  = (lch - $oRCol.outerHeight()) / 2;
    // Now determine the difference between the right and left outer cols; apply difference in padding to right-outer col padding.

    if($oLCol.outerHeight() != $oRCol.outerHeight()) {
        $oRCol.css({'paddingTop':lchPad + 'px','paddingBottom':lchPad+'px'});
    }

    // Adjust Top Margin

    // Now apply a padding to the outer container to vertically center align with inner cols
    $outerContainer = $('.outer-container');
    // At this point the inner cols should be height-aligned so height can be taken from one.
    $innerContainer = $('.three-row-col-div');
    var outPad = ($innerContainer.outerHeight() - $outerContainer.outerHeight()) / 2;

    $outerContainer.css({'paddingTop':outPad+'px'})
}

// Function sizes and spaces out the vertical bar connections for the
function communityVertBars() {
    // Count the number of member <div>'s in the first row
    var ct = $('.community-grid-row:first-child').children().length;

    // Insert as many vert-bar <div>'s in each vertical-bar-row <div>
    $('.vertical-bar-row').each(function(i,e) {
        var txt = '<div class="vert-bar">&nbsp;</div>';

        // Insert <div>'s
        for(i=0;i<ct;i++) {
            if(i==0) {  $(this).html(txt);
            } else
            if(i>0) {   $(this).children('div:last-child').after(txt); }
        }
    });
}


// On document pages, this makes the left column & right column heights equal
function docContentHeightFix() {
    // Columns' vars
    $leftCol    =  $('.doc-left-main-col');
    $rightCol   =  $('.doc-right-main-col');

    // Collect vars into an object
    var cols = [$leftCol,$rightCol];

    // Compare heights and use the larger number as the setting
    var useHeight = Math.max($leftCol.outerHeight(),$rightCol.outerHeight());

    $(cols).each(function(i,e) {
       $(this).css({'height':useHeight + 'px'});
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


// Function to control the display and selection of different languages on each page.
function languageSelectMenu() {

    var defaultSelectee = "english"; // 'english' might be split into UK English and USA English, too (for now, image is USA flag)
    // Now populate the remaining choices with a standard function
    populateLanguageOptions(defaultSelectee);


    // Selection Variables
    $l = $('.language-select-container');
    $al = $('.alternate-languages');

    $('a.lang-control-btn').click(function(e) {
        e.preventDefault();
        // Show or hide dropdown menu
        controlLanguageBox();

    });

    // Determine mouse entry to show or hide list.
    $al.mouseenter(function(e){
        $al.mouseleave(function(r){
            r.preventDefault();
            // Show or hide dropdown menu
            controlLanguageBox();
        });
    });
}

// This shows/hides the dropdown.
function controlLanguageBox() {
    $al = $('.alternate-languages');
    var c = $al.hasClass('hidden');
    (c === true) ? $al.removeClass('hidden') : $al.addClass('hidden');
}


// This function populates the language selection menu
function populateLanguageOptions(sel) {

    // Establish selected language
    $selectee = langObj[sel];
    // Start with the selectee
    $('span.language-label').html($selectee['label']);
    $('.selected-language').children().find('.language-img').attr('data-language-img',$selectee['class']);
    $('.lang-control-btn').attr('data-selected-lang',sel); // This needs to be known so the previously selected item can be added to the list.


    // Now fill in other language options.
    // Figure out keys and then loop through those that aren't selected.
    var lKeys = Object.keys(langObj);

    var lastI = lKeys.slice(-1); // Don't place a divider after this item.

    var rMenu = ''; // Object to be placed inside the dropdown options box.

    for(var i=0;i<lKeys.length;i++) {

        // Get specific item
        var e = langObj[lKeys[i]];

        if(e.type != sel) {
            // Build the remaining items
            rMenu += '<a href="#" data-language="'+ e.type +'">';
            rMenu +=  e.label + '<span class="language-img" data-language-img="'+e.class+'"></span>';
            rMenu += '</a>';
            rMenu += '<div class="language-divider"></div>';
        }

    }

    // Add last line
    rMenu += '<a href="#" data-language="add-new">Add Language<span class="language-img language-new"></span>';

    // Insert Object
    $('.alternate-languages').html(rMenu);

    // Lastly, add the hidden class back to the language option box.
    $al = $('.alternate-languages');
    if( $al.hasClass('hidden') !== true) {$al.addClass('hidden')};

    // Assign button selection functions
    $('.alternate-languages').children('a').click(function(e) {
        e.preventDefault();
        // Find which item this is
        var s = $(this).attr('data-language');
        if(s == 'add-new') {
            // Begin the functionality to add new language here
            alert('This is where a function to add a new language would commence');
        } else {
            // Proceed to switch the selected boxes
            populateLanguageOptions(s);

            // ** FUNCTION TO RUN THE LANGUAGE CHANGE FOR THE DISPLAYED PAGE WOULD OCCUR HERE **


            // Now hide the alternate language dropdown
            $al.addClass('hidden');
        }

    });

}

// This manages the sibling switch menu(s) on the documentation_page.html template
// Each sibling menu must have its own data-menu-level number.

/*
<a href> links in each sub menu are assumed to pull up a new page and thus
don't need any special functionality, but it could be added fairly easily if
content is changed via ajax calls instead of a new HTML page being pulled up.
*/

function siblingSwitchMenu() {
    // By default, menus should be hidden on a page load.
    if($('ol.sub-menu').hasClass('hidden') === false) {
        $('ol.sub-menu').addClass('hidden');
    }

    if($('a.sibling-switch-ctrl').hasClass('closed') === false) {
        $('a.sibling-switch-ctrl').addClass('closed');
    }

    // Assign button function
    $('a.sibling-switch-ctrl').click(function(e) {
        e.preventDefault();
        openControlMenu($(this).attr('data-menu-level'));
    });
}

// Function to control whichever menu is open; levelNumber identifies the menu's location in the hierarchy
function openControlMenu(levelNumber) {
    $tar = $('a.sibling-switch-ctrl[data-menu-level="'+levelNumber+'"]');

    // Change appearance of menu control
    $tar.removeClass('closed');

    // Show menu at this level
    $menu = $tar.parent().children('ol.sub-menu');
    $menu.removeClass('hidden');

    // Change z-index
    $tar.parent().css({'zIndex':5000});

    // Assign function to close via control link
    $tar.click(function(e) {
        e.preventDefault();
        closeControlMenu(levelNumber);
    });

    // Assign same function to close via mouseenter/mouseleave of actual menu
    $menu.mouseenter(function(e) {
        e.preventDefault();
        $(this).mouseleave(function() {
           closeControlMenu(levelNumber);
        });
    });
}

// Function to control whichever menu is open; levelNumber identifies the menu's location in the hierarchy
function closeControlMenu(levelNumber) {
    $tar = $('a.sibling-switch-ctrl[data-menu-level="'+levelNumber+'"]');

    // Change appearance of menu control
    if($tar.hasClass('closed') === false) {
        $tar.addClass('closed');
    }

    // Change z-index
    $tar.parent().css({'zIndex':0});

    // Hide menu at this level
    $menu = $tar.parent().children('ol.sub-menu');
    if($menu.hasClass('hidden') === false) {
        $menu.addClass('hidden');
    }

    // Reassign open function
    $tar.click(function(e) {
        e.preventDefault();
        openControlMenu(levelNumber);
    });
}