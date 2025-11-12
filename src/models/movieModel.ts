export interface TMDBMovie {
    id: number
    title: string
    original_title: string
    overview: string
    release_date: string
    poster_path: string | null
    backdrop_path: string | null
    vote_average: number
    vote_count: number
    popularity: number
    genre_ids: number[]
    original_language: string
}

// --- TV Show ---
export interface TMDBTVShow {
    id: number
    name: string
    original_name: string
    overview: string
    first_air_date: string
    poster_path: string | null
    backdrop_path: string | null
    vote_average: number
    vote_count: number
    popularity: number
    genre_ids: number[]
    original_language: string
}

// --- Person / Actor ---
export interface TMDBPerson {
    id: number
    name: string
    known_for_department: string
    profile_path: string | null
    popularity: number
    known_for: Array<TMDBMovie | TMDBTVShow>
}

// --- Paginated TMDB Response (for endpoints like /movie/popular, /tv/popular) ---
export interface TMDBPaginatedResponse<T> {
    page: number
    results: T[]
    total_pages: number
    total_results: number
}