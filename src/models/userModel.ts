// Defines Rating object structure provinient from OMDb API
export interface OMDbRating {
    Source: string
    Value: string
}

// Defines Movie object structure provinient from OMDb API
export interface OMDbMovie {
    imdbID: string
    Title: string
    Year: string
    Rated?: string
    Released?: string
    Runtime?: string
    Genre?: string
    Director?: string
    Writer?: string
    Actors?: string
    Plot?: string
    Language?: string
    Country?: string
    Awards?: string
    Poster?: string
    Ratings?: OMDbRating[]
    Metascore?: string
    imdbRating?: string
    imdbVotes?: string
    Type?: string
    DVD?: string
    BoxOffice?: string
    Production?: string
    Website?: string
}

// Defines the movie object structure from user watched movies array.
export interface UserMovie {
    imdbID: string
    rating: number
    watchedAt: string
    details?: OMDbMovie
}

// Defines the User object structure
export interface User {
    id: string
    displayName: string
    email: string | null
    accessToken?: string
    refreshToken?: string
    movies: UserMovie[]
    createdAt: string
}