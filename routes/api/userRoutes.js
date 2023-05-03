const router = require('express').Router();
const { createUser, deleteUser, getSingleUser, getUsers, updateUser } = require('../../controllers/userController');

// All routes in the file are prepending with /api/users

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

module.exports = router;
