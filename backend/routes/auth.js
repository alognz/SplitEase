const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../shared/auth');
const { validatePassword, validateEmail } = require('../utils/validation');

module.exports = function(router) {
  router.post('/auth/signup', async function(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({
          error: 'Request body required'
        });
      }
      const { username, email, password } = req.body;
      if (!username) {
        return res.status(400).json({
          error: 'need username'
        });
      }
      if (!email) {
        return res.status(400).json({
          error: 'need email'
        });
      }
      if (!password) {
        return res.status(400).json({
          error: 'need password'
        });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({
          error: 'Incorrect email format',
        });
      }
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          error: 'Password needs at least 8 characters with uppercase, lowercase, number, and special character',
        });
      }
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          error: 'Username already exists'
        });
      }
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({
          error: 'Email already exists',
        });
      }
      const user = new User({ username, email, password });
      await user.save();
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'whoopsie error signing up',
        actual: error.message
      });
    }
  });

  router.post('/auth/login', async function(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({
          error: 'Request body required'
        });
      }
      
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          error: 'Username and password required'
        });
      }
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({
          error: 'Incorrect username or password'
        });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          error: 'Incorrect username or password'
        });
      }
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'whoopsie error logging in',
      });
    }
  });

  router.get('/auth/me', auth, async function(req, res) {
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      createdAt: req.user.createdAt
    });
  });

  return router;
};