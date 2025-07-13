import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  error: Error | ZodError | PrismaClientKnownRequestError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      status: 'error',
      message: 'Dados inválidos',
      errors: error.errors,
    });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return response.status(400).json({
          status: 'error',
          message: 'Já existe um registro com estes dados',
        });
      case 'P2003':
        return response.status(400).json({
          status: 'error',
          message: 'Registro relacionado não encontrado',
        });
      case 'P2025':
        return response.status(404).json({
          status: 'error',
          message: 'Registro não encontrado',
        });
    }
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}; 