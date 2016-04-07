var TheSceneryapp = angular.module('TheSceneryapp', ['ngRoute']);

 TheSceneryapp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'partials/landing.html'
        })
        .when('/performance', {
            templateUrl : 'partials/performanceAVED.html'
        })
        // .otherwise({
        //     redirectTo: '/'
        // });
  });
