// src/routes/profile.ts
import express from 'express'
import { ensureAuthenticated } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @openapi
 * /profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     description: Returns user information from session. Only accessible if logged in.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 displayName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 movies:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: User is not authenticated
 */
router.get('/', ensureAuthenticated, (req, res) => {
    // req.user is populated by Passport after login
    res.json(req.user)
})

export default router