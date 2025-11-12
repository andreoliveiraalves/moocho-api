import express from 'express'
import passport from '../services/auth.js'

const router = express.Router()

/**
 * @openapi
 * /auth/google:
 *   get:
 *     summary: Redirect user to Google for authentication
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth 2.0 login
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to home on success or /login on failure
 */
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/')
)

export default router