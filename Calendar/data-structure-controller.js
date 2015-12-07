(function(){
    'use strict';

    angular.module('calendar')
        .controller('dataCtrl',dataCtrl);

    function dataCtrl (){
        var vm = this;

        vm.gui = null;
        vm.calRowSplit = [];
        vm.totalCalSplit = [];
        vm.twoCalendarsArr = [];
        vm.year = null;
        vm.typesOfDays = ["ACAD", "INST", "CONV", "COMM", "FINL", "HOLI", "WKND", "FILL", "OPEN", "UNK"];
		vm.dayTypes = {
			ACAD: 'Academic Work Day',
			INST: 'Instructional Day',
			CONV: 'Convocation',
			COMM: 'Commencement',
			FINL: 'Finals',
			HOLI: 'Holiday',
			WKND: 'Weekend',
			FILL: 'Fill',
			OPEN: 'Open',
			UNK: 'Unknown'
		};

        vm.getCalendar = function(year){
            vm.year = year;
            var startDate = {};
			startDate.month = "AUG";
			startDate.day = 22;
			var conditions = [1,1,1,1,1,1,1];
            vm.gui = constructCalendarData(year, startDate, conditions);
            console.log(vm.gui);
            var counter = 0;
            vm.calRowSplit = [];
            vm.totalCalSplit = [];
            vm.twoCalendarsArr = [];
            for(var month in vm.gui.guiTree){
//            	console.log(vm.gui.guiTree[month]);
				console.log(month);
				counter++;
            	if(counter <= 4){
            		vm.calRowSplit.push(vm.gui.guiTree[month]);
            	} else {
            		counter = 1;
            		console.log(vm.calRowSplit);
            		vm.totalCalSplit.push(vm.calRowSplit);
            		vm.calRowSplit = [];
            		vm.calRowSplit.push(vm.gui.guiTree[month]);
            	}
            }
            vm.totalCalSplit.push(vm.calRowSplit);
            console.log('Done with splitting:');
            console.log(vm.totalCalSplit);
            vm.twoCalendarsArr.push(vm.totalCalSplit);
            vm.twoCalendarsArr.push(vm.totalCalSplit);
            console.log('Added the two arrays:');
            console.log(vm.twoCalendarsArr);
        };

//        var fallStart = vm.gui.candidateEntryData.previousYearEnd;
//        fallStart.month;
//        fallStart.dayNumber;
//        var springStart = vm.gui.candidateEntryData[vm.gui.candidateEntryData.boundaries["SPRING_START"]];
//        springStart.month;
//        springStart.dayNumber;


		/*
		*	Constructs data for the gui and analyzer
		*
		*	@param academicYear The starting year to be worked on
		*	@return Data for the gui and analyzer
		*/
		function constructCalendarData(academicYear, startDate, conditions){

			conditions = TranslateConditions(conditions);
			//DATA AND FUNCTIONS*********************/

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
				if(month == 1 && year % 4 == 0)
					return DayLimits[month] + 1;
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

			function ExecuteProgram(data, startDate, condition){
				SetConditions(data, startDate, conditions);
				InitializeHandles(data);
				SetTypes(data);
				updateData(data);
				var errors = checkRules(data);
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
						while(weekDayCounter < startDay && dayOfMonth <= dayLimit){
							var day = new Day(0, weekDayCounter, 7, 4);
							weekDayCounter++;
							week.daySet.push(day);
						}//stop filling

						//DAYS**/
						//here is where the true days are added to the calendar
						while(weekDayCounter < 7 && dayOfMonth <= dayLimit){

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

			if((typeof startDate !== "undefined")||(typeof conditions !== "undefined")){
				var spareConditions = ["weekdayIdNum", "fallStartMon", "summerToFallMoreThanWeek", "convocationFriBeforeFirstID",
					"extendedFallBreak", "commencementTueFri", "CesarChavezInSpringBreak"];

				var spareStartDate = [];
				spareStartDate.month = "AUG";
				spareStartDate.day = 18;

				ExecuteProgram(data.candidateEntryData, spareStartDate, spareConditions);
			}
			else{
				ExecuteProgram(data.candidateEntryData, startDate, conditions);
			}

			return data;
		}//end creation of data

		function SetConditions(candidateEntry, previousYearEnd, softRules){
			candidateEntry.conditions = softRules;
			candidateEntry.previousYearEnd = GetDayIndex(candidateEntry, previousYearEnd);
		}

		function SetDataCounts(candidateEntry){
			candidateEntry.reportCounts = {"ACAD_FALL_AND_SPRING" : 0, "ID_FALL_AND_SPRING" : 0, "ACAD_FALL_AND_SUN" : 0,
				"ACAD_FALL_AND_MON" : 0, "ACAD_FALL_AND_TUE" : 0, "ACAD_FALL_AND_WED" : 0, "ACAD_FALL_AND_THU" : 0,
				"ACAD_FALL_AND_FRI" : 0, "ACAD_FALL_AND_SAT" : 0, "ACAD_SPRING_AND_SUN" : 0, "ACAD_SPRING_AND_MON" : 0,
				"ACAD_SPRING_AND_TUE" : 0, "ACAD_SPRING_AND_WED" : 0, "ACAD_SPRING_AND_THU" : 0, "ACAD_SPRING_AND_FRI" : 0,
				"ACAD_SPRING_AND_SAT" : 0, "ACAD_AUG" : 0, "ACAD_SEP": 0, "ACAD_NOV": 0, "ACAD_DEC" : 0,
				"ACAD_JAN" : 0, "ACAD_FEB" : 0, "ACAD_MAR" : 0, "ACAD_APR": 0, "ACAD_MAY" : 0, "ACAD_SUMMER" : 0, "ACAD_WINTER" : 0, "INSTR_FALL_AND_SUN" : 0,
				"INST_FALL_AND_MON" : 0, "INST_FALL_AND_TUE" : 0, "INST_FALL_AND_WED" : 0, "INST_FALL_AND_THU" : 0,
				"INST_FALL_AND_FRI" : 0, "INST_FALL_AND_SAT" : 0, "INST_SPRING_AND_SUN" : 0, "INST_SPRING_AND_MON" : 0,
				"INST_SPRING_AND_TUE" : 0, "INST_SPRING_AND_WED" : 0, "INST_SPRING_AND_THU" : 0, "INST_SPRING_AND_FRI" : 0,
				"INST_SPRING_AND_SAT" : 0, "INST_AUG" : 0, "INST_SEP": 0, "INST_NOV": 0, "INST_DEC" : 0,
				"INST_JAN" : 0, "INST_FEB" : 0, "INST_MAR" : 0, "INST_APR": 0, "INST_MAY" : 0, "INST_SUMMER" : 0, "INST_WINTER" : 0,
				"ACAD_FALL" : 0, "ACAD_SPRING" : 0, "INST_FALL" : 0, "INST_SPRING" : 0};
			candidateEntry.summary = [];

			var fall = {"START_MON" : 0, "START_DATE" : candidateEntry.boundaries["FALL_START"], "PAYS_45_OR_LESS" : 0,
				"VETERANS_SWITCH": 0, "FALL_BREAK_DAYS" : 0, "FINALS_WEEK": 0, "PRO_FINAL_GAP": 0, "WINTER_GRADES": 0};
			var winter = {"INST_WINTER": candidateEntry.reportCounts["ACAD_WINTER"]}
			var spring = {"PROCESS_TIME": 0, "SPRING_START": candidateEntry.boundaries["SPRING_START"], "PAYS_45_OR_LESS" : 0,
				"CESAR_IN_SPRING": 0, "SAME_SPRING": 0};
			var summer = {"INST_SUMMER" : candidateEntry.reportCounts["ACAD_SUMMER"]};
			candidateEntry.summary.fall = fall;
			candidateEntry.summary.winter = winter;
			candidateEntry.summary.spring = spring;
			candidateEntry.summary.summer = summer;
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
			candidateEntry.monthMarkers = {AUGUST : 0, SEPTEMBER : 0, OCTOBER : 0, NOVEMBER : 0, DECEMBER : 0,
				JANUARY : 0, FEBRUARY : 0, MARCH : 0, APRIL : 0, MAY : 0, JUNE : 0, JULY : 0};
			var monthCounter = 0;
			for(var i = 0; i < candidateEntry.length - 1; i++){
				if(candidateEntry[i].month != candidateEntry[i + 1].month){
					monthCounter ++;
					if(monthCounter > 2){
						switch(monthCounter - 3){
							case 0:	candidateEntry.monthMarkers["AUGUST"] = i + 1; console.log(candidateEntry[candidateEntry.monthMarkers["AUGUST"]]);break;
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
			candidateEntry.holidayMarkers = {"THANKSGIVING" : 0, "CESARCHAVEZ" : 0, "VETERANS" : 0};
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
//			else{
				SetDayHoliday(candidateEntry, candidateEntry.monthMarkers["NOVEMBER"], "FRI", 4);
//			}
			//DECEMBER
			for(var i = 0; i < 7; i++)
				SetHoliday(candidateEntry, candidateEntry.monthMarkers["DECEMBER"] + 24 + i);
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

		function GetDayIndex(data, date){
			var counter = 0;
			while(date.month != data[counter].month){
				counter++;
			}
			while(date.day != data[counter].dayNumber){
				counter++;
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
			candidateEntry.boundaries["SUMMER_START"] = 0 + candidateEntry.monthMarkers["JUNE"];
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
			var daysTillStart = 0;
			var index = data.boundaries["FALL_START"];
			while(daysTillStart < 2 || data[index].dayOfWeek == "SAT" || data[index].dayOfWeek == "SUN"){
				index--;
				daysTillStart++;
			}
			data.convocation = index;
			data[data.convocation].type = "CONV";
		}

		function filter(list, start, finish, filterFunction, searchValues){
			var filtered = [];
			for(var i = start; i < finish; i++){
				var day = list[i];
				if(filterFunction(day, searchValues)){
					filtered.push(day);
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
				var convIndex = 0;
				while(data[convIndex].type != "CONV"){
					convIndex++;
				}
				if(!((data[convIndex].dayOfWeek == "FRI")&&(data[data.boundaries["FALL_START"]] - convIndex == 3))){
					errors.push("CONV NOT FRIDAY BEFORE FALL START");
				}
			}
			if(softRules[4] == 1){
				var start = data.holidayMarkers["THANKSGIVING"] - 1;
				for(var i = 0; i < 3; i++){
					if(data[start - i].type != "ACAD"){
						i = 3;
						errors.push("NOT 3 AWD BEFORE THANKSGIVING");
					}
				}
			}
			if(softRules[5] == 1){
				var start = data.boundaries["SUMMER_START"];
				while(data[start].type != "COMM"){
					start--;
				}
				if(data[start].dayOfWeek != "FRI"){
					errors.push("COMMENCEMENT NOT TUES TIL THURS");
				}
				else{

					for(var i = 0; i < 4; i++){
						if(data[start-i] != "COMM"){
							errors.push("COMMENCEMENT NOT TUES TIL THURS");
							i = 4;
						}
					}
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
			if(filter(data, data.previousYearEnd, data.boundaries["WINTER_START"], isType, "INST").length +
				filter(data, data.boundaries["SPRING_START"], data.boundaries["SUMMER_START"], isType, "INST").length < 145){
				errors.push("ID LESS THAN 145");
			}
			if(filter(data, data.previousYearEnd, data.boundaries["WINTER_START"], isType, "INST").length +
				filter(data, data.boundaries["SPRING_START"], data.boundaries["SUMMER_START"], isType, "INST").length > 149){
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
			if(data[data.boundaries["SUMMER_START"]].month != "JUN"){
				errors.push("SUMMER START BEFORE JUN 1");
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

		function decrementBoundByIndex(data, index){
			if(data.boundaries["FALL_START"] == index){
				data.boundaries["FALL_START"] = data.boundaries["FALL_START"] -1;
			}
			if(data.boundaries["FALL_END"] == index){
				data.boundaries["FALL_END"] = data.boundaries["FALL_END"] -1;
			}
			if(data.boundaries["WINTER_START"] == index){
				data.boundaries["WINTER_START"] = data.boundaries["WINTER_START"] -1;
			}
			if(data.boundaries["WINTER_END"] == index){
				data.boundaries["WINTER_END"] = data.boundaries["WINTER_END"] -1;
				data.boundaries["SPRING_START"] = data.boundaries["SPRING_START"] -1;
			}
			if(data.boundaries["SPRING_END"] == index){
				data.boundaries["SPRING_END"] = data.boundaries["SPRING_END"] -1;
			}
			if(data.boundaries["SUMMER_START"] == index){
				data.boundaries["SUMMER_START"] = data.boundaries["SUMMER_START"] -1;
			}
			if(data.boundaries["SUMMER_END"] == index){
				data.boundaries["SUMMER_END"] = data.boundaries["SUMMER_END"] -1;
			}
		}

		function incrementBoundByIndex(data, index){
			if(data.boundaries["FALL_START"] == index){
				data.boundaries["FALL_START"] = data.boundaries["FALL_START"] + 1;
			}
			if(data.boundaries["FALL_END"] == index){
				data.boundaries["FALL_END"] = data.boundaries["FALL_END"] + 1;
			}
			if(data.boundaries["WINTER_START"] == index){
				data.boundaries["WINTER_START"] = data.boundaries["WINTER_START"] + 1;
			}
			if(data.boundaries["WINTER_END"] == index){
				data.boundaries["WINTER_END"] = data.boundaries["WINTER_END"] + 1;
				data.boundaries["SPRING_START"] = data.boundaries["SPRING_START"] + 1;
			}
			if(data.boundaries["SPRING_END"] == index){
				data.boundaries["SPRING_END"] = data.boundaries["SPRING_END"] + 1;
			}
			if(data.boundaries["SUMMER_START"] == index){
				data.boundaries["SUMMER_START"] = data.boundaries["SUMMER_START"] + 1;
			}
			if(data.boundaries["SUMMER_END"] == index){
				data.boundaries["SUMMER_END"] = data.boundaries["SUMMER_END"] + 1;
			}
		}

		function moveLeft(data, boundary){

			var softErrors = ["UNEVEN ID/WEEKDAY BALANCE", "FALL DOESN'T START ON MONDAY", "UNDER 1 WEEK SUMMER TO FALL", "CONV NOT FRIDAY BEFORE FALL START",
					"NOT 3 AWD BEFORE THANKSGIVING", "COMMENCEMENT NOT TUES TIL THURS", "CESAR CHAVEZ NOT IN SPRING BREAK"];

			var reportErrors = [];
			var oldErrors = checkRules(data);
			var tempType = "";
			var i = 0 + boundary;
			var test = 0;
			do{
				test++;
				if(test > 10){
					exit();
				}
				i--;
			}while((data[i].dayOfWeek == "SAT" || data[i].dayOfWeek == "SUN"
				|| data[i].type == "HOLI") && data[i].type != "FINL");
			tempType = "" + data[i].type;
			data[i].type = "" + data[boundary].type;
			data[boundary].type = "" + tempType;
			decrementBoundByIndex(data, boundary);
			var newErrors = checkRules(data);

			newErrors = filterNewErrors(softErrors, newErrors);
			for(var j = 0; j < newErrors.length; j++){
				if(oldErrors.indexOf(newErrors[j]) < 0){
					tempType = "" + data[i].type;
					data[i].type = "" + data[boundary].type;
					data[boundary].type = "" + tempType;
					incrementBoundByIndex(data, boundary - 1);
					return newErrors;
				}
			}
			return checkRules(data);
		}

		function moveRight(data, boundary){

			var softErrors = ["UNEVEN ID/WEEKDAY BALANCE", "FALL DOESN'T START ON MONDAY", "UNDER 1 WEEK SUMMER TO FALL", "CONV NOT FRIDAY BEFORE FALL START",
					"NOT 3 AWD BEFORE THANKSGIVING", "COMMENCEMENT NOT TUES TIL THURS", "CESAR CHAVEZ NOT IN SPRING BREAK"];


			var reportErrors = [];
			var oldErrors = checkRules(data);
			var tempType = "";
			var i = 0 + boundary;
			do{
				i++;
			}while(data[i].dayOfWeek == "SAT" || data[i].dayOfWeek == "SUN"
				|| data[i].type == "HOLI" && data[i].type != "FINL");
			tempType = "" + data[i].type;
			data[i].type = "" + data[boundary].type;
			data[boundary].type = "" + tempType;
			incrementBoundByIndex(data, boundary);
			var newErrors = checkRules(data);
			for(var j = 0; j < newErrors.length; j++){
				if(oldErrors.indexOf(newErrors[j]) < 0){
					tempType = "" + data[i].type;
					data[i].type = "" + data[boundary].type;
					data[boundary].type = "" + tempType;
					decrementBoundByIndex(data, boundary + 1);
					reportErrors.concat(newErrors);
					j = newErrors.length;
					return newErrors;
				}
			}
			return checkRules(data);
		}

		function shift(data, start, end, direction){
			var errors = [];
			switch(direction){
				case "left":
					errors = moveLeft(data, start);
					if(errors.length == 0)
						errors = moveLeft(data, end);
					break;
				case "right":
					errors =  moveRight(data, start);
					if(errors.length == 0)
						errors = moveRight(data, end);
					break;
				default:
					break;
			}
			return errors;
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
					console.log("error");
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

		function getStrategy(error){
			//["FALL_START", "FALL_END", "WINTER_START", "WINTER_END", "SPRING_START", "SPRING_END", "SUMMER_START", "SUMMER_END", ]
			switch(error){
				case "AWD MORE THAN 180":
					return ["left", "right", "none", "none", "none", "right", "left", "none"];
					break;
				case "ID MORE THAN 149":
					return ["right", "left", "none", "right", "none", "none", "left", "none"];
					break;
				case "FALL NOT 15 WEEKS LONG":
					return ["left", "right", "none", "none", "none", "none", "none", "none"];
					break;
				case "SPRING NOT 15 WEEKS LONG":
					return ["none", "none", "none", "none", "left", "right", "none", "none"];
					break;
				case "ID LESS THAN 145":
					return ["left", "right", "none", "none", "none", "none", "none", "none"];
					break;
				case "AWD LESS THAN 170":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "FALL START ON FRIDAY":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "SPRING START ON FRIDAY":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "TOO FEW FALL FINALS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "TOO FEW SPRING FINALS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "FALL START BEFORE AUG 17":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "FALL START AFTER SEP 1":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "SPRING START BEFORE JAN 15 + LEEP":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "SUMMER START BEFORE JUN 1":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "SUMMER END AFTER AUG 31":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "LESS THAN 2 DAYS CONV TO FALL":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "MORE THAN 5 DAYS CONV TO FALL":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "LESS THAN 12 WINTER INST DAYS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "MORE THAN 15 WINTER INST DAYS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "NOT 12 SUMMER WEEKS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "NOT 4 COMMENCEMEMT DAYS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "SPRING VACATION NOT CALENDAR WEEK":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "FALL VACATION NOT CALENDAR WEEK":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "UNEVEN ID/WEEKDAY BALANCE":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "FALL DOESN'T START ON MONDAY":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "UNDER 1 WEEK SUMMER TO FALL":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "CONV NOT FRIDAY BEFORE FALL START":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "NOT 3 AWD BEFORE THANKSGIVING":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "COMMENCEMENT NOT TUES TIL THURS":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "CESAR CHAVEZ NOT IN SPRING BREAK":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				default:
					return ["none", "none", "none", "none", "none", "none", "none", "none"]
					break;
			}
		}

		function solutionPermutation(data, hard){
			var errors = checkRules(data);
			if(hard){
				var softErrors = ["UNEVEN ID/WEEKDAY BALANCE", "FALL DOESN'T START ON MONDAY", "UNDER 1 WEEK SUMMER TO FALL", "CONV NOT FRIDAY BEFORE FALL START",
					"NOT 3 AWD BEFORE THANKSGIVING", "COMMENCEMENT NOT TUES TIL THURS", "CESAR CHAVEZ NOT IN SPRING BREAK"];
				errors = filterNewErrors(softErrors, errors);
			}

			customEvening();
		}


		//first shorten ID
		function shortenID(data){
			while((checkRules(data)).indexOf("ID MORE THAN 149") > -1){
			//	if( == 150)
			}
		}

		function shortenAWD(data){
		//["FALL_START", "FALL_END", "WINTER_START", "WINTER_END", "SPRING_START", "SPRING_END", "SUMMER_START", "SUMMER_END", ]
		//["left", "right", "none", "none", "none", "right", "left", "none"];

			while((checkRules(data)).indexOf("AWD MORE THAN 180") > -1){
			//	if( == 181)
			}
			//this depends on
			//no start on fridays
			//selected start date (consider last)
			var oldErrors = checkRules(data);

			return newErrors;
		}
		//HARD RULES: DO WHILE ERROR EXISTS
		//SOFT RULES: DO WHILE ERROR EXISTS OR NEW ERROR CREATED
		//SetTypes(data)


		function customEvening(error){
			//["FALL_START", "FALL_END", "WINTER_START", "WINTER_END", "SPRING_START", "SPRING_END", "SUMMER_START", "SUMMER_END", ]
			switch(error){
				case "AWD MORE THAN 180":
					return ["left", "right", "none", "none", "none", "right", "left", "none"];
					break;
				case "ID MORE THAN 149":
					return ["right", "left", "none", "right", "none", "none", "left", "none"];
					break;
				case "FALL NOT 15 WEEKS LONG":
					return ["left", "right", "none", "none", "none", "none", "none", "none"];
					break;
				case "SPRING NOT 15 WEEKS LONG":
					return ["none", "none", "none", "none", "left", "right", "none", "none"];
					break;
				case "ID LESS THAN 145":
					return ["left", "right", "none", "none", "none", "none", "none", "none"];
					break;
				case "AWD LESS THAN 170":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "FALL START ON FRIDAY":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "SPRING START ON FRIDAY":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "TOO FEW FALL FINALS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "TOO FEW SPRING FINALS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "FALL START BEFORE AUG 17":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "FALL START AFTER SEP 1":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "SPRING START BEFORE JAN 15 + LEEP":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "SUMMER START BEFORE JUN 1":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "SUMMER END AFTER AUG 31":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "LESS THAN 2 DAYS CONV TO FALL":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "MORE THAN 5 DAYS CONV TO FALL":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "LESS THAN 12 WINTER INST DAYS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "MORE THAN 15 WINTER INST DAYS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "NOT 12 SUMMER WEEKS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "NOT 4 COMMENCEMEMT DAYS":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "SPRING VACATION NOT CALENDAR WEEK":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "FALL VACATION NOT CALENDAR WEEK":
					//return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "UNEVEN ID/WEEKDAY BALANCE":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "FALL DOESN'T START ON MONDAY":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "UNDER 1 WEEK SUMMER TO FALL":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "CONV NOT FRIDAY BEFORE FALL START":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "NOT 3 AWD BEFORE THANKSGIVING":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "COMMENCEMENT NOT TUES TIL THURS":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				case "CESAR CHAVEZ NOT IN SPRING BREAK":
					return ["none", "none", "none", "none", "none", "none", "none", "none"];
					break;
				default:
					return ["none", "none", "none", "none", "none", "none", "none", "none"]
					break;
			}
		}
		function overlayStrategy(strategy1, strategy2){
			for(var i = 0; i < 8; i++){
				switch(strategy1[i]){
					case "left":
						if(strategy2[i] == "right" || strategy2[i] == "killed"){
							strategy1[i] = "killed";
						}
						break;
					case "right":
						if(strategy2[i] == "left" || strategy2[i] == "killed"){
							strategy1[i] = "killed";
						}
						break;
					case "none":
						strategy1[i] = strategy2[i];
						break;
					case "killed":
						strategy1[i] = "killed";
						break;
					case "both":
						if(strategy2[i] == "left" || strategy2[i] == "right"){
							strategy1[i] = "strategy2[i]";
						}
						if(strategy2[i] == "killed"){
							strategy[i] = killed;
						}
						break;
					default:
						console.log("error");
						break;
				}
			}
			return strategy1;
		}

		function combineStrategies(errors){
			var strategy = ["none", "none", "none", "none", "none", "none", "none", "none"];
			for(var i = 0; i < errors.length; i++){
				strategy = overlayStrategy(strategy, getStrategy(errors[i]));
			}
			return strategy;
		}

		function recurseStrategy(blacklist, error){


		}

		function applyStrategies(data){
			var softErrors = ["UNEVEN ID/WEEKDAY BALANCE", "FALL DOESN'T START ON MONDAY", "UNDER 1 WEEK SUMMER TO FALL", "CONV NOT FRIDAY BEFORE FALL START",
					"NOT 3 AWD BEFORE THANKSGIVING", "COMMENCEMENT NOT TUES TIL THURS", "CESAR CHAVEZ NOT IN SPRING BREAK"];
			var errors = checkRules(data);
			console.log(errors);
			console.log(softErrors);
			errors = filterNewErrors(softErrors, errors);
			console.log(errors);
			var test = 0;
			while(errors != []){
				var strategy = combineStrategies(errors);
				console.log(strategy);
				var newErrors = [];
				//console.log(newErrors);

				for(var i = 0; i < 8 && newErrors != []; i++){
					console.log(i);
					switch(strategy[i]){
						case "left":
							do{
								test++;
									if(test > 200)
										exit();
								if(i == 1 || i == 5){
									newErrors = shift(data, boundByIndex(data, i), (boundByIndex(data, i) + 7), "left");
								}
								else if(i == 6){
									newErrors = shift(data, boundByIndex(data, i), (boundByIndex(data, i) + 4), "left");
								}
								else{
									newErrors = moveLeft(data, boundByIndex(data, i));
								}
								newErrors = filterNewErrors(errors, newErrors);
								newErrors = filterNewErrors(softErrors, newErrors);
								console.log(newErrors);
								if(newErrors.length != 0){
									console.log("error:");
									console.log(newErrors);
								}
							}while(newErrors == []);
							break;
						case "right":
							do{
								console.log( boundByIndex(data, i));
								test++;
									if(test > 200)
										exit();
								//console.log("NOT HERE");
								if(i == 1 || i == 10){
									newErrors = shift(data, boundByIndex(data, i), (boundByIndex(data, i) + 7), "right");
								}
								else if(i == 6){
									newErrors = shift(data, boundByIndex(data, i), (boundByIndex(data, i) + 4), "right");
								}
								else{
									newErrors = moveRight(data, boundByIndex(data, i));
								}
								console.log("winter end:");
								console.log( boundByIndex(data, i));
								console.log(filterNewErrors(softErrors, newErrors));
								console.log(data.boundaries["WINTER_END"]);
								newErrors = filterNewErrors(errors, newErrors);
								newErrors = filterNewErrors(softErrors, newErrors);
								console.log(newErrors);
								console.log(checkRules(data));
								console.log(newErrors != []);
							}while(newErrors == []);
							break;
						default:
							break;
					}
					errors = checkRules(data);
					errors = filterNewErrors(softErrors, errors);
					console.log(errors);
				}
			}
			return checkRules(data);
		}
    }
}());