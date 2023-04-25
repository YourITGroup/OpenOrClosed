function specialHoursController($scope, angularHelper, localizationService) {
  // setup the default config
  const config = {
    excludeTimes: false,
    defaultToClosed: false,
    defaultOpen: '09:00',
    defaultClose: '17:00',
    showAppointmentOnly: false,
    removeOldDates: true,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    time_24hr: true,
    labelOpen: 'Open',
    labelClosed: 'Closed',
    closedHoursOptional: false,
    icons: {
      time: 'icon-time',
      date: 'icon-calendar',
      up: 'icon-chevron-up',
      down: 'icon-chevron-down',
    },
  };

  // map the user config
  $scope.model.config = angular.extend(config, $scope.model.config);

  //Umbraco persists boolean for prevalues as "0" or "1" so we need to convert that
  $scope.model.config.excludeTimes = Object.toBoolean(
    $scope.model.config.excludeTimes
  );
  $scope.model.config.defaultToClosed = Object.toBoolean(
    $scope.model.config.defaultToClosed
  );
  $scope.model.config.time_24hr = Object.toBoolean(
    $scope.model.config.time_24hr
  );
  $scope.model.config.showAppointmentOnly = Object.toBoolean(
    $scope.model.config.showAppointmentOnly
  );

  $scope.vm = {
    pickers: [],
    datePickerConfig: {
      enableTime: false,
      dateFormat: 'Y-m-d',
    },
    openTimePickerConfig: {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i:S',
      time_24hr: $scope.model.config.time_24hr,
      defaultDate: $scope.model.config.defaultOpen,
    },
    closeTimePickerConfig: {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i:S',
      time_24hr: $scope.model.config.time_24hr,
      defaultDate: $scope.model.config.defaultClose,
    },
    labels: {},
  };

  localizationService
    .localizeMany([
      'openOrClosed_open',
      'openOrClosed_closed',
      'openOrClosed_unrestricted',
      'openOrClosed_appointmentOnly',
    ])
    .then(function (data) {
      $scope.vm.labels.open = data[0];
      $scope.vm.labels.closed = data[1];
      $scope.vm.labels.unrestricted = data[2];
      $scope.vm.labels.appointmentOnly = data[3];

      // Now we can update our config.

      if (
        !$scope.model.config.labelOpen ||
        $scope.model.config.labelOpen.length === 0
      ) {
        $scope.model.config.labelOpen = $scope.vm.labels.open;
      }

      if (
        !$scope.model.config.labelClosed ||
        $scope.model.config.labelClosed.length === 0
      ) {
        $scope.model.config.labelClosed = $scope.vm.labels.closed;
      }
    });

  if (!$scope.model.value) {
    $scope.model.value = [];
  }

  function createDate() {
    return {
      date: null,
      isOpen: !$scope.model.config.defaultToClosed,
      comment: null,
      hoursOfBusiness: [createHours()],
    };
  }

  function createDateVm() {
    return {
      picker: null,
      hasPickerValue: false,
      pickerValue: null,
      hours: [createHoursVm()],
    };
  }

  function createHours() {
    return {
      opensAt: null,
      closesAt: null,
    };
  }

  function createHoursVm() {
    return {
      opensAt: {
        picker: null,
        hasPickerValue: false,
        pickerValue: null,
      },
      closesAt: {
        picker: null,
        hasPickerValue: false,
        pickerValue: null,
      },
    };
  }

  function getDateVm(index) {
    return $scope.vm.pickers[index];
  }

  function getTimeVm(parentIndex, index, target) {
    return getDateVm(parentIndex).hours[index][target];
  }

  function getDateValue(index) {
    return $scope.model.value[index];
  }

  function getTimeValue(parentIndex, index) {
    return getDateValue(parentIndex).hoursOfBusiness[index];
  }

  // Picker Setup callbacks
  $scope.datePickerSetup = function (index, instance) {
    getDateVm(index).picker = instance;
  };

  $scope.timePickerSetup = function (parentIndex, index, target, instance) {
    getTimeVm(parentIndex, index, target).picker = instance;
  };

  // Picker change callbacks
  $scope.datePickerChange = function (index, date) {
    setDate(index, moment(date));
    setDatePickerVal(index);
  };

  $scope.timePickerChange = function (parentIndex, index, target, time) {
    setTime(
      parentIndex,
      index,
      target,
      moment(time, $scope.model.config.timeFormat)
    );
    setTimePickerVal(parentIndex, index, target);
  };

  $scope.clearDate = function (index) {
    let vm = getDateVm(index);
    vm.hasPickerValue = false;
    if ($scope.model[index]) {
      vm.pickerValue = null;
      getDateValue(index).date = null;
    }
    //if ($scope.datePickerForm && $scope.datePickerForm.datepicker) {
    //    $scope.datePickerForm.datepicker.$setValidity("pickerError", true);
    //}
  };

  $scope.clearTime = function (parentIndex, index, target) {
    let vm = getTimeVm(parentIndex, index, target);
    let timeValue = getTimeValue(parentIndex, index);
    vm.hasPickerValue = false;
    if (timeValue[target]) {
      vm.pickerValue = null;
      timeValue[target] = null;
    }
    //if ($scope.datePickerForm && $scope.datePickerForm.datepicker) {
    //    $scope.datePickerForm.datepicker.$setValidity("pickerError", true);
    //}
  };

  $scope.dateInputChanged = function (index) {
    let vm = getDateVm(index);
    if (vm.pickerValue === '' && vm.hasPickerValue) {
      // vm.hasPickerValue indicates that we had a value before the input was changed,
      // but now the input is empty.
      $scope.clearDate(index);
    } else if (vm.pickerValue) {
      const date = getDateValue(index).date;

      var momentDate = moment(
        vm.pickerValue,
        $scope.model.config.dateFormat,
        true
      );
      if (!momentDate || !momentDate.isValid()) {
        momentDate = moment(new Date(vm.pickerValue));
      }
      if (momentDate && momentDate.isValid()) {
        setDate(index, momentDate);
      }
      setDatePickerVal(index);
      vm.picker.setDate(date, false);
    }
  };

  $scope.timeInputChanged = function (parentIndex, index, target) {
    let vm = getTimeVm(parentIndex, index, target);
    if (vm.pickerValue === '' && vm.hasPickerValue) {
      // vm.hasPickerValue indicates that we had a value before the input was changed,
      // but now the input is empty.
      $scope.clearTime(parentIndex, index, target);
    } else if (vm.pickerValue) {
      const time = getTimeValue(parentIndex, index)[target];

      var momentTime = moment(
        vm.pickerValue,
        $scope.model.config.timeFormat,
        true
      );
      if (!momentTime || !momentTime.isValid()) {
        momentTime = moment(new Date(vm.pickerValue));
      }
      if (momentTime && momentTime.isValid()) {
        setTime(parentIndex, index, target, momentTime);
      }
      setTimePickerVal(parentIndex, index, target);
      vm.picker.setDate(time, false);
    }
  };

  function setDate(index, momentDate) {
    let vm = getDateVm(index);
    angularHelper.safeApply($scope, function () {
      // when a date is changed, update the model
      if (momentDate && momentDate.isValid()) {
        //$scope.datePickerForm.datepicker.$setValidity("pickerError", true);
        vm.hasPickerValue = true;
        vm.pickerValue = momentDate.format($scope.model.config.dateFormat);
      } else {
        vm.hasPickerValue = false;
        vm.pickerValue = null;
      }
      updateModelDateValue(index, momentDate);
    });
  }

  function setTime(parentIndex, index, target, momentTime) {
    angularHelper.safeApply($scope, function () {
      const vm = getTimeVm(parentIndex, index, target);
      // when a date is changed, update the model
      if (momentTime && momentTime.isValid()) {
        //$scope.datePickerForm.datepicker.$setValidity("pickerError", true);
        vm.hasPickerValue = true;
        vm.pickerValue = momentTime.format($scope.model.config.timeFormat);
      } else {
        vm.hasPickerValue = false;
        vm.pickerValue = null;
      }
      updateModelTimeValue(parentIndex, index, target, momentTime);
    });
  }

  function updateModelDateValue(index, momentDate) {
    let vm = getDateVm(index);
    if (vm.hasPickerValue) {
      getDateValue(index).date = momentDate.format(
        $scope.model.config.dateFormat
      );
    } else {
      getDateValue(index).date = null;
    }
    angularHelper.getCurrentForm($scope).$setDirty();
  }

  function updateModelTimeValue(parentIndex, index, target, momentTime) {
    let vm = getTimeVm(parentIndex, index, target);
    if (vm.hasPickerValue) {
      getTimeValue(parentIndex, index)[target] = momentTime.format(
        $scope.model.config.timeFormat
      );
    } else {
      getTimeValue(parentIndex, index)[target] = null;
    }
    angularHelper.getCurrentForm($scope).$setDirty();
  }

  /** Sets the value of the date picker control and associated viewModel objects based on the model value */
  function setDatePickerVal(index) {
    const date = getDateValue(index).date;
    if (date) {
      let vm = getDateVm(index);
      //create a normal moment , no offset required
      let dateVal = date
        ? moment(date, $scope.model.config.dateFormat)
        : moment();
      vm.pickerValue = dateVal.format($scope.model.config.dateFormat);
    } else {
      $scope.clearDate(index);
    }
  }

  function setTimePickerVal(parentIndex, index, target) {
    const time = getTimeValue(parentIndex, index)[target];
    if (time) {
      let vm = getTimeVm(parentIndex, index, target);
      //create a normal moment , no offset required
      let dateVal = time
        ? moment(time, $scope.model.config.timeFormat)
        : moment();
      vm.pickerValue = dateVal.format($scope.model.config.timeFormat);
    } else {
      $scope.clearTime(parentIndex, index, target);
    }
  }

  $scope.toggleOpen = function (index) {
    let date = getDateValue(index);
    let vm = getDateVm(index);
    if (date.isOpen) {
      date.hoursOfBusiness = [];
      vm.hours = [];
      date.isOpen = false;
    } else {
      date.isOpen = true;
      $scope.addHours(index);
    }
  };

  $scope.setComment = function (val) {
    let day = getDayValue(index);
    day.comment = val;
  };

  $scope.toggleByAppointmentOnly = function (hours) {
    hours.byAppointmentOnly = !hours.byAppointmentOnly;
  };

  $scope.addDate = function () {
    $scope.model.value.push(createDate());
    $scope.vm.pickers.push(createDateVm());
  };

  $scope.addHours = function (index) {
    if (!$scope.model.config.excludeTimes) {
      let date = getDateValue(index);
      let vm = getDateVm(index);

      if (!Array.isArray(date.hoursOfBusiness)) {
        date.hoursOfBusiness = [];
      }

      if (!Array.isArray(vm.hours)) {
        vm.hours = [];
      }

      date.hoursOfBusiness.push(createHours());
      vm.hours.push(createHoursVm());
    }
  };

  $scope.deleteHours = function (index, parentIndex) {
    getDateVm(parentIndex).hours.splice(index, 1);

    let date = getDateValue(parentIndex);
    date.hoursOfBusiness.splice(index, 1);

    if (
      !Array.isArray(date.hoursOfBusiness) ||
      date.hoursOfBusiness.length === 0
    ) {
      $scope.toggleOpen(parentIndex);
    }
  };

  $scope.deleteDate = function (index) {
    $scope.model.value.splice(index, 1);
    $scope.vm.pickers.splice(index, 1);

    if (!Array.isArray($scope.model.value)) {
      $scope.model.value = [];
    }
    if (!Array.isArray($scope.vm.pickers)) {
      $scope.vm.pickers = [];
    }
  };

  function removeOldDates() {
    if ($scope.model.config.removeOldDates) {
      var tempDates = [];
      for (var i = 0; i < $scope.model.value.length; i++) {
        var date = Date.parse($scope.model.value[i].date);
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (date >= currentDate) {
          tempDates.push($scope.model.value[i]);
        }
        //else {
        //    $scope.oldDatesRemovedOnSave = true
        //}
      }
      $scope.model.value = tempDates;
    }
  }

  function init() {
    removeOldDates();

    // Set up the vm for each date.
    for (let i = 0; i < $scope.model.value.length; i++) {
      let dateVm = createDateVm();
      let date = getDateValue(i);

      // createDateVm automatically adds a default set of hours - we need to remove it.
      // We'll create a fresh one and populate it's values if needed further on.
      dateVm.hours.pop();

      dateVm.hasPickerValue = true;
      dateVm.pickerValue = date.date;

      if (date.isOpen) {
        if (!$scope.model.config.excludeTimes) {
          for (let j = 0; j < date.hoursOfBusiness.length; j++) {
            let timeVm = createHoursVm();
            timeVm.opensAt.hasPickerValue =
              date.hoursOfBusiness[j].opensAt !== null;
            timeVm.opensAt.pickerValue = date.hoursOfBusiness[j].opensAt;

            timeVm.closesAt.hasPickerValue =
              date.hoursOfBusiness[j].closesAt !== null;
            timeVm.closesAt.pickerValue = date.hoursOfBusiness[j].closesAt;

            dateVm.hours.push(timeVm);
          }
        }
      }
      $scope.vm.pickers.push(dateVm);
    }
  }

  init();
}

angular
  .module('umbraco')
  .controller(
    'OpenOrClosed.PropertyEditors.SpecialHours.controller',
    specialHoursController
  );
