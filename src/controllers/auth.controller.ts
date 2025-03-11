import { AuthService } from '@/services/auth.service';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export class AuthController {
  /**
   * @route POST /api/auth/register
   * @desc Register new user
   * @access Public
   */
  static async register(req: Request, res: Response): Promise<any> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  /**
   * @route POST /api/auth/login
   * @desc Authenticate user and get token
   * @access Public
   */
  static async login(req: Request, res: Response) {
    try {
      const { accessToken, refreshToken } = await AuthService.login(req.body);
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  }

  /**
   * @route POST /api/auth/refresh
   * @desc Refresh access token
   * @access Public
   */
  static async refreshToken(req: Request, res: Response) {
    try {
      const { accessToken } = await AuthService.refreshToken(req.body.refreshToken);
      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(403).json({ message: (error as Error).message });
    }
  }
}
