const express = require("express");
const mongoose = require("mongoose");
const Movie = require("../models/movie");
const User = require("../models/user");
const auth = require("../middleware/auth");
const recommendationService = require("../services/recommendationService");
const router = express.Router();

// Get all movies with user's liked status
router.get("/", auth, async (req, res) => {
  try {
    const movies = await Movie.find();
    const user = await User.findById(req.userId).select("likedMovies");

    const moviesWithLikedStatus = movies.map((movie) => ({
      ...movie.toObject(),
      liked: user.likedMovies.includes(movie._id),
    }));

    res.json(moviesWithLikedStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search movies
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.json([]);
    }

    const yearQuery = parseInt(q);
    const isYearSearch = !isNaN(yearQuery);

    const searchQuery = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { director: { $regex: q, $options: "i" } },
        { cast: { $regex: q, $options: "i" } },
        { genre: { $regex: q, $options: "i" } },
      ],
    };

    if (isYearSearch) {
      searchQuery.$or.push({ year: yearQuery });
    }

    const exactGenreMatch = await Movie.find({ genre: q });
    const partialMatches = await Movie.find(searchQuery);

    const allMovies = [...new Map([...exactGenreMatch, ...partialMatches].map(m => [m._id.toString(), m])).values()];

    const user = await User.findById(req.userId).select("likedMovies watchlist");

    const moviesWithStatus = allMovies.map((movie) => ({
      ...movie.toObject(),
      liked: user.likedMovies.includes(movie._id),
      inWatchlist: user.watchlist.includes(movie._id),
    }));

    res.json(moviesWithStatus);
  } catch (error) {
    res.status(500).json({ message: "Error searching movies", error: error.message });
  }
});

// Like a movie
router.post("/liked", auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { likedMovies: movieId } },
      { new: true }
    );

    res.json({ message: "Movie liked successfully", liked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unlike a movie
router.delete("/liked", auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { likedMovies: movieId } },
      { new: true }
    );

    res.json({ message: "Movie unliked successfully", liked: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's liked movies
router.get("/liked", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("likedMovies")
      .select("likedMovies");

    const likedMovies = user.likedMovies.map((movie) => ({
      ...movie.toObject(),
      liked: true,
    }));

    res.json({ likedMovies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to watchlist
router.post("/watchlist", auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { watchlist: movieId } },
      { new: true }
    );
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove from watchlist
router.delete("/watchlist", auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { watchlist: movieId } },
      { new: true }
    );
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Append Platforms with Advanced $push
router.post("/:id/platforms", async (req, res) => {
  const { platforms } = req.body;
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        platforms: {
          $each: platforms,
          $position: 2,
          $sort: 1,
          $slice: -5,
        },
      },
    },
    { new: true }
  );
  res.json(movie.platforms);
});

// Add Unique Cast Members via $addToSet
router.post("/:id/cast", async (req, res) => {
  const { cast } = req.body;
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { cast: { $each: cast } } },
    { new: true }
  );
  res.json(movie.cast);
});

// Remove Platforms with $pull and $pullAll
router.delete("/:id/platforms", async (req, res) => {
  const { removeAll, platforms } = req.body;
  const update = removeAll
    ? { $pullAll: { platforms } }
    : { $pull: { platforms: platforms[0] } };
  const movie = await Movie.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });
  res.json(movie.platforms);
});

// Update a Nested Review with Positional Operator
router.patch("/:movieId/reviews", auth, async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const movie = await Movie.findOneAndUpdate(
      { _id: req.params.movieId },
      {
        $push: {
          reviews: {
            user: user.username,
            rating: rating,
            comment: comment,
          },
        },
      },
      { new: true }
    );

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json(movie.reviews);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Aggregate Top Directors by Average Rating
router.get("/directors/top", async (req, res) => {
  const top = await Movie.aggregate([
    { $unwind: "$reviews" },
    {
      $group: {
        _id: { director: "$director", movie: "$title" },
        avgMovie: { $avg: "$reviews.rating" },
      },
    },
    {
      $group: {
        _id: "$_id.director",
        avgRating: { $avg: "$avgMovie" },
      },
    },
    { $sort: { avgRating: -1 } },
    { $limit: 3 },
  ]);
  res.json(top);
});

// Get all reviews of a movie
router.get("/:id/reviews", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).select("reviews");
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie.reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
});

// Add review to a movie
router.post("/:movieId/reviews", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.userId;
    const movieId = req.params.movieId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const user = await User.findById(userId);
    const movie = await Movie.findById(movieId);

    if (!user || !movie) {
      return res.status(404).json({ message: "User or Movie not found" });
    }

    const existingReview = movie.reviews.find(
      (review) => review.user === user.username
    );
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this movie",
        existingReview,
      });
    }

    movie.reviews.push({
      user: user.username,
      rating,
      comment,
    });

    await movie.save();

    res.json({ message: "Review added successfully", reviews: movie.reviews });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
});

module.exports = router;
