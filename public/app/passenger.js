/**
 * Created by lequan on 10/20/2016.
 */

app.controller('PassengerController', function ($scope, $location, $window, Passenger, TicketService) {

    $scope.info = ['Người lớn', 'Trẻ em (dưới 18)', 'Trẻ sơ sinh'];
    $scope.id = ['Số CMND', 'Số giấy khai sinh', 'Số giấy khai sinh'];
    $scope.pay = 'visa';

    $scope.cost = TicketService.getCost();

    $scope.passengers = [[], [], []];
    var passengers = TicketService.getPassenger();
    for (var i = 0; i < passengers.adult; ++i)
        $scope.passengers[0].push({});
    for (var i = 0; i < passengers.children; ++i)
        $scope.passengers[1].push({});
    for (var i = 0; i < passengers.baby; ++i)
        $scope.passengers[2].push({});

    $scope.show = [true, passengers.children > 0, passengers.baby > 0];

    $scope.getTicket = function () {

        if ($scope.phone === undefined || $scope.email === undefined) {
            alert('Bạn chưa điền thông tin liên hệ');
            return;
        }

        for (var i in $scope.passengers) {
            var group = $scope.passengers[i];
            for (var j in group) {
                var item = group[j];
                if (item.title === undefined || item.firstname === undefined === item.lastname || item.birthday === undefined || item.id === undefined) {
                    alert('Bạn chưa điền đầy đủ thông tin hành khách');
                    return;
                }
                if (!checkDate(item.birthday)) {
                    alert('Ngày sinh của bạn không hợp lệ');
                    return;
                }
            }
        }


        var ticket = {
            bookingId: TicketService.getBookingId(),
            phone: $scope.phone,
            email: $scope.email,
            adult: $scope.passengers[0],
            children: $scope.passengers[1],
            baby: $scope.passengers[2]
        };

        Passenger.save(ticket, function (data) {
            if (data.status == 200)
                alert(data.message + "\n" + "Mã số của bạn là " + data.bookingId);
            else
                alert(data.message);
            $location.path('/');
        });
    };

});


function checkDate(date) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
        if (isNaN(date.getTime())) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
}