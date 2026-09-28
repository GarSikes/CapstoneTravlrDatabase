require('dotenv').config();
var express = require('express');
var path = require('path');
var hbs = require('hbs');
const db = require('./app_api/models/db');
var cors = require('cors');
var passport = require('passport');
require('./app_api/config/passport');

var app = express();

const corsOptions = {
    origin: 'http://localhost:4200'
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'app_server/views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/layout' });

// register the partials folder (header.hbs, footer.hbs)
hbs.registerPartials(path.join(__dirname, 'app_server/views/partials'));

// helper used by header/footer partials to highlight the active nav item
hbs.registerHelper('ifEquals', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

// static assets (css, images, and the not-yet-converted static pages)
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// routes
var travelRouter = require('./app_server/routes/index');
app.use('/', travelRouter);

var apiRouter = require('./app_api/routes/index');
console.log('apiRouter type:', typeof apiRouter);
app.use('/api', apiRouter);

// Catch unauthorized error and create 401
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res
            .status(401)
            .json({ "message": err.name + ": " + err.message });
    }
});

app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000');
});