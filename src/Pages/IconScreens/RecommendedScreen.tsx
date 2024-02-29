import React, { useContext, useEffect, useMemo, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { CurrentUserContext, TMDBClientContext } from '../../App'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MovieListResponse, MovieListResult } from '../../data/types/MovieListResponse'
import Moviebox from '../../Components/Moviebox'
import { supabase } from '../../lib/supabaseClient'
import { favs } from '../../Components/Profile'

const RecommendedScreen = () => {
  
  let firstind = 0
  let secondind = 2 
  let realPage = 1

  const client = useContext(TMDBClientContext)
  const [recGenres, setRecGenres] = useState<number[]>([])
  const [recActors, setRecActors] = useState<string[]>([])
  const [favMovies, setFavMovies] = useState<favs[]>([])
  const [passInGenres, setPassInGenres] = useState<number[]>(recGenres.slice(0, 2))
  const [loading, setLoading] = useState<boolean>(true)
  const currentUserSession = useContext(CurrentUserContext) 
  const userToken = currentUserSession?.access_token
  useEffect(() => {
    async function fetchRecs() {
      try {
        const response = await fetch('/recommendations', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data  = await response.json()
        setRecActors(data[0])
        setRecGenres(data[1])
        setPassInGenres(data[1].slice(0, 2))
       // console.log(data[0]['genre_ratings'])

      } catch (error) {
        console.log(error)
        console.error('There was a problem with the fetch operation:', error)
      }
    }
    fetchRecs();
  }, [])

  useEffect(() => {
    async function getFavs(){
      try{
        const {data, error} = await supabase.from("favoritemovies").select("*")
        setFavMovies(data as favs[])
      }catch(error) {
        console.log(error)
      }
    }
   getFavs()
  }, [])

  console.log(passInGenres)
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['discoverMovies', recGenres.slice(0,2)],
    queryFn: ({ pageParam = 1 }) => recGenres.length === 0 
    ? Promise.resolve<MovieListResponse>({
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0
      }) : client.fetchRecommendedList(pageParam, "movie", passInGenres, recActors),
    getNextPageParam: (lastPage) => lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1, 
  });
  useEffect(() => {
    if(data == null){
      setLoading(true)
    }
    else{
      setLoading(false)
    }
  }, [data])


  useEffect(() => {
      const handleScroll = () => {
          //checking if we are near the bottom of the screen
          if(window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
              fetchNextPage().catch((e) => alert(e.toLocaleString()))
              setPassInGenres(recGenres)    
          }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)

  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const itemsRec = useMemo(() => {
      return data?.pages.flatMap((page) => page.results) ?? []

  }, [data, recActors, recGenres])

  console.log(favMovies)
  console.log(itemsRec)
  let passItems = itemsRec.filter(movie => !favMovies.some(favMovie => favMovie.id === movie.id))
  if(passItems.length < 10) {
    fetchNextPage()
  }

  if(loading == true) return <div>Loading...</div>
  return (
    <div className="flex flex-col h-full w-full pe-12">
      <div>
      <Navbar></Navbar>
      </div>
        <div className="flex-grow grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 p-4">
        {passItems.map((movie: MovieListResult) => (
      <Moviebox key={movie.id} item={movie} />
    ))}
      </div>

</div>


  )
}

export default RecommendedScreen