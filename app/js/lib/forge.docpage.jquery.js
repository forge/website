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

//$(initDocPage);

// Init
function initDocPage() {
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

    // If this is a document page, init column sizing for tablet/desktop size screens
    if($('.doc-content').length && $(window).outerWidth() > 767) {
        docContentHeightFix();
        $(window).resize(function(){
            if($(window).outerWidth() > 767) {
                docContentHeightFix();
            }
        });
    }

    // Init sibling switch menu
    if($('.sibling-switch-menu').length) {
        siblingSwitchMenu();
    }
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