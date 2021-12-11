import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import { apiRouter } from './routes/api.routes';


const app = express();
app.use(express.json());
app.use(apiRouter);


app.listen(config.PORT, async () => {
    console.log('Server funcionando na porta: ', config.PORT);
    
    mongoose.connect(config.MONGO_URI);
});