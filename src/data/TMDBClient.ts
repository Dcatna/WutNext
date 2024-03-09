import {MovieListResponse, MovieListType, MovieTrailer, ResourceType, ShowListResponse, SortType} from "./types/MovieListResponse";
import {TokenBuckets} from "./ratelimit/TokenBuckets";
import {TokenBucket} from "./ratelimit/TokenBucket";
import {sign} from "node:crypto";
import {buildUrl} from "./query/query";
import { Credit } from "./types/types";


class TMDBCClient {

    private reqPerMin = 50

    private readonly apiKey: string = '11e1be5dc8a3cf947ce265da83199bce'
    private bucket: TokenBucket = TokenBuckets
        .builder()
        .withCapacity(this.reqPerMin)
        .withFixedIntervalRefillStrategy(
             this.reqPerMin,
            // 60 sec to milliseconds
            60 * 1000
        )
    .build()

    // Create an AbortController instance
    private controller = new AbortController();

    private readonly apiKeyParam = {
        name: "api_key",
        value: this.apiKey
    }

    private readonly BASE_URL = "https://api.themoviedb.org/3"

    async fetchMovieList(
        page: number,
        type: ResourceType,
        with_genres : number[],
        region: string | undefined = undefined,
        language: string | undefined = "en-US",
        sort_by : SortType = undefined,
        include_adult : boolean | undefined = true,
        include_video : boolean | undefined = false
    ): Promise<MovieListResponse> {

        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;

        const url = buildUrl(
            `${this.BASE_URL}/discover/${type}`,
            [
                this.apiKeyParam,
                { name: "page", value: page },
                { name: "language", value: language },
                { name: "sort_by", value: sort_by},
                { name: "include_adult", value: include_adult},
                { name: "include_video", value: include_video},
            ],
            [
                { name: "with_genres", value: with_genres, join: "AND"},
            ]
        )
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url)
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        return await res.json() as MovieListResponse
    }
    //`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${apiKey}`
    async fetchCreditList(
        movie_id: number,
        //type: ResourceType,
        language: string | undefined = "en-US",
    ): Promise<Credit> {

        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;

        const url = buildUrl(
            `${this.BASE_URL}/movie/${movie_id}}/credits`,
            [
                this.apiKeyParam,
                { name: "language", value: language },

            ],
        )
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url)
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        return await res.json() as Credit
    }
    async fetchRecommendedList(
        page: number,
        type: ResourceType,
        with_genres : number[],
        with_actors : string[],
        language: string | undefined = "en-US",
        sort_by : SortType = "popularity.desc",
        include_adult : boolean | undefined = true,
        include_video : boolean | undefined = false
    ): Promise<MovieListResponse> {

        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;

        const url = buildUrl(
            `${this.BASE_URL}/discover/${type}`,
            [
                this.apiKeyParam,
                { name: "page", value: page },
                { name: "language", value: language },
                { name: "sort_by", value: sort_by},
                { name: "include_adult", value: include_adult},
                { name: "include_video", value: include_video},
            ],
            [
                { name: "with_genres", value: with_genres, join: "OR"},
                { name: "with_actors", value: with_genres, join: "OR"},
                
            ]
        )
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url)
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        return await res.json() as MovieListResponse
    }

    async fetchShowList(
        page: number,
        type: ResourceType,
        with_genres : number[],
        region: string | undefined = undefined,
        language: string | undefined = "en-US",
        sort_by : SortType = undefined,
        include_adult : boolean | undefined = true,
        include_video : boolean | undefined = false
    ): Promise<ShowListResponse> {

        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;

        const url = buildUrl(
            `${this.BASE_URL}/discover/${type}`,
            [
                this.apiKeyParam,
                { name: "page", value: page },
                { name: "language", value: language },
                { name: "sort_by", value: sort_by},
                { name: "include_adult", value: include_adult},
                { name: "include_video", value: include_video},
            ],
            [
                { name: "with_genres", value: with_genres, join: "OR"},
            ]
        )
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url)
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        return await res.json() as ShowListResponse
    }

    async fetchSearchList(
        page: number,
        type: ResourceType,
        query: string | undefined = "",
        language: string | undefined = "en-US"
        
    ): Promise<MovieListResponse> {

        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;

        const url = buildUrl(
            `${this.BASE_URL}/search/${type}`,
            [
                this.apiKeyParam,
                { name: "page", value: page },
                { name: "language", value: language },
                { name: "query", value: query}
            ],
        )
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url)
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        return await res.json() as MovieListResponse
    }

    //url for trailers = 'https://api.themoviedb.org/3/movie/movie_id/videos?language=en-US'
    //https://api.themoviedb.org/3/movie/videos?api_key=11e1be5dc8a3cf947ce265da83199bce&movie_id=866398&language=en-US
    async fetchTrailer(
        move_id : number,
        type : string | undefined = "videos",
        language : string | undefined = "en-US"

    ): Promise<MovieTrailer> {

        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;

        const url = buildUrl(
            `${this.BASE_URL}/movie/${move_id}/${type}`,
            [
                this.apiKeyParam,
                { name: "language", value: language },
            ]
        )
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url)
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await res.json() as MovieTrailer
    }
    cancelOngoingRequests() {
        this.controller.abort();
        this.controller = new AbortController()
    }


    fetchWithTimeout = async (url: string, signal: AbortSignal) => {

        if (signal.aborted) {
            return Promise.reject(signal.reason)
        }

        await this.bucket.consume()

        if (signal.aborted) {
            return Promise.reject(signal.reason)
        }

        return fetch(url, { signal })
    }
}

export default TMDBCClient