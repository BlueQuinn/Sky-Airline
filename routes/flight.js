/**
 * Created by lequan on 10/20/2016.
 */

var Flight = require('../models/flight');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

    switch (filterQuery(req.query))
    {
        case SEARCH_FLIGHTS:
        {
            var query = {
                departure: req.query.departure,
                arrival: req.query.arrival,
                date: req.query.date
            };

            Flight.find(query, function (err, docs) {
                if (err)
                {
                    res.send({
                        message: "Không tìm thấy chuyến bay",
                        status: 400,
                        error: err
                    });
                    return;
                }

                var flights = [];
                flights.push(parseData(docs, req.query.seat_count, query.date));

                if (req.query.return_date !== undefined && req.query.return_date != 0)
                {
                    query.departure = req.query.arrival;
                    query.arrival = req.query.departure;
                    query.date = req.query.return_date;

                    Flight.find(query, function (err, docs) {
                        if (err)
                        {
                            res.send({
                                message: "Không tìm thấy chuyến bay",
                                status: 400,
                                error: err
                            });
                            return;
                        }

                        flights.push(parseData(docs, req.query.seat_count, query.date));

                        res.json(flights);
                    });
                }
                else
                {
                    res.json(flights);
                }
            });
            break;
        }

        case GET_ARRIVAL:
        {
            Flight.find({departure: req.query.departure}, 'arrival', function (err, docs) {
                if (err)
                {
                    res.send({
                        message: "Không tìm thấy chuyến bay",
                        status: 400,
                        error: err
                    });
                    return;
                }
                res.json(docs);
            });
            break;
        }
    }
});


function filterQuery(query) {
    if (query.departure !== undefined && query.arrival !== undefined &&
        query.seat_count !== undefined && query.date !== undefined)
    {
        return SEARCH_FLIGHTS;
    }

    if (query.departure !== undefined)
    {
        return GET_ARRIVAL;
    }

    return GET_ALL_FLIGHTS;
}

function parseData(docs, seatCount, date) {
    var flights = [];
    var today = new Date();
    var time = today.getHours() * 60 + today.getMinutes();
    var isToday = checkToday(date);

    docs.forEach(function (flight) {
        flight.info.forEach(function (info) {
            if (info.available_seat > seatCount)
            {
                if (isToday && time >= parseTime(flight.time))
                {
                    return;
                }

                var item = {};
                item.flightId = flight.flightId;
                item.departure = flight.departure;
                item.arrival = flight.arrival;
                item.date = flight.date;
                item.time = flight.time;
                item.cost = info.cost;

                switch (info.class)
                {
                    case 'C':
                        item.class = 'Thương gia';
                        break;
                    case 'Y':
                        item.class = 'Phổ thông';
                        break;
                }

                switch (info.price)
                {
                    case 'F':
                        item.price = 'Linh hoạt';
                        break;
                    case 'S':
                        item.price = 'Tiêu chuẩn';
                        break;
                    case 'C':
                        item.price = 'Tiết kiệm';
                        break;
                }
                flights.push(item);
            }
        });
    });
    return flights;
}

function parseTime(time) {
    time = time.split(':');
    return parseInt(time[0]) * 60 + parseInt(time[1]);
}


function checkToday(date) {
    var today = new Date();
    date = date.split('/');
    return parseInt(date[0]) == today.getDate() &&
        parseInt(date[1]) == today.getMonth() &&
        parseInt(date[2]) == today.getFullYear();
}

var SEARCH_FLIGHTS = 1;
var GET_ALL_FLIGHTS = 2;
var GET_ARRIVAL = 3;


module.exports = router;

