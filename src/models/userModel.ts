export interface UserMovie {
    tmdbId: string
    rating?: number        // rating optional, in case user hasn’t rated yet
    watchedAt: string
}

export interface UserShow {
    tmdbId: string
    rating?: number        // optional rating
    watchedAt: string
}

// --- Friend request ---
export type FriendRequest = {
    from: string
    status: 'pending' | 'accepted' | 'rejected'
    sentAt: string
}

// --- Avatar ---
export type UserAvatar = {
    backgroundColor: string
    mascot: string
}

// --- User ---
export interface User {
    id: string
    displayName: string
    email: string | null
    accessToken?: string
    refreshToken?: string
    movies: UserMovie[]
    shows: UserShow[]
    friends: string[]
    requests: FriendRequest[]
    createdAt: string
    avatar: UserAvatar
}

// --- User profile previews ---
export type ProfileUser = Omit<User, 'accessToken' | 'refreshToken'>
export type SafeUser = Omit<User, 'accessToken' | 'refreshToken' | 'email' | 'friends' | 'requests' | 'movies' | 'shows' | 'createdAt'>
export type FriendlyUser = Omit<User, 'accessToken' | 'refreshToken' | 'email' | 'requests'>