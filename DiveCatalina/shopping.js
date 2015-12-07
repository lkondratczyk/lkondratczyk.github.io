function populateInputs(){		
	
	document.getElementById("payment-input").selectedIndex = 0;
	
	function timeOptions(){
		var options = [];
		var getoptions = document.getElementById("os0");
		var entries = getoptions.length;
		for(var i = 0; i < entries; i++){
			options.push(getoptions.options[i].text);
		}
		return options;
	}
	var timeSelect = document.getElementById("time-input");
	populateInput(timeOptions(), timeSelect);
}

function populateInput(newOptions, optionParent){
	while (optionParent.options.length > 0) { 
		optionParent.options.remove(0); 
	}
	var entries = newOptions.length;
	for(var i = 0; i < entries; i++){
		var option = document.createElement("option");
		option.text = newOptions[i];
		option.value = newOptions[i];
		optionParent.appendChild(option);
	}
}

function setDefaultDate(month, day, year){
	var today = new Date();
	month.selectedIndex = today.getMonth();
	day.selectedIndex = today.getDate() - 1;
	year.selectedIndex = 0;
}

function getDaySet(limit){
	var dateSet = [];
	for(var i = 1; i <= limit; i++){
		dateSet.push(i);
	}
	if(limit == "28" && (new Date()).getYear() % 4 == 0){
		dateSet.push("29");
	}
	return dateSet;
}

function getYearSet(){
	var yearSet = [];
	var thisYear = (new Date()).getFullYear();
	for(var i = 0; i < 5; i++){
		yearSet.push(thisYear + i);
	}
	return yearSet;
}

function injectToPP(selection){
	if(selection == 0){
		document.getElementById("os0").selectedIndex = document.getElementById("time-input").selectedIndex;
		if(document.getElementById("datepicker") != null){
			document.getElementById("os1").value = 	document.getElementById("datepicker").value; 
		}
		else{
			document.getElementById("os1").value = 	document.getElementById("month-input").value;
			document.getElementById("os1").value += "/" + document.getElementById("day-input").value;
			document.getElementById("os1").value += "/" + document.getElementById("year-input").value;
		}

		
		document.getElementById("os2").value = document.getElementById("name-input").value;
		document.getElementById("os2").value += " "	
		document.getElementById("os2").value += document.getElementById("phone-input").value;		
	}
	else{
		document.getElementById("os0b").selectedIndex = document.getElementById("time-input").selectedIndex;
		
		document.getElementById("os1b").value = 	document.getElementById("datepicker").value; 
		
		document.getElementById("os2b").value = document.getElementById("name-input").value;
		document.getElementById("os2b").value += " "	
		document.getElementById("os2b").value += document.getElementById("phone-input").value;		
	}
}

function validate(){
	var success = true;
	if(!validateName(success)){
		success = false;
	}
	if(!validateEmail(success)){
		success = false;
	}
	if(!validatePhone(success)){
		success = false;
	}
	if(!validateDate(success)){
		success = false;
	}
	
	return success;
}

function validateName(success){
	if(document.getElementById("name-input").value.length < 1){
		document.getElementById("name-error").className = "error-reveal";
		document.getElementById("name-input-error").className = "error-reveal";
		return false;
	}
	else{
		document.getElementById("name-error").className = "error-hide";
		document.getElementById("name-input-error").className = "error-hide";
		return true;
	}
}

function validateEmail(){
    var re = /[^\s@]+@[^\s@]+\.[^\s@]+/
    if(!re.test(document.getElementById("email-input").value)){
		document.getElementById("email-error").className = "error-reveal";
		document.getElementById("email-input-error").className = "error-reveal";
		return false;
	}
	else{
		document.getElementById("email-error").className = "error-hide";
		document.getElementById("email-input-error").className = "error-hide";
		return true;
	}
}

function validatePhone(){
	if(!checkDigits(document.getElementById("phone-input").value)){
		document.getElementById("phone-error").className = "error-reveal";
		document.getElementById("phone-input-error").className = "error-reveal";
		return false;
	}
	else{
		document.getElementById("phone-error").className = "error-hide";
		document.getElementById("phone-input-error").className = "error-hide";
		return true;
	}
}

