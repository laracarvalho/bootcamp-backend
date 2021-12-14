import { Router } from 'express';
import { movieFetcher } from '../external/movieFetcher';

const extRouter = Router();

extRouter.get('/external', movieFetcher);

export { extRouter };