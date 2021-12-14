import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import * as sessionController from '../controllers/session.controller';
import * as movieController from '../controllers/movie.controller';
import { authorize } from '../middlewares/auth';

const apiRouter = Router();

/* ROTAS GERAIS */

apiRouter.get('/', (req, res) => {
    return res.json({
        message: 'Nossa primeira rota de API'
    });
});

/* ROTAS DE USUÁRIO */

apiRouter.post('/users/new', userController.create);
apiRouter.get('/users/id/:id', userController.view);
apiRouter.delete('/users/destroy/:id', userController.destroy);


/* ROTAS DE SESSÃO */

apiRouter.get('/session', authorize, sessionController.index);
apiRouter.post('/session/new', sessionController.create);

/* ROTAS DE FILME */

apiRouter.get('/movies', movieController.index);
apiRouter.get('/movies/id/:id', movieController.view);
apiRouter.get('/movies/search/:search', movieController.search);
apiRouter.post('/movies/new', movieController.create);

/* ROTAS DE LISTA */

export { apiRouter };