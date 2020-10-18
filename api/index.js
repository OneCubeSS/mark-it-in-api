let blog = require('./blog/route');
let admin = require('./admin/route');

module.exports = {
    registerRoutes: function(app) {
        app.use('/api/admin', admin);
        app.use('/api/blog', blog);
    }
};