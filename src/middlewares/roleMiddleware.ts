import { NextFunction, Request, Response } from 'express';

export const roleMiddleware = (papeis: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPapel = req.user?.papel;

    if (!userPapel || !papeis.includes(userPapel)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    next();
  };
}; 