import express from 'express'
import { ensureAuthenticated } from '../middleware/authMiddleware.js'
import { redisClient } from '../utils/redisClient.js'
import { validateUserFriendship } from '../utils/functions/userFriendshipValidation.js'
import type { User, FriendRequest } from '../models/userModel.js'
import { toSafeUser, toFriendlyUser } from '../utils/functions/typeConversions.js'

const router = express.Router()

/**
 * Send a friend request
 */
router.post('/request/:friendId', ensureAuthenticated, async (req, res) => {
    const sender = req.user as User
    const { friendId } = req.params

    if (!friendId || friendId === sender.id) {
        return res.status(400).json({ message: 'Invalid friendId' })
    }

    const key = `user:${friendId}`

    try {
        let success = false
        const maxAttempts = 5
        let attempts = 0

        while (!success && attempts < maxAttempts) {
            attempts++
            await redisClient.watch(key)

            const receiverDataRaw = await redisClient.get(key)
            if (!receiverDataRaw) {
                await redisClient.unwatch()
                return res.status(404).json({ message: 'User not found' })
            }

            const receiver: User = JSON.parse(receiverDataRaw)
            receiver.requests = receiver.requests || [] as FriendRequest[]

            if (validateUserFriendship(sender, receiver)) {
                await redisClient.unwatch()
                return res.status(400).json({ message: 'Already friends' })
            }

            const existing = receiver.requests.find(r => r.from === sender.id && r.status === 'pending')
            if (existing) {
                await redisClient.unwatch()
                return res.status(400).json({ message: 'Request already sent' })
            }

            const newRequest: FriendRequest = {
                from: sender.id,
                status: 'pending',
                sentAt: new Date().toISOString()
            }
            receiver.requests.push(newRequest)

            const multi = redisClient.multi().set(key, JSON.stringify(receiver))
            const execResult = await multi.exec()

            if (execResult !== null) success = true
        }

        if (!success) {
            return res.status(500).json({ message: 'Could not send friend request, please try again' })
        }

        res.json({ message: 'Friend request sent' })
    } catch (err) {
        console.error('Internal server error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

/**
 * List incoming friend requests
 */
router.get('/requests', ensureAuthenticated, async (req, res) => {
    const user = req.user as User

    try {
        const userDataRaw = await redisClient.get(`user:${user.id}`)
        if (!userDataRaw) return res.status(404).json({ message: 'User not found' })

        const currentUser: User = JSON.parse(userDataRaw)
        const pendingRequests: FriendRequest[] = currentUser.requests?.filter(r => r.status === 'pending') || []

        const detailedRequests = await Promise.all(
            pendingRequests.map(async r => {
                const senderDataRaw = await redisClient.get(`user:${r.from}`)
                if (!senderDataRaw) return null
                const sender: User = JSON.parse(senderDataRaw)
                return {
                    from: r.from,
                    sender: toSafeUser(sender),
                    status: r.status,
                    sentAt: r.sentAt
                }
            })
        )

        res.json({ requests: detailedRequests.filter(Boolean) })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

/**
 * Count pending friend requests
 */
router.get('/requests/count', ensureAuthenticated, async (req, res) => {
    const user = req.user as User

    try {
        const userDataRaw = await redisClient.get(`user:${user.id}`)
        if (!userDataRaw) return res.status(404).json({ message: 'User not found' })

        const currentUser: User = JSON.parse(userDataRaw)
        const pendingCount = (currentUser.requests?.filter(r => r.status === 'pending') || []).length

        res.json({ count: pendingCount })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

/**
 * Accept or reject a friend request
 */
router.post('/request/:friendId/respond', ensureAuthenticated, async (req, res) => {
    const user = req.user as User
    const { friendId } = req.params
    const { action } = req.body as { action: 'accepted' | 'rejected' }

    if (!friendId || (action !== 'accepted' && action !== 'rejected')) {
        return res.status(400).json({ message: 'Invalid friendId or action' })
    }

    const maxAttempts = 5
    let attempts = 0
    let success = false

    try {
        while (!success && attempts < maxAttempts) {
            attempts++

            const userKey = `user:${user.id}`
            const friendKey = `user:${friendId}`

            await redisClient.watch([userKey, friendKey])

            const [userRaw, friendRaw] = await Promise.all([
                redisClient.get(userKey),
                redisClient.get(friendKey)
            ])

            if (!userRaw || !friendRaw) {
                await redisClient.unwatch()
                return res.status(404).json({ message: 'User not found' })
            }

            const currentUser: User = JSON.parse(userRaw)
            const friendUser: User = JSON.parse(friendRaw)

            const request = currentUser.requests?.find(r => r.from === friendId && r.status === 'pending')
            if (!request) {
                await redisClient.unwatch()
                return res.status(400).json({ message: 'No pending request from this user' })
            }

            request.status = action

            if (action === 'accepted') {
                if (!currentUser.friends.includes(friendId)) currentUser.friends.push(friendId)
                if (!friendUser.friends.includes(user.id)) friendUser.friends.push(user.id)
            }

            const multi = redisClient.multi()
            multi.set(userKey, JSON.stringify(currentUser))
            multi.set(friendKey, JSON.stringify(friendUser))
            const execResult = await multi.exec()

            if (execResult !== null) success = true
        }

        if (!success) {
            return res.status(500).json({ message: 'Could not process request, please try again' })
        }

        res.json({ message: `Friend request ${action}` })
    } catch (err) {
        console.error('Error processing friend request:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

/**
 * List all friends
 */
router.get('/list', ensureAuthenticated, async (req, res) => {
    const currentUser = req.user as User

    try {
        const userDataRaw = await redisClient.get(`user:${currentUser.id}`)
        if (!userDataRaw) return res.status(404).json({ message: 'User not found' })

        const user: User = JSON.parse(userDataRaw)
        const friendIds = Array.isArray(user.friends) ? user.friends : []

        const friendsData = await Promise.all(
            friendIds.map(async friendId => {
                const friendRaw = await redisClient.get(`user:${friendId}`)
                if (!friendRaw) return null
                const friend: User = JSON.parse(friendRaw)
                return toFriendlyUser(friend)
            })
        )

        const friendlyFriends = friendsData.filter(Boolean)

        res.json({ friends: friendlyFriends })
    } catch (err) {
        console.error('Error fetching friends list:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

export default router
