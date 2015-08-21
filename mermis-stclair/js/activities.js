/*************************************************************************************
 * JavaScript for activities.html
 * 
 * BakerSoftware 2007
 ************************************************************************************/
 
var images = Array(
				   "images/activities/harbor.jpg",
				   "images/activities/arlington.jpg",
				   "images/activities/lobero.jpg",
				   "images/activities/mission.jpg",
				   "images/activities/courthouse.jpg",
				   "images/activities/lotusland.jpg",
				   "images/activities/poloclub.jpg",
				   "images/activities/montecitocc.jpg",
				   "images/activities/mountains.jpg",
				   "images/activities/lakecachuma.jpg",
				   "images/activities/granada.jpg"
				   );

window.onload = loader;

function loader()
{
	initDHTMLAPI();
	// Cache images
	cacheImages(images);
	setActivity(0);
	setVisible("activityPic", true);
	var elem = getRawObject("menu");
	if (elem) {
		elem.onmousemove = handleMouseMove;
		elem.onmouseout = handleMouseOut;
	}
}

function handleMouseMove(evt)
{
	// Only handle mouseout of <a class="hover">
	var elem = getEventSource(evt);
	if (elem && elem.tagName.toLowerCase() == "a" && elem.className == "hover") {
		setActivity(elem.id);
	}
}

function handleMouseOut(evt)
{
	// Only handle mouseout of <div id="menu">
	var elem = getEventSource(evt);
	if (elem && elem.tagName.toLowerCase() == "div") {
		setActivity(0);
	}
}

function setActivity(id)
{
	for (i = 0; i < 11; i++) {
		setDisplay("activity" + i, (i == id));
	}
	setImage("activityPic", images[id]);
}