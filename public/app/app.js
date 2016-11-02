/**
 * Created by lequan on 10/20/2016.
 */

var app = angular.module('app', ['ngResource', 'ngRoute', 'ngMaterial']);

app.config(function ($routeProvider) {
    $routeProvider
        .otherwise({
            redirectTo: 'flight'
        })
        .when("/flight", {
            templateUrl: "flight.html",
            controller: 'FlightController'
        })
        .when("/booking", {
            templateUrl: "booking.html",
            controller: 'BookingController'
        })
        .when("/passenger", {
            templateUrl: "passenger.html",
            controller: 'PassengerController'
        });
});

