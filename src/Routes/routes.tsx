import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import BrowsePage from "../Pages/Home/BrowsePage";
import Loginbox from "../Pages/Login/Loginbox";
import Signup from "../Pages/SignUp/SignupPage";
import RecommendedScreen from "../Pages/IconScreens/RecommendedScreen";
import ProtectedRoute from "../Components/ProtectedRoute";
import MovieInfo from "../Components/MovieInfo";
import SearchPage from "../Pages/SearchPage";
import Profile from "../Components/Profile";
import Pool from "../Components/Pool";
import Home, {ContentPreview} from "../Pages/Home";
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
            {path:"/home",
                element:<Home />,
                children: [
                    {path: "/home", element:<ContentPreview/>},
                    {path: "/home/list", element:<ContentPreview/>}, // TODO (show all user lists or list browse screen)
                    {
                        path:"/home/list/:listId",
                        element: <ListItems/>,
                        // with this data loaded before rendering
                        loader: async ({ request, params }) => {
                            // TODO(get list items)
                            return null
                        },
                    },
                    {path:"/home/favorites", element: <Favorites></Favorites>},
                ]
            },
            {path:"/browse", element:<BrowsePage />},
            {path:"/recommended", element: <ProtectedRoute><RecommendedScreen/></ProtectedRoute>},
            {path:"/search", element: <SearchPage/>},
            {path:"/profile", element:<ProtectedRoute><Profile/></ProtectedRoute> },
            {path:"/pool", element:<ProtectedRoute><Pool/></ProtectedRoute> },
            {path:"/info", element: <MovieInfo/>},
            {path:"/showinfo", element: <Showinfo/>},

            {path:"/WatchItem", element: <WatchItem></WatchItem>},

            {path:"/WatchShow", element: <WatchShow></WatchShow>}
        ]
    }, 
    {path:"/signin", element:<Loginbox />},
    {path:"/signup", element:<Signup />},
])