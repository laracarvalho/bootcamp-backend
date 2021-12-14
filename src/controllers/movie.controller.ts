import { Request, Response } from 'express';
import { Movie } from '../models/movie.model';

function index(req: Request, res: Response) {

    Movie.find((error, result) => {
        if (error) {
            return res.status(500).json({
                error
            });
        }

        return res.status(201).json({
            result
        });
    });
    
}

async function create(req: Request, res: Response) {
    const { name, category, description, media_type, poster, backdrop } = req.body;

    const movieExists = await Movie.findOne({ name });

    if (movieExists) {
        return res.status(409).json({
            message: 'Filme já existe.'
        });
    }

    const movie = new Movie({ name, category, description, media_type, poster, backdrop });

    movie.save((error: any, result: any) => {
        if (error) {
            return res.status(500).json({
                error
            });
        }

        return res.status(201).json({
            result
        });
    });
}

export { index, create }