function checkDigits(phone){
	var isValid = true;
	var digitCount = 0;
	var firstDigit;
	for(var i = 0; i < phone.length; i++){
		if(phone[i] >= 0 && phone[i] <= 9){
			if(!(phone[i] == ' ')){
				if(digitCount == 0){
					firstDigit = phone[i];
				}
				digitCount++;
			}
		}
		else if(phone[i] != '(' && phone[i] != ')' && phone[i] !='-' && phone[i] == ' '){
			return false;
		}
	}
	if(digitCount > 11 || digitCount < 10){
		return false;
	}
	if(digitCount == 11 && firstDigit != '1'){
		return false;
	}
	return true;
}

function validateDate(success){
	var validDate = true;
	var currentDate = new Date();
	var reservation = document.getElementById("datepicker");
	if(reservation != null){
		if(reservation.value == ""){
			validDate = false;
		}
		reservation = reservation.value.split("/");
		var selectYear = parseInt(reservation[2]);
		var selectMonth = parseInt(reservation[0]);
		var selectDay = parseInt(reservation[1]);
		if(selectYear < currentDate.getFullYear()){
			validDate = false; 
		}
		else if(selectYear == currentDate.getFullYear()){
			if(selectMonth - 1 < currentDate.getMonth()){
				validDate = false; 
			}
			else if(selectMonth - 1 == currentDate.getMonth()){
				if(selectDay < currentDate.getDate()){
					validDate = false;
				}
			}
		}
		if(validDate == false){
			success = false;
			document.getElementById("date-error").className = "error-reveal";
			document.getElementById("date-input-error").className = "error-reveal";
		}
		else{
			document.getElementById("date-error").className = "error-hide";
			document.getElementById("date-input-error").className = "error-hide";
		}
	}
	else{
		if(document.getElementById("year-input").value < currentDate.getFullYear()){
			validDate = false; 
		}
		else if(document.getElementById("year-input").value == currentDate.getFullYear()){
			if(document.getElementById("month-input").selectedIndex + 2 < currentDate.getMonth()){
				validDate = false; 
			}
			else if(document.getElementById("month-input").selectedIndex + 2 == currentDate.getMonth()){
				if(document.getElementById("day-input").value < currentDate.getDate()){
					validDate = false;
				}
			}
		}
	}
	if(validDate == false){
		success = false;
		document.getElementById("date-error").className = "error-reveal";
		document.getElementById("date-input-error").className = "error-reveal";
	}
	else{
		document.getElementById("date-error").className = "error-hide";
		document.getElementById("date-input-error").className = "error-hide";
	}
	return success;
}

function customSubmit(){
	if(validate() == true){
		var f = document.getElementById("contactform");
		var postData = [];
		for (var i = 0; i < f.elements.length; i++) {
			postData.push(f.elements[i].name + "=" + f.elements[i].value);
		}
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "servertest.php", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		xhr.send(postData.join("&"));
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				window.location = "http://lyndonk.com/?p=525";
			}
		}
	}
}


function customPPSubmit(){
	if(validate()){
		document.getElementById("payment-input").selectedIndex = 1;
		injectToPP(0);
		var f = document.getElementById("contactform");
		var postData = [];
		for (var i = 0; i < f.elements.length; i++) {
			postData.push(f.elements[i].name + "=" + f.elements[i].value);
		}
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "servertest.php", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		xhr.send(postData.join("&"));

		
		document.getElementById("pp0").submit();
	}
}

function customEquipmentSubmit(duration){
	if(validate(duration)){
		document.getElementById("payment-input").selectedIndex = 1;
		injectToPP(duration);
		var f = document.getElementById("contactform");
		var postData = [];
		for (var i = 0; i < f.elements.length; i++) {
			postData.push(f.elements[i].name + "=" + f.elements[i].value);
		}
		//for asynchronous requests
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "servertest.php", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		xhr.send(postData.join("&"));

		document.getElementById("pp" + duration).submit();
	}
}





