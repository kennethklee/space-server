var browserify = require('browserify'),
    cors = require('cors'),
    path = require('path');

// Setup HTTP service
module.exports = function(app) {
    app.use(cors());
    
    app.get('/', function(req, res) {
        res.send('Server is running.');
    });
    
    app.get('/space.js', function(req, res) {
        res.set('Content-Type', 'application/json');
        browserify({standalone: 'space'})
            .add(path.join(__dirname, '..', 'entities', 'space.js'))
            .bundle()
            .pipe(res);
    });
};
