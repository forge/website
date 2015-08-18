// These scripts manage the height values of the individual documentation page divs.
function initDocumentationJS() {
    if($('.row.documentation-flex-boxes').length) {
       heightMatchDocDivs();
    }
}


//Match heights of .info-row div within each .documentation-item
function heightMatchDocDivs() {
    var iArr = new Array();

    $('.info-row').each(function(i,e){
        iArr.push($(this).outerHeight());
    });

    //Max value
    var heightVal = Math.max.apply(Math,iArr);

   $('.info-row').css({'height':heightVal + 'px'});
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