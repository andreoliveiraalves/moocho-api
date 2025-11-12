// Movie rating interface to define rating objects

export interface MovieUserRating {
  userId: string
  tmdbId: number
  rating: number
  createdAt: string
}

// Summary of ratings for a movie
export interface MovieRatingSummary {
  tmdbId: string
  averageRating: number
  ratingsCount: number
}