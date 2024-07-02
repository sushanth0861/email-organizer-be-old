import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers['token'];
    // const token =req.body.token

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        res.locals.user = decoded;        
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};
