import { useEffect, useRef, useState } from "react"

import SuggestionBox from "../assets/suggestionBoxLogo.png" 
import DM from "../assets/DM.png"
import play from "../assets/play.png"
import pause from "../assets/pause.png"
import noImage from "../assets/noImage.png"
import search from "../assets/search.png"

export default function Navbar({ userId, renderDMs, setRenderDMs }){

    const [user, setUser] = useState(null)
    const [musicImgSrc, setMusicImgSrc] = useState(null)
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
            <div className="flex-100" style={{width: "50%", justifyContent: "space-evenly"}}>
                <input placeholder="Search for something"  style={{width: "90%", height: "30%", borderRadius: "2rem", backgroundColor: "transparent", color: "white"}} onChange={(e) => searchText.current = e.target.value} />
                <img src={search} alt="search" className="search-image-button"/>
            </div>
            <div style={{width: "15%", display: "flex", justifyContent: "space-evenly", alignItems: "center", height: "100%", alignSelf: "flex-end"}}>
                <a className="suggestion-box-logo" href="/app/suggestionbox"><img src={SuggestionBox} alt="suggestion box" style={{height: "100%"}}/></a>
                <img src={DM} alt="direct messages" style={{height: "80%", cursor: "pointer"}} onClick={() => setRenderDMs(!renderDMs)}/>
                {musicImgSrc && <img src={musicImgSrc} alt="play theme" style={{height: "50%", marginLeft: "5%", cursor: "pointer"}} onClick={playMusic}/>}
            </div>
            <img src={noImage} alt="user" style={{cursor: "pointer", height: "65%", borderRadius: "50%", border: "0.25rem solid #cca43b"}} onClick={() => {if (user) window.location.assign(`/app/profile/${user.username}`)}} />
        </nav>
    )
}