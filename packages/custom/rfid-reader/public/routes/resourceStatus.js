'use strict';

angular.module('mean.rfid-reader').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('Summary status of all resources', {
      url: '/library/status',
      templateUrl: 'rfid-reader/views/resourceStatus.html'
    });
  }
]);
