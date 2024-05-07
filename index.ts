import express from 'express';
import cors from 'cors';
import { getGenreRatings, recAlgo } from './RecAlgo';
const app = express()
app.use(cors())
//const MovieDB = require('moviedb')('11e1be5dc8a3cf947ce265da83199bce')
const fetch = require('node-fetch')
const port = 3001


app.get('/trending', async (req, res) => {
    try{
        const response = await fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=11e1be5dc8a3cf947ce265da83199bce',
        {headers:{
            "Accept": "application/json"
        }})
        //console.log(response)
        console.log(response, 'hi')
        res.send(response)
    }catch(error){
        console.error("Error fetching data:", error);
        res.status(500).send({message: "Error geetting data", error})
    }
})
app.get("/recommendations", async (req, res) => {
    try{
        const authHeader = req.headers['authorization'];
        const userToken = authHeader?.split(' ')[1]; // Assuming the format is "Bearer {token}"
        if (!userToken) {
            return res.status(401).send({ error: 'Authorization token required' });
        }
        const recs = await recAlgo(userToken)
        //console.log(recs, 'hi')
        res.send(recs)
    }catch(error){
        console.log(error)
    }
})
app.listen(port, () => {
    console.log("Running on port ${port}")
})
