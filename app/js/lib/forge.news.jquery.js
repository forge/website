// JS Functions for the news page

/**
 * Functions for the news page and news sub-pages
 */

//$(initNews);
function initNews() {
    // If this is a document page, init column sizing for tablet/desktop size screens
    if($('.doc-content').length && $(window).outerWidth() > 767) {
        docContentHeightFix();
        $(window).resize(function(){
            if($(window).outerWidth() > 767) {
                docContentHeightFix();
            }
        });
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
