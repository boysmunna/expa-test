var app = angular.module('myApp', []);

app.controller('SearchController', function($scope, $http) {
	$scope.search = {};
	$scope.search.role = "";
	$scope.search.location = "";
    $http.get('/getusers')
    .then(function (response) {
    	$scope.users = response.data;
    })

    $scope.removeItem = function (userid) {
    	$http.put('/delete', {params: {"userid": userid}})
    	.then(function (response) {
    		$http.get('/getusers')
		    .then(function (response) {
		    	$scope.users = response.data;
		    })
    	})
    }

    $scope.sort = function (field, url) {
    	if (url === undefined) {
    		url = "/getusers?sort=" + field;
    	} else {
    		url += "&sort=" + field;
    	}
    	$http.get(url)
	    .then(function (response) {
	    	$scope.users = response.data;
	    })
    }

    $scope.searchUsers = function() {
    	$scope.url = "/getusers?"
    	if ($scope.search.location != "") {
    		$scope.url += "location=" + $scope.search.location;
    	}
    	if ($scope.search.role != "") {
    		if ($scope.search.location != "") {
    			$scope.url += "&";
    		}
    		$scope.url += "role=" + $scope.search.role;
    	}
    	$http.get($scope.url)
	    .then(function (response) {
	    	$scope.users = response.data;
	    })
    }
})