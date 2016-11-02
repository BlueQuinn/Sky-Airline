/**
 * Created by lequan on 10/20/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FlightSchema = new Schema({
    flightId: String,
    departure: String,
    arrival: String,
    date: String,
    time: String,
    info: [
        {
            class: String,
            price: String,
            total_seat: Number,
            available_seat: Number,
            cost: Number
        }
    ]
});

module.exports = mongoose.model('Flight', FlightSchema);