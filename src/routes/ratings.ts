import express from 'express'
import { ensureAuthenticated } from '../middleware/authMiddleware.js'
import { redisClient } from '../utils/redisClient.js'
import type { MovieRatingSummary } from '../models/ratingModel.js'
import type { User } from '../models/userModel.js'
import { calculateAverage } from '../utils/functions/calculateAverage.js'

const router = express.Router()

/**
 * @openapi
 * /ratings/{tmdbId}:
 *   get:
 *     summary: Get movie rating summary
 *     description: Returns the average rating and total ratings count for a movie.
 *     tags: [Ratings]
 */
router.get('/:tmdbId', async (req, res) => {
    const { tmdbId } = req.params
    const tmdbIdNum = parseInt(tmdbId)

    if (isNaN(tmdbIdNum)) return res.status(400).json({ message: 'Invalid TMDB ID' })

    try {
        const data = await redisClient.get(`movie:summary:${tmdbIdNum}`)
        if (!data) return res.status(404).json({ message: "This movie hasn't been rated yet" })

        const summary: MovieRatingSummary = JSON.parse(data)
        res.json(summary)
    } catch (err) {
        console.error('Error fetching movie rating:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

/**
 * @openapi
 * /ratings/friends:
 *   get:
 *     summary: Get friends' ratings for a specific movie
 *     description: Returns each friend who has rated the given movie, their rating, and the average rating among friends.
 *     tags: [Ratings]
 */
router.get('/friends', ensureAuthenticated, async (req, res) => {
    const user = req.user as User
    const { tmdbId } = req.query

    const tmdbIdNum = parseInt(tmdbId as string)
    if (!tmdbId || isNaN(tmdbIdNum)) {
        return res.status(400).json({ message: 'Missing or invalid tmdbId query parameter' })
    }

    try {
        if (!user.friends || user.friends.length === 0) {
            return res.json({ tmdbId: tmdbIdNum, friendsWatched: 0, ratings: [], average: null })
        }

        const movieKey = `movie:ratings:hash:${tmdbIdNum}`
        const friendsRatingsObj = await redisClient.hmGet(movieKey, user.friends)

        const ratings = friendsRatingsObj
            .map((val, index) =>
                val
                    ? {
                        friendId: user.friends[index],
                        rating: parseFloat(val)
                    }
                    : null
            )
            .filter(Boolean) as { friendId: string; rating: number }[]

        const friendsWatched = ratings.length
        const average = friendsWatched > 0 ? calculateAverage(ratings.map(r => r.rating)) : null

        res.json({ tmdbId: tmdbIdNum, friendsWatched, ratings, average })
    } catch (err) {
        console.error('Error fetching friends ratings:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

/**
 * @openapi
 * /ratings/{tmdbId}:
 *   post:
 *     summary: Submit a new rating for a movie
 *     description: Allows an authenticated user to submit or update their rating for a movie. Updates the aggregate rating in Redis.
 *     tags: [Ratings]
 */
router.post('/:tmdbId', ensureAuthenticated, async (req, res) => {
    const { tmdbId } = req.params
    const { rating } = req.body
    const user = req.user as User

    if (!tmdbId) return res.status(400).json({ message: 'Missing TMDB ID' })
    if (typeof rating !== 'number' || rating < 1 || rating > 10) {
        return res.status(400).json({ message: 'Rating must be a number between 1 and 10' })
    }

    try {
        const movieKey = `movie:ratings:hash:${tmdbId}`

        // Store or update user rating
        await redisClient.hSet(movieKey, user.id, rating.toString())

        // Get all ratings for this movie to recalc average
        const allRatingsObj = await redisClient.hGetAll(movieKey)
        const allRatings = Object.values(allRatingsObj).map(r => parseFloat(r))
        const average = calculateAverage(allRatings) || rating

        const summaryKey = `movie:summary:${tmdbId}`
        const summary: MovieRatingSummary = {
            tmdbId,
            averageRating: average,
            ratingsCount: allRatings.length
        }

        await redisClient.set(summaryKey, JSON.stringify(summary))

        res.json({ message: `Rating ${rating} saved for TMDB movie ${tmdbId}`, summary })
    } catch (err) {
        console.error('Error saving rating:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

export default router