// FUNCTIONS THAT CONTROL THE COMMUNITY LAYOUT GRID
//initCommunity();
function initCommunity() {

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

    // Community Network Grid

    // Manage the community page image grid display
//    if($('.community-grid').length) {
//        manageCommunityGridDisplay();
//    }

    if($('.community-images-holder').children().length) {
       manageCommunityGridDisplay();
    }
}


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
    $c.children('a').each(function(i,e) {
        imgArr.push($(this));
    });

    // Shuffle array with shuffleArray() function in main js file.
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

