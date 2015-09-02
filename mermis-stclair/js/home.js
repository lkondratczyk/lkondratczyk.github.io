/*************************************************************************************
 * JavaScript for home.html
 * 
 * BakerSoftware 2007
 ************************************************************************************/

var SLIDE_COUNT = 9;		// Number of pics in slide show
var START_INDEX = 1;		// Slide to start at
var current_slide;		// Current slide
var slidesImg;				// Image to show slides in
var images = Array();

window.onload = loader;

function loader()
{
	initDHTMLAPI();
	// Cache images
	for (i = 0; i < SLIDE_COUNT; ++i)
		images[i] = "images/home/slide" + i + ".jpg?1";
		
	cacheImages(images);
	slidesImg = getRawObject("slideShow");

	current_slide = START_INDEX;
	t = setInterval("changeSlide()", 3300);
}

function changeSlide()
{
	if (current_slide >= SLIDE_COUNT)
		current_slide = 0;

	slidesImg.src = images[current_slide];
	current_slide++;
}
