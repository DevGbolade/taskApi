import jwt from 'jsonwebtoken';

export const generateToken = (userId: number, userRole: string): string => {
  return jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};