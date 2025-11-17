// Library imports
import express from 'express'
import dotenv from 'dotenv'
import passport from 'passport'
import path from 'path'

// Internal imports
import { initRedis } from './utils/redisClient.js'
import { sessionMiddleware } from './middleware/sessionMiddleware.js'
import { swaggerUi, swaggerSpec } from './docs/swagger.js'

// App route imports
import authRoutes from './routes/auth.js'
import rootRoute from './routes/root.js'
import profileRoutes from './routes/user.js'
import ratingRoutes from './routes/ratings.js'
import friendsRoutes from './routes/friends.js'


// Loading of environment variables, redis, middleware, passport and  express iniciation
dotenv.config()
await initRedis()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(process.cwd(), 'public')))
app.use(express.json())
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())


// route and middleware definitions
app.use('/', rootRoute)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use('/ratings', ratingRoutes)
app.use('/friends', friendsRoutes)


// server start
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))