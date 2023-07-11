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
import DM from "../../assets/DM.png"

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

export default function ProfilePage({ id, setRenderDMs }){

    const { username } = useParams()
    const [currentUser, setCurrentUser] = useState(null)
    const [user, setUser] = useState(null)
    const [music, setMusic] = useState(null)
    const [renderEdit, setRenderEdit] = useState(false)

    useEffect(() => {
        fetch(`https://harmonise-backend-server.onrender.com/api/getuser?username=${username}`)
        .then(res => res.json())
        .then(data => {
            setUser(data)
            if (data["theme"]) setMusic(new Audio(data["theme"]["preview_url"]))
        })
        .catch(x => console.log(x))
    }, [username])

    useEffect(() => {
        if (id){
            fetch(`https://harmonise-backend-server.onrender.com/api/getuser?_id=${id}`)
            .then(res => res.json())
            .then(data => setCurrentUser(data))
            .catch(x => console.log(x))
        }
    }, [id])

    return (
        <div id="click" className={`page-with-navbar-background-div ${user ? "" : "flex-100"}`}>
            {renderEdit ? <ProfileEdit id={id} setRenderEdit={setRenderEdit} /> : ""}
            {user ? user["success"] ? <div>
                <SideCard id={id} userId={user.id} name={user.name} username={username} trackInfo={music ? user["theme"]: null}  created={new Date(user.created)} track={music} edit={id === user["id"]} setRenderEdit={setRenderEdit} followers={user["followers"]} currentUserFollowers={currentUser ? currentUser.followers : null} setRenderDMs={setRenderDMs}/>
                <UserPosts username={username} userId={id} create={user["id"] === id} />
            </div> : <UserDNE username={username}/> : <LoadingModal />}
        </div>
    )
}

const SideCard = ({ id, userId, name, username, trackInfo, created, track, edit, setRenderEdit, followers, currentUserFollowers }) => {

    const [imgSrc, setImgSrc] = useState(play)
    const [followSrc, setFollowSrc] = useState(followers.includes(id) ? followingIcon : followIcon)
    const [numFollowers, setNumFollowers] = useState(followers.length)
    const [changeFollow, setChangeFollow] = useState(true)
    const [DMing, setDMing] = useState(false)
    const [canDM, setCanDM] = useState(false)
    const [profileImage, setProfileImage] = useState(defaultImage)

    useEffect(() => {
        if (track) track.addEventListener("ended", (e) => setImgSrc(play))
    }, [track])

    useEffect(() => {
        if (currentUserFollowers){
            if (currentUserFollowers.includes(userId) && followers.includes(id)) setCanDM(true)
        }
    }, [currentUserFollowers, id, userId, followers])

    useEffect(() => {
        fetch(`https://harmonise-backend-server.onrender.com/api/image?id=${userId}`)
        .then(res => res.json())
        .then(data => {
            if (data) setProfileImage(data.data)
        })
        .catch(x => console.log(x))
    }, [userId])

    const followUnfollow = () => {
        if (changeFollow){
            setChangeFollow(false)
            if (followSrc === followIcon){
                setFollowSrc(followingIcon)
                setNumFollowers(numFollowers + 1)
                if (currentUserFollowers.includes(userId)) setCanDM(true)
            }
            else{
                setFollowSrc(followIcon)
                setNumFollowers(numFollowers - 1)
                if (canDM) setCanDM(false)
            }
            fetch(`https://harmonise-backend-server.onrender.com/api/changefollowstatus`, {
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

    const DMRoom = () => {
        if (!DMing){
            setDMing(true)
            fetch("https://harmonise-backend-server.onrender.com/api/createroom", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    userOne: id,
                    userTwo: userId
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) window.location.assign(`/room/${data.insertedId}`)
                else window.location.assign(`/room/${data._id}`)
            })
            .catch(x => console.log(x))
        }
    }

    return (
        <div className="profile-page-side-card-background flex-100">
            {edit && <img src={editIcon} alt="edit profile" className="edit-icon" onClick={() => setRenderEdit(true)}/>}
            {canDM && <img src={DM} alt="direct message" className="dm-logo" onClick={DMRoom}/>}
            {document.cookie.includes("user_id") && !edit && <img src={followSrc} alt="follow" className="follow-icon" onClick={followUnfollow} style={{left: `${canDM ? "33.7" : "40"}%`}} />}
            <h1 className="flex-100" style={{textAlign: "center", height: "0%"}}>@{username}</h1>
            <div className="flex-100" style={{height: "25%", transform: "translateY(12.5%)"}}><img alt="nothing" src={profileImage} className="profile-image" style={{cursor: edit ? "pointer" : "default"}} onClick={() => {
                if (edit) window.location.assign("/app/changeprofilepicture")
            }} /></div>
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