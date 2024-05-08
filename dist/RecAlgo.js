"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recAlgo = exports.getFavoriteDetails = exports.getFavoriteGenres = exports.getMovieCredits = exports.getGenreRatings = void 0;
const supabaseClient_1 = require("./Supa/supabaseClient");
async function getGenreRatings(supabase) {
    const { data, error } = await supabase.from("users").select("genre_ratings");
    if (error) {
        console.log(error);
        return null;
    }
    //console.log(data)
    return data;
}
exports.getGenreRatings = getGenreRatings;
async function getMovieCredits(movie_id) {
    const apiKey = '11e1be5dc8a3cf947ce265da83199bce';
    if (movie_id == -1) {
        return undefined;
    }
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${apiKey}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}
exports.getMovieCredits = getMovieCredits;
async function getMovieGenres(movie_id) {
    const apiKey = '11e1be5dc8a3cf947ce265da83199bce';
    console.log(movie_id);
    if (movie_id == -1) {
        return undefined;
    }
    else {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    }
}
async function getFavoriteGenres(supabase) {
    const genres = [];
    const { data, error } = await supabase.from("favoritemovies").select("*");
    //console.log(data as favs[], "usesfavs")
    if (error) {
        console.log(error);
        return [];
    }
    let count = 0;
    for (var movie of data) {
        const movie_genres = await getMovieGenres(movie.movie_id);
        if (movie_genres != undefined) {
            count += 1;
            genres.push(movie_genres);
        }
    }
    //console.log(count, "counts")
    //console.log(details)
    return genres;
}
exports.getFavoriteGenres = getFavoriteGenres;
async function getFavoriteDetails(supabase) {
    const details = [];
    const genres = [];
    const { data, error } = await supabase.from("favoritemovies").select("*");
    //console.log(data as favs[], "usesfavs")
    if (error) {
        console.log(error);
        return [];
    }
    let count = 0;
    for (var movie of data) {
        const movie_details = await getMovieCredits(movie.movie_id);
        if (movie_details != undefined) {
            count += 1;
            details.push(movie_details);
        }
    }
    //console.log(count, "counts")
    //console.log(details)
    return details;
}
exports.getFavoriteDetails = getFavoriteDetails;
function sortMap(castMap) {
    const mapSort1 = new Map([...castMap.entries()].sort((a, b) => b[1] - a[1]));
    return mapSort1;
}
function sortMapG(genreMap) {
    const mapSort1 = new Map([...genreMap.entries()].sort((a, b) => b[1] - a[1]));
    return mapSort1;
}
function selectActors(castMap, threshold) {
    let wantedCast = [];
    castMap.forEach((val, actor) => {
        if (val > Math.floor(threshold)) {
            wantedCast.push(actor);
        }
    });
    return wantedCast;
}
function selectGenres(genreMap, threshold) {
    let wantedGenres = [];
    genreMap.forEach((val, genre) => {
        if (val > Math.floor(threshold) - 1) {
            wantedGenres.push(genre);
        }
    });
    return wantedGenres;
}
async function recAlgo(token) {
    let castMap = new Map();
    let genreMap = new Map();
    let thresholdCast = 0; //what score we should use to choose actors (ROUND DOWN)
    let thresholdGenre = 0;
    const client = (0, supabaseClient_1.initializeSupabaseClient)(token);
    const favoiriteGenres = await getFavoriteGenres(client);
    const favoriteDetails = await getFavoriteDetails(client);
    //console.log(favoriteDetails[0].cast.length)
    for (var movieDetail of favoriteDetails) {
        for (var castMemberDetail of movieDetail.cast) {
            if (castMap.has(castMemberDetail.name)) {
                castMap.set(castMemberDetail.name, castMap.get(castMemberDetail.name) + 1);
            }
            else {
                castMap.set(castMemberDetail.name, 1);
            }
        }
    }
    for (var genreLists of favoiriteGenres) {
        for (var genre of genreLists.genres) {
            if (genreMap.has(genre.id)) {
                genreMap.set(genre.id, genreMap.get(genre.id) + 1);
            }
            else {
                genreMap.set(genre.id, 1);
            }
        }
    }
    castMap = sortMap(castMap);
    genreMap = sortMapG(genreMap);
    console.log(genreMap);
    for (var num of castMap.values()) {
        thresholdCast += num;
    }
    for (var num of genreMap.values()) {
        thresholdGenre += num;
    }
    thresholdCast = thresholdCast / castMap.size;
    thresholdGenre = thresholdGenre / genreMap.size;
    const actorList = selectActors(castMap, thresholdCast);
    const genreList = selectGenres(genreMap, thresholdGenre);
    console.log(actorList, "hi");
    console.log(genreList, "genr");
    return [actorList, genreList];
}
exports.recAlgo = recAlgo;
