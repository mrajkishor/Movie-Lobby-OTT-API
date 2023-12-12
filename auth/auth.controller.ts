import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/user.model';
const secretKey = process.env.JWT_SECRET_KEY || 'default_secret_key';

export const authenticateUser = async (id: any, username: string, role: string): Promise<string | null> => {
    return jwt.sign({ id: id, username: username, role: role }, secretKey, {
        expiresIn: '1h',
    });
};
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = await authenticateUser(user._id, user.username, user.role);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


