(function(){
    'use strict';

    angular.module('calendar')
        .service('dataService',dataService);

    function dataService (){
        return {
            constructCalendarData: constructCalendarData
        };
        /*****************GUITREE DATA/METHODS******************************/

        var Months = new Enum(["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]);
        var DayLimits = new Enum([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31])
        var DaysOfWeek = new Enum(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'UNK']);
        var DayTypes = new Enum(["ACAD", "INST", "CONV", "COMM", "FINL", "HOLI", "WKND", "FILL", "OPEN", "UNK"]);
        var Terms = new Enum(["FALL", "WINT", "SPRI", "SUMM", "UNK"]);

        /**
         *	Defines the data structures returned by the calendar maker. They reference
         *	eachother, so changing a day in one changes the other as well, so that the gui
         *	can update easily
         *
         *	@param guiTree The containers for gui mapping
         *	@param candidateList A list of eligible academic days for analysis
         */
        function ReturnData(guiTree, candidateList){
            this.guiTree = guiTree;
            this.candidateList = candidateList;
        }

        /**
         *	A tool to define immutable enumerated types
         *
         *	@param constantsList A list of values to associate with the enumerated type
         */
        function Enum(constantsList) {
            for (var i in constantsList) {
                this[constantsList[i]] = i;
            }
            return Object.freeze(constantsList);
        }

        /**
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

        /**
         *
         *	Creates a week object/container
         *
         *	@param daySet A container to hold days belonging to the week
         */
        function Week(daySet){
            this.daySet = daySet;
        }

        /**
         *	Creates a month object/container
         *
         *	@param monthNumber The indexed number relative to the year
         *	@param monthName The name of the month
         *	@param weekSet A container to hold the weeks of the month
         */
        function Month(weekSet, monthNumber, monthName){
            this.weekSet = weekSet;
            this.monthNumber = monthNumber;
            this.monthName = monthName;
        }

        /**
         *	Creates a year object/container
         *
         *	@param yearNumber The 4 digit year
         *	@param monthSet A container to hold the months of the year
         */
        function Year(monthSet, yearNumber){
            this.monthSet = monthSet;
            this.yearNumber = yearNumber;
        }

        /**
         *	Given a year and a month, this constructs the first day from the Date library
         *	to retrieves the first day of the week for the month
         */
        function getFirstWeekday(year, month){
            var date = new Date(year, month, 0);
            return (date.getDay() + 1) % 7;
        }

        /**
         *	For getting the count of days in a month
         */
        function getDaysInMonth(year, month){
            if(month == 1 && year % 4 == 0)
                return DayLimits[month] + 1;
            return DayLimits[month];
        }

        /*****************MAPPER******************************/
        /**
         *	Constructs data for the gui and analyzer
         *
         *	@param academicYear The starting year to be worked on
         *	@return Data for the gui and analyzer
         */
        function constructCalendarData(academicYear){

            //data to return
            var data = new ReturnData([], []);
            //always points to next calendar week day
            var startDay = getFirstWeekday(academicYear, 4);
            //gui displays from May of academic year to August of the next
            var yearCounter = academicYear;
            //starting in May
            var monthCounter = 4;

            /**YEARS**/
            while(yearCounter <= academicYear + 1){
                var year = new Year([], yearCounter);

                /**MONTHS**/
                while((yearCounter == academicYear && monthCounter < 12) || (yearCounter == academicYear + 1 && monthCounter < 8)){

                    var month = new Month([], monthCounter, Months[monthCounter], []);
                    var weekCounter = 0;
                    var dayOfMonth = 1;
                    var dayLimit = getDaysInMonth(yearCounter, monthCounter);

                    /**WEEKS**/
                    while(weekCounter < 6){ //six to fill the calendar data space

                        var week = new Week([], weekCounter, Terms[4]);
                        var weekDayCounter = 0;

                        //fill days in beginning of month
                        while(weekDayCounter < startDay && dayOfMonth <= dayLimit){
                            var day = new Day(0, weekDayCounter, 7, 4);
                            weekDayCounter++;
                            week.daySet.push(day);
                        }//stop filling

                        /**DAYS**/
                        //here is where the true days are added to the calendar
                        while(weekDayCounter < 7 && dayOfMonth <= dayLimit){

                            var day = new Day(dayOfMonth, weekDayCounter, 9, 4);
                            week.daySet.push(day);
                            if(weekDayCounter == 0 || weekDayCounter == 6){//assign weekends
                                day.type = DayTypes[6];
                            }
                            else{//leave weekends out of candidateList
                                day.month = monthCounter;
                                day.year = yearCounter;
                                data.candidateList.push(day);
                            }
                            dayOfMonth++;
                            weekDayCounter++;
                            //move start day to next day of week
                            startDay = (weekDayCounter == 7)?0:startDay + 1;

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

            return data;
        }//end creation of data

        /*****************COUNT-TABLE DATA/METHODS******************************/

        /**
         *	Data for the year
         *
         *	@param termSet The set of terms for the year
         */
        function YearCount(termSet){
            this.count = new Count(0, 0);
            this.termSet = termSet;
        }

        /**
         *	Data for a Term
         *
         *	@param term	The term index for Terms labels
         *	@param firstWeek Index for the first week of the term (found later)
         *	@param firstDay The first day of the term (found later)
         *	@param daySet A set of counters for each day of the week
         *	@param monthSet A set of counters for each month of the term
         */
        function TermCount(term, firstWeek, firstDay, daySet, monthSet){
            this.count = new Count(0, 0);
            this.term = Terms[term];
            this.firstWeek = firstWeek;
            this.firstDay = firstDay;
            this.daySet = daySet;
            this.monthSet = monthSet;
        }

        /**
         *	Data for a month
         *
         *	@param month The month index to get a Months label
         */
        function MonthCount(month){
            this.count = new Count(0, 0);
            this.month = Months[month];
        }

        /**
         *	Data for each day of the week
         *
         *	@param day The day of week index to get a label from DaysOfWeek
         */
        function DayCount(day){
            this.count = new Count(0, 0);
            this.day = DaysOfWeek[day];
        }

        /**
         *	A data structure to hold counts of awd an id days consistently
         *
         *	@param awdCount The awd count
         *	@param idCount The id count
         */
        function Count(awdCount, idCount){
            this.awdCount = awdCount;
            this.idCount = idCount;
        }

        /*****************COUNT-TABLE MAPPER******************************/

        /**
         *	Constructs the data table to be used by the program
         */
        function constructTable(){
            var data = new YearCount([]);
            for(var i = 0; i < 4; i++){
                //one year only
                data.termSet.push(new TermCount(i, null, null,[], []));
                for(var j = 0; j < 7; j++){ //SUN - SAT
                    data.termSet[i].daySet.push(new DayCount(j));
                }
                if(i == 0){ //FALL
                    for(var j = 0; j < 5; j++){
                        data.termSet[i].monthSet.push(new MonthCount((j + 7) % 12));
                    }
                }
                if(i == 1){ //WINTER
                    for(var j = 0; j < 2; j++){
                        data.termSet[i].monthSet.push(new MonthCount((j + 11) % 12));
                    }
                }
                if(i == 2){ //SPRING
                    for(var j = 0; j < 5; j++){
                        data.termSet[i].monthSet.push(new MonthCount(j));
                    }
                }
                if(i == 3){ //SUMMER
                    for(var j = 0; j < 3; j++){
                        data.termSet[i].monthSet.push(new MonthCount(j + 4));
                    }
                }
            }
            return data;
        }

        /*
         function getCounts(yearCount){

         }

         function updateCounts(){

         }

         function clearCounts(){

         }

         function iterator(actionFunctions, candidateList){
         for(var day in candidateList){
         for(var action in actionFunctions){

         }
         }
         }
         */
    }
}());