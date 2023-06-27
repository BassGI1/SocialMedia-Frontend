import { useEffect, useRef, useState } from "react"
import "./css/search-page.css"

import LoadingModal from "../utils/LoadingModal.js"
import defaultImage from "../../assets/noImage.png"

const parseURL = () => {
    if (!window.location.href.includes("?query")) window.location.assign("/app")
    return window.location.href.split("?query")[1].substring(1)
}

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

export default function SearchPage(){

    const [posts, setPosts] = useState(null)
    const [users, setUsers] = useState(null)
    const music = useRef(null)
    
    useEffect(() => {
        fetch(`https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/search?query=${parseURL()}`)
        .then(res => res.json())
        .then(data => {
            setPosts(data.posts)
            setUsers(data.users)
        })
        .catch(x => console.log(x))
    }, [])

    return (
        <div className="flex-100" style={{height: "87.5%"}}>
            {!posts && <LoadingModal />}
            {posts && users && <div className="flex-100">
                <section className="title-dividing-section">
                    <h1 style={{textAlign: "center", width: "65%", fontSize: "2.75rem", cursor: "default"}}>Posts</h1>
                    <h1 style={{textAlign: "center", width: "35%", fontSize: "2.25rem", cursor: "default"}}>Users</h1>
                </section>
                <div className="not-title-other-div">
                    <div className="posts-div">
                        {!posts.length && <h1>There are no posts that match the query . . .</h1>}
                        {posts.length ? posts.map((post, i) => <Post {...post} music={music} key={i}/>) : ""}
                    </div>
                    <div className="users-div">
                        {!users.length && <h1>There are no users that match the query . . .</h1>}
                        {users.length ? users.map((user, i) => <User {...user} music={music} key={i}/>) : ""}
                    </div>
                </div>
            </div>}
        </div>
    )
}

const Post = ({ created, id, numLikes, numReplies, text, title, user, music }) => {
    
    const date = new Date(created)

    const playMusic = () => {
        if (music.current) music.current.pause()
        music.current = new Audio(user.theme.preview_url)
        music.current.play()
    }

    return (
        <div className="post-background-search">
            <div className="left-div-post">
                <h2 className="underline-hover" style={{height: "0%", color: "black"}} onClick={() => window.location.assign(`/app/profile/${user.username}`)}>@{user.username}</h2>
                {user.theme && <h3 className="underline-hover" style={{height: "0%", color: "black"}} onClick={playMusic}>Play User Theme</h3>}
                <h4 style={{height: "0%", color: "black"}}>{`${numLikes === 0 ? "no likes" : numLikes === 1 ? "1 like" : `${numLikes} likes`}`}</h4>
                <h4 style={{height: "0%", color: "black", position: "relative", top: "-10%"}}>{`${numReplies === 0 ? "no replies" : numReplies === 1 ? "1 reply" : `${numReplies} replies`}`}</h4>
                <h5 style={{height: "0%", color: "black", position: "relative", top: "-12.5%"}}>{`${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</h5>
            </div>
            <div className="right-div-post" onClick={() => window.location.assign(`/app/post/${id}`)}>
                <h1 style={{color: "black", wordBreak: "break-all", position: "relative", top: "10%"}}>{title.length > 35 ? title.slice(0, 32) + "..." : title}</h1>
                <p style={{color: "black", wordBreak: "break-all", position: "relative", bottom: "10%"}}>{text.length > 250 ? text.slice(0, 247) + "..." : text}</p>
            </div>
        </div>
    )
}

const User = ({ created, id, image, music, name, numFollowers, theme, username }) => {

    const playMusic = () => {
        if (music.current) music.current.pause()
        music.current = new Audio(theme.preview_url)
        music.current.play()
    }

    return (
        <div className="user-background-search">
            <div className="flex-100" style={{width: "30%", height: "100%", position: "relative", overflow: "hidden", flexDirection: "column"}}>
                <img src={image ? image.data : defaultImage} alt="profile" style={{height: "65%", borderRadius: "1rem", border: "0.3rem solid white"}} onClick={() => window.location.assign(`/app/profile/${username}`)}/>
            </div>
            <div className="flex-100" style={{width: "70%", height: "100%", position: "relative", flexDirection: "column"}}>
                <h2 className="underline-hover" style={{height: "0%"}} onClick={() => window.location.assign(`/app/profile/${username}`)}>@{username}</h2>
                <h4 style={{height: "0%"}}>{name}</h4>
                <h3 style={{height: "0%", position: "relative", bottom: "7.5%"}}>{`${numFollowers === 0 ? "no followers" : numFollowers === 1 ? "1 follower" : `${numFollowers} followers`}`}</h3>
                {theme && <h4 className="underline-hover" style={{height: "0%", position: "relative", bottom: "10%"}} onClick={playMusic}>Play User Theme</h4>}
            </div>
        </div>
    )
}