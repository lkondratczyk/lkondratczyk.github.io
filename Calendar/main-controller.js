(function () {
    'use strict';

    angular.module('calendar')
        .controller('mainCtrl', mainCtrl);

    mainCtrl.$inject = ['dataService'];

    function mainCtrl(dataService) {
        var vm = this;

        vm.showSelections = false;
        vm.showIdRadio = false;
        vm.year = new Date().getFullYear();
        vm.gui = null;

        // temp
        vm.count = 0;

        vm.selections = {
            rules: []
        };

        vm.softRules = {
            weekdayIdNum: 'Even distribution of one day per week classes (14-15)',
            convocationFriBeforeFirstID: 'Convocation is a Friday before the first Instructional Day (ID) of Fall semester',
            fallStartMon: 'Fall semester starts on a Monday',
            extendedFallBreak: 'Extended Fall break (take off Monday-Wednesday before Thanksgiving)',
            fallFinalsMonday: 'Fall semester finals start on a Monday - NEW',
            summerToFallMoreThanWeek: 'Difference between the end of Summer and start of Fall semester is more than 7 calendar days',
            CesarChavezInSpringBreak: 'Attempt to put Cesar Chavez Day in Spring Break',
            springFinalsMonday: 'Spring semester finals start on a Monday - NEW',
            commencementTueFri: 'Commencement is Tuesday - Friday',
            commencementBeforeMemorial: 'Commencement is before Memorial Day - NEW'
        };

        vm.hardRules = [
            "Fall semester is at least 15 weeks long",
            "Spring semester is at least 15 weeks long",
            "Between 145 and 149 Instructional Days",
            "Between 170 and 180 Academic Work Days",
            "Fall and Spring semesters do not start on a Friday",
            "Fall and Spring finals are a full week, not including Sunday",
            "Fall semester must start between Aug 17 and Sep 1",
            "Spring semester must start before Jan 15",
            "Summer session must start between May 31 and Aug 31",
            "2-5 days between Convocation and the beginning of Fall semester",
            "12-15 Winter Instructional Days",
            "Summer is at least 12 weeks",
            "4 days reserved for Commencement",
            "Fall and Spring Breaks are a calendar week"
        ];

        vm.rulesContainCtrlId = function() {
            for(var i in vm.selections.rules){
                //console.log(vm.selections.rules[i]);
                if(vm.selections.rules[i] == 'ctrlIdNum'){
                    return true;
                }
            }
            return false;
        };

        vm.finished = function() {
            vm.showIdRadio = vm.rulesContainCtrlId();
            console.log('SEND INFORMATION FOR BACKEND : '+vm.year);
            console.log(vm.selections.rules);
            console.log(vm.showIdRadio);
            vm.showSelections = true;
        };

        vm.constructCalendar = function(year) {
            vm.year = year;
            console.log('CONSTRUCT CALENDAR WITH: '+vm.year);
//            vm.gui = dataService.constructCalendarData(year);
            console.log('GUI TREE:');
            console.log(vm.gui);
        };

        console.log("Inside mainCtrl");
        //vm.gui = dataService.constructCalendarData(2017);
        //console.log('GUI TREE:');
        //console.log(vm.gui);
    }
}());