'use strict';

angular.module('mean.rfid-reader')
  .controller('ResourceStatusCtrl', ['$scope', '$http', function ($scope, $http) {

  // Get all needed information to display summary of the end point "library"
  $http.get('/library/status')
      .success(function (data, status, headers, config) {
        $scope.resourceStatusSummary = [];
        data.resources.forEach(function(element) {
          $scope.resourceStatusSummary.push({
            resource: element,
            person: searchRfid(element.person_rfid, data.people)
          });

        });
      })
      .error(function (data, status, headers, config) {
      });

  // Find person, who has RFID, that equals resourse's person_rfid
  function searchRfid (rfid, peopleArr) {
    /*jslint plusplus: true */
    for (var i = 0; i < peopleArr.length; i++) {
      if (peopleArr[i].rfid === rfid) {
        return peopleArr[i];
      }
    }
  }



}]);
  