/*************************************************************************************
 * JavaScript utility library
 * 
 * BakerSoftware 2007
 ************************************************************************************/
 
function focusThis(objectID){
	var obj = document.getElementById(objectID);
	if (typeof(obj) != "undefined")
		obj.focus();
}

var isCSS, isW3C, isIE4, isNN4;

// initialize upon load to let all browsers establish content objects
function initDHTMLAPI() {
    if (document.images) {
        isCSS = (document.body && document.body.style) ? true : false;
        isW3C = (isCSS && document.getElementById) ? true : false;
        isIE4 = (isCSS && document.all) ? true : false;
        isNN4 = (document.layers) ? true : false;
        isIE6CSS = (document.compatMode && document.compatMode.indexOf("CSS1") >= 0) ? true : false;
    }
}

// Seek nested NN4 layer from string name
function seekLayer(doc, name) {
    var theObj;
    for (var i = 0; i < doc.layers.length; i++) {
        if (doc.layers[i].name == name) {
            theObj = doc.layers[i];
            break;
        }
        // dive into nested layers if necessary
        if (doc.layers[i].document.layers.length > 0) {
            theObj = seekLayer(document.layers[i].document, name);
        }
    }
    return theObj;
}

// Convert object name string or object reference
// into a valid element object reference
function getRawObject(obj) {
    var theObj;
    if (typeof(obj) == "string") {
        if (isW3C) {
            theObj = document.getElementById(obj);
        } else if (isIE4) {
			theObj = document.all(obj);
        } else if (isNN4) {
            theObj = seekLayer(document, obj);
        }
    } else {
        // pass through object reference
        theObj = obj;
    }
    return theObj;
}

// Get the source element that raised an event
function getEventSource(evt)
{
	var elem = null;
	if (document.images){
        // equalize W3C and IE event objects
        evt = (evt) ? evt : ((window.event) ? window.event : null);
        if (evt) {
            // equalize W3C and IE event property
            elem = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
		}
	}
	return elem;
}
			
// set an image src
function setImage(id, src)
{
	var elem = getRawObject(id);
	if (typeof elem != "undefined") elem.src = src;
}

// set object visibility
function setVisible(id, show)
{
	var elem = getRawObject(id);
	if (typeof elem != "undefined") {
		if (show) {
			elem.style.visibility = "visible";
		} else {
			elem.style.visibility = "hidden";
		}
	}
}

// set object visibility
function setDisplay(id, disp)
{
	var elem = getRawObject(id);
	if (typeof elem != "undefined") {
		if (disp) {
			elem.style.display = "block";
		} else {
			elem.style.display = "none";
		}
	}
}

function setImage(id, new_src) {
	var elem = getRawObject(id);
	if (typeof elem != "undefined") {
		elem.src = new_src;
	}
}

// Cache images
function cacheImages(imgs){
	if(document.images){
		document.imageCache = new Object();
		for(m = 0; m < imgs.length; m++){
			document.imageCache[m] = new Image;
			document.imageCache[m].src = imgs[m];
		}
	}
}

function isUndefined(v) {
	var undef;
	return v === undef;
}