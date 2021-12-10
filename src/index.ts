import express from 'express';
import mongoose from 'mongoose';
import config from './config';


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Conseguimos criar um servidor Express'
    });
});

app.listen(config.PORT, async () => {
    console.log('Server funcionando na porta: ', config.PORT);
    
    mongoose.connect(config.MONGO_URI);
});