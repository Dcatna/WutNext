"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TokenBuckets_1 = require("./ratelimit/TokenBuckets");
const query_1 = require("./query/query");
class TMDBCClient {
    constructor() {
        this.reqPerMin = 50;
        this.apiKey = '11e1be5dc8a3cf947ce265da83199bce';
        this.bucket = TokenBuckets_1.TokenBuckets
            .builder()
            .withCapacity(this.reqPerMin)
            .withFixedIntervalRefillStrategy(this.reqPerMin, 
        // 60 sec to milliseconds
        60 * 1000)
            .build();
        // Create an AbortController instance
        this.controller = new AbortController();
        this.apiKeyParam = {
            name: "api_key",
            value: this.apiKey
        };
        this.BASE_URL = "https://api.themoviedb.org/3";
        this.fetchWithTimeout = async (url, signal) => {
            if (signal.aborted) {
                return Promise.reject(signal.reason);
            }
            await this.bucket.consume();
            if (signal.aborted) {
                return Promise.reject(signal.reason);
            }
            return fetch(url, { signal });
        };
    }
    async fetchMovieList(page, type, with_genres, region = undefined, language = "en-US", sort_by = undefined, include_adult = true, include_video = false) {
        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;
        const url = (0, query_1.buildUrl)(`${this.BASE_URL}/discover/${type}`, [
            this.apiKeyParam,
            { name: "page", value: page },
            { name: "language", value: language },
            { name: "sort_by", value: sort_by },
            { name: "include_adult", value: include_adult },
            { name: "include_video", value: include_video },
        ], [
            { name: "with_genres", value: with_genres, join: "AND" },
        ]);
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    }
    //`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${apiKey}`
    async fetchCreditList(movie_id, 
    //type: ResourceType,
    language = "en-US") {
        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;
        const url = (0, query_1.buildUrl)(`${this.BASE_URL}/movie/${movie_id}}/credits`, [
            this.apiKeyParam,
            { name: "language", value: language },
        ]);
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    }
    async fetchShowCreditList(show_id, 
    //type: ResourceType,
    language = "en-US") {
        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;
        const url = (0, query_1.buildUrl)(`${this.BASE_URL}/tv/${show_id}}/credits`, [
            this.apiKeyParam,
            { name: "language", value: language },
        ]);
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    }
    async fetchRecommendedList(page, type, with_genres, with_actors, language = "en-US", sort_by = "popularity.desc", include_adult = true, include_video = false) {
        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;
        const url = (0, query_1.buildUrl)(`${this.BASE_URL}/discover/${type}`, [
            this.apiKeyParam,
            { name: "page", value: page },
            { name: "language", value: language },
            { name: "sort_by", value: sort_by },
            { name: "include_adult", value: include_adult },
            { name: "include_video", value: include_video },
        ], [
            { name: "with_genres", value: with_genres, join: "OR" },
            { name: "with_actors", value: with_genres, join: "OR" },
        ]);
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    }
    async fetchShowList(page, type, with_genres, region = undefined, language = "en-US", sort_by = undefined, include_adult = true, include_video = false) {
        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;
        const url = (0, query_1.buildUrl)(`${this.BASE_URL}/discover/${type}`, [
            this.apiKeyParam,
            { name: "page", value: page },
            { name: "language", value: language },
            { name: "sort_by", value: sort_by },
            { name: "include_adult", value: include_adult },
            { name: "include_video", value: include_video },
        ], [
            { name: "with_genres", value: with_genres, join: "OR" },
        ]);
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    }
    async fetchMovieSearchList(page, type, query = "", language = "en-US") {
        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;
        const url = (0, query_1.buildUrl)(`${this.BASE_URL}/search/${type}`, [
            this.apiKeyParam,
            { name: "page", value: page },
            { name: "language", value: language },
            { name: "query", value: query }
        ]);
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    }
    async fetchShowSearchList(page, type, query = "", language = "en-US") {
        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;
        const url = (0, query_1.buildUrl)(`${this.BASE_URL}/search/${type}`, [
            this.apiKeyParam,
            { name: "page", value: page },
            { name: "language", value: language },
            { name: "query", value: query }
        ]);
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    }
    //url for trailers = 'https://api.themoviedb.org/3/movie/movie_id/videos?language=en-US'
    //https://api.themoviedb.org/3/movie/videos?api_key=11e1be5dc8a3cf947ce265da83199bce&movie_id=866398&language=en-US
    async fetchMovieTrailer(move_id, type = "videos", language = "en-US") {
        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;
        const url = (0, query_1.buildUrl)(`${this.BASE_URL}/movie/${move_id}/${type}`, [
            this.apiKeyParam,
            { name: "language", value: language },
        ]);
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    }
    async fetchShowTrailer(show_id, type = "videos", language = "en-US") {
        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;
        const url = (0, query_1.buildUrl)(`${this.BASE_URL}/tv/${show_id}/${type}`, [
            this.apiKeyParam,
            { name: "language", value: language },
        ]);
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    }
    async fetchSimilarMovie(move_id, type = "similar", language = "en-US") {
        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;
        const url = (0, query_1.buildUrl)(`${this.BASE_URL}/movie/${move_id}/${type}`, [
            this.apiKeyParam,
            { name: "language", value: language },
        ]);
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    }
    async fetchSimilarShow(show_id, type = "similar", language = "en-US") {
        // Obtain a reference to the AbortSignal
        const signal = this.controller.signal;
        const url = (0, query_1.buildUrl)(`${this.BASE_URL}/tv/${show_id}/${type}`, [
            this.apiKeyParam,
            { name: "language", value: language },
        ]);
        const res = await this.fetchWithTimeout(url, signal);
        console.log(url);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.json();
    }
    cancelOngoingRequests() {
        this.controller.abort();
        this.controller = new AbortController();
    }
}
exports.default = TMDBCClient;
