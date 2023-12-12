import mongoose, { Document, Schema } from 'mongoose';

export interface Movie extends Document {
    title: string;
    genre: string;
    rating: number;
    streamingLink: string;
}

const movieSchema = new Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    rating: { type: Number, required: true },
    streamingLink: { type: String, required: true },
});

const MovieModel = mongoose.model<Movie>('Movie', movieSchema);

export default MovieModel;
