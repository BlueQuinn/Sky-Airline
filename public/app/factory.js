/**
 * Created by lequan on 10/20/2016.
 */

app.factory('Airport', function ($resource) {
    return $resource('/airlines/airports/');
});

app.factory('Flight', function ($resource) {
    return $resource('/airlines/flights/');
});

app.factory('Booking', function ($resource) {
    return $resource('/airlines/bookings/');
});

app.factory('Passenger', function ($resource) {
    return $resource('/airlines/passengers/');
});
