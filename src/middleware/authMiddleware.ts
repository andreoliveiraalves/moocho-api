import type { Request, Response, NextFunction } from 'express'

// verifies if user is authenticated
export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) return next()
    res.status(401).json({ error: 'Não autenticado' })
}