//To handle all browsers, including IE5 and IE6, check if the browser supports the XMLHttpRequest object. If it does, create an XMLHttpRequest object, if not, create an ActiveXObject:
var xhttp;
if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
    } else {
    // code for IE6, IE5
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
}

xhttp.open("POST", "ajax_test.asp", true); //POST for robust features, true  for async AJAX behavior (no waiting for server responsees)
//(use async=false to confirm reservation emailed to ron?)
//When using async=true, specify a function to execute when the response is ready in the onreadystatechange event:
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); //adds http header to the request
xhttp.send("fname=Henry&lname=Ford");


function loadDoc() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			document.getElementById("demo").innerHTML = xhttp.responseText;
		}
	}
}


function loadDoc(cFunc) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			cFunc(xhttp);
		}
	}
}