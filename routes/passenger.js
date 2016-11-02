/**
 * Created by lequan on 10/20/2016.
 */

var Passenger = require('../models/passenger');
var Booking = require('../models/booking');
var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {

    var passenger = Object.assign(new Passenger(), req.body);

    passenger.save(function (err, docs) {
        if (err) {
            res.send({
                message: "Chưa đặt được vé",
                status: 400,
                error: err
            });
            return;
        }

        Booking.update({bookingId: passenger.bookingId}, {$set:{status:true}}, function (err, docs) {
            if (err) {
                res.send({
                    message: "Chưa đặt được vé",
                    status: 400,
                    error: err
                });
                return;
            }
            res.send(
                {
                    message: "Đặt vé thành công",
                    bookingId: passenger.bookingId,
                    status: 200
                }
            );
        });



    });
});






module.exports = router;