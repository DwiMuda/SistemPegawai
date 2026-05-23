import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/response';
import { AuthenticationError } from '../utils/AppError';
import { prisma } from '../server';
import { config } from '../config';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const result = await AuthService.login(username, password, ip, userAgent);

      // Set refresh token in HttpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return successResponse(res, 'Login berhasil', {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;

      if (!token) {
        return res.status(401).json({ success: false, message: 'Tidak terautentikasi' });
      }

      const result = await AuthService.refreshToken(token);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, 'Token diperbarui', {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      // Clear cookie on failure
      res.clearCookie('refreshToken');
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      const userId = req.user?.userId;
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      if (userId) {
        await AuthService.logout(token, userId, ip, userAgent);
      }

      res.clearCookie('refreshToken');
      return successResponse(res, 'Logout berhasil');
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.users.findUnique({
        where: { idUser: req.user!.userId },
        include: {
          pegawai: {
            include: {
              jabatan: true,
              departemen: true,
            },
          },
        },
      });

      if (!user) {
        throw new AuthenticationError('Sesi tidak valid');
      }

      successResponse(res, 'Berhasil mengambil profil pengguna', {
        id: user.idUser,
        username: user.username,
        role: user.role,
        pegawai: user.pegawai,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { oldPassword, newPassword } = req.body;
      
      await AuthService.changePassword(req.user!.userId, oldPassword, newPassword);
      successResponse(res, 'Password berhasil diubah');
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.users.findUnique({ where: { idUser: req.user!.userId } });
      const idPegawai = user?.idPegawai;
      
      if (!idPegawai) {
        res.status(403).json({ success: false, message: 'User tidak tertaut dengan data pegawai' });
        return;
      }
      
      const { email, noTelpon, alamat } = req.body;
      
      const updated = await prisma.pegawai.update({
        where: { idPegawai },
        data: { email, noTelpon, alamat }
      });
      
      successResponse(res, 'Profil berhasil diperbarui', updated);
    } catch (error) {
      next(error);
    }
  }
}
