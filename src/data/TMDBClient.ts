import {MovieListResponse, MovieListType} from "./types/MovieListResponse";
import {TokenBuckets} from "./ratelimit/TokenBuckets";
import {TokenBucket} from "./ratelimit/TokenBucket";
import {sign} from "node:crypto";


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
        type: MovieListType,
        with_genres : string | undefined = " ",
        region: string | undefined = undefined,
        language: string | undefined = "en-US",
        
        sort_by : string | undefined = "popularity.desc",
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
                { name: "with_genres", value: with_genres},
                { name: "sort_by", value: sort_by},
                { name: "include_adult", value: include_adult},
                { name: "include_video", value: include_video},

            ]
        )
        console.log(with_genres)
        console.log(url)
        const res = await this.fetchWithTimeout(url, signal);

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        return await res.json() as MovieListResponse
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


type Param = {
    name: string
    value: string | number | boolean |undefined
}

function buildUrl(base: string, args: Param[]): string {

    let url = base
    let first = true

    for (let {name, value} of args) {
        if (value === undefined) {
            continue
        }
        if (first) {
            url += `?${name}=${value.toString()}`
            first = false
        } else {
            url += `&${name}=${value.toString()}`
        }
    }

    return url
}

export default TMDBCClient