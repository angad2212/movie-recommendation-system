const express = require('express');
const mongoose = require('mongoose');
const Movie = require('../models/movie');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

//1. Search by Cast, Title, or Genre
router.get('/search', async (req, res) => {
  const term = req.query.term || '';
  const regex = new RegExp(term, 'i');
  const movies = await Movie.find({
    $or: [
      { cast:   { $regex: regex } },
      { title:  { $regex: regex } },
      { genres: { $regex: regex } }
    ]
  });
  res.json(movies);
});

//2. Append Platforms with Advanced $push
router.post('/:id/platforms', async (req, res) => {
  const { platforms } = req.body; // e.g. ["Max","Paramount+"]
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        platforms: {
          $each:     platforms,
          $position: 2,
          $sort:     1,
          $slice:   -5
        }
      }
    },
    { new: true }
  );
  res.json(movie.platforms);
});

//3. Add Unique Cast Members via $addToSet
router.post('/:id/cast', async (req, res) => {
  const { cast } = req.body; // e.g. ["Ken Watanabe"]
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { cast: { $each: cast } } },
    { new: true }
  );
  res.json(movie.cast);
});

//4. Remove Platforms with $pull and $pullAll
router.delete('/:id/platforms', async (req, res) => {
  const { removeAll, platforms } = req.body;
  const update = removeAll
    ? { $pullAll: { platforms } }
    : { $pull:    { platforms: platforms[0] } };
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true }
  );
  res.json(movie.platforms);
});

//5. Atomic Stats Update with Multiple Operators
router.patch('/:id/stats', async (req, res) => {
  const { incViews, mulScore, minRating, maxRating, setFields, unsetFields } = req.body;
  const ops = {};
  if (incViews)  ops.$inc   = { 'stats.views': incViews };
  if (mulScore)  ops.$mul   = { 'stats.score': mulScore };
  if (minRating) ops.$min   = { 'stats.low':   minRating };
  if (maxRating) ops.$max   = { 'stats.high':  maxRating };
  if (setFields) ops.$set   = setFields;
  if (unsetFields) ops.$unset = unsetFields.reduce((u, f) => (u[f] = '' , u), {});
  const movie = await Movie.findByIdAndUpdate(req.params.id, ops, { new: true });
  res.json(movie.stats);
});

//6. Update a Nested Review with Positional Operator
router.patch('/:movieId/reviews', async (req, res) => {
  const { userId, rating, comment } = req.body;
  const movie = await Movie.findOneAndUpdate(
    { _id: req.params.movieId, 'reviews.user': userId },
    {
      $set: {
        'reviews.$.rating':  rating,
        'reviews.$.comment': comment
      }
    },
    { new: true }
  );
  res.json(movie.reviews);
});

//7. Aggregate Top Directors by Average Rating
router.get('/directors/top', async (req, res) => {
  const top = await Movie.aggregate([
    { $unwind: '$reviews' },
    { $group: {
        _id:       { director: '$director', movie: '$title' },
        avgMovie:  { $avg: '$reviews.rating' }
      }
    },
    { $group: {
        _id:       '$_id.director',
        avgRating: { $avg: '$avgMovie' }
      }
    },
    { $sort: { avgRating: -1 } },
    { $limit: 3 }
  ]);
  res.json(top);
});


module.exports = router;
