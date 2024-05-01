import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/Home/HomePage";
import Loginbox from "../Pages/Login/Loginbox";
import Signup from "../Pages/SignUp/SignupPage";
import RecommendedScreen from "../Pages/IconScreens/RecommendedScreen";
import ProtectedRoute from "../Components/ProtectedRoute";
import MovieInfo from "../Components/MovieInfo";
import SearchPage from "../Pages/SearchPage";
import Profile from "../Components/Profile";
import Pool from "../Components/Pool";
import FavoritesList from "../Components/FavoritesList";
import Browse from "../Pages/Browse";
import Showinfo from "../Components/Showinfo";
import ListItems from "../Pages/ListItems";
import WatchItem from "../Components/WatchItem"
import Favorites from "../Pages/Favorites";
import WatchShow from "../Components/WatchShow";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {path:"/", element:<Browse />},
            {path:"/home", element:<HomePage />},
            {path:"/recommended", element: <ProtectedRoute><RecommendedScreen/></ProtectedRoute>},
            {path:"/search", element: <SearchPage/>},
            {path:"/profile", element:<ProtectedRoute><Profile/></ProtectedRoute> },
            {path:"/pool", element:<ProtectedRoute><Pool/></ProtectedRoute> },
            {path:"/info", element: <MovieInfo/>},
            {path:"/showinfo", element: <Showinfo/>},
            {path:"/listitems", element: <ListItems/>},
            {path:"/WatchItem", element: <WatchItem></WatchItem>},
            {path:"/favorites", element: <Favorites></Favorites>},
            {path:"/WatchShow", element: <WatchShow></WatchShow>}
        ]
    }, 
    {path:"/signin", element:<Loginbox />},
    {path:"/signup", element:<Signup />},
    {path:"/favorites", element:<FavoritesList/>}
])