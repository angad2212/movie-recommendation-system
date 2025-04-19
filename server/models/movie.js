const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now }
});

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  genres: [String],
  language: String,
  director: String,
  cast: [String],
  platforms: [String],
  reviews: [reviewSchema]
});

module.exports = mongoose.model('Movie', movieSchema);
