const router = require('express').Router();
const { createThought, deleteThought, getSingleThought, getThoughts, updateThought } = require('../../controllers/thoughtController');

// All routes in the file are prepending with /api/thoughts

// /api/thoughts
router.route('/').get(getThoughts).post(createThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions');

module.exports = router;
