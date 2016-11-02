/**
 * Created by lequan on 10/20/2016.
 */

app.controller('FlightController', function ($scope, $location, Airport, Flight, AirportService, FlightService) {

    $scope.airports = [];
    $scope.arrivals = [];
    $scope.adult = [1, 2, 3, 4, 5, 6];
    $scope.children = [];
    $scope.baby = [];
    $scope.isReturn = 'oneway';
    $scope.seatCount = 0;
    $scope.departureDate = moment().toDate();
    $scope.returnDate = moment().add(1, 'day').toDate();
    var adultCount = 1, childrenCount = 0, babyCount = 0;

    var reload = function () {
        Airport.query(function (data) {
            $scope.airports = data;
            AirportService.setAirports(data);
        });
    };

    reload();


    $scope.searchFlights = function () {

        if ($scope.departureId === undefined)
        {
            alert('Bạn chưa chọn địa điểm đi');
            return;
        }
        if ($scope.arrivalId === undefined)
        {
            alert('Bạn chưa chọn địa điểm đến');
            return;
        }
        if ($scope.departureDate === undefined)
        {
            alert('Bạn chưa chọn ngày khởi hành');
            return;
        }
        if (checkPastDate($scope.departureDate))
        {
            alert('Bạn không thể chọn những ngày trước đây');
            return;
        }

        if ($scope.isReturn == 'oneway')
        {
            $scope.returnDate = 0;
        }
        else
        {
            if ($scope.returnDate === undefined)
            {
                alert('Bạn chưa chọn ngày trở về');
                return;
            }
            if (checkPastDate($scope.returnDate))
            {
                alert('Bạn không thể chọn những ngày trước đây');
                return;
            }
        }

        $scope.seatCount = adultCount + childrenCount;

        Flight.query(
            {
                departure: $scope.departureId,
                arrival: $scope.arrivalId,
                date: parseDate($scope.departureDate),
                return_date: parseDate($scope.returnDate),
                seat_count: $scope.seatCount
            }, function (data) {
                if (data.length < 1)
                {
                    alert('Không tìm thấy chuyến bay nào');
                    return;
                }

                $scope.returnDate = moment().add(1, 'day').toDate();

                var flights = {
                    adult: adultCount,
                    children: childrenCount,
                    baby: babyCount
                };
                flights.departure = data[0];
                if (data.length > 1)
                {
                    flights.return = data[1];
                }

                FlightService.setFlights(flights);
                $location.path('/booking');
            });
    };

    $scope.getAri = function () {
        Flight.query({departure: $scope.departureId}, function (data) {

            $scope.arrivals = [];

            data.forEach(function (flight) {
                $scope.airports.forEach(function (airport) {
                    if (flight.arrival == airport.airportId)
                    {
                        $scope.arrivals.push(airport);
                    }
                })
            });


            $scope.arrivals = $scope.arrivals.filter(function (item, pos) {
                return $scope.arrivals.indexOf(item) == pos;
            });

        });
    };

    $scope.getAdu = function () {
        $scope.children = [];
        $scope.baby = [];
        adultCount = parseInt($scope.SoAdult);
        for (var i = 0; i <= adultCount; ++i)
        {
            $scope.children.push(i);
            $scope.baby.push(i);
        }
        if (childrenCount >= adultCount)
        {
            $scope.SoChild = 0;
            childrenCount = 0;
        }
        if (babyCount >= adultCount)
        {
            $scope.SoBaby = 0;
            babyCount = 0;
        }
    };

    $scope.getChild = function () {
        $scope.baby = [];
        childrenCount = parseInt($scope.SoChild);
        babyCount = adultCount - childrenCount;
        for (var i = 0; i <= babyCount; ++i)
        {
            $scope.baby.push(i);
        }
        if (babyCount >= adultCount)
        {
            $scope.SoBaby = 0;
            babyCount = 0;
        }
    };

    $scope.getBaby = function () {
        $scope.children = [];
        babyCount = parseInt($scope.SoBaby);
        childrenCount = adultCount - babyCount;
        for (var i = 0; i <= childrenCount; ++i)
        {
            $scope.children.push(i);
        }
        if (childrenCount >= adultCount)
        {
            $scope.SoChild = 0;
            childrenCount = 0;
        }
    };

    $('input[id="departure_date_picker"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            locale: {
                format: 'DD/MM/YYYY'
            },
            startDate: $scope.departureDate
        },
        function (start, end, label) {
            $scope.departureDate = new Date(start);
        });


    $('input[id="return_date_picker"]').daterangepicker({
            showDropdowns: true,
            locale: {
                format: 'DD/MM/YYYY'
            },
            startDate: $scope.departureDate,
            endDate: $scope.returnDate
        },
        function (start, end, label) {
            $scope.departureDate = new Date(start);
            $scope.returnDate = new Date(end);
        });
});


function parseDate(date) {
    if (date == 0)
    {
        return 0;
    }
    return date.getDate().toString() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}

function checkPastDate(date) {

    var today = moment().toDate();

    if (date.getFullYear() > today.getFullYear())
    {
        return false;
    }

    if (date.getFullYear() == today.getFullYear())
    {
        if (date.getMonth() > today.getMonth())
        {
            return false;
        }

        if (date.getMonth() == today.getMonth())
        {
            if (date.getDate() >= today.getDate())
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        else
        {
            return true;
        }
    }
    else
    {
        return true;
    }
}