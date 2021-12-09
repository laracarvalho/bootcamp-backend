import express from 'express';

const app = express();

app.use(express.json());

const port = 5000;

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Conseguimos criar um servidor Express'
    });
});

app.listen(port, () => {
    console.log('Server funcionando na porta: ', port);
});