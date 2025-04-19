const mongoose = require('mongoose');

const userReviewSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  likedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  reviews: [userReviewSchema]
});

module.exports = mongoose.model('User', userSchema);
