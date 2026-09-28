// app_server/controllers/main.js
exports.index = function (req, res) {
    res.render('index', { title: 'Home' });
};
