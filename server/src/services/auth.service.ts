import { prisma } from '../server';
import { AuthenticationError } from '../utils/AppError';
import { hashPassword, comparePassword } from '../utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { config } from '../config';

export class AuthService {
  static async login(username: string, passwordPlain: string, ip: string, userAgent: string) {
    const user = await prisma.users.findUnique({
      where: { username },
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
      throw new AuthenticationError('Username atau password salah');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Akun tidak aktif');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AuthenticationError(`Akun terkunci. Coba lagi pada ${user.lockedUntil.toLocaleString()}`);
    }

    const isValidPassword = await comparePassword(passwordPlain, user.passwordHash);

    if (!isValidPassword) {
      // Increment login attempts
      const attempts = user.loginAttempts + 1;
      const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await prisma.users.update({
        where: { idUser: user.idUser },
        data: { loginAttempts: attempts, lockedUntil },
      });

      throw new AuthenticationError('Username atau password salah');
    }

    // Success login
    const payload = { userId: user.idUser, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        idUser: user.idUser,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Reset login attempts and update lastLogin
    await prisma.users.update({
      where: { idUser: user.idUser },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        idUser: user.idUser,
        action: 'LOGIN',
        entity: 'Users',
        entityId: user.idUser,
        ipAddress: ip,
        userAgent,
      },
    });

    return {
      user: {
        id: user.idUser,
        username: user.username,
        role: user.role,
        pegawai: user.pegawai,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(token: string) {
    try {
      const payload = verifyRefreshToken(token);

      const dbToken = await prisma.refreshToken.findUnique({
        where: { token },
      });

      if (!dbToken || dbToken.isRevoked) {
        throw new AuthenticationError('Token tidak valid');
      }

      const user = await prisma.users.findUnique({
        where: { idUser: payload.userId },
        include: {
          pegawai: {
            include: {
              jabatan: true,
              departemen: true,
            },
          },
        }
      });

      if (!user || !user.isActive) {
        throw new AuthenticationError('Sesi tidak valid');
      }

      // Revoke old token
      await prisma.refreshToken.update({
        where: { id: dbToken.id },
        data: { isRevoked: true },
      });

      // Issue new tokens
      const newPayload = { userId: user.idUser, role: user.role };
      const newAccessToken = signAccessToken(newPayload);
      const newRefreshToken = signRefreshToken(newPayload);

      await prisma.refreshToken.create({
        data: {
          idUser: user.idUser,
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        user: {
          id: user.idUser,
          username: user.username,
          role: user.role,
          pegawai: user.pegawai,
        },
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new AuthenticationError('Sesi kadaluarsa, silakan login kembali');
    }
  }

  static async logout(token: string, userId: number, ip: string, userAgent: string) {
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { token },
        data: { isRevoked: true },
      });
    }

    await prisma.auditLog.create({
      data: {
        idUser: userId,
        action: 'LOGOUT',
        entity: 'Users',
        entityId: userId,
        ipAddress: ip,
        userAgent,
      },
    });
  }

  static async changePassword(userId: number, oldPasswordPlain: string, newPasswordPlain: string) {
    const user = await prisma.users.findUnique({ where: { idUser: userId } });
    if (!user) throw new AuthenticationError('User tidak ditemukan');

    const isValidPassword = await comparePassword(oldPasswordPlain, user.passwordHash);
    if (!isValidPassword) throw new AuthenticationError('Password lama tidak sesuai');

    const passwordHash = await hashPassword(newPasswordPlain);
    await prisma.users.update({
      where: { idUser: userId },
      data: { passwordHash }
    });
  }
}
