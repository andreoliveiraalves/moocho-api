import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
import { redisClient } from '../utils/redisClient.js'
import type { User } from '../models/userModel.js'

dotenv.config()

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth credentials not set in .env')
}

// Serialization / deserialization only saves googleId
passport.serializeUser((user: any, done) => done(null, user.id))
passport.deserializeUser(async (id: string, done) => {
    try {
        const data = await redisClient.get(`user:${id}`)
        if (data) done(null, JSON.parse(data))
        else done(null, null)
    } catch (err) {
        done(err, null)
    }
})

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const key = `user:${profile.id}`
                const existing = await redisClient.get(key)
                let user: User

                if (existing) {
                    const parsed: User = JSON.parse(existing)
                    user = {
                        ...parsed,
                        accessToken,
                        refreshToken
                    }
                } else {
                    user = {
                        id: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails?.[0]?.value || null,
                        accessToken,
                        refreshToken,
                        movies: [],
                        createdAt: new Date().toISOString()
                    }
                }

                await redisClient.set(key, JSON.stringify(user))
                done(null, user)
            } catch (err) {
                done(err, false)
            }
        }
    )
)

export default passport