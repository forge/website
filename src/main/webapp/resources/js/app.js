$(function() {
	var jbssoserverbase = (document.location.href.indexOf("-stg.") != -1) ? "https://sso-stg.jboss.org"
			: "https://sso.jboss.org";
	// Temporarily set to sso while the not on the vpn
	jbssoserverbase = "https://sso.jboss.org";

	// you can uncomment and fill next variable with another URL to be used for
	// return from SSO login.
	// Full URL of current page is used normally.
	var _jbssobackurl = window.location.href;
	// Loads this..
	$.ajax({
		// https://sso.jboss.org/logininfo
		url : jbssoserverbase + "/logininfo?backurl=" + escape(_jbssobackurl),
		context : document.body,
		dataType : "jsonp",
		type : "GET",
		success : function(data, textStatus) {
			if (data) {
				// user is logged in!
				var responsePart1 = $(data.part1);
				var responsePart2 = $(data.part2);
				$('#jbssologininfo1').html(responsePart1);
				$('#jbssologininfo2').html(responsePart2);
			}
		}
	});
})