import jwt from 'jsonwebtoken';

export const generateToken = (user: { id: string, email: string }) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
    );
};
