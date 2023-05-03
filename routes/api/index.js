const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

// All routes in the file are prepending with /api
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;
