/**
 * Created by lequan on 10/20/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PassengerSchema = new Schema({
    bookingId: String,
    phone: String,
    email: String,
    adult: [
        {
            title: String,
            firstname: String,
            lastname: String,
            gender: String,
            birthday: String,
            id: String
        }
    ],
    children: [
        {
            title: String,
            firstname: String,
            lastname: String,
            gender: String,
            birthday: String,
            id: String
        }
    ],
    baby: [
        {
            title: String,
            firstname: String,
            lastname: String,
            gender: String,
            birthday: String,
            id: String
        }
    ]
});

module.exports = mongoose.model('Passenger', PassengerSchema);