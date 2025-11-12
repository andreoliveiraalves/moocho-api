import express from 'express'
import { ensureAuthenticated } from '../middleware/authMiddleware.js'
import type { User, ProfileUser, SafeUser, FriendlyUser } from '../models/userModel.js'
import { toSafeUser, toFriendlyUser, toProfileUser } from '../utils/functions/typeConversions.js'
import { validateUserFriendship } from '../utils/functions/userFriendshipValidation.js'
import { redisClient } from '../utils/redisClient.js'

const router = express.Router()

/**
 * @openapi
 * /profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     description: Returns information about the currently logged-in user. Requires authentication.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Authenticated user's profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileUser'
 *       401:
 *         description: User is not authenticated
 */
router.get('/', ensureAuthenticated, async (req, res) => {
    const user = req.user as User

    //get redis data
    const userDataRaw = await redisClient.get(`user:${user.id}`)
    if (!userDataRaw) return res.status(404).json({ message: 'User not found' })

    const currentUser: User = JSON.parse(userDataRaw)

    const profileUser: ProfileUser = toProfileUser(currentUser)

    res.json(profileUser)
})

/**
 * @openapi
 * /profile/{id}:
 *   get:
 *     summary: Get a user's profile by ID
 *     description: Fetches either a safe (non-friends) or friendly (friend) profile depending on the relationship with the requesting user. Requires authentication.
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The user's unique ID
 *         schema:
 *           type: string
 *           example: "1093212391239"
 *     responses:
 *       200:
 *         description: User profile data (Safe or Friendly)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/SafeUser'
 *                 - $ref: '#/components/schemas/FriendlyUser'
 *       404:
 *         description: User not found
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.get('/:id', ensureAuthenticated, async (req, res) => {
    const currentUser = req.user as User
    const { id } = req.params

    try {
        const data = await redisClient.get(`user:${id}`)
        if (!data) {
            return res.status(404).json({ message: 'User not found' })
        }

        const user: User = JSON.parse(data)

        //Friend validation

        const isFriend = validateUserFriendship(user, currentUser)

        if (isFriend) {
            const friendlyUser: FriendlyUser = toFriendlyUser(user)
            return res.json(friendlyUser)
        }
        const safeUser: SafeUser = toSafeUser(user)
        res.json(safeUser)
    } catch (err) {
        console.error('Error fetching user:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

export default router