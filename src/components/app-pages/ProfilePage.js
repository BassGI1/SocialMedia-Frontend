import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import UserPosts from "../app-components/UserPosts.js"
import UserDNE from "./ProfileDNE.js"
import ProfileEdit from "../app-components/ProfileEdit.js"
import LoadingModal from "../utils/LoadingModal.js"
import defaultImage from "../../assets/noImage.png"
import Spotify from "../../assets/spotifyLogo.png"
import pause from "../../assets/pause.png"
import play from "../../assets/play.png"
import editIcon from "../../assets/editProfileIcon.png"
import followIcon from "../../assets/followIcon.png"
import followingIcon from "../../assets/followingIcon.png"

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

export default function ProfilePage({ id }){

    const { username } = useParams()
    const [user, setUser] = useState(null)
    const [music, setMusic] = useState(null)
    const [renderEdit, setRenderEdit] = useState(false)

    useEffect(() => {
        fetch(`http://localhost:5000/api/getuser?username=${username}`)
        .then(res => res.json())
        .then(data => {
            setUser(data)
            if (data["theme"]) setMusic(new Audio(data["theme"]["preview_url"]))
        })
        .catch(x => console.log(x))
    }, [username])

    return (
        <div id="click" className={`page-with-navbar-background-div ${user ? "" : "flex-100"}`}>
            {renderEdit ? <ProfileEdit id={id} setRenderEdit={setRenderEdit} /> : ""}
            {user ? user["success"] ? <div>
                <SideCard id={id} userId={user.id} name={`${user.firstName} ${user.lastName}`} username={username} trackInfo={music ? user["theme"]: null}  created={new Date(user.created)} track={music} edit={id === user["id"]} setRenderEdit={setRenderEdit} followers={user["followers"]}/>
                <UserPosts username={username} userId={id} create={user["id"] === id} />
            </div> : <UserDNE username={username}/> : <LoadingModal />}
        </div>
    )
}

const SideCard = ({ id, userId, name, username, trackInfo, created, track, edit, setRenderEdit, followers }) => {

    const [imgSrc, setImgSrc] = useState(play)
    const [followSrc, setFollowSrc] = useState(followers.includes(id) ? followingIcon : followIcon)
    const [numFollowers, setNumFollowers] = useState(followers.length)
    const [changeFollow, setChangeFollow] = useState(true)

    useEffect(() => {
        if (track) track.addEventListener("ended", (e) => setImgSrc(play))
    }, [track])

    const followUnfollow = () => {
        if (changeFollow){
            setChangeFollow(false)
            if (followSrc === followIcon){
                setFollowSrc(followingIcon)
                setNumFollowers(numFollowers + 1)
            }
            else{
                setFollowSrc(followIcon)
                setNumFollowers(numFollowers - 1)
            }
            fetch(`http://localhost:5000/api/changefollowstatus`, {
                method: "POST",
                body: JSON.stringify({
                    followeeId: userId,
                    followerId: id
                }),
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.json())
            .then(data => setChangeFollow(true))
            .catch(x => console.log(x))
        }
    }

    return (
        <div className="profile-page-side-card-background flex-100">
            {edit && <img src={editIcon} alt="edit profile" className="edit-icon" onClick={() => setRenderEdit(true)}/>}
            {document.cookie.includes("user_id") && !edit && <img src={followSrc} alt="follow" className="follow-icon" onClick={followUnfollow} />}
            <h1 className="flex-100" style={{textAlign: "center", height: "0%"}}>@{username}</h1>
            <div className="flex-100" style={{height: "25%", transform: "translateY(12.5%)"}}><img alt="nothing" src={defaultImage} className="profile-image"/></div>
            <h3 style={{textAlign: "center"}}>{name}<br/>{`${numFollowers} ${numFollowers === 1 ? "follower" : "followers"}`}<br/>{`Joined ${months[created.getMonth()]} ${created.getDate()}, ${created.getFullYear()}`}</h3>
            {trackInfo && <div className="flex-100 music-div">
                <img src={trackInfo["images"]} style={{width: "40%"}} alt="track logo"/>
                <div className="flex-100" style={{width: "50%", flexDirection: "column"}}>
                    <h4 style={{textAlign: "center"}}>
                        {trackInfo["name"]}
                        <br/>
                        {trackInfo["artist"]}
                    </h4>
                    <div className="flex-100" style={{height: "auto"}}>
                        <img src={imgSrc} alt="control" style={{cursor: "pointer", height: "4vh"}}  onClick={() => {
                            if (imgSrc === play) setImgSrc(pause)
                            else setImgSrc(play)
                            if (track.paused && ((track.readyState === 4) || (track.readyState === 3))) track.play()
                            else track.pause()
                        }}/>
                        <a href={trackInfo["spotify"]} target="_blank" rel="noreferrer"><img src={Spotify} alt="spotify" style={{height: "5vh", marginLeft: "3vh", transform: "translateY(0.75vh)", cursor: "pointer"}}/></a>
                    </div>
                </div>
            </div>}
        </div>
    )
}