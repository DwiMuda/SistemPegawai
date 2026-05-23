import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';

export const auditLog = (action: string, tableName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // We want to capture the response after it's sent to log the actual result
    // But we need the old data *before* the request completes if it's an UPDATE or DELETE
    
    // In a full implementation, you might intercept the `res.send` or attach a listener
    // For simplicity, we attach a listener to 'finish'
    
    // Note: To properly capture old_data and new_data, this usually requires 
    // integration at the repository/service level rather than just a middleware.
    // This middleware provides a basic request-level audit.
    
    res.on('finish', async () => {
      // Only log successful modifications
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const userId = req.user?.userId;
          if (userId) {
            await prisma.auditLog.create({
              data: {
                idUser: userId,
                action,
                entity: tableName,
                entityId: req.params.id ? parseInt(req.params.id as string, 10) : null,
                // oldData and newData would ideally come from the service layer via res.locals
                oldData: res.locals.oldData ? JSON.stringify(res.locals.oldData) : null,
                newData: res.locals.newData ? JSON.stringify(res.locals.newData) : null,
                ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
              }
            });
          }
        } catch (error) {
          console.error('Failed to create audit log:', error);
        }
      }
    });

    next();
  };
};
