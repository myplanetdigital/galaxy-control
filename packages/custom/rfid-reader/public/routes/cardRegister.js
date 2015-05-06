'use strict';

angular.module('mean.rfid-reader').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('New card ID registration', {
      url: '/card-registration',
      templateUrl: 'rfid-reader/views/cardRegister.html'
    });
  }
]);
