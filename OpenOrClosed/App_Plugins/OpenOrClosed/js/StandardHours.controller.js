function standardHoursController($scope, angularHelper, localizationService) {

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
        closedHoursOptional: false,
        labelBankHolidays: 'Bank Holidays',
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
        labels: {}
    }

    localizationService.localizeMany([
        'openOrClosed_open',
        'openOrClosed_closed',
        'openOrClosed_monday',
        'openOrClosed_tuesday',
        'openOrClosed_wednesday',
        'openOrClosed_thursday',
        'openOrClosed_friday',
        'openOrClosed_saturday',
        'openOrClosed_sunday',
        'openOrClosed_bankHoliday',
        'openOrClosed_unrestricted',
        'openOrClosed_appointmentOnly'
    ]
    ).then(function (data) {
        $scope.vm.labels.open = data[0]
        $scope.vm.labels.closed = data[1]
        $scope.vm.labels.monday = data[2]
        $scope.vm.labels.tuesday = data[3]
        $scope.vm.labels.wednesday = data[4]
        $scope.vm.labels.thursday = data[5]
        $scope.vm.labels.friday = data[6]
        $scope.vm.labels.saturday = data[7]
        $scope.vm.labels.sunday = data[8]
        $scope.vm.labels.bankHoliday = data[9]
        $scope.vm.labels.unrestricted = data[10]
        $scope.vm.labels.appointmentOnly = data[11]

        // Now we can update our config and initialise the data.

        if (!$scope.model.config.labelOpen || $scope.model.config.labelOpen.length === 0) {
            $scope.model.config.labelOpen = $scope.vm.labels.open
        }

        if (!$scope.model.config.labelClosed || $scope.model.config.labelClosed.length === 0) {
            $scope.model.config.labelClosed = $scope.vm.labels.closed
        }

        if (!$scope.model.config.labelBankHolidays || $scope.model.config.labelBankHolidays.length === 0) {
            $scope.model.config.labelBankHolidays = $scope.vm.labels.bankHoliday
        } else {
            $scope.vm.labels.bankHoliday = $scope.model.config.labelBankHolidays
        }

        init()
    })

    $scope.vm.getLabelByIndex = function(index) {
        return Object.values($scope.vm.labels)[index]
    }

    function createDay(index) {
        return {
            dayoftheweek: $scope.vm.getLabelByIndex(index + 2),
            isOpen: false,
            hoursOfBusiness: [
            ]
        }
    }

    function createHours() {
        return {
            opensAt: null,
            closesAt: null
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
            if (!$scope.model.config.showBankHolidays && $scope.model.value.length === 8) {
                $scope.model.value.pop()
            }
            else if ($scope.model.config.showBankHolidays && $scope.model.value.length === 7) {
                $scope.model.value.push(createDay(7))
            }
        }

        // Fix up bank holiday label from config.
        if ($scope.model.config.showBankHolidays) {
            $scope.model.value[7].dayoftheweek = $scope.model.config.labelBankHolidays
        }

        // Set up the vm for each one.
        for (let i = 0; i < dotwLength; i++) {
            let dayVm = createDayVm()
            let day = getDayValue(i)
            if (day.isOpen) {
                for (let j = 0; j < day.hoursOfBusiness.length; j++) {
                    let timeVm = createHoursVm()

                    timeVm.opensAt.hasPickerValue = day.hoursOfBusiness[j].opensAt !== null
                    timeVm.opensAt.pickerValue = day.hoursOfBusiness[j].opensAt

                    timeVm.closesAt.hasPickerValue = day.hoursOfBusiness[j].closesAt !== null
                    timeVm.closesAt.pickerValue = day.hoursOfBusiness[j].closesAt

                    dayVm.hours.push(timeVm)
                }
            }
            $scope.vm.pickers.push(dayVm)
        }
    }
}

angular.module('umbraco')
    .controller('OpenOrClosed.PropertyEditors.StandardHours.controller', standardHoursController);
