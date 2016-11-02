/**
 * Created by lequan on 10/20/2016.
 */

var router = require('express').Router();
var Airport = require('../models/airport');

router.get('/', function (req, res) {
    Airport.find({}, function (err, docs) {
        if (err) {
            res.send({
                message: "Không tìm được sân bay",
                status: 400,
                error: err
            });
            return;
        }

        res.json(docs);
    });
});

module.exports = router;