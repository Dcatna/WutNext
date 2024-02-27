import React, { useContext, useEffect, useMemo, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { CurrentUserContext, TMDBClientContext } from '../../App'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MovieListResult } from '../../data/types/MovieListResponse'
import Moviebox from '../../Components/Moviebox'


interface genres {
  [key:string] : number
}
//gonna prompt user with 5 or so shows/movies depending on what they are looking for then show recs, if they dont know any 
//of the shows just show them mix of popular and highest rated, and let them like movies and shows
async function fetchRecs(){
  const res = await fetch('/recommendations')
  return res 
}
const RecommendedScreen = () => {
  

  const client = useContext(TMDBClientContext)
  const [recGenres, setRecGenres] = useState<number[]>([])
  const [recActors, setRecActors] = useState<string[]>([])
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
       // console.log(data[0]['genre_ratings'])

      } catch (error) {
        console.log(error)
        console.error('There was a problem with the fetch operation:', error)
      }
    }

    fetchRecs();
  }, [])

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
      queryKey: ['discoverMovies', recActors, recGenres],
      queryFn: ({ pageParam }) => client.fetchRecommendedList(pageParam, "movie", recGenres, recActors),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
          if (lastPage.page < lastPage.total_pages) {
              return lastPage.page + 1;
          } else {
              return undefined;
          }
      },
  });

  useEffect(() => {
      const handleScroll = () => {
          //checking if we are near the bottom of the screen
          if(window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
              fetchNextPage().catch((e) => alert(e.toLocaleString()))
          }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)

  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  

  const items = useMemo(() => {
      return data?.pages.flatMap((page) => page.results) ?? []

  }, [data, recActors, recGenres])


  console.log(items)

  
  return (
    <div className="flex flex-col h-full w-full pe-12">
      <div>
      <Navbar></Navbar>
      </div>
      <div className="flex-grow grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 p-4">
    {items.map((movie: MovieListResult) => (
      <Moviebox key={movie.id} item={movie} />
    ))}
    </div>

</div>


  )
}

export default RecommendedScreen