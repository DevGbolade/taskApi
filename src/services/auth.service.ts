import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '@/entities/user.entity';
import { IUser } from '@/interfaces/auth.interface';

export class AuthService {
  /**
   * Register a new user
   */
    static async register(data:  IUser) {
    const {username,  email, password, role = 'user' } = data;

    const userRepo = AppDataSource.getRepository(User);

    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepo.create({ username,  email, password: hashedPassword, role });
    await userRepo.save(newUser);

    return newUser;
  }

  /**
   * Login user and return JWT tokens
   */
  static async login(data: { email: string; password: string }) {
    const { email, password } = data;
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string) {
    try {
      const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: decoded.userId } });

      if (!user) throw new Error('Invalid refresh token');

      return { accessToken: this.generateAccessToken(user) };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Generate JWT access token
   */
  private static generateAccessToken(user: User) {
    return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }

  /**
   * Generate JWT refresh token
   */
  private static generateRefreshToken(user: User) {
    return jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
  }
}
