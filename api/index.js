let blog = require('./blog/route');
let admin = require('./admin/route');
let mailer = require('./mailer/route');

module.exports = {
    registerRoutes: function(app) {
        app.use('/api/admin', admin);
        app.use('/api/blog', blog);
        app.use('/api/mailer', mailer);
    }
};