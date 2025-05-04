// middleware/validate.jwt.js
import jwt from 'jsonwebtoken';

export const validateJwt = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
        if (!token) return res.status(401).json({ message: 'Token requerido' });

        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.user = payload; // aquí inyectas el usuario decodificado
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};