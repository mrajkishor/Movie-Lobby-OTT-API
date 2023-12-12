import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
    username: string;
    password: string;
    role: string;
}

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
});

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;
