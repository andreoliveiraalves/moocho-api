import session from 'express-session'
import { RedisStore } from 'connect-redis'
import { redisClient } from '../utils/redisClient.js'
import dotenv from 'dotenv'

dotenv.config()

// throws error if session secret isn't set
if (!process.env.SESSION_SECRET) {
    throw new Error('Session secret  not set in .env')
}
// creates de session middleware for the user
export const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
})