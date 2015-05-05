'use strict';

/* jshint -W098 */
angular.module('mean.rfid-reader').controller('RfidReaderController', ['$scope', 'Global', 'RfidReader',
  function($scope, Global, RfidReader) {
    $scope.global = Global;
    $scope.package = {
      name: 'rfid-reader'
    };
  }
]);
