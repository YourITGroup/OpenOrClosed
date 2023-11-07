﻿(function () {
    'use strict';

    function timePickerController($scope, angularHelper, dateHelper, validationMessageService) {

        let flatPickr = null;

        function onInit() {

            $scope.hasDatetimePickerValue = $scope.model.value ? true : false;
            $scope.model.datetimePickerValue = null;
            $scope.serverTime = null;
            $scope.serverTimeNeedsOffsetting = false;

            // setup the default config
            const config = {
                pickDate: false,
                pickTime: true,
                useSeconds: true,
                format: "HH:mm:ss",
                icons: {
                    time: "icon-time",
                    up: "icon-chevron-up",
                    down: "icon-chevron-down"
                }
            };

            if (!$scope.model.alias) {
                $scope.model.alias = `${Math.random()}`.replace('.', '_');
            }

            // map the user config
            $scope.model.config = Utilities.extend(config, $scope.model.config);

            // date picker config
            $scope.timePickerConfig = {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i:S",
                time_24hr: false,
                clickOpens: !$scope.readonly
            };

            setDatePickerVal();

            // Set the message to use for when a mandatory field isn't completed.
            // Will either use the one provided on the property type or a localised default.
            validationMessageService.getMandatoryMessage($scope.model.validation).then(function (value) {
                $scope.mandatoryMessage = value;
            });
        }

        $scope.clearDate = function ($event) {
            // $event.stopPropagation();
            // $event.preventDefault();
            $scope.hasDatetimePickerValue = false;
            if ($scope.model) {
                $scope.model.datetimePickerValue = null;
                $scope.model.value = null;
            }
            if ($scope.timePickerForm && $scope.timePickerForm.timepicker) {
                $scope.timePickerForm.timepicker.$setValidity("pickerError", true);
            }
        }

        $scope.timePickerSetup = function (instance) {
            flatPickr = instance;
        };

        $scope.timePickerChange = function (date) {
            const momentDate = moment(date, $scope.model.config.format);
            setDate(momentDate);
            setDatePickerVal();
        };

        $scope.inputChanged = function () {
            if ($scope.model.datetimePickerValue === "" && $scope.hasDatetimePickerValue) {
                // $scope.hasDatetimePickerValue indicates that we had a value before the input was changed,
                // but now the input is empty.
                $scope.clearDate();
            } else if ($scope.model.datetimePickerValue) {
                var momentDate = moment($scope.model.datetimePickerValue, $scope.model.config.format, true);
                if (!momentDate || !momentDate.isValid()) {
                    momentDate = moment(new Date($scope.model.datetimePickerValue));
                }
                if (momentDate && momentDate.isValid()) {
                    setDate(momentDate);
                }
                setDatePickerVal();
                flatPickr.setDate($scope.model.value, false);
            }
        }

        //here we declare a special method which will be called whenever the value has changed from the server
        //this is instead of doing a watch on the model.value = faster
        $scope.model.onValueChanged = function (newVal, oldVal) {
            if (newVal != oldVal) {
                //check for c# System.DateTime.MinValue being passed as the clear indicator
                var minDate = moment('0001-01-01');
                var newDate = moment(newVal);

                if (newDate.isAfter(minDate)) {
                    setDate(newDate);
                } else {
                    $scope.clearDate();
                }
            }
        };

        function setDate(momentDate) {
            angularHelper.safeApply($scope, function () {
                // when a date is changed, update the model
                if (momentDate && momentDate.isValid()) {
                    $scope.timePickerForm.timepicker.$setValidity("pickerError", true);
                    $scope.hasDatetimePickerValue = true;
                    $scope.model.datetimePickerValue = momentDate.format($scope.model.config.format);
                }
                else {
                    $scope.hasDatetimePickerValue = false;
                    $scope.model.datetimePickerValue = null;
                }
                updateModelValue(momentDate);
            });
        }

        function updateModelValue(momentDate) {
            if ($scope.hasDatetimePickerValue) {
                //check if we are supposed to offset the time
                if ($scope.model.value && Object.toBoolean($scope.model.config.offsetTime) && Umbraco.Sys.ServerVariables.application.serverTimeOffset !== undefined) {
                    $scope.model.value = dateHelper.convertToServerStringTime(momentDate, Umbraco.Sys.ServerVariables.application.serverTimeOffset);
                    $scope.serverTime = dateHelper.convertToServerStringTime(momentDate, Umbraco.Sys.ServerVariables.application.serverTimeOffset, "YYYY-MM-DD HH:mm:ss Z");
                }
                else {
                    $scope.model.value = momentDate.format("YYYY-MM-DD HH:mm:ss");
                }
                // $scope.model.value = momentDate.format($scope.model.config.format);
            }
            else {
                $scope.model.value = null;
            }

            setDirty();
        }
    
        function setDirty() {
            if ($scope.datePickerForm) {
                $scope.datePickerForm.datepicker.$setDirty();
            }
        }

        /** Sets the value of the date picker control adn associated viewModel objects based on the model value */
        function setDatePickerVal() {
            if ($scope.model.value) {
                var dateVal;
                //check if we are supposed to offset the time
                if ($scope.model.value && Object.toBoolean($scope.model.config.offsetTime) && $scope.serverTimeNeedsOffsetting) {
                    //get the local time offset from the server
                    dateVal = dateHelper.convertToLocalMomentTime($scope.model.value, Umbraco.Sys.ServerVariables.application.serverTimeOffset);
                    $scope.serverTime = dateHelper.convertToServerStringTime(dateVal, Umbraco.Sys.ServerVariables.application.serverTimeOffset, "YYYY-MM-DD HH:mm:ss Z");
                }
                else {
                    //create a normal moment , no offset required
                    var dateVal = $scope.model.value ? moment($scope.model.value, "YYYY-MM-DD HH:mm:ss") : moment();
                }
                //create a normal moment , no offset required
                // var dateVal = $scope.model.value ? moment($scope.model.value, $scope.model.config.format) : moment();
                $scope.model.datetimePickerValue = dateVal.format($scope.model.config.format);
            }
        }

        $scope.$watch("model.value", function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.hasDatetimePickerValue = newVal ? true : false;
                setDatePickerVal();
            }
        });

        onInit();

    }

    angular.module('umbraco')
        .controller('OpenOrClosed.PropertyEditors.TimePickerController', timePickerController);

})();