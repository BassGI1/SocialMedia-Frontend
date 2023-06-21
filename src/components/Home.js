import { Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import "./app-pages/css/pages.css"

import ProfilePage from "./app-pages/ProfilePage.js"
import Navbar from "./Navbar.js"
import PostPage from "./app-pages/PostPage.js"
import SuggestionBox from "./app-pages/SuggestionBox.js"
import HomePage from "./app-pages/HomePage.js"
import DMSideCard from "./app-components/DMSideCard.js"
import DeleteAccount from "./app-pages/DeleteAccount.js"
import ChangePicturePage from "./app-pages/ChangePicturePage.js"
import noImage from "../assets/noImage.png"
import SearchPage from "./app-pages/SearchPage"

export default function Home({ userId }){

    if (!userId) window.location.assign("/signup")

    const [renderDMs, setRenderDMs] = useState(false)
    const [image, setImage] = useState("")

    useEffect(() => {
        if (!image.length){
            fetch(`http://localhost:5000/api/image?id=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (!data) setImage(noImage)
                else setImage(data.data)
            })
            .catch(x => console.log(x))
        }
    }, [image, userId])

    return (
        <div className="background-div">
            <Navbar userId={userId} renderDMs={renderDMs} setRenderDMs={setRenderDMs} image={image}/>
            {renderDMs && <DMSideCard userId={userId} setRenderDMs={setRenderDMs}/>}
            <Routes>
                <Route path="/profile/:username" element={<ProfilePage id={userId} setRenderDMs={setRenderDMs}/>}/>
                <Route path="/post/:postId" element={<PostPage id={userId}/>} />
                <Route path="/suggestionbox" element={<SuggestionBox id={userId}/>}/>
                <Route path="/deleteaccount" element={<DeleteAccount userId={userId}/>}/>
                <Route path="/changeprofilepicture" element={<ChangePicturePage userId={userId} setImage={setImage} image={image}/>}/>
                <Route path="/search" element={<SearchPage />}/>
                <Route path="/" element={<HomePage userId={userId}/>}/>
            </Routes>
        </div>
    )

}