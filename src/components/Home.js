import { Routes, Route } from "react-router-dom"
import "./app-pages/css/pages.css"

import ProfilePage from "./app-pages/ProfilePage.js"
import Navbar from "./Navbar.js"
import PostPage from "./app-pages/PostPage"
import SuggestionBox from "./app-pages/SuggestionBox"
import HomePage from "./app-pages/HomePage"

export default function Home({ userId }){

    return (
        <div className="background-div">
            <Navbar />
            <Routes>
                <Route path="/profile/:username" element={<ProfilePage id={userId}/>}/>
                <Route path="/post/:postId" element={<PostPage id={userId}/>} />
                <Route path="/suggestionbox" element={<SuggestionBox id={userId}/>}/>
                <Route path="/" element={<HomePage userId={userId}/>}/>
            </Routes>
        </div>
    )

}