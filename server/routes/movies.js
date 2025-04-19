const express = require('express');
const mongoose = require('mongoose');
const Movie   = require('../models/movie');
const User    = require('../models/user');
const auth    = require('../middleware/auth');

const router = express.Router();

// 5.1 List & Filter
router.get('/', async (req, res) => {
  const { genre, minRating } = req.query;
  const filter = {};
  if (genre)     filter.genres = genre;
  if (minRating) filter['reviews.rating'] = { $gte: +minRating };
  const movies = await Movie.find(filter);
  res.json(movies);
});

// 5.2 Top Rated by Genre
router.get('/top/:genre', async (req, res) => {
  const genre = req.params.genre;
  const top = await Movie.aggregate([
    { $match: { genres: genre } },
    { $unwind: '$reviews' },
    { $group: {
        _id: '$_id',
        avgRating: { $avg: '$reviews.rating' },
        title:     { $first: '$title' }
      }
    },
    { $sort: { avgRating: -1 } },
    { $limit: 5 }
  ]);
  res.json(top);
});

// 5.3 Trending (reviews in last 7 days)
router.get('/trending', async (req, res) => {
  const weekAgo = new Date(Date.now() - 7*24*60*60*1000);
  const trending = await Movie.aggregate([
    { $unwind: '$reviews' },
    { $match: { 'reviews.date': { $gte: weekAgo } } },
    { $group: {
        _id: '$_id',
        count: { $sum: 1 },
        title: { $first: '$title' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  res.json(trending);
});

// 5.4 Recommendations
router.get('/recommendations', auth, async (req, res) => {
  const user = await User.findById(req.userId).populate('watchlist');
  const watchedGenres = [
    ...new Set(user.watchlist.flatMap(m => m.genres))
  ];
  const recs = await Movie.find({
    genres: { $in: watchedGenres },
    _id:    { $nin: user.watchlist.map(m => m._id) }
  })
    .sort({ 'reviews.rating': -1 })
    .limit(10);
  res.json(recs);
});

// 5.5 Add Review
router.post('/:id/review', auth, async (req, res) => {
  const { rating, comment } = req.body;
  const movie = await Movie.findById(req.params.id);
  movie.reviews.push({ user: req.userId, rating, comment });
  await movie.save();
  res.json(movie);
});

module.exports = router;
