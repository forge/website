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
$(function() {
    // Only use widthBox() during testing
    //widthBox();

    // Check width for parallax use:
    //runParallax();

    // Use vertical-only parallax
    runVertParallax();

    // Maintain position of emblem if viewing on a phone-size screen
    smallScreenWidthMgr();


    // Init Rating Star display script
    if($('.star-row').length) {
        uniformAddonSizes();
        addStars();
    }

    // Init Contribute page column sizing – works in the larger (lg or md) breakpoints only
    if($('.contribute-columns').length && $(window).outerWidth() > 767) {
        sizeContributeSection();
        $(window).resize(function(){
            if($(window).outerWidth() > 767) {
                sizeContributeSection();
            }
        });
    }

    // Init community grid row "connection bar" row column sizing
    // As of this setup, the vertical bar row and its two <span> objects must be present
    if($('.community-grid-row').length && $('.vertical-bar-row').length) {
       // communityVertBars();
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

});

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
    if( w < 767) {
        $('div[role="navigation"]').css({'marginTop':'73px','position':'absolute'});

        // Correct logo placement
        $logo = $('.forge-logo-smaller');
        $logo.css({'marginLeft':((w/2) - 75)+'px'});
        // Add a border to dropdown menu
        //$('#navBarMain').css({'border':'1px solid white'});
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


// Sizing of Contribute row sections. Make sure left & right cols are the same height and displayed in the vertical center relative tot he middle two columns
function  sizeContributeSection() {

    // FAR LEFT AND FAR RIGHT COLUMN SIZING/SPACING...

    // Far Left / Far Right Display divs
    $lCol =  $('.display-div.left-col'); // Far Left Col Display
    $rCol =  $('.display-div.right-col'); // Far Right Col Display

    var lColH = parseInt($lCol.outerHeight());
    var rColH = parseInt($rCol.outerHeight());
    var finColHeight; // This var is set for the outer-inner height align below

    // Size .display-divs
    if(lColH != rColH) {
        if(lColH > rColH ) {
            $rCol.css({'height':lColH + 'px'});

            finColHeight = lColH;
        } else {
            $lCol.css({'height':rColH + 'px'});
            finColHeight = rColH;
        }
    }

    // INTERIOR LEFT/RIGHT COLUMN SIZING/SPACING

    // This assumes that the right-inner column is the larger height of the two.
    var intRightColHeight = $('.three-row-col-div').outerHeight();
    $('.build-an-addon').css({'height':intRightColHeight + 'px' });


    //if($(window).width() > 992) {
    if($(window).width() > 767) {
        // Now the outer and inner pairs of columns should be aligned vertically
        var diff = (Math.abs(intRightColHeight - finColHeight)) / 2;

        var arr = [$lCol,$rCol];
        $(arr).each(function(i,e) {
            $(e).css({'marginTop':diff + 'px'});
        });
    }

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