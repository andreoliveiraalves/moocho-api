// ======================================
// TMDB GENRES AND COMMON ENTITIES
// ======================================

// Standard genre object
export interface TMDBGenre {
    id: number
    name: string
}

// Spoken language object
export interface TMDBSpokenLanguage {
    iso_639_1: string
    english_name: string
    name: string
}

// Production company
export interface TMDBProductionCompany {
    id: number
    name: string
    logo_path: string | null
    origin_country: string
}

// Production country
export interface TMDBProductionCountry {
    iso_3166_1: string
    name: string
}

// Collection (sagas)
export interface TMDBCollection {
    id: number
    name: string
    poster_path: string | null
    backdrop_path: string | null
}



// ======================================
// MOVIES
// ======================================

// Movie Lite (returned by /movie/popular, /movie/top_rated, /search/movie, etc.)
export interface TMDBMovie {
    id: number
    title: string
    original_title: string
    overview: string

    poster_path: string | null
    backdrop_path: string | null

    release_date: string
    original_language: string

    adult: boolean
    video: boolean

    popularity: number
    vote_average: number
    vote_count: number

    genre_ids: number[] // In lists TMDB only returns IDs
}

// Movie Full (returned by /movie/{id})
export interface TMDBMovieFull {
    id: number
    title: string
    original_title: string
    overview: string
    tagline: string | null

    release_date: string | null
    status: string
    original_language: string

    poster_path: string | null
    backdrop_path: string | null

    adult: boolean
    video: boolean
    popularity: number
    vote_average: number
    vote_count: number

    budget: number
    revenue: number
    runtime: number | null
    homepage: string | null
    imdb_id: string | null

    belongs_to_collection: TMDBCollection | null

    genres: TMDBGenre[]
    spoken_languages: TMDBSpokenLanguage[]
    production_companies: TMDBProductionCompany[]
    production_countries: TMDBProductionCountry[]
}



// ======================================
// TV SHOWS
// ======================================

// TV Lite (returned by /tv/popular, /tv/top_rated, /search/tv, etc.)
export interface TMDBTVShow {
    id: number
    name: string
    original_name: string
    overview: string

    poster_path: string | null
    backdrop_path: string | null

    first_air_date: string
    original_language: string

    popularity: number
    vote_average: number
    vote_count: number

    genre_ids: number[]
    origin_country: string[]
    adult?: boolean
}

// Extra entities for full TV show data
export interface TMDBCreatedBy {
    id: number
    credit_id: string
    name: string
    gender: number | null
    profile_path: string | null
}

export interface TMDBNetwork {
    id: number
    name: string
    logo_path: string | null
    origin_country: string
}

export interface TMDBSeason {
    id: number
    name: string
    season_number: number
    episode_count: number
    air_date: string | null
    overview: string
    poster_path: string | null
}

// TV Full (returned by /tv/{id})
export interface TMDBTVShowFull {
    id: number
    name: string
    original_name: string
    overview: string
    tagline: string | null

    first_air_date: string | null
    last_air_date: string | null
    status: string
    type: string

    poster_path: string | null
    backdrop_path: string | null

    original_language: string
    homepage: string | null

    popularity: number
    vote_average: number
    vote_count: number

    in_production: boolean
    episode_run_time: number[]
    number_of_episodes?: number
    number_of_seasons?: number

    genres: TMDBGenre[]
    created_by: TMDBCreatedBy[]
    seasons: TMDBSeason[]

    production_companies: TMDBProductionCompany[]
    production_countries: TMDBProductionCountry[]
    spoken_languages: TMDBSpokenLanguage[]
    networks: TMDBNetwork[]
}



// ======================================
// PERSONS / ACTORS
// ======================================

// Movie/TV credits inside "known_for"
export interface TMDBMediaCreditMovie {
    id: number
    media_type: 'movie'
    title: string
    original_title: string
    popularity: number
    vote_average: number
    vote_count: number
    poster_path: string | null
    backdrop_path: string | null
    genre_ids: number[]
    release_date: string
    adult: boolean
    overview: string
}

export interface TMDBMediaCreditTV {
    id: number
    media_type: 'tv'
    name: string
    original_name: string
    popularity: number
    vote_average: number
    vote_count: number
    poster_path: string | null
    backdrop_path: string | null
    genre_ids: number[]
    first_air_date: string
    overview: string
}

export type TMDBKnownFor = TMDBMediaCreditMovie | TMDBMediaCreditTV

// Person Lite (returned by /search/person, /person/popular)
export interface TMDBPerson {
    id: number
    name: string
    known_for_department: string
    popularity: number
    profile_path: string | null

    known_for: TMDBKnownFor[]
}

// Person Full (returned by /person/{id})
export interface TMDBPersonFull {
    id: number
    name: string
    biography: string
    birthday: string | null
    deathday: string | null
    gender: number
    homepage: string | null
    known_for_department: string
    place_of_birth: string | null
    popularity: number
    profile_path: string | null
    also_known_as: string[]
}



// ======================================
// PAGINATED RESPONSE
// ======================================

// For endpoints like /movie/popular, /tv/top_rated etc.
export interface TMDBPaginatedResponse<T> {
    page: number
    results: T[]
    total_pages: number
    total_results: number
}
