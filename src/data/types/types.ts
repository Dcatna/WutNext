export interface Genre {
    id: number;
    name: string;
}

export type Rating = {
    certification: string,
    meaning: string,
    order: number
}
export interface Credit {
    id: number
    cast: Cast[]
    crew: Crew[]
  }
  
export interface Cast {
    adult: boolean
    gender: number
    id: number
    known_for_department: string
    name: string
    original_name: string
    popularity: number
    profile_path?: string
    cast_id: number
    character: string
    credit_id: string
    order: number
  }
  
export interface Crew {
    adult: boolean
    gender: number
    id: number
    known_for_department: string
    name: string
    original_name: string
    popularity: number
    profile_path?: string
    credit_id: string
    department: string
    job: string
  }
  export interface SimilarMovieResult {
    page: number
    results: SimilarMovie[]
    total_pages: number
    total_results: number
  }
  
  export interface SimilarMovie {
    adult: boolean
    backdrop_path?: string
    genre_ids: number[]
    id: number
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path?: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
  }