import { Request, Response } from 'express';
import axios from 'axios';

const URL_MOVIES = 'https://api.themoviedb.org/3/trending/all/week?api_key=8c9751844a68e8e7105d68bd90f6eb25';

const URL_CATEGORIES = 'https://api.themoviedb.org/3/genre/movie/list?api_key=8c9751844a68e8e7105d68bd90f6eb25&language=en-US';

const URL_IMAGES = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2'

async function movieFetcher(req: Request, res: Response) {
    const getMovies = await axios(URL_MOVIES);
    const moviesList = getMovies.data.results;

    const getCategories = await axios(URL_CATEGORIES);
    const catsList = getCategories.data.genres;

    const moviesArray: Object[] = [];

    moviesList.map((obj: any) => {

        const movieObj = {
            name: obj.original_title,
            category: obj.genre_ids,
            description: obj.overview,
            poster: URL_IMAGES + obj.poster_path,
            backdrop: URL_IMAGES + obj.backdrop_path
        }

        moviesArray.push(movieObj);

    });

    moviesArray.map((movie: any, movieIndex: any) => {
        catsList.find((cat: any, catIndex: any) => {
            if (cat.id === movie.category[0]) {
                movie.category = cat.name;
            }
        });
    });

    console.log(moviesArray);
    return res.status(200).json({
        moviesArray
    });
}

export { movieFetcher }