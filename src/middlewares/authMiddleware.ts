import { NextFunction, Request, Response } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implementar verificação do token JWT
  // Por enquanto, apenas simula a autenticação
  const papel = req.headers['x-user-role'] as string;
  
  if (!papel) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  req.user = { papel };
  next();
}; 