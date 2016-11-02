/**
 * Created by lequan on 10/23/2016.
 */

app.service('AirportService', function () {

    var airports = {};

    var setAirports = function (data) {
        data.forEach(function (item) {
           airports[item.airportId] = item.name;
        });
    };

    var getAirports = function () {
        return airports;
    };

    var getCity = function (data) {
        for (var item in data) {
            if (data.hasOwnProperty(item)) {
                var flight = data[item];
                flight.departureCity = airports[flight.departure];
                flight.arrivalCity = airports[flight.arrival];
            }
        }
        return data;
    };

    return {
        setAirports: setAirports,
        getAirports: getAirports,
        getCity: getCity
    };
});

app.service('FlightService', function () {

    var availableFlights = [];

    var setFlights = function (flights) {
        availableFlights = flights;
    };

    var getFlights = function () {
        return availableFlights;
    };

    return {
        setFlights: setFlights,
        getFlights: getFlights
    };
});


app.service('TicketService', function () {

    var total_passenger = [];
    var id;
    var cost;

    var setTicket = function (passenger, bookingId, total_cost) {
        total_passenger = passenger;
        id = bookingId;
        cost =  total_cost;
    };

    var getPassenger = function () {
        return total_passenger;
    };

    var getBookingId = function () {
        return id;
    };

    var getCost = function () {
        return cost;
    };

    return {
        setTicket: setTicket,
        getPassenger: getPassenger,
        getBookingId: getBookingId,
        getCost: getCost
    };

});
