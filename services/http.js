// Setup HTTP service
module.exports = function(app) {
    app.get('/', function(req, res) {
        res.send('Server is running.');
    });
};
