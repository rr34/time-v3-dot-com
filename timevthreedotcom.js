// these functions set up the timev3.com site layout and adjust as necessary

// *** get user info from the URL search parameters and set global variables ***
var userInfo = new URLSearchParams(window.location.search),
	loc = userInfo.get('loc'),
	lat = parseFloat(userInfo.get('lat')),
	lng = parseFloat(userInfo.get('lng')),
	goStop;

function timevthreedotcom ()
{
	// *** display the location given in the URL search parameters ***
	document.getElementById("displayLocationTitle").innerHTML = 'Time v3 at ' + loc;
	
	ticktick();
	
	// use current time for now, eventually select date
	let now = new Date();
	now = now.getTime();
	document.getElementById('weekLapse').setAttribute('onclick','timeLapse( '+now+' , 10080 );');
	document.getElementById('monthLapse').setAttribute('onclick','timeLapse( '+now+' , 21600 );');
	document.getElementById('yearLapse').setAttribute('onclick','timeLapse( '+now+' , 105120 );');

}

// on button click,  generate link for different location
function userLinkGenerate () {
	// create the blank URL object. this could easily be done manually as a string, but why not use javascript.
	let userLink = new URL(window.location.href);

	// get the user input
	let userLinkLoc = document.getElementById("userLinkName").value;
	let userLinkLat = document.getElementById("userLinkLat").value;
	let userLinkLng = document.getElementById("userLinkLng").value;
	// create the query string and make it a URLSearchParams object
	userLink.search = "?loc=" + userLinkLoc + "&lat=" + userLinkLat + "&lng=" + userLinkLng;
	
	document.getElementById("userLinkText").innerHTML = userLink.href;
}