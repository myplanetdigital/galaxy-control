var express = require('express'),
    bodyParser = require('body-parser');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

var stationMap = {
    '0800280179b7': {
        name: 'Death Star'
    }
};

var userMap = {
    'fe5754a5': {
        name: 'Ates'
    },
    'fbfb8a34': {
        name: 'Erin'
    }
};

var assetMap = {
    '5e8c07db': {
        name: 'Bartending for Dummies'
    }
};

app.use(function (req, res) {
    console.log('Mac:', req.body.mac, 'ID:', req.body.id);

    var station = stationMap[req.body.mac];

    if (station) {
        console.log('Station: ' + station.name);

        switch (req.body.id) {
        case 'HELLO':
            res.send('Welcome back\r\n' + station.name + '!');
            break;
        default:
            var user = userMap[req.body.id];

            if (user) {
                console.log('User: ' + user.name);

                var now = new Date();

                if (now - user.sessionStartDate < 10 * 1000) {
                    if (user.sessionStation === station) {
                        console.log('Session ended');
                        res.send('Bye\r\n' + user.name + '!');
                        user.sessionStartDate = null;
                    } else {
                        console.log('Session started');
                        res.send('Hello\r\n' + user.name + '!');
                        user.sessionStartDate = now;
                        user.sessionStation = station;
                    }
                } else {
                    console.log('Session started');
                    res.send('Hello\r\n' + user.name + '!');
                    user.sessionStartDate = now;
                    user.sessionStation = station;
                }
            } else {
                var asset = assetMap[req.body.id];

                if (asset) {
                    console.log('Asset: ' + asset.name);

                    for (var userId in userMap) {
                        var user = userMap[userId];

                        var now = new Date();

                        if (now - user.sessionStartDate < 10 * 1000) {
                            if (user.sessionStation === station) {
                                console.log('Checked out');
                                res.send('Checked out\r\n' + asset.name);
                                user.sessionStartDate = null;
                                return;
                            }
                        }
                    }

                    res.send(asset.name);
                } else {
                    console.log('Unknown user/asset');
                    res.send('Unkown user\r\nor asset');
                }
            }
            break;
        }
    } else {
        console.log('Unknown station: ' + req.body.mac);
        res.send('Unknown station');
    }
});

app.listen(8088);
