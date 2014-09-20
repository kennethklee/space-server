var cors = require('cors');

// Setup HTTP service
module.exports = function(app) {
    app.use(cors());
    
    app.get('/', function(req, res) {
        res.send('Server is running.');
    });
};
