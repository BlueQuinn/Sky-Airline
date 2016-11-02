/**
 * Created by lequan on 10/20/2016.
 */

var Hashids = require('hashids');
var express = require('express');
var Booking = require('../models/booking');
var Flight = require('../models/flight');
var router = express.Router();
var hashids = new Hashids("1312465_1312548_1312561", 6);

router.post('/', function (req, res) {

    Booking.count({}, function (err, count) {
        if (err)
        {
            res.send({
                message: "Chưa đặt được chỗ",
                status: 400,
                error: err
            });
            return;
        }
        var booking = new Booking();
        booking.bookingId = hashids.encode(count);
        booking.date = (new Date()).getTime().toString();     // in seconds
        booking.status = false;
        booking.cost = req.body.cost;
        booking.flights = req.body.flights;
        booking.passengers = req.body.passengers;

        booking.save(function (err, docs) {
            if (err)
            {
                res.send({
                    message: "Chưa đặt được chỗ",
                    status: 400,
                    error: err
                });
                return;
            }

            var seat_count = booking.passengers.adult + booking.passengers.children;

            var i = 0;
            booking.flights.forEach(function (flight) {
                var query = {
                    flightId: flight.flightId,
                    date: flight.date
                };
                Flight.find(query, function (err, docs) {
                    if (err)
                    {
                        res.send({
                            message: "Chưa đặt được chỗ",
                            status: 400,
                            error: err
                        });
                        return;
                    }

                    if (docs.length > 0 && docs[0].info.length > 0)
                    {
                        var index = getIndex(flight.class, flight.price);
                        docs[0].info[index].available_seat = docs[0].info[index].available_seat - seat_count;

                        docs[0].save(function (err) {
                            if (err)
                            {
                                res.send({
                                    message: "Chưa đặt được chỗ",
                                    status: 400,
                                    error: err
                                });
                                return;
                            }

                            if (i == booking.flights.length - 1)
                            {
                                res.send(
                                    {
                                        message: 'Mã đặt chỗ của bạn là ' + booking.bookingId + '\nHãy nhanh chóng điền thông tin hành khách để lấy vé',
                                        bookingId: booking.bookingId,
                                        status: 200
                                    });
                            }
                            ++i;
                        });
                    }
                });
            });
        });

    });

});


function getIndex(ticketClass, price) {
    if (ticketClass == 'C')
    {
        switch (price)
        {
            case 'F':
                return 0;
            case 'S':
                return 1;
        }
    }
    else
    {
        switch (price)
        {
            case 'F':
                return 2;
            case 'S':
                return 3;
            case 'C':
                return 4;
        }
    }
}


module.exports = router;
