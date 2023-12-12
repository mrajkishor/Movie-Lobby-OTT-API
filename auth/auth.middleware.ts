import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET_KEY || 'default_secret_key';

const authenticate = (requiredRole?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }
        jwt.verify(token, secretKey, async (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized - Invalid token' });
            }
            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
            }
            req.user = decoded;
            next();
        });
    };
};

export default authenticate;
