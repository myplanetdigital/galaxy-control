'use strict';

angular.module('mean.rfid-reader').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('rfidReader example page', {
      url: '/rfidReader/example',
      templateUrl: 'rfid-reader/views/index.html'
    });
  }
]);
