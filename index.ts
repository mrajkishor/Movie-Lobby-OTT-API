import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import MovieModel from './model/movie.model';
import authenticate from './auth/auth.middleware';
import { login } from './auth/auth.controller';

export const app = express();
const PORT = 3000;

app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/movie-lobby', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


app.post('/login', login);


app.get('/movies', async (req, res) => {
    try {
        const movies = await MovieModel.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/search', async (req, res) => {
    const query: string = req.query.q as string;
    try {
        const movies = await MovieModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } },
            ],
        });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/movies', authenticate('admin'), async (req, res) => {
    try {
        const newMovie = await MovieModel.create(req.body);
        res.json(newMovie);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/movies/:id', authenticate('admin'), async (req, res) => {
    try {
        const updatedMovie = await MovieModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedMovie);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/movies/:id', authenticate('admin'), async (req, res) => {
    try {
        await MovieModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default server; 