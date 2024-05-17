import {  initializeSupabaseClient } from "./Supa/supabaseClient"
import {useState} from 'react'
import { Details, ListParam, MovieListResponse, Param, Primitves, ResourceType, Root, SortType, favs } from "./Types/Types";
import { SignInWithIdTokenCredentials, SupabaseClient } from "@supabase/supabase-js";

export async function getGenreRatings(supabase : SupabaseClient) {
    const {data, error} = await supabase.from("users").select("genre_ratings");
    if (error) {
        console.log(error)
        return null
    }
    //console.log(data)
    return data
}

export async function getMovieCredits(movie_id: number): Promise<Root | undefined> {
    const apiKey: string = '11e1be5dc8a3cf947ce265da83199bce';
    if(movie_id == -1){
        return undefined
    }
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${apiKey}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    
    }
    const data : Root = await response.json() as Root
    return data
}

async function getMovieGenres(movie_id : number) : Promise<Details | undefined> {
    const apiKey: string = '11e1be5dc8a3cf947ce265da83199bce';
    console.log(movie_id)
    if(movie_id == -1) {
        return undefined
    }else {

    
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${apiKey}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    
    }
    const data : Details = await response.json() as Details
    return data
    }
}
export async function getFavoriteGenres(supabase : SupabaseClient) : Promise<Details[]>{

    const genres : Details[] = []

    const {data, error} = await supabase.from("favoritemovies").select("*")
    //console.log(data as favs[], "usesfavs")
    if(error){
        console.log(error)
        return []
    }
    let count = 0
    for (var movie of data as favs[]) {
        const movie_genres = await getMovieGenres(movie.movie_id)
        if(movie_genres != undefined) {
            count+=1
            genres.push(movie_genres)
        }
        
    }
    //console.log(count, "counts")
    //console.log(details)
    return genres
}

export async function getFavoriteDetails(supabase : SupabaseClient) : Promise<Root[]>{
    const details : Root[] = []
    const genres : Details[] = []

    const {data, error} = await supabase.from("favoritemovies").select("*")
    //console.log(data as favs[], "usesfavs")
    if(error){
        console.log(error)
        return []
    }
    let count = 0
    for (var movie of data as favs[]) {
        const movie_details = await getMovieCredits(movie.movie_id)
        if(movie_details != undefined){
            count+=1
            details.push(movie_details!!)
        }
    }
    //console.log(count, "counts")
    //console.log(details)
    return details
}

function sortMap(castMap : Map<string,number>) {
    const mapSort1 = new Map([...castMap.entries()].sort((a, b) => b[1] - a[1]))
    return mapSort1
}
function sortMapG(genreMap : Map<number,number>) {
    const mapSort1 = new Map([...genreMap.entries()].sort((a, b) => b[1] - a[1]))
    return mapSort1
}

function selectActors(castMap : Map<string,number>, threshold : number){
    let wantedCast : string[] = []
    castMap.forEach((val, actor) => {
        if(val > Math.floor(threshold)){
            wantedCast.push(actor)
        }
    })
    return wantedCast
}
function selectGenres(genreMap : Map<number,number>, threshold : number){
    let wantedGenres : number[] = []
    genreMap.forEach((val, genre) => {
        if(val > Math.floor(threshold) - 1){
            wantedGenres.push(genre)
        }
    })
    return wantedGenres
}


export async function recAlgo(token : string) : Promise<[string[], number[]]> {
    let castMap = new Map<string, number>()
    let genreMap = new Map<number, number>()
    let thresholdCast = 0 //what score we should use to choose actors (ROUND DOWN)
    let thresholdGenre = 0
    const client = initializeSupabaseClient(token)

    const favoiriteGenres : Details[] = await getFavoriteGenres(client)
    const favoriteDetails : Root[] = await getFavoriteDetails(client)

    //console.log(favoriteDetails[0].cast.length)
   
    for (var movieDetail of favoriteDetails) {
        for (var castMemberDetail of movieDetail.cast) {
            if (castMap.has(castMemberDetail.name)) {
                castMap.set(castMemberDetail.name, castMap.get(castMemberDetail.name)!! + 1)
            } else {
                castMap.set(castMemberDetail.name, 1)
            }
        }
    }

    for (var genreLists of favoiriteGenres) {
        for(var genre of genreLists.genres) {
            if(genreMap.has(genre.id)) {
                genreMap.set(genre.id, genreMap.get(genre.id)!! + 1)
            }
            else{
                genreMap.set(genre.id, 1)
            }
        }
    }
    
    castMap = sortMap(castMap)
    genreMap = sortMapG(genreMap)
    console.log(genreMap)
    for(var num of castMap.values()) {
        thresholdCast+=num
    }
    for(var num of genreMap.values()) {
        thresholdGenre+=num
    }
    thresholdCast = thresholdCast/castMap.size
    thresholdGenre = thresholdGenre/genreMap.size
    const actorList = selectActors(castMap, thresholdCast)
    const genreList = selectGenres(genreMap, thresholdGenre)
    console.log(actorList, "hi")
    console.log(genreList, "genr")
 
    return [actorList, genreList]
}