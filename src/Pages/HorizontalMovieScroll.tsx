import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Moviebox, { movieBoxProp } from "../Components/Moviebox";
import {
  MovieListResponse,
  MovieListResult,
  MovieListType,
  ShowListResponse,
  ShowListResult,
  ShowListType,
} from "../data/types/MovieListResponse";
import { Link } from "react-router-dom";
import { showBoxProp } from "../Components/Showbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faGripLines,
  faStar,
  fas,
  faCircleMinus,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { CurrentUserContext } from "../App";
import { supabase } from "../lib/supabaseClient";
interface HoriScrollType {
  movieType: MovieListType | undefined;
  showType: ShowListType | undefined;
  movieOrShow: movieShow;
}
type movieShow = "movie" | "tv";

interface FetchMoviesParams {
  pageParam: number;
}
const HorizontalMovieScroll = ({
  movieType,
  showType,
  movieOrShow,
}: HoriScrollType) => {
  //const [item, setItems] = useState<Result[]> = (])

  //const [animationParent] = useAutoAnimate()
  const [arr, setArr] = useState<MovieListResult[] | ShowListResult[]>([]);
  //const [page, setPage] = useState(1);

  async function fetchMoviesOrShows() {
    const apiKey = process.env.REACT_APP_TMDB_API_KEY
    console.log(apiKey)
    const res = await fetch(
      `https://api.themoviedb.org/3/${movieOrShow}/${
        movieType ? movieType : showType
      }?api_key=${apiKey}&page=1`
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    } else {
      const movies: MovieListResponse = await res.json();
      console.log(movies);
      setArr(movies.results);
    }
  }

  useEffect(() => {
    fetchMoviesOrShows();
  }, []);

  return (
    <div className="flex flex-row w-full overflow-x-auto">
      {arr.map((item: MovieListResult | ShowListResult) => {
        if ("original_title" in item) {
          // Assuming original_title is unique to MovieListResult
          const movieItem = item as MovieListResult; // Type assertion
          return (
            <div className="min-w-[200px] px-2">
              <MovieItems item={movieItem} inList={false} lst={undefined} />
            </div>
          );
        } else {
          const showItem = item as ShowListResult; // Type assertion
          return (
            <div className="min-w-[200px] px-2">
              <ShowItems item={showItem} inList={false} lst={undefined} />
            </div>
          );
        }
      })}
    </div>
  );
};
const ShowItems = ({ item }: showBoxProp) => {
  const partial_url = "https://image.tmdb.org/t/p/original/";
  const [loaded, setLoaded] = useState(false);
  const client = useContext(CurrentUserContext);
  async function handleFavorites(
    event: React.MouseEvent,
    item: ShowListResult
  ) {
    event.preventDefault(); // Prevent link navigation
    event.stopPropagation();
    const { data, error } = await supabase
      .from("favoritemovies")
      .select("*")
      .eq("show_id", item.id);
    console.log(data);
    if (data?.length == 0) {
      const { data, error } = await supabase.from("favoritemovies").insert([
        {
          movie_id: -1,
          show_id: item.id,
          user_id: client?.user.id,
          poster_path: item.poster_path,
          title: item.name,
          overview: item.overview,
          vote_average: item.vote_average,
        },
      ]);
      if (error) {
        console.log(error, "hi");
      } else {
        console.log(data);
      }
    } else {
      console.log("MOVIE IS ALREADY FAVORITED");
    }
  }
  return (
    <div className="group relative">
      <div className="absolute top-0 right-0 m-2 z-10">
        <button onClick={(event) => handleFavorites(event, item)}>
          <FontAwesomeIcon icon={faStar} />
        </button>
      </div>

      <Link
        to={"/showinfo"}
        state={{ item }}
        className="block w-full relative m-2 aspect-[3/4]"
      >
        <img
          onLoad={() => setLoaded(true)}
          className="absolute top-0 left-0 w-full h-full rounded-md object-cover "
          src={`${partial_url}${item.poster_path}`}
          alt="Movie Poster"
        />
        <div className="absolute bottom-0 left-0 w-full h-4/6 bg-gradient-to-t from-black to-transparent rounded-md" />
        <div className="absolute bottom-0 left-0 w-full h-full hover:bg-gradient-to-t from-slate-900 to-transparent bg-transparent rounded-md" />
        {loaded && (
          <text className="absolute bottom-0 left-0 m-2 text-white text-xs line-clamp-2">
            {item.name}
          </text>
        )}
      </Link>
    </div>
  );
};
const MovieItems = ({ item }: movieBoxProp) => {
  const partial_url = "https://image.tmdb.org/t/p/original/";
  const [loaded, setLoaded] = useState(false);
  const client = useContext(CurrentUserContext);

  async function handleFavorites(
    event: React.MouseEvent,
    item: MovieListResult
  ) {
    event.preventDefault(); // Prevent link navigation
    event.stopPropagation();
    const { data, error } = await supabase
      .from("favoritemovies")
      .select("*")
      .eq("movie_id", item.id);
    console.log(data);
    if (data?.length == 0) {
      const { data, error } = await supabase.from("favoritemovies").insert([
        {
          movie_id: item.id,
          show_id: -1,
          user_id: client?.user.id,
          poster_path: item.poster_path,
          title: item.title,
          overview: item.overview,
          vote_average: item.vote_average,
        },
      ]);

      if (error) {
        console.log(error, "hi");
      } else {
        console.log(data);
      }
    } else {
      console.log("MOVIE IS ALREADY FAVORITED");
    }
  }
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 m-2 z-10">
        <button onClick={(event) => handleFavorites(event, item)}>
          <FontAwesomeIcon icon={faStar} />
        </button>
      </div>

      <Link
        to={"/info"}
        state={{ item }}
        className="block w-full relative m-2 aspect-[3/4]"
      >
        <img
          onLoad={() => setLoaded(true)}
          className="absolute top-0 left-0 w-full h-full rounded-md object-cover "
          src={`${partial_url}${item.poster_path}`}
          alt="Movie Poster"
        />
        <div className="absolute bottom-0 left-0 w-full h-4/6 bg-gradient-to-t from-black to-transparent rounded-md" />
        <div className="absolute bottom-0 left-0 w-full h-full hover:bg-gradient-to-t from-slate-900 to-transparent bg-transparent rounded-md" />
        {loaded && (
          <text className="absolute bottom-0 left-0 m-2 text-white text-xs line-clamp-2">
            {item.title}
          </text>
        )}
      </Link>
    </div>
  );
};

export default HorizontalMovieScroll;
