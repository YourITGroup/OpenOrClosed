function standardHoursController($scope, angularHelper, openOrClosedResource) {

    // setup the default config
    const config = {
        defaultOpen: "09:00",
        defaultClose: "17:00",
        showAppointmentOnly: false,
        showBankHolidays: false,
        timeFormat: "HH:mm:ss",
        time_24hr: true,
        labelOpen: 'Open',
        labelClosed: 'Closed',
        icons: {
            time: "icon-time",
            up: "icon-chevron-up",
            down: "icon-chevron-down"
        }
    }

    // map the user config
    $scope.model.config = angular.extend(config, $scope.model.config)

    //Umbraco persists boolean for prevalues as "0" or "1" so we need to convert that
    $scope.model.config.time_24hr = Object.toBoolean($scope.model.config.time_24hr)
    $scope.model.config.showAppointmentOnly = Object.toBoolean($scope.model.config.showAppointmentOnly)
    $scope.model.config.showBankHolidays = Object.toBoolean($scope.model.config.showBankHolidays)

    if ($scope.model.config.labelOpen.length === 0) {
        $scope.model.config.labelOpen = 'Open'
    }

    if ($scope.model.config.labelClosed.length === 0) {
        $scope.model.config.labelClosed = 'Closed'
    }

    $scope.vm = {
        pickers: [],
        openTimePickerConfig: {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i:S",
            time_24hr: $scope.model.config.time_24hr,
            defaultDate: $scope.model.config.defaultOpen,
        },
        closeTimePickerConfig: {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i:S",
            time_24hr: $scope.model.config.time_24hr,
            defaultDate: $scope.model.config.defaultClose,
        },
    }

    const daysoftheweek = [
            { id: '764dc03a-6f77-4607-b7b6-f650200a39a5', dotw: 'Monday' },
            { id: 'b138f333-b366-4f8a-891f-ea5d04e948b5', dotw: 'Tuesday' },
            { id: '2238d1fa-4d27-4b37-a12a-173518d0d105', dotw: 'Wednesday' },
            { id: '28020ef9-698a-4926-b5c4-b0a98fa15feb', dotw: 'Thursday' },
            { id: '0f818d67-10a7-41ed-a2eb-ae5a4bbd213e', dotw: 'Friday' },
            { id: '2667efc2-6747-4a2a-a758-f934b0ec6952', dotw: 'Saturday' },
            { id: 'b3cc2ff7-ac75-47e8-a615-567f9d8f6b72', dotw: 'Sunday' },
            { id: '587e1626-489e-4db2-99f7-a5efd599a59c', dotw: 'Bank Holidays' }
        ];

    function createDay(index) {
        return {
            id: daysoftheweek[index].id,
            dayoftheweek: daysoftheweek[index].dotw,
            isOpen: false,
            hoursOfBusiness: [
            ]
        }
    }

    function createHours() {
        return {
            opensAt: null,
            closesAt: null,
            id: openOrClosedResource.generateGuid()
        }
    }

    function createDayVm() {
        return {
            hours: [
            ]
        }
    }
    function createHoursVm() {
        return {
            opensAt: {
                picker: null,
                hasPickerValue: false,
                pickerValue: null
            },
            closesAt: {
                picker: null,
                hasPickerValue: false,
                pickerValue: null
            }
        }
    }

    function getDayVm(index) {
        return $scope.vm.pickers[index]
    }

    function getTimeVm(parentIndex, index, target) {
        return getDayVm(parentIndex).hours[index][target]
    }

    function getTimeValue(parentIndex, index) {
        return getDayValue(parentIndex).hoursOfBusiness[index]
    }

    function getDayValue(index) {
        return $scope.model.value[index]
    }

    $scope.timePickerSetup = function (parentIndex, index, target, instance) {
        getTimeVm(parentIndex, index, target).picker = instance
    }

    $scope.timePickerChange = function (parentIndex, index, target, time) {
        setTime(parentIndex, index, target, moment(time, $scope.model.config.timeFormat));
        setTimePickerVal(parentIndex, index, target);
    };

    $scope.clearTime = function (parentIndex, index, target) {
        let vm = getTimeVm(parentIndex, index, target)
        let timeValue = getTimeValue(parentIndex, index)
        vm.hasPickerValue = false
        if (timeValue[target]) {
            vm.pickerValue = null;
            timeValue[target] = null;
        }
    }

    $scope.timeInputChanged = function (parentIndex, index, target) {
        let vm = getTimeVm(parentIndex, index, target)
        if (vm.pickerValue === "" && vm.hasPickerValue) {
            // vm.hasPickerValue indicates that we had a value before the input was changed,
            // but now the input is empty.
            $scope.clearTime(parentIndex, index, target);
        } else if (vm.pickerValue) {
            const time = getTimeValue(parentIndex, index)[target]

            var momentTime = moment(vm.pickerValue, $scope.model.config.timeFormat, true);
            if (!momentTime || !momentTime.isValid()) {
                momentTime = moment(new Date(vm.pickerValue));
            }
            if (momentTime && momentTime.isValid()) {
                setTime(parentIndex, index, target, momentTime);
            }
            setTimePickerVal(parentIndex, index, target);
            vm.picker.setDate(time, false);
        }
    }

    function setTime(parentIndex, index, target, momentTime) {
        angularHelper.safeApply($scope, function () {
            const vm = getTimeVm(parentIndex, index, target)
            // when a date is changed, update the model
            if (momentTime && momentTime.isValid()) {
                vm.hasPickerValue = true;
                vm.pickerValue = momentTime.format($scope.model.config.timeFormat);
            }
            else {
                vm.hasPickerValue = false;
                vm.pickerValue = null;
            }
            updateModelTimeValue(parentIndex, index, target, momentTime);
        });
    }

    function updateModelTimeValue(parentIndex, index, target, momentTime) {
        let vm = getTimeVm(parentIndex, index, target)
        if (vm.hasPickerValue) {
            getTimeValue(parentIndex, index)[target] = momentTime.format($scope.model.config.timeFormat);
        }
        else {
            getTimeValue(parentIndex, index)[target] = null;
        }
        angularHelper.getCurrentForm($scope).$setDirty();
    }

    function setTimePickerVal(parentIndex, index, target) {
        const time = getTimeValue(parentIndex, index)[target]
        if (time) {
            let vm = getTimeVm(parentIndex, index, target)
            //create a normal moment, no offset required
            let dateVal = time ? moment(time, $scope.model.config.timeFormat) : moment();
            vm.pickerValue = dateVal.format($scope.model.config.timeFormat);
        }
        else {
            $scope.clearTime(parentIndex, index, target)
        }
    }

    $scope.toggleOpen = function (index) {
        let day = getDayValue(index)
        let vm = getDayVm(index)
        if (day.isOpen) {
            day.hoursOfBusiness = []
            vm.hours = []
            day.isOpen = false
        } else {
            day.isOpen = true
            $scope.addHours(index)
        }
    }

    $scope.toggleByAppointmentOnly = function (hours) {
        hours.byAppointmentOnly = !hours.byAppointmentOnly
    }

    $scope.addHours = function (index) {
        let day = getDayValue(index)
        let vm = getDayVm(index)

        if (!Array.isArray(day.hoursOfBusiness)) {
            vm.hoursOfBusiness = []
        }

        if (!Array.isArray(vm.hours)) {
            vm.hours = []
        }

        day.hoursOfBusiness.push(createHours())
        vm.hours.push(createHoursVm())
    }

    $scope.deleteHours = function (index, parentIndex) {
        let day = getDayValue(parentIndex)
        let vm = getDayVm(parentIndex)
        vm.hours.splice(index, 1)

        day.hoursOfBusiness.splice(index, 1)

        if (!Array.isArray(day.hoursOfBusiness) || day.hoursOfBusiness.length === 0) {
            $scope.toggleOpen(parentIndex)
        }
    }
    function init() {
        const dotwLength = $scope.model.config.showBankHolidays ? 8 : 7

        if (!$scope.model.value) {
            $scope.model.value = []
            for (let i = 0; i < dotwLength; i++) {
                $scope.model.value.push(createDay(i))
            }
        }
        else {
            if ($scope.model.config.showBankHoliday && $scope.model.value.length === 8) {
                $scope.model.value.pop()
            }
            else if ($scope.model.config.showBankHoliday && $scope.model.value.length === 7) {
                $scope.model.value.push(createDay(7))
            }
        }


        // Set up the vm for each one.
        for (let i = 0; i < dotwLength; i++) {
            var dayVm = createDayVm()
            let day = getDayValue(i)
            if (day.isOpen) {
                for (var j = 0; j < day.hoursOfBusiness.length; j++) {
                    let timeVm = createHoursVm()

                    timeVm.opensAt.hasPickerValue = true
                    timeVm.opensAt.pickerValue = day.hoursOfBusiness[j].opensAt

                    timeVm.closesAt.hasPickerValue = true
                    timeVm.closesAt.pickerValue = day.hoursOfBusiness[j].closesAt

                    dayVm.hours.push(timeVm)
                }
            }
            $scope.vm.pickers.push(dayVm)
        }
    }

    init()

}

angular.module('umbraco')
    .controller('OpenOrClosed.PropertyEditors.StandardHours.controller', standardHoursController);
