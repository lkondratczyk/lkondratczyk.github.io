/*
*	Constructs data for the gui and analyzer
*
*	@param academicYear The starting year to be worked on
*	@return Data for the gui and analyzer
*/
function constructCalendarData(academicYear, startDate, conditions){	
	//DATA AND FUNCTIONS

	var Months = new Enum(["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]);

	var DayLimits = new Enum([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31])
		
	var DaysOfWeek = new Enum(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'UNK']);
	
	var DayTypes = new Enum(["ACAD", "INST", "CONV", "COMM", "FINL", "HOLI", "WKND", "FILL", "UNK"]);
		
	var Terms = new Enum(["FALL", "WINT", "SPRI", "SUMM", "UNK"]);
		
	/*
	*	Creates a week object/container
	*
	*	@param dayNumber The calendar number associated with the day
	*	@param dayOfWeek The enumerated day of the week (SUNDAY-SATURDAY)
	*	@param type The academic category of the day
	*	@param term The enumerated term the day belongs to (FALL - SUMMER)
	*/
	function Day(dayNumber, dayOfWeek, type, term){
		this.dayNumber = dayNumber;
		this.dayOfWeek = DaysOfWeek[dayOfWeek];
		this.type = DayTypes[type];
		this.term = Terms[term];
	}
	
	/*
	*	Creates a week object/container
	*
	*	@param weekNumber The indexed number relative to the month
	*	@param termWeek The indexed number relative to the term
	*	@param daySet A container to hold days belonging to the week
	*/
	function Week(daySet, weekNumber, termWeek){
		this.daySet = daySet;
		this.weekNumber = weekNumber;
		this.termWeek = termWeek; //counts the number
	}
	
	/*
	*	Creates a month object/container
	*
	*	@param monthNumber The indexed number relative to the year
	*	@param monthName The name of the month
	*	@param weekSet A container to hold the weeks of the month
	*	@param dayTypeCounters A container to hold maps of day type occurrences
	*/
	function Month(weekSet, monthNumber, monthName, dayTypeCounters){
		this.weekSet = weekSet;
		this.monthNumber = monthNumber;
		this.monthName = monthName;
		this.dayTypeCounters = dayTypeCounters;					
	}
	
	/*
	*	Creates a year object/container
	*
	*	@param yearNumber The 4 digit year
	*	@param monthSet A container to hold the months of the year
	*/
	function Year(monthSet, yearNumber){
		this.monthSet = monthSet;
		this.yearNumber = yearNumber;
	}
	
	/*
	*	Defines the data structures returned by the calendar maker. They reference
	*	eachother, so changing a day in one changes the other as well, so that the gui
	*	can update easily
	*
	*	@param guiTree The containers for gui mapping
	*	@param candidateList A list of eligible academic days for analysis 
	*/
	function ReturnData(guiTree, candidateEntryData){
		this.guiTree = guiTree;
		this.candidateEntryData = candidateEntryData;
		this.year = academicYear;
	}
	
	/*
	*	Given a year and a month, this constructs the first day from the Date library 
	*	to retrieves the first day of the week for the month
	*/
	function getFirstWeekday(year, month){
		var date = new Date(year, month, 0);
		return (date.getDay() + 1) % 7;					
	}
	
	/*
	*	For getting the count of days in a month
	*/
	function getDaysInMonth(year, month){
		if((month == 1) && (year % 4 == 0)){
			return DayLimits[month] + 1;

		}
		return DayLimits[month];
	}
		
	/*
	*	For making enumerated values
	*
	*/
	function Enum(constantsList) {
		for (var i in constantsList) {
			this[constantsList[i]] = i;
		}
		return constantsList;
	}	

	function ExecuteProgram(data, startDate, conditions){
		SetConditions(data, startDate, conditions);
		InitializeHandles(data);
		SetTypes(data);
		updateData(data);
	}
	
	function TranslateConditions(strings){
		var booleans = [0, 0, 0, 0, 0, 0, 0];
		booleans[0] = (strings.indexOf("weekdayIdNum") < 0)?0:1;
		booleans[1] = (strings.indexOf("fallStartMon") < 0)?0:1;
		booleans[2] = (strings.indexOf("summerToFallMoreThanWeek") < 0)?0:1;
		booleans[3] = (strings.indexOf("convocationFriBeforeFirstID") < 0)?0:1;
		booleans[4] = (strings.indexOf("extendedFallBreak") < 0)?0:1;
		booleans[5] = (strings.indexOf("commencementTueFri") < 0)?0:1;
		booleans[6] = (strings.indexOf("CesarChavezInSpringBreak") < 0)?0:1;
		booleans[7] = (strings.indexOf("fallFinalsMonday") < 0)?0:1;
		booleans[8] = (strings.indexOf("springFinalsMonday") < 0)?0:1;
		booleans[9] = (strings.indexOf("commencementBeforeMemorial") < 0)?0:1;
		return booleans;
	}
	
	//MAPPER******************************/
	
	//data to return 
	var data = new ReturnData([], []);
	//always points to next calendar week day
	var startDay = getFirstWeekday(academicYear, 4);
	//gui displays from May of academic year to August of the next
	var yearCounter = academicYear;
	//starting in May
	var monthCounter = 4; 
	
	//YEARS**/
	while(yearCounter <= academicYear + 1){
		
		//MONTHS**/
		while((yearCounter == academicYear && monthCounter < 12) || (yearCounter == academicYear + 1 && monthCounter < 8)){
			
			var month = new Month([], monthCounter, Months[monthCounter], []);
			month.yearNumber = yearCounter;
			var weekCounter = 0;
			var dayOfMonth = 1;
			var dayLimit = getDaysInMonth(yearCounter, monthCounter);
			//WEEKS**/
			while(weekCounter < 6){ //six to fill the calendar data space
			
				var week = new Week([], weekCounter, Terms[4]);
				var weekDayCounter = 0;
				
				//fill days in beginning of month

				while((weekDayCounter < startDay) && (dayOfMonth <= dayLimit)){
					var day = new Day(0, weekDayCounter, 7, 4);
					weekDayCounter++;
					week.daySet.push(day);
				}//stop filling
				//DAYS**/
				//here is where the true days are added to the calendar
				while(weekDayCounter < 7 && (dayOfMonth <= dayLimit)){
				
					var day = new Day(dayOfMonth, weekDayCounter, 8, 4);
					dayOfMonth++;
					weekDayCounter++;
					startDay = (weekDayCounter == 7)?0:startDay + 1;
					week.daySet.push(day);
					day.month = Months[monthCounter];
					day.year = yearCounter;
					if(weekDayCounter == 1 || weekDayCounter == 7)
						day.type = "WKND";
					data.candidateEntryData.push(day);
				}//stop adding days
				//fill days at end of month
				while(dayOfMonth > dayLimit && weekDayCounter < 7){
					var day = new Day(0, weekDayCounter, 7, 4);
					weekDayCounter++;
					week.daySet.push(day);
				}//stop filling
				
				weekCounter++;
				weekDayCounter = 0;
				month.weekSet.push(week);
			}//end week
			
			monthCounter++;
			data.guiTree.push(month);
		}//end month
		
		monthCounter = 0;
		yearCounter++;						
	}//end year
	
	var setConditions = [];
	if((typeof startDate == "undefined")||(typeof conditions == "undefined")){
		var spareConditions = ["fallStartMon", "summerToFallMoreThanWeek", "convocationFriBeforeFirstID", 
			"extendedFallBreak", "commencementTueFri", "CesarChavezInSpringBreak"];
		setConditions = spareConditions;
		//spareConditions = TranslateConditions(spareConditions);
		var spareStartDate = [];
		spareStartDate.month = "AUG";
		spareStartDate.dayNumber = 23;
		data.candidateEntryData.startDate = spareStartDate;
		//var test = data.candidateEntryData;
		//test.conditions = spareConditions;
		//ExecuteProgram(data.candidateEntryData, spareStartDate, spareConditions);
	}

	else{
		data.candidateEntryData.startDate = startDate;
		data.candidateEntryData.conditions = conditions;
		//conditions = TranslateConditions(conditions);
		//ExecuteProgram(data.candidateEntryData, startDate, conditions);
	}
	data.candidateEntryData.conditions = TranslateConditions(data.candidateEntryData.conditions);
	ExecuteProgram(data.candidateEntryData, startDate, data.candidateEntryData.conditions);

	return data;
}//end creation of data

function SetConditions(candidateEntry, previousYearEnd, softRules){
	candidateEntry.conditions = softRules;
	candidateEntry.previousYearEnd = GetDayIndex(candidateEntry, previousYearEnd);
}

function SetDataCounts(candidateEntry){
	candidateEntry.reportCounts = {"ACAD_FALL_AND_SPRING" : 0, "INST_FALL_AND_SPRING" : 0, "ACAD_FALL_AND_SUN" : 0,
		"ACAD_FALL_AND_MON" : 0, "ACAD_FALL_AND_TUE" : 0, "ACAD_FALL_AND_WED" : 0, "ACAD_FALL_AND_THU" : 0,
		"ACAD_FALL_AND_FRI" : 0, "ACAD_FALL_AND_SAT" : 0, "ACAD_SPRING_AND_SUN" : 0, "ACAD_SPRING_AND_MON" : 0, 
		"ACAD_SPRING_AND_TUE" : 0, "ACAD_SPRING_AND_WED" : 0, "ACAD_SPRING_AND_THU" : 0, "ACAD_SPRING_AND_FRI" : 0, 
		"ACAD_SPRING_AND_SAT" : 0, "ACAD_AUG" : 0, "ACAD_SEP": 0, "ACAD_NOV": 0, "ACAD_DEC" : 0, 
		"ACAD_JAN" : 0, "ACAD_FEB" : 0, "ACAD_MAR" : 0, "ACAD_APR": 0, "ACAD_MAY" : 0, "ACAD_SUMMER" : 0, "ACAD_WINTER" : 0, "INST_FALL_AND_SUN" : 0,
		"INST_FALL_AND_MON" : 0, "INST_FALL_AND_TUE" : 0, "INST_FALL_AND_WED" : 0, "INST_FALL_AND_THU" : 0,
		"INST_FALL_AND_FRI" : 0, "INST_FALL_AND_SAT" : 0, "INST_SPRING_AND_SUN" : 0, "INST_SPRING_AND_MON" : 0, 
		"INST_SPRING_AND_TUE" : 0, "INST_SPRING_AND_WED" : 0, "INST_SPRING_AND_THU" : 0, "INST_SPRING_AND_FRI" : 0, 
		"INST_SPRING_AND_SAT" : 0, "INST_AUG" : 0, "INST_SEP": 0, "INST_NOV": 0, "INST_DEC" : 0, 
		"INST_JAN" : 0, "INST_FEB" : 0, "INST_MAR" : 0, "INST_APR": 0, "INST_MAY" : 0, "INST_SUMMER" : 0, "INST_WINTER" : 0,
		"ACAD_FALL" : 0, "ACAD_SPRING" : 0, "INST_FALL" : 0, "INST_SPRING" : 0};
}

function updateData(data){

	data.reportCounts["ACAD_FALL"] = filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING"] = filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["INST_FALL"] = filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, ["INST"]).length;
	data.reportCounts["INST_SPRING"] = filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isType, ["INST"]).length;
	
	data.reportCounts["ACAD_FALL_AND_SPRING"] = 
		filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length + 
		filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["INST_FALL_AND_SPRING"] = 
		filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, ["INST"]).length + 
		filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isType, ["INST"]).length;;
	data.reportCounts["ACAD_FALL_AND_SUN"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SUN"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SUN"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_MON"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["MON"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["MON"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_TUE"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["TUE"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["TUE"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_WED"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["WED"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["WED"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_THU"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["THU"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["THU"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_FRI"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["FRI"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["FRI"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_SAT"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SAT"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SAT"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_SUN"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SUN"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SUN"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_MON"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["MON"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["MON"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_TUE"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["TUE"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["TUE"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_WED"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["WED"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["WED"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_THU"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["THU"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["THU"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_FRI"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["FRI"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["FRI"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_SAT"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SAT"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SAT"]).length, isType, ["ACAD", "FINL", "COMM", "CONV"]).length;
	data.reportCounts["ACAD_AUG"] = filter(data, data.monthMarkers["AUGUST"], data.monthMarkers["SEPTEMBER"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SEP"] = filter(data, data.monthMarkers["SEPTEMBER"], data.monthMarkers["OCTOBER"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_OCT"] = filter(data, data.monthMarkers["OCTOBER"], data.monthMarkers["NOVEMBER"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_NOV"] = filter(data, data.monthMarkers["NOVEMBER"], data.monthMarkers["DECEMBER"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_DEC"] = filter(data, data.monthMarkers["DECEMBER"], data.monthMarkers["JANUARY"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_JAN"] = filter(data, data.monthMarkers["JANUARY"], data.monthMarkers["FEBRUARY"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FEB"] = filter(data, data.monthMarkers["FEBRUARY"], data.monthMarkers["MARCH"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_MAR"] = filter(data, data.monthMarkers["MARCH"], data.monthMarkers["APRIL"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_APR"] = filter(data, data.monthMarkers["APRIL"], data.monthMarkers["MAY"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_MAY"] = filter(data, data.monthMarkers["MAY"], data.monthMarkers["JUNE"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["INST_FALL_AND_SUN"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SUN"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SUN"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_MON"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["MON"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["MON"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_TUE"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["TUE"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["TUE"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_WED"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["WED"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["WED"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_THU"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["THU"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["THU"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_FRI"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["FRI"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["FRI"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_SAT"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SAT"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SAT"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_SUN"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SUN"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SUN"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_MON"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["MON"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["MON"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_TUE"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["TUE"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["TUE"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_WED"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["WED"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["WED"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_THU"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["THU"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["THU"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_FRI"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["FRI"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["FRI"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_SAT"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SAT"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SAT"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_AUG"] = filter(data, data.monthMarkers["AUGUST"], data.monthMarkers["SEPTEMBER"], isType, ["INST"]).length;
	data.reportCounts["INST_SEP"] = filter(data, data.monthMarkers["SEPTEMBER"], data.monthMarkers["OCTOBER"], isType, ["INST"]).length;
	data.reportCounts["INST_OCT"] = filter(data, data.monthMarkers["OCTOBER"], data.monthMarkers["NOVEMBER"], isType, ["INST"]).length;
	data.reportCounts["INST_NOV"] = filter(data, data.monthMarkers["NOVEMBER"], data.monthMarkers["DECEMBER"], isType, ["INST"]).length;
	data.reportCounts["INST_DEC"] = filter(data, data.monthMarkers["DECEMBER"], data.monthMarkers["JANUARY"], isType, ["INST"]).length;
	data.reportCounts["INST_JAN"] = filter(data, data.monthMarkers["JANUARY"], data.monthMarkers["FEBRUARY"], isType, ["INST"]).length;
	data.reportCounts["INST_FEB"] = filter(data, data.monthMarkers["FEBRUARY"], data.monthMarkers["MARCH"], isType, ["INST"]).length;
	data.reportCounts["INST_MAR"] = filter(data, data.monthMarkers["MARCH"], data.monthMarkers["APRIL"], isType, ["INST"]).length;
	data.reportCounts["INST_APR"] = filter(data, data.monthMarkers["APRIL"], data.monthMarkers["MAY"], isType, ["INST"]).length;
	data.reportCounts["INST_MAY"] = filter(data, data.monthMarkers["MAY"], data.monthMarkers["JUNE"], isType, ["INST"]).length;
	data.reportCounts["INST_SUMMER"] = filter(data, data.boundaries["SUMMER_START"], data.boundaries["SUMMER_END"], isType, ["INST"]).length;
	data.reportCounts["INST_WINTER"] = filter(data, data.boundaries["WINTER_START"], data.boundaries["WINTER_END"], isType, ["INST"]).length;
	data.summary.fall["START_MON"] = (data.boundaries["FALL_START"].dayOfWeek == "MON");
	data.summary.fall["START_DATE"] = data[data.boundaries["FALL_START"]];
	data.summary.fall["PAYS_45_OR_LESS"] = 0;
	
	data.summary.fall["VETERANS_SWITCH"] = function(){
		var veterans = data[data.holidayMarkers["VETERANS"]];
		if(veterans.dayNumber == 11 || veterans.dayOfWeek == "FRI" || vaterans.dayOfWeek == "MON"){
			return false;
		}
	};
	data.summary.fall["FALL_BREAK_DAYS"] = function(){
		var index = data.holidayMarkers["THANKSGIVING"];
		var numberDays = 0;
		while(data[index].dayOfWeek != "SUN"){
			if(data[index].type != "INST"){
				numberDays++;
			}
			index--;
		}
		return numberDays;
	};
	data.summary.fall["FINALS_WEEK"] = function(){
		var finals = filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, "FINL");
		if(finals[0].dayOfWeek == "TUE"){
			return true;
		}
	};
	data.summary.fall["PRO_FINAL_GAP"] = function(){
		var sample = filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, "ACAD");
		return (sample.length >= 3);
	};
	data.summary.fall["WINTER_GRADES"] = function(){
		var sample = filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, "ACAD");
		return (sample.length >= 3);
	};;
	//winter
	data.summary.winter["INST_WINTER"] = filter(data, data.boundaries["WINTER_START"], data.boundaries["WINTER_END"], isType, "INST").length;
	//spring
	data.summary.spring["PROCESS_TIME"];
	data.summary.spring["SPRING_START"] = data[data.boundaries["SPRING_START"]];
	data.summary.spring["PAYS_45_OR_LESS"];
	data.summary.spring["CESAR_IN_SPRING"] = function(){
		var cesar = data.holidayMarkers["CESARCHAVEZ"];				
		if(data[cesar].dayOfWeek == "FRI"){
			return (data[cesar - 1].type == "ACAD");
		}
		else{
			return (data[cesar + 1].type == "ACAD");
		}
	};
	data.summary.spring["SAME_SPRING"];
	//summer
	data.summary.summer["INST_SUMMER"] = filter(data, data.boundaries["SUMMER_START"], data.boundaries["SUMMER_END"], isType, "INST").length;

}

function InitializeHandles(candidateEntry){
	SetMonthHandles(candidateEntry);
	SetBoundaries(candidateEntry);
	SetHolidays(candidateEntry);
	SetTypes(candidateEntry);
	SetDataCounts(candidateEntry);
}

function SetMonthHandles(candidateEntry){
	candidateEntry.monthMarkers = {"AUGUST" : 0, "SEPTEMBER" : 0, "OCTOBER" : 0, "NOVEMBER" : 0, "DECEMBER" : 0,
		"JANUARY" : 0, "FEBRUARY" : 0, "MARCH" : 0, "APRIL" : 0, "MAY" : 0, "JUNE" : 0, "JULY" : 0};
	var monthCounter = 0;
	for(var i = 0; i < candidateEntry.length - 1; i++){
		if(candidateEntry[i].month != candidateEntry[i + 1].month){
			monthCounter ++;
			if(monthCounter > 2){
				switch(monthCounter - 3){
					case 0:	candidateEntry.monthMarkers["AUGUST"] = i + 1; break;
					case 1:	candidateEntry.monthMarkers["SEPTEMBER"] = i + 1; break;
					case 2:	candidateEntry.monthMarkers["OCTOBER"] = i + 1; break;
					case 3:	candidateEntry.monthMarkers["NOVEMBER"] = i + 1; break;
					case 4:	candidateEntry.monthMarkers["DECEMBER"] = i + 1; break;
					case 5:	candidateEntry.monthMarkers["JANUARY"] = i + 1;	break;
					case 6:	candidateEntry.monthMarkers["FEBRUARY"] = i + 1; break;
					case 7:	candidateEntry.monthMarkers["MARCH"] = i + 1; break;
					case 8:	candidateEntry.monthMarkers["APRIL"] = i + 1; break;
					case 9:	candidateEntry.monthMarkers["MAY"] = i + 1; break;
					case 10: candidateEntry.monthMarkers["JUNE"] = i + 1; break;
					case 11: candidateEntry.monthMarkers["JULY"] = i + 1; break;
					default: 
				}
			}
		}
	}
}

function SetHolidays(candidateEntry){
	candidateEntry.holidayMarkers = {"THANKSGIVING" : 0, "CESARCHAVEZ" : 0, "VETERANS" : 0, "CHRISTMAS" : 0};
	//JANUARY
	SetHoliday(candidateEntry, candidateEntry.monthMarkers["JANUARY"], null); 
	SetDayHoliday(candidateEntry, candidateEntry.monthMarkers["JANUARY"], "MON", 3, null);
	//MARCH
	SetHoliday(candidateEntry, candidateEntry.monthMarkers["MARCH"] + 30, "CESARCHAVEZ");
	//MAY
	SetDayHoliday(candidateEntry, candidateEntry.monthMarkers["MAY"], "MON", 
		(filter(candidateEntry, candidateEntry.monthMarkers["MAY"], candidateEntry.monthMarkers["JUNE"], isDay, "MON").length), null);			
	//JULY
	SetHoliday(candidateEntry, candidateEntry.monthMarkers["JULY"] + 3, null);
	//SEPTEMBER
	SetDayHoliday(candidateEntry, candidateEntry.monthMarkers["SEPTEMBER"], "MON", 1, null);
	//NOVEMBER
	SetHoliday(candidateEntry, candidateEntry.monthMarkers["NOVEMBER"] + 10, "VETERANS");
	SetDayHoliday(candidateEntry, candidateEntry.monthMarkers["NOVEMBER"], "THU",4, "THANKSGIVING", null);
	SetHoliday(candidateEntry, candidateEntry.holidayMarkers["THANKSGIVING"] + 1, null);

	//DECEMBER
	for(var i = 0; i < 7; i++)
		SetHoliday(candidateEntry, candidateEntry.monthMarkers["DECEMBER"] + 24 + i, "CHRISTMAS");
}

function SetHoliday(list, index, handle){
	if(list[index].dayOfWeek == "SAT"){
		list[index - 1].type = "HOLI";
		if(handle != null){
			list.holidayMarkers[handle] = index - 1;
		}
	}
	else if(list[index].dayOfWeek == "SUN"){
		list[index + 1].type = "HOLI";
		if(handle != null){
			list.holidayMarkers[handle] = index + 1;
		}
	}
	else{
		list[index].type= "HOLI";
		if(handle != null){
			list.holidayMarkers[handle] = index;
		}
	}			
}

function SetDayHoliday(list, startIndex, day, count, handle){
	var countDays = 0;
	for(var i = 0; countDays < count; i++){
		if(list[startIndex + i].dayOfWeek == day){
			countDays++;
		}
		if(countDays == count){
			if(handle != null){
				list.holidayMarkers[handle] = startIndex + i;
			}
			list[startIndex + i].type = "HOLI";
		}
	}
}

function countEligibles(list, start, finish){ //start and finish are boundaries/markers
	var count = 0;
	for(var i = start; i < finish; i++){
		var day = list[i];
		if(!(day.type == "WKND" || day.type == "HOLI")){
			count++;
		}
	}
	return count;
}

function Enum(constantsList) {
	for (var i in constantsList) {
		this[constantsList[i]] = i;
	}
	return constantsList;
}

function GetDayIndex(data, date, secondOccurrence){
	var counter = 0;
	var skip = ((typeof secondOccurrence == "undefined")|| (secondOccurrence == false))?0:1;
	while(skip >= 0){
		while(date.month != data[counter].month){
			counter++;
		}
		while(date.dayNumber != data[counter].dayNumber){
			counter++;
		}
		skip--;
		if(skip == 0){
			while(data[counter].dayNumber != 1){
				counter++;
			}
		}
	}
	return counter;
}

function SetBoundaries(candidateEntry){
	candidateEntry.boundaries = {"FALL_START" : 0, "FALL_END" : 0, "WINTER_START" : 0, "WINTER_END" : 0, 
		"SPRING_START" : 0, "SPRING_END" : 0, "SUMMER_START" : 0, "SUMMER_END" : 0};
	var boundaries = candidateEntry.boundaries;

	//FALL
	
	candidateEntry.boundaries["FALL_START"] = candidateEntry.previousYearEnd;
	while(candidateEntry.boundaries["FALL_START"] - candidateEntry.previousYearEnd < 2 ||
		candidateEntry.previousYearEnd > candidateEntry.boundaries["FALL_START"] ||
		candidateEntry[candidateEntry.boundaries["FALL_START"]].dayOfWeek == "FRI"){
	
		candidateEntry.boundaries["FALL_START"] = candidateEntry.boundaries["FALL_START"] + 1;
	}
	candidateEntry.boundaries["FALL_END"] = 24 + candidateEntry.monthMarkers["DECEMBER"];
	while(countEligibles(candidateEntry, candidateEntry.boundaries["FALL_END"], 24 + candidateEntry.monthMarkers["DECEMBER"]) < 8){
		candidateEntry.boundaries["FALL_END"] = candidateEntry.boundaries["FALL_END"] - 1;
	}

	//WINTER
	candidateEntry.boundaries["WINTER_START"] = candidateEntry.monthMarkers["JANUARY"];
	for(var i = 0, fridays = 0; fridays <= 3; i++){
		if(candidateEntry[candidateEntry.boundaries["WINTER_START"] + i].dayOfWeek == "FRI"){
			fridays++;
			if(fridays == 3){
				candidateEntry.boundaries["WINTER_END"] = candidateEntry.boundaries["WINTER_START"] + i + 1;
			}
		}
	}
	switch(candidateEntry[candidateEntry.boundaries["WINTER_START"]].dayOfWeek){
		case "WED": candidateEntry.boundaries["WINTER_END"] = candidateEntry.boundaries["WINTER_END"] + 4;
		break;
		case "THU": candidateEntry.boundaries["WINTER_END"] = candidateEntry.boundaries["WINTER_END"] + 6;
		break;
		case "FRI": candidateEntry.boundaries["WINTER_END"] = candidateEntry.boundaries["WINTER_END"] + 9;
		break;
		default:
	}
	//SPRING
	candidateEntry.boundaries["SPRING_START"] = candidateEntry.boundaries["WINTER_END"];
	while(candidateEntry[candidateEntry.boundaries["SPRING_START"]].dayOfWeek == "FRI"){
		candidateEntry.boundaries["WINTER_END"] = candidateEntry.boundaries["WINTER_END"] + 1;
		candidateEntry.boundaries["SPRING_START"] = candidateEntry.boundaries["SPRING_START"] + 1;
	}
	candidateEntry.boundaries["SPRING_END"] = candidateEntry.monthMarkers["JUNE"] - 14;
	while(candidateEntry[candidateEntry.boundaries["SPRING_END"]].dayOfWeek != "MON"){
		candidateEntry.boundaries["SPRING_END"] = candidateEntry.boundaries["SPRING_END"] - 1;
	}
	//SUMMER
	candidateEntry.boundaries["SUMMER_START"] = 0 + candidateEntry.monthMarkers["JUNE"] - 1;
	candidateEntry.boundaries["SUMMER_END"] = candidateEntry.boundaries["SUMMER_START"] + (12*7);
}

function SetTypes(data){
	var index = 0;
	index += data.holidayMarkers["THANKSGIVING"];
	assignSpecialHolidays(data, index);
	
	index = 0;
	index += data.holidayMarkers["CESARCHAVEZ"];
	assignSpecialHolidays(data, index);
	
	index = data.boundaries["FALL_END"];
	assignFinals(data, index);
	
	index = data.boundaries["SPRING_END"];
	assignFinals(data, index);
	
	index = data.previousYearEnd;
	var end = data.boundaries["FALL_START"];
	assignAWD(data, index, end);
	
	index = data.boundaries["FALL_END"];
	end = data.monthMarkers["DECEMBER"] + 24;
	assignAWD(data, index, end);
	
	index = data.boundaries["SPRING_END"];
	end = data.boundaries["SUMMER_START"]
	assignAWD(data, index, end);
	
	index = data.boundaries["FALL_START"];
	end = data.boundaries["FALL_END"];
	assignID(data, index, end);
	
	index = data.boundaries["WINTER_START"];
	end = data.boundaries["WINTER_END"];
	assignID(data, index, end);
	
	index = data.boundaries["SPRING_START"];
	end = data.boundaries["SPRING_END"];
	assignID(data, index, end);
	
	index = data.boundaries["SUMMER_START"];
	end = data.boundaries["SUMMER_END"];
	assignID(data, index, end);
	
	index = data.boundaries["SUMMER_START"] - 1;
	assignCOMM(data, index);
	
	assignCONV(data);
}

function assignSpecialHolidays(data, index){
	while(data[index].dayOfWeek != "MON"){
		index--;
	}
	while(data[index].dayOfWeek != "SAT"){
		if(data[index].type != "HOLI"){
			data[index].type = "ACAD";
		}
		index++;
	}
}

function assignFinals(data, index){
	var numberOfFinals = 0;
	while(data[index].dayOfWeek == "SUN" || data[index].dayOfWeek == "SAT"){
		index++;
	}
	while(numberOfFinals < 6){
		if(data[index].dayOfWeek != "SUN"){
			data[index].type = "FINL";
			numberOfFinals++;
		}
		index++;
	}
}

function assignAWD(data, start, end){
	while(start < end){
		if(data[start].type != "FINL" && data[start].type != "HOLI" &&
			data[start].dayOfWeek != "SAT" && data[start].dayOfWeek != "SUN"){
			data[start].type = "ACAD";
		}
		start++;
	}
}

function assignID(data, start, end){
	while(start < end){
		if(data[start].type != "FINL" && data[start].type != "HOLI" && data[start].type != "ACAD"&&
			data[start].dayOfWeek != "SAT" && data[start].dayOfWeek != "SUN"){
			data[start].type = "INST";
		}
		start++;
	}
}
	
function assignCOMM(data, start){
	var commDays = 0;
	while(commDays < 4){
		if(data[start].dayOfWeek != "SUN" && data[start].dayOfWeek != "SAT" && data[start].type != "HOLI"){
			data[start].type = "COMM";
			commDays++;
		}
		start--;
	}
}
	
function assignCONV(data){
	for(var i = 5; i >= 2; i--){
		if(data[data.boundaries["FALL_START"] - i - 1].dayOfWeek == "FRI"){
			data.convocation =data.boundaries["FALL_START"] - i - 1;
			data[data.boundaries["FALL_START"] - i - 1].type = "CONV";
			i = 1;
		}
		if(data[data.boundaries["FALL_START"] - i - 1].dayOfWeek == "SUN" && (i >= 2)){
			data.convocation = data.boundaries["FALL_START"] - i;
			data[data.boundaries["FALL_START"] - i].type = "CONV";
			i = 1;
		}
	}
}

function filter(list, start, finish, filterFunction, searchValues){
	var filtered = [];
	for(var i = start; i < finish; i++){
		var day = list[i];
		if((typeof filterFunction == "undefined")||(typeof searchValues == "undefined") ||
				(filterFunction == false)||(searchValues == false)){
			filtered.push(day);
		}
		else{
			if(filterFunction(day, searchValues)){
				filtered.push(day);
			}		
		}
	}
	return filtered;
}

function isDay(day, searchValues){
	return (searchValues.indexOf(day.dayOfWeek) > -1);
}			

function isType(day, searchValues){
	return (searchValues.indexOf(day.type) > -1);
}

function updateData(data){
	data.reportCounts["ACAD_FALL"] = filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING"] = filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["INST_FALL"] = filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, ["INST"]).length;
	data.reportCounts["INST_SPRING"] = filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isType, ["INST"]).length;
	
	data.reportCounts["ACAD_FALL_AND_SPRING"] = 
		filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length + 
		filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ID_FALL_AND_SPRING"] = 
		filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, ["INST"]).length + 
		filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isType, ["INST"]).length;;
	data.reportCounts["ACAD_FALL_AND_SUN"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SUN"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SUN"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_MON"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["MON"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["MON"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_TUE"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["TUE"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["TUE"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_WED"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["WED"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["WED"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_THU"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["THU"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["THU"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_FRI"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["FRI"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["FRI"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FALL_AND_SAT"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SAT"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SAT"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_SUN"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SUN"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SUN"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_MON"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["MON"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["MON"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_TUE"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["TUE"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["TUE"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_WED"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["WED"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["WED"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_THU"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["THU"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["THU"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_FRI"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["FRI"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["FRI"]).length, isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SPRING_AND_SAT"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SAT"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SAT"]).length, isType, ["ACAD", "FINL", "COMM", "CONV"]).length;
	data.reportCounts["ACAD_AUG"] = filter(data, data.monthMarkers["AUGUST"], data.monthMarkers["SEPTEMBER"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_SEP"] = filter(data, data.monthMarkers["SEPTEMBER"], data.monthMarkers["OCTOBER"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_OCT"] = filter(data, data.monthMarkers["OCTOBER"], data.monthMarkers["NOVEMBER"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_NOV"] = filter(data, data.monthMarkers["NOVEMBER"], data.monthMarkers["DECEMBER"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_DEC"] = filter(data, data.monthMarkers["DECEMBER"], data.monthMarkers["JANUARY"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_JAN"] = filter(data, data.monthMarkers["JANUARY"], data.monthMarkers["FEBRUARY"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_FEB"] = filter(data, data.monthMarkers["FEBRUARY"], data.monthMarkers["MARCH"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_MAR"] = filter(data, data.monthMarkers["MARCH"], data.monthMarkers["APRIL"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_APR"] = filter(data, data.monthMarkers["APRIL"], data.monthMarkers["MAY"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["ACAD_MAY"] = filter(data, data.monthMarkers["MAY"], data.monthMarkers["JUNE"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length;
	data.reportCounts["INST_FALL_AND_SUN"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SUN"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SUN"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_MON"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["MON"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["MON"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_TUE"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["TUE"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["TUE"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_WED"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["WED"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["WED"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_THU"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["THU"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["THU"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_FRI"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["FRI"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["FRI"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_FALL_AND_SAT"] = filter(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SAT"]),
		0, filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["SAT"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_SUN"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SUN"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SUN"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_MON"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["MON"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["MON"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_TUE"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["TUE"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["TUE"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_WED"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["WED"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["WED"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_THU"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["THU"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["THU"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_FRI"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["FRI"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["FRI"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_SPRING_AND_SAT"] = filter(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SAT"]),
		0, filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["SAT"]).length, isType, ["INST"]).length;
	data.reportCounts["INST_AUG"] = filter(data, data.monthMarkers["AUGUST"], data.monthMarkers["SEPTEMBER"], isType, ["INST"]).length;
	data.reportCounts["INST_SEP"] = filter(data, data.monthMarkers["SEPTEMBER"], data.monthMarkers["OCTOBER"], isType, ["INST"]).length;
	data.reportCounts["INST_OCT"] = filter(data, data.monthMarkers["OCTOBER"], data.monthMarkers["NOVEMBER"], isType, ["INST"]).length;
	data.reportCounts["INST_NOV"] = filter(data, data.monthMarkers["NOVEMBER"], data.monthMarkers["DECEMBER"], isType, ["INST"]).length;
	data.reportCounts["INST_DEC"] = filter(data, data.monthMarkers["DECEMBER"], data.monthMarkers["JANUARY"], isType, ["INST"]).length;
	data.reportCounts["INST_JAN"] = filter(data, data.monthMarkers["JANUARY"], data.monthMarkers["FEBRUARY"], isType, ["INST"]).length;
	data.reportCounts["INST_FEB"] = filter(data, data.monthMarkers["FEBRUARY"], data.monthMarkers["MARCH"], isType, ["INST"]).length;
	data.reportCounts["INST_MAR"] = filter(data, data.monthMarkers["MARCH"], data.monthMarkers["APRIL"], isType, ["INST"]).length;
	data.reportCounts["INST_APR"] = filter(data, data.monthMarkers["APRIL"], data.monthMarkers["MAY"], isType, ["INST"]).length;
	data.reportCounts["INST_MAY"] = filter(data, data.monthMarkers["MAY"], data.monthMarkers["JUNE"], isType, ["INST"]).length;
	data.reportCounts["INST_SUMMER"] = filter(data, data.boundaries["SUMMER_START"], data.boundaries["SUMMER_END"], isType, ["INST"]).length;
	data.reportCounts["INST_WINTER"] = filter(data, data.boundaries["WINTER_START"], data.boundaries["WINTER_END"], isType, ["INST"]).length;
	data.reportCounts["VETERANS_SWITCH"] = false;
}

function checkRules(data){
	var errors = [];
	var softRules = data.conditions;
	if(softRules[0] == 1){
		var idDaysFall = filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isType, "INST");
		var idDaysSpring = filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isType, "INST");
		if(((filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, "MON").length != 14)&&
			(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, "MON").length != 15))||
			((filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, "TUE").length != 14)&&
			(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, "TUE").length != 15))||
			((filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, "WED").length != 14)&&
			(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, "WED").length != 15))||
			((filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, "THU").length != 14)&&
			(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, "THU").length != 15))||
			((filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, "FRI").length != 14)&&
			(filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, "FRI").length != 15))||
			((filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, "MON").length != 14)&&
			(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, "MON").length != 15))||
			((filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, "TUE").length != 14)&&
			(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, "TUE").length != 15))||
			((filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, "WED").length != 14)&&
			(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, "WED").length != 15))||
			((filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, "THU").length != 14)&&
			(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, "THU").length != 15))||
			((filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, "FRI").length != 14)&&
			(filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, "FRI").length != 15))){
				errors.push("UNEVEN ID/WEEKDAY BALANCE");
		}
	}
	if(softRules[1] == 1){
		if(data[data.boundaries["FALL_START"]].dayOfWeek != "MON"){
			errors.push("FALL DOESN'T START ON MONDAY");
		}
	}
	if(softRules[2] == 1){
		if(data.boundaries["FALL_START"] - data.previousYearEnd < 7){
			errors.push("UNDER 1 WEEK SUMMER TO FALL");
		}
	}
	if(softRules[3] == 1){
		
		if(data[data.convocation].dayOfWeek != "FRI"){
			errors.push("CONV NOT FRIDAY BEFORE FALL START");
		}
		
		/*
		var convIndex = 0;
		while(data[convIndex].type != "CONV"){
			convIndex++;
		}
		if(!((data[convIndex].dayOfWeek == "FRI")&&(data[data.boundaries["FALL_START"]] - convIndex == 3))){
			errors.push("CONV NOT FRIDAY BEFORE FALL START");
		}
		*/
	}
	var totalID = filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_END"], isDay, ["MON", "TUE", "WED", "THU", "FRI"]).length; 
			totalID -= filter(data, data.boundaries["FALL_START"], data.boundaries["FALL_START"], isType, ["HOLI", "ACAD"]).length ;
			totalID += filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isDay, ["MON", "TUE", "WED", "THU", "FRI"]).length;
			totalID -= filter(data, data.boundaries["SPRING_START"], data.boundaries["SPRING_END"], isType, ["HOLI", "ACAD"]).length ;
	if(softRules[4] == 1){
		var start = data.holidayMarkers["THANKSGIVING"] - 1;
		if(totalID - 3 >= 145){
			for(var i = 0; i < 3; i++){
				data[start - i].type = "ACAD";
			}
			totalID -= 3;
		}	
		else{
			for(var i = 0; i < 3; i++){
				data[start - i].type = "INST";
			}
			errors.push("NOT 3 AWD BEFORE THANKSGIVING");
		}
	}
	if(softRules[5] == 1){
		var start = data.boundaries["SUMMER_START"];
		
		
		while(data[start].type != "COMM"){
			start--;
		}
		var chain = 1;
		var commCount = 0;
		while(commCount < 4){
			
			if(data[start].type == "COMM"){
				commCount++;
			}
			chain++;
			start--;
		}
		if(data[start].dayOfWeek == "MON" && chain == 4){
			errors.push("COMMENCEMENT NOT TUES TIL FRI");
		}
	}
	if(softRules[6] == 1){
		var start = data.holidayMarkers["CESARCHAVEZ"];
		if(data[start].dayOfWeek == "FRI"){
			if(data[start - 1].type != "ACAD"){
				errors.push("CESAR CHAVEZ NOT IN SPRING BREAK");
			}
		}
		else{
			if(data[start + 1].type != "ACAD"){
				errors.push("CESAR CHAVEZ NOT IN SPRING BREAK");
			}
		}
	}
	if(softRules[7] == 1){
		var start = 0 + data.boundaries["FALL_END"];
		while(data[start].dayOfWeek == "SUN"){
			start ++;
		}
		if(data[start.dayOfWeek] != "MON"){
			errors.push("FALL FINALS DON'T START MONDAY");
		}
	}
	if(softRules[8] == 1){
		var start = 0 + data.boundaries["SPRING_END"];
		while(data[start].dayOfWeek == "SUN"){
			start ++;
		}
		if(data[start.dayOfWeek] != "MON"){
			errors.push("SPRING FINALS DON'T START MONDAY");
		}
	}
	if(softRules[9] == 1){
		var start = data.monthMarkers["JUNE"];
		while((data[start].tye != "HOLI") && ( data[start].tye != "COMM")){
			start ++;
		}
		if(data[start].tye == "COMM"){
			errors.push("COMMENCEMENT NOT BEFORE MEMORIDAL DAY");
		}
	}
	if(data.previousYearEnd > data.boundaries["FALL_START"]){
		errors.push("YEAR-FALL OVERLAP");
	}
	if(data.boundaries["FALL_START"] > data.boundaries["FALL_END"]){
		errors.push("NO FALL");
	}
	if(data.boundaries["FALL_END"] > data.boundaries["WINTER_START"]){
		errors.push("FALL-WINTER OVERLAP");
	}
	if(data.boundaries["WINTER_START"] > data.boundaries["WINTER_END"]){
		errors.push("NO WINTER");
	}
	if(data.boundaries["WINTER_END"] > data.boundaries["SPRING_START"]){
		errors.push("WINTER-SPRING OVERLAP");
	}
	if(data.boundaries["SPRING_START"] > data.boundaries["SPRING_END"]){
		errors.push("NO SPRING");
	}
	if(data.boundaries["SPRING_END"] > data.boundaries["SUMMER_START"]){
		errors.push("SPRING-SUMMER OVERLAP");
	}
	if(data.boundaries["SUMMER_START"] > data.boundaries["SUMMER_END"]){
		errors.push("NO SUMMER");
	}
	
	if((data.boundaries["FALL_END"] - data.boundaries["FALL_START"]) < 106){
		errors.push("FALL NOT 15 WEEKS LONG");
	}
	if((data.boundaries["SPRING_END"] - data.boundaries["SPRING_START"]) < 106){
		errors.push("SPRING NOT 15 WEEKS LONG");
	}
	if(totalID < 145){
		errors.push("ID LESS THAN 145");
	}
	if(totalID > 149){
		errors.push("ID MORE THAN 149");
	}
	if(filter(data, data.previousYearEnd, data.boundaries["WINTER_START"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length + 
		filter(data, data.boundaries["SPRING_START"], data.boundaries["SUMMER_START"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length < 170){
		errors.push("AWD LESS THAN 170");
	}
	if(filter(data, data.previousYearEnd, data.boundaries["WINTER_START"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length + 
		filter(data, data.boundaries["SPRING_START"], data.boundaries["SUMMER_START"], isType, ["ACAD", "FINL", "COMM", "CONV", "INST"]).length > 180){
		errors.push("AWD MORE THAN 180");
	}

	if(data[data.boundaries["FALL_START"]].dayOfWeek == "FRI"){
		errors.push("FALL START ON FRIDAY");
	}
	if(data[data.boundaries["SPRING_START"]].dayOfWeek == "FRI"){
		errors.push("SPRING START ON FRIDAY");
	}
	if(filter(data, data.boundaries["FALL_END"], data.boundaries["WINTER_START"], isType, "FINL").length < 6){
		errors.push("TOO FEW FALL FINALS");
	}
	if(filter(data, data.boundaries["SPRING_END"], data.boundaries["SUMMER_START"], isType, "FINL").length < 6){
		errors.push("TOO FEW SPRING FINALS");
	}
	if(data[data.boundaries["FALL_START"]].month == "AUG" && 
		data[data.boundaries["FALL_START"]].dayNumber < 17){
		errors.push("FALL START BEFORE AUG 17");
	}
	if(data[data.boundaries["FALL_START"]].month == "SEP" && 
		data[data.boundaries["FALL_START"]].dayNumber > 1){
		errors.push("FALL START AFTER SEP 1");
	}
	var leep = (data.year % 4 == 0)?1:0;
	if(data[data.boundaries["SPRING_START"]].month == "JAN" && 
		data[data.boundaries["SPRING_START"]].dayNumber < 15 + leep){
		errors.push("SPRING START BEFORE JAN 15 + LEEP");
	}
	if(data[data.boundaries["SUMMER_START"]].month != "MAY"){
		errors.push("SUMMER START AFTER MAY 31");
	}
	if(data[data.boundaries["SUMMER_END"]].month != "AUG"){
		errors.push("SUMMER END AFTER AUG 31");
	}
	if(data.boundaries["FALL_START"] - data.convocation < 2){
		errors.push("LESS THAN 2 DAYS CONV TO FALL");
	}
	if(data.boundaries["FALL_START"] - data.convocation > 5){
		errors.push("MORE THAN 5 DAYS CONV TO FALL");
	}
	if(filter(data, data.boundaries["WINTER_START"], data.boundaries["WINTER_END"], isType, "INST").length < 12){
		errors.push("LESS THAN 12 WINTER INST DAYS");
	}
	if(filter(data, data.boundaries["WINTER_START"], data.boundaries["WINTER_END"], isType, "INST").length > 15){
		errors.push("MORE THAN 15 WINTER INST DAYS");
	}
	if((data.boundaries["SUMMER_END"] - data.boundaries["SUMMER_START"]) / 7 != 12){
		errors.push("NOT 12 SUMMER WEEKS");
	}
	if(filter(data, data.boundaries["SPRING_END"], data.boundaries["SUMMER_START"], isType, "COMM").length != 4){
		errors.push("NOT 4 COMMENCEMEMT DAYS");
	}
	var springVacation = filter(data, data.monthMarkers["MARCH"], data.monthMarkers["MAY"], isType, ["HOLI", "ACAD"]);			
	if(springVacation.length != 5 && springVacation[0].dayOfWeek != "MON"){
		errors.push("SPRING VACATION NOT CALENDAR WEEK");
	}			
	var fallVacation = filter(data, data.holidayMarkers["THANKSGIVING"] - 3, data.holidayMarkers["THANKSGIVING"] + 2, isType, ["HOLI", "ACAD"]);
	if(fallVacation.length != 5 && fallVacation[0].dayOfWeek != "MON"){
		errors.push("FALL VACATION NOT CALENDAR WEEK");
	}			
	return errors;
}

function getPossibilities(data){
	//return array of possibilites for each index
	var fallStarts = [];
	var fallEnds = [];
	var winterEnds = []; //winter end = spring start
	var springEnds = []; 
	var summerStarts = []; // summer end = summer start + (12 * 7)
	
	//FALL_START
	for(var i = data.previousYearEnd; i < GetDayIndex(data, data[data.monthMarkers["SEPTEMBER"] + 2]); i++){
		while(data[i].dayOfWeek == "FRI" || data[i].dayOfWeek == "SAT" || data[i].dayOfWeek == "SUN" ||
			data[i].type == "HOLI" || i < GetDayIndex(data, data[data.monthMarkers["AUGUST"] + 16])){
			i++;
		}
		if(i < GetDayIndex(data, data[data.monthMarkers["SEPTEMBER"] + 2]))
			fallStarts.push(0 + i);
		//*not friday
		//*not weekend
		//*after august 16 (while-loop increment)(do first)
		//*after prevYearEnd (start condition)
		//*not on holiday
		//*before september 2 (termination condition)
	}
	
	//FALL_END
	var lastFallEnd = indexByStartAndCount(data.monthMarkers["DECEMBER"] + 23, 6, true, false);
	var earliestFallEnd = fallStarts[0] + 7 * 15;
	while(data[earliestFallEnd].dayOfWeek != "TUE"){
		earliestFallEnd++;
	}
	for(var i = earliestFallEnd; i < lastFallEnd; i++){
		while(data[i].dayOfWeek == "SAT" || data[i].dayOfWeek == "SUN" || data[i].type == "HOLI"){
			i++;
		}
		if(i < lastFallEnd)
			fallEnds.push(0 + i);
		//start at smallest 15 weeks possible (start condition) (times 15 then increment until TUES)
		//not holiday
		//not weekend
		//must have 7 days for finals before winter + 3 days for grading (end condition)
	}
	
	//WINTER_END&SPRING_START
	var earliestWinterEnd = indexByStartAndCount(data.monthMarkers["JANUARY"], 13, 1, false, true);
	var lastWinterEnd = indexByStartAndCount(data.monthMarkers["JANUARY"], 16, 1, false, false);
	for(var i = earliestWinterEnd; i < lastWinterEnd; i++){
		var leap = (data[data.monthMarkers["JANUARY"]].year % 4 == 0)?1:0;
		while(i < data.monthMarkers["JANUARY"] + 14 + leap || data[i].dayOfWeek == "SAT" || 
			data[i].dayOfWeek == "SUN" || data[i].type == "HOLI"){
			i++;
		}
		if((i < lastWinterEnd) && (data[i].dayOfWeek != "FRI")) 
			winterEnds.push(0 + i);
		//not friday
		//not holiday
		//not weekend
		//end - start >= 12 ID(start condition)
		//end - start <= 15 ID(termination condition)
		//after jan 14 + leep	
	}
	
	//SPRING_END
	var earliestSpringEnd = winterEnds[0] + 7 * 15;
	while(data[earliestSpringEnd].dayOfWeek != "TUE"){
		earliestSpringEnd++;
	}
	for(var i = earliestSpringEnd; i < data.monthMarkers["JUNE"] - 10; i ++){
		while(data[i].dayOfWeek == "SAT" || data[i].dayOfWeek == "SUN" || data[i].type == "HOLI"){
			i++;
		}
		//not holiday
		//not weekend
		//before jun 1 (termination condition) (subtract 6 for finals to exclude a saturday) (subtract 4 for convocation) 
		//smallest 15 weeks possible (start condition)
		if(i < data.monthMarkers["JUNE"] - 10)
			springEnds.push(0 + i);
	}
	
	//SUMMER_START
	var earliestSummerStart = indexByStartAndCount(springEnds[0], 10, 1, true, true);
	var augustStart = data.monthMarkers["JULY"] + 31;
	for(var i = earliestSummerStart; ((i < data.monthMarkers["JUNE"]) && ( i < augustStart + 30 - (12 * 7))); i++){
		while(data[i].dayOfWeek == "SAT" || data[i].dayOfWeek == "SUN"){
			i++;
		}
		if(((i < data.monthMarkers["JUNE"]) && ( i < augustStart + 30 - (12 * 7)))){
			summerStarts.push(i);
		}
		//before jun 1 (term condition)
		//summer start - spring end >= 7 + 4 exculding weekends. (initial while loop)
		//summers start + 12 * 7 must be less than september 1 (termination condition)
		//not holiday
		//not weekend
	}
		
	//direction = -1 or +1
	//countFridays is true or false (false for fall start and spring start (winter end))
	//earliest = flase means latest
	function indexByStartAndCount(initialIndex, daysRequired, directionVector, countFridays, earliest){
		if(directionVector == 1){
			daysRequired --;
		}
		while(daysRequired > 0){
			while(data[initialIndex].type == "HOLI" || data[initialIndex].dayOfWeek == "SAT" || data[initialIndex].dayOfWeek == "SUN"){
				initialIndex += directionVector;
			}
			daysRequired--;
			initialIndex += directionVector;
		}
		if(!countFridays){
			if(data[initialIndex.dayOfWeek == "FRI"]){
				if(earliest){
					initialIndex += 3;
				}
				else{
					initialIndex--;
				}
			}
		}
		return initialIndex;
	}
		
	return [fallStarts, fallEnds, winterEnds, springEnds, summerStarts];
}

function applyPossibilities(data, possibilites){
	
	//most important thing is holidays are set
	if(countPossibilities(possibilites) != 0){
		var softErrors = ["UNEVEN ID/WEEKDAY BALANCE", "FALL DOESN'T START ON MONDAY", "UNDER 1 WEEK SUMMER TO FALL", "CONV NOT FRIDAY BEFORE FALL START",
			"NOT 3 AWD BEFORE THANKSGIVING", "COMMENCEMENT NOT TUES TIL FRI", "CESAR CHAVEZ NOT IN SPRING BREAK"];
		var options = [];
		var conflicts = [];	
		var errors = [];		
		var testCount = 0;
		var smallestHardError = [];
		var possibleCalendar;
		
		var px = filter(data, data.previousYearEnd, data.holidayMarkers["CHRISTMAS"], isDay, ["MON", "TUE", "WED", "THU", "FRI"]).length - 
			filter(data, data.previousYearEnd, data.holidayMarkers["CHRISTMAS"], isType, ["HOLI"]).length;
		var ab;//
		var janc;//
		var cd;//
		var de;
		var ce;//
		for(var a = 0; a < possibilites[0].length; a++){
			for(var b = 0; b < possibilites[1].length; b++){
				var ab = filter(data, possibilites[0][a], possibilites[1][b], isDay, ["MON", "TUE", "WED", "THU", "FRI"]).length -
					filter(data, possibilites[0][a], possibilites[1][b], isType, ["HOLI"]).length;
								
				if(!((ab/5 < 14) || (ab/5 > 16))){
					
					for(var c = 0; c < possibilites[2].length; c++){
						wc = filter(data, data.boundaries["WINTER_START"],  possibilites[2][c], isDay, ["MON", "TUE", "WED", "THU", "FRI"]).length -
							filter(data, data.boundaries["WINTER_START"],  possibilites[2][c], isType, ["HOLI"]).length; 
						
						if(!((wc.length < 12) || (wc.length > 15))){

							for(var d = 0; d < possibilites[3].length; d++){
								var cd = filter(data, possibilites[2][c], possibilites[3][d], isDay,["MON", "TUE", "WED", "THU", "FRI"]).length - 
									filter(data, possibilites[2][c], possibilites[3][d], isType, ["HOLI"]).length;

											
								if(!((cd/5 < 14) || (cd/5 > 16) || ((ab) + (cd) - 4 < 145) || ((ab) + (cd) - 8 > 149))){
																									
									for(var e = 0; e < possibilites[4].length; e++){	
										var de = filter(data, possibilites[3][d], possibilites[4][e], isDay, ["MON", "TUE", "WED", "THU", "FRI"]).length - 
												filter(data, possibilites[3][d], possibilites[4][e], isType, ["HOLI"]).length;
									
										var ce = cd + de;
										
										if(!((de < 9) || ((px + ce) < 170) || (px + ce) > 180)){
																
											testCount++;
											if(testCount % 100 == 0)
												console.log(testCount);
											
											data.boundaries["FALL_START"] = 0 + possibilites[0][a];						
											data.boundaries["FALL_END"] = 0 + possibilites[1][b];
											data.boundaries["WINTER_END"] = 0 + possibilites[2][c];
											data.boundaries["SPRING_START"] = 0 + possibilites[2][c];
											data.boundaries["SPRING_END"] = 0 + possibilites[3][d];
											data.boundaries["SUMMER_START"] = 0 + possibilites[4][e];
											data.boundaries["SUMMER_END"] = 0 + data.boundaries["SUMMER_START"] + (12 * 7);
											
											SetTypes(data);
											updateData(data);
											errors = checkRules(data);

											if(errors.length != 0){
												possibleCalendar = constructCalendarData(
													data[0].year, 
													data[data.previousYearEnd],
													intToAnne(data.conditions));
													
												possibleCalendar = possibleCalendar.candidateEntryData;						
												possibleCalendar.boundaries["FALL_START"] = 0 + possibilites[0][a];						
												possibleCalendar.boundaries["FALL_END"] = 0 + possibilites[1][b];
												possibleCalendar.boundaries["WINTER_END"] = 0 + possibilites[2][c];
												possibleCalendar.boundaries["SPRING_START"] = 0 + possibilites[2][c];
												possibleCalendar.boundaries["SPRING_END"] = 0 + possibilites[3][d];
												possibleCalendar.boundaries["SUMMER_START"] = 0 + possibilites[4][e];
												possibleCalendar.boundaries["SUMMER_END"] = 0 + possibleCalendar.boundaries["SUMMER_START"] + (12 * 7);
												if((filterNewErrors(softErrors, errors).length == 0) && ((errors.length < conflicts.length) || (conflicts.length == 0))){
													conflicts = errors;
												}	
												else{
													if(smallestHardError.length == 0 || filterNewErrors(softErrors, errors).length < smallestHardError.length){
														smallestHardError =(errors);	
														if(smallestHardError.indexOf("") > 0){
															console.log();
														}
													}
												}
												
											}
											else{
												options.push(possibleCalendar);
											}
											
											// if(options.length > 0){
												// console.log(testCount);
												// return [options, conflicts];
											// }

											
										}
									}
								}
							}
						}
					}
				}
			}
		}

		console.log(smallestHardError);
		console.log(testCount);
		return [options, conflicts];
	}
	else{
		return [[], [checkRules(data)]]
	}
}

function anneToLyn(softErrors){
	var lyndons = [];
	for(var i = 0; i < softErrors.length; i++){
		switch(softErrors[i]){
			case "weekdayIdNum":lyndons.push("UNEVEN ID/WEEKDAY BALANCE");break;
			case "fallStartMon":lyndons.push("FALL DOESN'T START ON MONDAY");break;
			case "summerToFallMoreThanWeek":lyndons.push("UNDER 1 WEEK SUMMER TO FALL");break;
			case "convocationFriBeforeFirstID":lyndons.push("CONV NOT FRIDAY BEFORE FALL START");break;
			case "extendedFallBreak":lyndons.push("NOT 3 AWD BEFORE THANKSGIVING");break;
			case "commencementTueFri":lyndons.push("COMMENCEMENT NOT TUES TIL THURS");break;
			case "CesarChavezInSpringBreak":lyndons.push("CESAR CHAVEZ NOT IN SPRING BREAK");break;
			default:
		}
	}
	return lyndons;
}

function intToAnne(softErrors){
	var annes = [];
	for(var i = 0; i < softErrors.length; i++){
		if(softErrors[i] == 1){
			switch(i){
				case 0:annes.push("weekdayIdNum");break;
				case 1:annes.push("fallStartMon");break;
				case 2:annes.push("summerToFallMoreThanWeek");break;
				case 3:annes.push("convocationFriBeforeFirstID");break;
				case 4:annes.push("extendedFallBreak");break;
				case 5:annes.push("commencementTueFri");break;
				case 6:annes.push("CesarChavezInSpringBreak");break;
				case 7:annes.push("fallFinalsMonday");break;
				case 8:annes.push("springFinalsMonday");break;
				case 9:annes.push("commencementBeforeMemorial");break;
				default:
			}	
		}
	}
	return annes;
}

//TEMP FOR TEST
function countPossibilities(possibilities){
	return possibilities[0].length*possibilities[1].length*possibilities[2].length*possibilities[3].length*possibilities[4].length;
}

function boundByIndex(data, index){
	switch(index){
		case 0:
			return data.boundaries["FALL_START"];
			break;
		case 1:
			return data.boundaries["FALL_END"];
			break;
		case 2:
			return data.boundaries["WINTER_START"];
			break;
		case 3:
			return data.boundaries["WINTER_END"];
		break;
		case 4:
			return data.boundaries["SPRING_START"];
		break;
		case 5:
			return data.boundaries["SPRING_END"];
			break;
		case 6:
			return data.boundaries["SUMMER_START"];
			break;
		case 7:
			return data.boundaries["SUMMER_END"];
			break;
		default:
			break;
	}
}

function filterNewErrors(oldErrors, newErrors){
	var newErrorReturn = [];
	for(var i = 0; i < newErrors.length; i++){
		if(oldErrors.indexOf(newErrors[i]) < 0){
			newErrorReturn.push(newErrors[i]);
		}
	}
	return newErrorReturn;
}
