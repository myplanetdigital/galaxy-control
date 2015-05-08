'use strict';
/*global $ */

angular.module('mean.rfid-reader')
  .controller('CardRegistrationCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
      
    // Get rfid from url
    var getParams = $location.search();
    if (getParams.rfid) {
      $scope.rfid = getParams.rfid;
    }
    else {
      $scope.rfid = null;
    }
    
    // Register button callback function saves specified data to DB
    $scope.registerCard = function (cardType) {
      var params = {rfid: $scope.rfid};
      if (cardType === 'resource') {
        params.description = $scope.resource.description;
        params.category = $scope.resource.category;
      }
      else if (cardType === 'person') {
        params.name = $scope.person.name;
        params.email = $scope.person.email;
      }
      
      // Save new card to DB
      $http.defaults.headers.post = {'Content-Type': 'application/json'};
      $http.post('/' + cardType, $.param(params))
      .success(function (data, status, headers, config) {
      })
      .error(function (data, status, headers, config) {
      });
      
    };


}]);
  