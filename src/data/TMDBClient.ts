import {MovieListResponse, MovieListType} from "./types/MovieListResponse";


class TMDBCClient {

    private readonly apiKey: string = '11e1be5dc8a3cf947ce265da83199bce'

    private readonly apiKeyParam = {
        name: "api_key",
        value: this.apiKey
    }

    private readonly BASE_URL = "https://api.themoviedb.org/3"

    async fetchMovieList(
        page: number,
        type: MovieListType,
        region: string | undefined = undefined,
        language: string | undefined = "en-US"
    ): Promise<MovieListResponse> {


        const url = buildUrl(
            `${this.BASE_URL}/movie/${type}`,
            [
                this.apiKeyParam,
                { name: "page", value: page },
                { name: "region", value: region},
                { name: "language", value: language }
            ]
        )

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        return await res.json() as MovieListResponse
    }
}

type Param = {
    name: string
    value: string | number | undefined
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