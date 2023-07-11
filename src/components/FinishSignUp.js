import { useEffect, useRef, useState } from "react"

export default function FinishSignUp({ id, created }){

    const [renderFunctionality, setRenderFunctionality] = useState(false)
    const [musicChoices, setMusicChoices] = useState(["not empty"])
    const [page, setPage] = useState(0)
    const [showWarning, setShowWarning] = useState(false)
    let selectedTrack = useRef(null).current
    let q = useRef("").current

    useEffect(() => {
        let createdDate = new Date(created)
        createdDate.setTime(createdDate.getTime() + 300000)
        if (createdDate < new Date()) window.location.assign("/app")
        setTimeout(() => setRenderFunctionality(true), 2000)
    }, [created])

    const searchForMusic = () => {
        if ((musicChoices.length && q.length) || (musicChoices[0] === "empty")){
            if (selectedTrack) selectedTrack.pause()
            setPage(0)
            selectedTrack = null
            setMusicChoices([])
            fetch(`https://harmonise-backend-server.onrender.com/api/searchfortrack?q=${q}`, {
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
            selectedTrack.autoplay = true
        }
        else{
            selectedTrack = null
        }
    }

    const stopAudio = () => {
        if (selectedTrack) selectedTrack.pause()
        selectedTrack = null
    }

    const submit = () => {
        fetch("https://harmonise-backend-server.onrender.com/api/changemusic", {
            method: "POST",
            body: JSON.stringify({
                _id: id,
                theme: musicChoices.find(x => x.preview_url === selectedTrack.currentSrc)
            }),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(data => window.location.assign(`/app/profile/${data["username"]}`))
        .catch(x => console.log(x))
    }

    return (
        <div className="finish-signup-background">
            <div className="finish-signup-middle-div">
                {renderFunctionality && <div className="flex-100">
                    {showWarning && <div className="flex-100 music-init-submit-background-div">
                            <div className="flex-100" style={{height: "60%", width: "60%", backgroundColor: "orange"}}>
                                <h2 style={{textAlign: "center", color: "black", height: "50%"}}>
                                    You have not selected a track. Are you sure you do not want this feature?
                                </h2>
                                <div className="flex-100" style={{height: "auto", marginTop: "-20%"}}>
                                    <button className="music-init-submit-button" onClick={() => window.location.assign("/app")}>
                                        Yes
                                    </button>
                                    <button className="music-init-submit-button" onClick={() => setShowWarning(false)}>
                                        No
                                    </button>
                                </div>
                            </div>
                    </div>}
                    <div className="flex-100" style={{height: "18.5%", alignSelf: "flex-start", fontSize: "1.75rem", borderBottom: "1rem solid #363636"}}>
                        <div className="flex-100 music-init-done" onClick={() => {
                            if (!selectedTrack){
                                setShowWarning(true)
                            }
                            else{
                                submit()
                            }
                        }}>
                            Complete
                        </div>
                        <h1 className="flex-100" style={{height: "30%"}}>
                            You're almost done!
                        </h1>
                        <h6 className="flex-100" style={{height: "20%"}}>
                            Pick your favourite song that will play whenever your account is visited.
                        </h6>
                        <div className="flex-100" style={{height: "337.5%"}}>
                            <div className="flex-100" style={{height: "auto", alignSelf: "flex-start"}}>
                                <input type="text" className="signup-input" placeholder="Search" onChange={(e) => {
                                    q = e.target.value
                                }}/>
                                <button style={{cursor: "pointer"}} onClick={searchForMusic}>Search</button>
                            </div>
                            <div className="flex-100" style={{height: "5%"}}></div>
                            {musicChoices.length > 1 ? <MusicGallery music={paginate()} page={page} setPage={setPage} playMusic={playMusic} stopAudio={stopAudio} /> : null}
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

const MusicGallery = ({ music, page, setPage, playMusic, stopAudio }) => {
    return (
        <div className="flex-100" style={{height: "95%"}}>
            {page !== 0 ? <button className="paginate" style={{right: "90%"}} onClick={() => {
                stopAudio()
                setPage(page - 1)
            }}>←</button> : ""}
            {page !== 4 ? <button className="paginate" style={{left: "90%"}} onClick={() => {
                stopAudio()
                setPage(page + 1)
            }}>→</button>: ""}
            {music.map(x => <TrackDisplay key={x.id} {...x} playMusic={playMusic}/>)}
        </div>
    )
}

const TrackDisplay = ({ images, name, artist, id, playMusic }) => {
    return (
        <div className="flex-100 track-div" style={{height: "50%", width: "20%", cursor: "pointer"}} onClick={() => playMusic(id)}>
            <div className="flex-100" style={{height: "auto"}}>
                <img src={images} alt="album cover" className="track-display-image"/>
            </div>
            <div className="flex-100" style={{height: "auto", marginTop: "-5%"}}>
                <div className="flex-100" style={{height: "0%"}}>
                    <p style={{fontSize: name.length > 29 ? "0.75rem" : "0.9rem", alignSelf: "flex-start", textAlign: "center"}}>{name}<br/>{artist}</p>
                </div>
            </div>
        </div>
    )
}