export type Param = {
    name: string
    value: string | number | boolean | undefined
}

export type Join = "OR" | "AND" | undefined

export type Primitves = boolean | number | undefined | string

export type ListParam<T extends Primitves> = {
    name: string
    value: T[]
    join: Join
}
export interface MovieListResponse {
    page: number
    results: MovieListResult[]
    total_pages: number
    total_results: number
}

export interface MovieListResult {
    adult: boolean
    backdrop_path: string
    id: number
    title: string
    original_language: string
    original_title: string
    overview: string
    poster_path: string
    media_type: string
    genre_ids: number[]
    popularity: number
    release_date: string
    video: boolean
    vote_average: number
    vote_count: number
}

export interface MovieTrailer {
    id: number
    results: MovieTrailerResult[]
  }
  
  export interface MovieTrailerResult {
    iso_639_1: string
    iso_3166_1: string
    name: string
    key: string
    site: string
    size: number
    type: string
    official: boolean
    published_at: string
    id: string
  }
export type MovieListType = "popular" | "top_rated" | "upcoming" | "now_playing" | "discover"
export type ResourceType =  "movie" | "tv"
export type SortType =
    "popularity.desc"
    | "popularity.asc"
    | "original_title.desc"
    | "original_title.asc"
    | "revenue.desc"
    | "revenue.asc"
    | "title.desc"
    | "title.asc"
    | undefined



export interface Root {
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

  
export interface favs {
    movie_id: number
    user_id : string
    poster_path: string
    title: string
    overview: string
    vote_average: number
    _id : number
    show_id : number
  }

  export interface Details {
    adult: boolean
    backdrop_path: string
    belongs_to_collection: any
    budget: number
    genres: Genre[]
    homepage: string
    id: number
    imdb_id: string
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    production_companies: ProductionCompany[]
    production_countries: ProductionCountry[]
    release_date: string
    revenue: number
    runtime: number
    spoken_languages: SpokenLanguage[]
    status: string
    tagline: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
  }
  
  export interface Genre {
    id: number
    name: string
  }
  
  export interface ProductionCompany {
    id: number
    logo_path?: string
    name: string
    origin_country: string
  }
  
  export interface ProductionCountry {
    iso_3166_1: string
    name: string
  }
  
  export interface SpokenLanguage {
    english_name: string
    iso_639_1: string
    name: string
  }
  

