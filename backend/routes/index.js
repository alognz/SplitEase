/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./auth.js')(router));
    app.use('/api', require('./users.js')(router));
    app.use('/api', require('./groups.js')(router));
    app.use('/api', require('./expenses.js')(router));
    app.use('/api', require('./chores.js')(router));
    app.use('/api', require('./activities.js')(router));
};