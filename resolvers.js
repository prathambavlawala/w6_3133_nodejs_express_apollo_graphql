const Movie = require('./models/Movie');

const resolvers = {
  Query: {
    getAllMovies: async () => {
      return await Movie.find();
    },
    getMovieById: async (_, { id }) => {
      return await Movie.findOne({ id }); // Find by `id`
    }
  },

  Mutation: {
    // ✅ Mutation to Insert Movie (Auto Incrementing ID)
    addMovie: async (_, { name, director_name, production_house, release_date, rating }) => {
      const lastMovie = await Movie.findOne().sort({ id: -1 });
      const newId = lastMovie ? lastMovie.id + 1 : 1;  // Generate next ID

      const newMovie = new Movie({
        id: newId,
        name,
        director_name,
        production_house,
        release_date,
        rating,
      });

      await newMovie.save();
      return newMovie;
    },

    // ✅ Mutation to Update Movie by ID
    updateMovie: async (_, { id, name, director_name, production_house, release_date, rating }) => {
      const updatedMovie = await Movie.findOneAndUpdate(
        { id },  // Find by `id`
        { name, director_name, production_house, release_date, rating },
        { new: true }
      );
      return updatedMovie;
    },

    // ✅ Mutation to Delete Movie by ID
    deleteMovie: async (_, { id }) => {
      const movie = await Movie.findOneAndDelete({ id });  // Find by `id`
      if (!movie) {
        throw new Error("Movie not found");
      }
      return "Movie deleted successfully";
    }
  }
};

module.exports = resolvers;
