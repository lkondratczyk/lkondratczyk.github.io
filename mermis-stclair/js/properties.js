/*************************************************************************************
 * JavaScript for properties.html
 * 
 * BakerSoftware 2007
 ************************************************************************************/

var images = Array();
var TOTAL_IMAGES = 25;
var DEFAULT_IMAGE = -1;				// Helicopter image
var lastProperty = DEFAULT_IMAGE;	// The default helicopter image was displayed last

window.onload = loader;

function loader()
{
	initDHTMLAPI();
	// cache images
	
	for (i = 0; i < TOTAL_IMAGES; i++)
		images[i] = "images/properties/property" + i + ".jpg";
	cacheImages(images);

	var elem = getRawObject("menu");
	if (elem) {
		elem.onclick = handleMouseClick;
		//elem.onmousemove = handleMouseMove;
		//elem.onmouseout = handleMouseOut;
	}
}

function handleMouseClick(evt)
{
	var elem = getEventSource(evt);
	if (elem && elem.tagName.toLowerCase() == "img" && elem.className == "thumb") {
		showProperty(elem.id);
	}
}


/*
function handleMouseMove(evt)
{
	// Only handle mouseout of <a class="hover">
	var elem = getEventSource(evt);
	if (elem && elem.tagName.toLowerCase() == "img" && elem.className == "thumb") {
		showProperty(elem.id);
	}
}

function handleMouseOut(evt)
{
	// Only handle mouseout of <div id="menu">
	var elem = getEventSource(evt);
	if (elem && elem.tagName.toLowerCase() == "div" && elem.id == "menu") {
		hideLastProperty();
		setImage("propertyPic", "images/helicopter.jpg");
		lastProperty = DEFAULT_IMAGE;
	}
}
*/

function showProperty(id)
{	
	// Show new pic
	hideLastProperty();
	setDisplay("property" + id, true);
	setImage("propertyPic", images[id]);
	lastProperty = id;
}

// Hide previous description text
function hideLastProperty()
{
	if (lastProperty != DEFAULT_IMAGE)
		setDisplay("property" + lastProperty, false);
}