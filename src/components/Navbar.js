import { useEffect, useRef, useState } from "react"

import SuggestionBox from "../assets/suggestionBoxLogo.png" 
import DM from "../assets/DM.png"
import play from "../assets/play.png"
import pause from "../assets/pause.png"
import noImage from "../assets/noImage.png"
import search from "../assets/search.png"
import Harmonize from "../assets/harmonizeLogo.png"

export default function Navbar({ userId, renderDMs, setRenderDMs }){

    const [user, setUser] = useState(null)
    const [musicImgSrc, setMusicImgSrc] = useState(null)
    const [renderProfileDropDown, setRenderProfileDropDown] = useState(false)
    const searchText = useRef("")
    const music = useRef(null)
    
    useEffect(() => {
        if (!user){
            fetch(`http://localhost:5000/api/getuser?_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                setUser(data)
                if (data.theme){
                    setMusicImgSrc(play)
                    music.current = new Audio(data.theme.preview_url)
                    music.current.addEventListener("ended", (e) => setMusicImgSrc(play))
                }
            })
            .catch(x => console.log(x))
        }
        // eslint-disable-next-line
    }, [])

    const playMusic = () => {
        if (music.current.paused && ((music.current.readyState === 4) || (music.current.readyState === 3))){
            music.current.play()
            setMusicImgSrc(pause)
        }
        else{
            music.current.pause()
            setMusicImgSrc(play)
        }
    }

    return (
        <nav className="navbar">
            <img src={Harmonize} alt="Harmonize" style={{height: "66.66%", cursor: "pointer"}} onClick={() => window.location.assign("/app")}/>
            <div className="flex-100" style={{width: "50%", justifyContent: "space-evenly"}}>
                <input placeholder="Search for something"  style={{width: "90%", height: "30%", borderRadius: "2rem", backgroundColor: "transparent", color: "white"}} onChange={(e) => searchText.current = e.target.value} />
                <img src={search} alt="search" className="search-image-button"/>
            </div>
            <div style={{width: "15%", display: "flex", justifyContent: "space-evenly", alignItems: "center", height: "100%", alignSelf: "flex-end"}}>
                <a className="suggestion-box-logo" href="/app/suggestionbox"><img src={SuggestionBox} alt="suggestion box" style={{height: "100%"}}/></a>
                <img src={DM} alt="direct messages" style={{height: "80%", cursor: "pointer"}} onClick={() => setRenderDMs(!renderDMs)}/>
                {musicImgSrc && <img src={musicImgSrc} alt="play theme" style={{height: "50%", marginLeft: "5%", cursor: "pointer"}} onClick={playMusic}/>}
            </div>
            <div className="flex-100" style={{height: "100%", position: "relative", width: "5%"}}>
                <img src={noImage} alt="user" style={{cursor: "pointer", height: "65%", borderRadius: "50%", border: "0.25rem solid #cca43b"}} onClick={() => setRenderProfileDropDown(!renderProfileDropDown)}/>
                {renderProfileDropDown && <div style={{position: "absolute", backgroundColor: "#242f40", width: "200%", height: "150%", zIndex: 15, top: "100%", borderBottomLeftRadius: "1rem", borderBottomRightRadius: "1rem", borderLeft: "0.15rem solid #26262e", borderBottom: "0.15rem solid #26262e", borderRight: "0.15rem solid #26262e", overflow: "hidden"}}>
                    <div className="flex-100 dropdown-half-div" onClick={() => {if (user) window.location.assign(`/app/profile/${user.username}`)}}>
                        My Profile
                    </div>
                    <div className="flex-100 dropdown-half-div" onClick={() => {
                        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
                        window.location.assign("/signup")
                    }}>
                        Log Out
                    </div>
                </div>}
            </div>
        </nav>
    )
}