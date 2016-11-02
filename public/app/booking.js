/**
 * Created by lequan on 10/20/2016.
 */

app.controller('BookingController', function ($scope, $location, Booking, AirportService, FlightService, TicketService) {

    $scope.flights = FlightService.getFlights();

    $scope.departureFlight = -1;
    $scope.returnFlight = -2;
    $scope.total_passenger = $scope.flights.adult + $scope.flights.children + $scope.flights.baby;
    //$scope.departureFlight = -1;

    if ($scope.flights.departure.hasOwnProperty('0'))
    {
        $scope.hasDeparture = true;
        $scope.flights.departure = AirportService.getCity($scope.flights.departure);
    }
    else
    {
        $scope.hasDeparture = false;
    }


    $scope.hasReturn = true;
    if ($scope.flights.return !== undefined)
    {
        $scope.returnFlight = -1;

        if ($scope.flights.return.hasOwnProperty('0'))
        {
            $scope.flights.return = AirportService.getCity($scope.flights.return);
        }
        else
        {
            $scope.hasReturn = false;
        }
    }

    $scope.reserve = function () {
        if ($scope.departureFlight == -1)
        {
            alert('Bạn chưa chọn chuyến bay khởi hành');
            return;
        }
        if ($scope.returnFlight == -1)
        {
            alert('Bạn chưa chọn chuyến bay khứ hồi');
            return;
        }

        var departureFlight = $scope.flights.departure[$scope.departureFlight];
        var booking = {
            cost: $scope.departure.total_cost,
            passengers: {
                adult: $scope.flights.adult,
                children: $scope.flights.children,
                baby: $scope.flights.baby
            },
            flights: [
                {
                    flightId: departureFlight.flightId,
                    date: departureFlight.date,
                    class: getClass(departureFlight.class),
                    price: getPrice(departureFlight.price)
                }
            ]
        };
        if ($scope.returnFlight > 0)
        {
            var returnFlight = $scope.flights.return[$scope.returnFlight];
            booking.flights.push({
                flightId: returnFlight.flightId,
                date: returnFlight.date,
                class: getClass(returnFlight.class),
                price: getPrice(returnFlight.price)
            });
            booking.cost += $scope.return.total_cost;
        }

        Booking.save(booking, function (data) {
            if (data.status == 200)
            {
                alert(data.message);
                TicketService.setTicket(booking.passengers, data.bookingId, booking.cost);
                $location.path('/passenger');
            }
            else
            {
                alert(data.message);
            }
        });
    };


    $scope.updateDeparture = function (flights) {
        var flight = flights[$scope.departureFlight];
        $scope.departure = updateTicket(flight);
    };

    $scope.updateReturn = function (flights) {
        var flight = flights[$scope.returnFlight];
        $scope.return = updateTicket(flight);
    };

    function updateTicket(flight) {
        var ticket = {};

        ticket.flightId = flight.flightId;
        ticket.departure = flight.departure;
        ticket.arrival = flight.arrival;
        ticket.date = flight.date;
        ticket.time = flight.time;
        ticket.class = flight.class;
        ticket.price = flight.price;

        ticket.adult_cost = flight.cost;
        ticket.children_cost = Math.round(flight.cost * 0.8);
        ticket.baby_cost = Math.round(flight.cost / 10);

        ticket.cost = ticket.adult_cost * $scope.flights.adult
            + ticket.children_cost * $scope.flights.children
            + ticket.baby_cost * $scope.flights.baby;

        ticket.total_cost = Math.round(ticket.cost * 1.1);
        return ticket;
    }

});

function getClass(ticketClass) {
    switch (ticketClass)
    {
        case 'Thương gia':
            return 'C';
        case 'Phổ thông':
            return 'Y';
    }
}

function getPrice(ticketClass) {
    switch (ticketClass)
    {
        case 'Linh hoạt':
            return 'F';
        case 'Tiêu chuẩn':
            return 'S';
        case 'Tiết kiệm':
            return 'C';
    }
}