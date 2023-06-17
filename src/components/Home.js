import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import "./app-pages/css/pages.css"

import ProfilePage from "./app-pages/ProfilePage.js"
import Navbar from "./Navbar.js"
import PostPage from "./app-pages/PostPage.js"
import SuggestionBox from "./app-pages/SuggestionBox.js"
import HomePage from "./app-pages/HomePage.js"
import DMSideCard from "./app-components/DMSideCard.js"
import DeleteAccount from "./app-pages/DeleteAccount"

export default function Home({ userId }){

    if (!userId) window.location.assign("/signup")

    const [renderDMs, setRenderDMs] = useState(false)

    return (
        <div className="background-div">
            <Navbar userId={userId} renderDMs={renderDMs} setRenderDMs={setRenderDMs}/>
            {renderDMs && <DMSideCard userId={userId} setRenderDMs={setRenderDMs}/>}
            <Routes>
                <Route path="/profile/:username" element={<ProfilePage id={userId} setRenderDMs={setRenderDMs} />}/>
                <Route path="/post/:postId" element={<PostPage id={userId}/>} />
                <Route path="/suggestionbox" element={<SuggestionBox id={userId}/>}/>
                <Route path="/deleteaccount" element={<DeleteAccount userId={userId}/>}/>
                <Route path="/" element={<HomePage userId={userId}/>}/>
            </Routes>
        </div>
    )

}