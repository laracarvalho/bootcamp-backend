import { Request, Response } from 'express';
import fs from 'fs';
import axios from 'axios';
import { Movie } from '../models/movie.model';

const URL_MOVIES = 'https://api.themoviedb.org/3/trending/all/week?api_key=8c9751844a68e8e7105d68bd90f6eb25';

const URL_CATEGORIES_MOVIES = 'https://api.themoviedb.org/3/genre/movie/list?api_key=8c9751844a68e8e7105d68bd90f6eb25&language=en-US';

const URL_CATEGORIES_TV = 'https://api.themoviedb.org/3/genre/tv/list?api_key=8c9751844a68e8e7105d68bd90f6eb25&language=en-US';

const URL_IMAGES = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2'

async function movieFetcher(req: Request, res: Response) {
    const getMovies = await axios(URL_MOVIES);
    const moviesList = getMovies.data.results;

    const getCategoriesMovie = await axios(URL_CATEGORIES_MOVIES);
    const catsListMovie = getCategoriesMovie.data.genres;

    const getCategoriesTV = await axios(URL_CATEGORIES_TV);
    const catsListTV = getCategoriesTV.data.genres;

    const moviesArray: Object[] = [];

    moviesList.map((obj: any) => {

        const movieObj = {
            name: undefined,
            category: undefined,
            description: undefined,
            media_type: undefined,
            poster: undefined,
            backdrop: undefined
        };

        if (obj.media_type === "movie") {
            movieObj.name = obj.title;
        } else {
            movieObj.name = obj.name;
        }

        const poster_url: any = URL_IMAGES + obj.poster_path;
        const backdrop_url: any = URL_IMAGES + obj.backdrop_path;
        
        movieObj.category = obj.genre_ids;
        movieObj.description = obj.overview;
        movieObj.media_type = obj.media_type;
        movieObj.poster = poster_url;
        movieObj.backdrop = backdrop_url;

        moviesArray.push(movieObj);

    });

    // Passando categorias para objetos tipo "filme"
    moviesArray.map((movie: any, movieIndex: any) => {
        catsListMovie.find((cat: any, catIndex: any) => {
            if (movie.media_type as string === "movie" && cat.id === movie.category[0]) {
                movie.category = cat.name;
            }
        });
    });

    // Passando categorias para objetos tipo "tv"
    moviesArray.map((movie: any, movieIndex: any) => {
        catsListTV.find((cat: any, catIndex: any) => {
            if (
                movie.media_type as string === "tv"
                && cat.id === movie.category[0]
                ) {
                movie.category = cat.name;
            }
        });
    });

    writeToJson(moviesArray);

    return res.status(200).json({
        moviesArray
    });
}

function writeToJson(array: Object[]) {
    const arrayMovies = JSON.stringify(array);

    const fileSteam = fs.createWriteStream('./src/movies.json');

    fileSteam.write(arrayMovies + '\n');

    fileSteam.on('finish', () => {
        console.log('File Steam concluido');
    });

    fileSteam.on('error', (error) => {
        console.log(`File Steam teve um erro: ${error}`);
    });

    fileSteam.end();
}

async function bulkCreate(req: Request, res: Response) {
    const { filePath } = req.body;

    const array = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const movies = await Movie.insertMany(array).catch(error => {
        return res.status(500).json(error);
    });

    return res.status(201).json(movies);
}


export { movieFetcher, bulkCreate }