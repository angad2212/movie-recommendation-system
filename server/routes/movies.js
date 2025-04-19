const express = require('express');
const mongoose = require('mongoose');
const Movie = require('../models/movie');
const User = require('../models/user');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

//1. Search by Cast, Title, or Genre
router.get('/search', async (req, res) => {
  const { cast, title, genres } = req.query;

  const query = {};

  if (cast) query.cast = new RegExp(cast, 'i');
  if (title) query.title = new RegExp(title, 'i');
  if (genres) query.genres = new RegExp(genres, 'i');

  try {
    const movies = await Movie.find(query);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
  }
});

//2. Append Platforms with Advanced $push
router.post('/:id/platforms', async (req, res) => {
  const { platforms } = req.body; // e.g. ["Max","Paramount+"]
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        platforms: {
          $each: platforms,
          $position: 2,
          $sort: 1,
          $slice: -5
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
    : { $pull: { platforms: platforms[0] } };
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
  if (mulScore)  ops.$mul = { 'stats.score': mulScore };
  if (incViews)  ops.$inc = { 'stats.views': incViews };
  if (minRating) ops.$min = { 'stats.low':   minRating };
  if (maxRating) ops.$max = { 'stats.high':  maxRating };
  if (setFields) ops.$set = setFields;
  if (unsetFields) ops.$unset = unsetFields.reduce((u, f) => (u[f] = '' , u), {});
  const movie = await Movie.findByIdAndUpdate(req.params.id, ops, { new: true });
  res.json(movie.stats);
});

//6. Update a Nested Review with Positional Operator
router.patch('/:movieId/reviews', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.userId; 

  try {
    const movie = await Movie.findOneAndUpdate(
      { _id: req.params.movieId, 'reviews.user': userId },
      {
        $set: {
          'reviews.$.rating': rating,
          'reviews.$.comment': comment
        }
      },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Review not found for this user' });
    }

    res.json(movie.reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

//7. Aggregate Top Directors by Average Rating
router.get('/directors/top', async (req, res) => {
  const top = await Movie.aggregate([
    { $unwind: '$reviews' },
    { $group: {
        _id: { director: '$director', movie: '$title' },
        avgMovie: { $avg: '$reviews.rating' }
      }
    },
    { $group: {
        _id: '$_id.director',
        avgRating: { $avg: '$avgMovie' }
      }
    },
    { $sort: { avgRating: -1 } },
    { $limit: 3 }
  ]);
  res.json(top);
});

//8. Adding a movie to a user's watchlist
router.post('/watchlist', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    // Uses req.userId from auth middleware
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { watchlist: movieId } },  // ensures no duplicates
      { new: true }
    );
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//9. Adding a movie to a user's liked list
router.post('/liked', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { likedMovies: movieId } },   // or use $addToSet for uniqueness
      { new: true }
    );
    res.json({ likedMovies: user.likedMovies });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;