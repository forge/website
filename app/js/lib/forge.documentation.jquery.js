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