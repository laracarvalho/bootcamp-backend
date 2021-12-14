import { Router } from 'express';
import { movieFetcher, bulkCreate } from '../external/movieFetcher';

const extRouter = Router();

extRouter.get('/external', movieFetcher);

extRouter.post('/external/createBulk', bulkCreate);

export { extRouter };