const User = require('../models/User');
const auth = require('../shared/auth');

module.exports = function(router) {
    router.get('/users/search', auth, async function(req, res) {
        try {
            if (!req.query) {
                return res.status(400).json({
                    error: 'Request query required'
                });
            }

            const { username } = req.query;
            if (!username) {
                return res.status(400).json({
                    error: 'need query',
                    query: req.query
                });
            }
            const users = await User.find({
                username: { $regex: username, $options: 'i' }
            }).select('_id username').limit(20);
            res.json({
                users: users.map(function(user) {
                    return {
                        id: user._id,
                        username: user.username
                    };
                })
            });
        } catch (error) {
            res.status(500).json({
                error: 'error searching',
            });
        }
    });
    
    return router;
};