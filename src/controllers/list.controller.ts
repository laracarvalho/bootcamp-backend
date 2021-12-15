import { Request, Response } from 'express';
import { List } from '../models/list.model';
import { Movie } from '../models/movie.model';
import { paginate } from '../middlewares/pagination';

function index(req: Request, res: Response) {
    List.aggregate([
        {
            $lookup: {
                from: 'movies',
                localField: 'movie_id',
                foreignField: '_id',
                as: 'movies_list'
            }
        }
    ]).exec(function (error, list) {

        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }

        const array: any[] = [];

        list.map((item) => {
            array.push(item.movies_list);
            // console.log(item.movies_list);
        });

        const result = array.flat(Infinity);

        return res.status(200).json(result);
    });
}

async function add(req: Request, res: Response) {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
        return res.status(404).json({
            message: 'Esse filme não existe.'
        });
    }

    const insideList = await List.findOne({ movie_id: id });

    if (insideList) {
        return res.status(401).json({
            message: 'Esse filme já se encontra na lista'
        });
    }

    const data = new List({
        user_id: req.user,
        movie_id: movie._id
    });

    data.save((error: any, result: any) => {
        if (error) {
            return res.status(500).json(error);
        }

        return res.status(201).json(result);
    });

    

    // console.log(id, req.user);
}

function remove(req: Request, res: Response) {

}

export { index, add, remove }