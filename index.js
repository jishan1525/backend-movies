const {initalizeDatabase} = require("./db/db.connect")
const Movie = require("./models/movies.models")
const express = require("express")
const cors = require("cors");
const app = express();
initalizeDatabase();

app.use(express.json())

const newMovie = {
  title: "New Movie",
  releaseYear: 2023,
  genre: ["Drama"],
  director: "Aditya ROy Chopra",
  actors: ["Actor 1", "Actor2"],
  language: "Hindi",
  country: "India",
  rating: 6.1,
  plot: "A young man and woman fall in love on a Australia trip.",
  awards: "IFA Filmfare Awards",
  posterUrl: "https://example.com/new-poster1.jpg",
  trailerUrl: "https://example.com/new-trailer1.mp4"
};


//Adding to Database

async function createMovie(newMovie){
    try{
        const movie = new Movie(newMovie)
        const saveMovie=await movie.save()
       return saveMovie;

    }
    catch(error){
        throw error;
    }
}

app.post("/movies",async(req,res)=>{
    try {
        const savedMovie = await createMovie(req.body)
        res.status(201).json({message:"Movie Added successfully.",movie:savedMovie})
    } catch (error) {
        res.status(500).json({error:"failed to add movie"})
    }
})

//Find a movie with a particular title

async function readMovieByTitle(movieTitle){
    try{
        const movie = await Movie.findOne({title:movieTitle})
        return movie;
    }
    catch(error){
            throw error
    }
}
app.get("/movies/:title",async (req,res)=>{
    try{
        const movie = await readMovieByTitle(req.params.title)
        if(movie){
            res.json(movie)
        }else{
            res.status(404).json({error:"Movie not found."})
        }

    }
    catch(error){
        res.status(500).json({error:"Failed to fetch movie."})
    }
})

// readMovieByTitle("Dilwale Dulhania Le Jayenge")

//to get all the movies in the database

async function readAllMovies(){
    try {
        const allMovies = await Movie.find();
       return allMovies
        
    } catch (error) {
        throw error
    }
}


app.get("/movies", async(req,res)=>{
    try{
        const movies = await readAllMovies()
        if(movies.length!=0){
            res.json(movies)
        }
        else{
            res.status(401).json({error:"No moveis found"})          
        }

    }
    catch(error){
         res.status(500).json({error:"Failed to fetch movie."})
    }
})

//get movie by director name


async function readMovieByDirector(directorName){
    try {
        const movieByDirector = await Movie.find({director:directorName})
        return movieByDirector      
    } catch (error) {
        throw error
    }
}

app.get("/movies/director/:directorName",async(req,res)=>{
    try{
        const movies = await readMovieByDirector(req.params.directorName)
        if(movies.length != 0){
            res.json(movies)
        }else{
            res.status(404).json({error:"No Movies found"})
        }

    }
    catch(error){
        res.status(500).json({error:"Failed to fetch movie."})
    }
})

async function readMovieByGenre(genreName) {
    try{
        const movieByGenre = await Movie.find({genre:genreName})
        return movieByGenre
    }catch(error){
        console.log(error)
    }
}

app.get("/movies/genres/:genreName", async(req,res)=>{
   try{
    const movies = await readMovieByGenre(req.params.genreName)
    if(movies.length!=0){
        res.json(movies)
    }
    else{
        res.status(404).json({error:"no movies found."})
    }

   }
   catch(error){
     res.status(500).json({error:"Failed to fetch movie."})
   } 
})

async function deleteMovie(movieId){
    try {
        const deletedMovie = await Movie.findByIdAndDelete(movieId)
        return deletedMovie;
    } catch (error) {
        console.log(error)
    }
}

app.delete("/movies/:movieId",async(req,res)=>{
    try {
        const deletedMovie = await deleteMovie(req.params.movieId)
        res.status(200).json({message:"Movie deleted successfully."})
        
    } catch (error) {
        res.status(500).json({error:"Failed to fetch movie."})
    }
})

async function updateMovie(movieId,dataToUpdate){
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(movieId,dataToUpdate,{
            new:true
        });
        return updatedMovie
        
    } catch (error) {
        throw error;
    }
}

//683793c0fe09e7c2f94a4361

app.post("/movies/:movieId",async(req,res)=>{
    try {
        const updatedMovie = await updateMovie(req.params.movieId,req.body)
        if(updatedMovie){
            res.status(200).json({message:"Movie updated successfully.",updatedMovie:updatedMovie})
        }
        else{
            res.status(404).json({error:"Movie not found"})
        }
    } catch (error) {
        res.status(500).json({error:"Failed to update Movie"})
    }
})


// readMovieByDirector("Kabir Khan")
const PORT= 3000
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})


const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
