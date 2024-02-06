import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/Home/HomePage";
import Loginbox from "../Pages/Login/Loginbox";
import Signup from "../Pages/SignUp/SignupPage";
import RecommendedScreen from "../Pages/IconScreens/RecommendedScreen";
import ProtectedRoute from "../Components/ProtectedRoute";
import MovieInfo from "../Components/MovieInfo";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {path:"/", element:<HomePage />},
            {path:"/recommended", element: <ProtectedRoute><RecommendedScreen/></ProtectedRoute>},
            
            
             
        ]
    }, 
    {path:"/signin", element:<Loginbox />},
    {path:"/info", element: <MovieInfo/>},
    {path:"/signup", element:<Signup />}
])