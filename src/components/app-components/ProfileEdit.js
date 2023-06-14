import { useRef, useState } from "react"

import "./css/profile-edit.css"
import LoadingModal from "../utils/LoadingModal"
import backArrow from "../../assets/backArrow.png"

export default function ProfileEdit({ id, setRenderEdit }){

    const [stageTwo, setStageTwo] = useState(false)
    const [loadWhileExpanding, setLoadWhileExpanding] = useState(false)
    const [page, setPage] = useState(0)
    const [musicChoices, setMusicChoices] = useState(["not empty"])
    let password = useRef("").current
    let changeInfo = useRef({password: "", email: "", username: "", theme: {}, firstName: "", lastName: ""}).current
    let selectedTrack = useRef(null).current
    let q = useRef("").current

    const checkPassword = () => {
        fetch(`http://localhost:5000/api/getuser?_id=${id}&password=${password}`)
        .then(res => res.json())
        .then(data => {
            if (data["success"]) {
                setStageTwo(true)
                setLoadWhileExpanding(true)
                setTimeout(() => setLoadWhileExpanding(false), 1500)
            }
            else setRenderEdit(false)
        })
        .catch(x => console.log(x))
    }

    const searchForMusic = () => {
        if ((musicChoices.length && q.length) || (musicChoices[0] === "empty")){
            if (selectedTrack) selectedTrack.pause()
            setPage(0)
            selectedTrack = null
            setMusicChoices([])
            fetch(`http://localhost:5000/api/searchfortrack?q=${q}`, {
                method: "GET"
            })
            .then(res => res.json())
            .then(data => setMusicChoices(data))
            .catch(x => console.log(x))
        }
    }

    const paginate = () => {
        const temp = [...musicChoices]
        for (let i = 0; i < page; ++i) temp.splice(0, 10)
        return temp.splice(0, 10)
    }

    const playMusic = (id) => {
        if (selectedTrack) selectedTrack.pause()
        const track = musicChoices.find(x => x.id === id).preview_url
        if (!selectedTrack || track !== selectedTrack.currentSrc) {
            selectedTrack = new Audio(track)
            selectedTrack.play()
        }
        else{
            selectedTrack = null
        }
    }

    const stopAudio = () => {
        if (selectedTrack) selectedTrack.pause()
        selectedTrack = null
    }

    const submit = async () => {
        let status = false
        await fetch(`http://localhost:5000/api/getuser?username=${changeInfo["username"]}`)
        .then(res => res.json())
        .then(data => status = data["success"])
        .catch(x => console.log(x))
        if (status){
            alert("Username already taken")
            return
        }
        await fetch(`http://localhost:5000/api/getuser?email=${changeInfo["email"]}`)
        .then(res => res.json())
        .then(data => status = data["success"])
        .catch(x => console.log(x))
        if (status){
            alert("Email already in use")
            return
        }
        const keys = Object.keys(changeInfo)
        const username = changeInfo["username"]
        for (let i = 0; i < keys.length; ++i) if (!changeInfo[keys[i]].length) delete changeInfo[keys[[i]]]
        const body = {
            ...changeInfo,
            _id: id
        }
        if (selectedTrack) body["theme"] = musicChoices.find(x => x.preview_url === selectedTrack.currentSrc)
        fetch(`http://localhost:5000/api/edituser`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(data => window.location.assign(`/app/profile/${username.length ? username : data["username"]}`))
        .catch(x => console.log(x))
    }

    return (
        <div className="darkened-out-background-div flex-100" >
            {!stageTwo && <div className="interactive-div flex-100">
                <h2 className="flex-100" style={{height: "10%", color: "black"}}>Enter your password</h2>
                <input type="password" placeholder="Enter your password" onChange={(e) => password = e.target.value} style={{color: "black", width: "50%"}}/>
                <div className="flex-100" style={{justifyContent: "space-evenly", height: "25%"}}>
                    <button className="music-init-submit-button" style={{height: "auto"}} onClick={checkPassword}>Submit</button>
                    <button className="music-init-submit-button" style={{height: "auto"}} onClick={() => setRenderEdit(false)}>Cancel</button>
                </div>
            </div>}
            {stageTwo && <div className="interactive-div flex-100 expand">
                {loadWhileExpanding && <LoadingModal backgroundColor="#cca43b" barColor="#363636" barWidth="0.35rem" height="3.5rem" width="3.5rem"/>}
                {!loadWhileExpanding && <div className="flex-100">
                    <img src={backArrow} alt="back" className="back-arrow" onClick={() => setRenderEdit(false)}/>
                    <button className="music-init-done flex-100 music-done-hover" style={{position: "absolute", top: "12.5%", right: "11%", cursor: "pointer", zIndex: 3}} onClick={submit}>Complete</button>
                    <div className="flex-100" style={{position: "absolute", top: "-33.33%"}}><h1 style={{color: "#363636", fontSize: "3rem", cursor: "default"}}>Edit your profile</h1></div>
                    <div className="change-profile-side-div flex-100" style={{width: "30%", flexDirection: "column"}}>
                        <input type="text" placeholder="Enter new username" style={{width: "60%", color: "black", marginBottom: "3%"}} onChange={(e) => changeInfo["username"] = e.target.value} />
                        <input type="text" placeholder="Enter new first name" style={{width: "60%", color: "black", marginBottom: "3%"}} onChange={(e) => changeInfo["firstName"] = e.target.value} />
                        <input type="text" placeholder="Enter new last name" style={{width: "60%", color: "black", marginBottom: "3%"}} onChange={(e) => changeInfo["lastName"] = e.target.value} />
                        <input type="email" placeholder="Enter new email" style={{width: "60%", color: "black", marginBottom: "3%"}} onChange={(e) => changeInfo["email"] = e.target.value} />
                        <input type="password" placeholder="Enter new password" style={{width: "60%", color: "black", marginBottom: "3%"}} onChange={(e) => changeInfo["password"] = e.target.value} />
                    </div>
                    <div className="change-profile-side-div flex-100" style={{width: "70%"}}>
                        <div className="flex-100" style={{height: "10%", alignSelf: "flex-start"}}>
                            <input type="text" placeholder="Search" style={{width: "60%", color: "black"}} onChange={(e) => q = e.target.value}/>
                            <button style={{cursor: "pointer"}} onClick={searchForMusic} >Search</button>
                        </div>
                        <div className="paginate-button-div flex-100">
                            {page !== 0 && <button className="paginate paginate-button" onClick={() => {
                                stopAudio()
                                setPage(page - 1)
                            }}>←</button>}
                        </div>
                        <div className="main-music-div flex-100">
                        {musicChoices.length > 1 ? <MusicGallery music={paginate()} playMusic={playMusic} stopAudio={stopAudio} /> : null}
                        </div>
                        <div className="paginate-button-div flex-100">
                        {(page !== 4) && (musicChoices.length > 1) && <button className="paginate paginate-button" onClick={() => {
                                stopAudio()
                                setPage(page + 1)
                            }} >→</button>}
                        </div>
                    </div>
                </div>}
            </div>}
        </div>
    )
}

const MusicGallery = ({ music, playMusic }) => {
    return (
        <div className="flex-100" style={{height: "95%"}}>
            {music.map(x => <TrackDisplay key={x.id} {...x} playMusic={playMusic}/>)}
        </div>
    )
}

const TrackDisplay = ({ images, name, artist, id, playMusic }) => {
    return (
        <div className="flex-100 track-div-edit" style={{height: "50%", width: "20%", cursor: "pointer"}} onClick={() => playMusic(id)}>
            <div className="flex-100" style={{height: "auto"}}>
                <img src={images} alt="album cover" className="track-display-image"/>
            </div>
            <div className="flex-100" style={{height: "auto", marginTop: "-5%"}}>
                <div className="flex-100" style={{height: "0%"}}>
                    <p style={{fontSize: (name.length > 25) || (artist.length > 25) ? "0.65rem" : "0.8rem", alignSelf: "flex-start", textAlign: "center",  color: "#363636"}}>{name}<br/>{artist}</p>
                </div>
            </div>
        </div>
    )
}