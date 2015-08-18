/**
 * Functions for use specifically on the front page of the site – these may use some of the main forge.jquery.js functions as well.
 */

initAddonSet();

// Init Rating Star display script
function initAddonSet() {
    if($('.star-row').length) {
        uniformAddonSizes();
        addStars();
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
