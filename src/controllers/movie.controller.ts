import { Request, Response } from 'express';
import { User } from '../models/user.model';

function index(req: Request, res: Response) {
    return res.json('Rota de filmes');
}

export { index }