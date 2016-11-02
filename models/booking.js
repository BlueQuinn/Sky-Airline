/**
 * Created by lequan on 10/20/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookingSchema = new Schema({
    bookingId: String,
    date: String,
    cost: Number,
    status: Boolean,
    flights: [
        {
            flightId: String,
            date: String,
            class: String,
            price: String
        }
    ],
    passengers: {
        adult: Number,
        children: Number,
        baby: Number
    }
});

module.exports = mongoose.model('Booking', BookingSchema);