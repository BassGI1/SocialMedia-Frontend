import { useEffect, useRef, useState } from "react"
import "./css/home-page.css"

import LoadingModal from "../utils/LoadingModal"
import flame from "../../assets/flame.png"
import filled from "../../assets/filledHeart.png"
import unfilled from "../../assets/unfilledHeart.png"
import defaultImage from "../../assets/noImage.png"
import arrow from "../../assets/replyArrow.png"

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

export default function HomePage({ userId }){

    const page = useRef(0)
    const trendingIter = useRef(0)
    const [posts, setPosts] = useState(null)
    const [fetching, setFetching] = useState(false)
    const trends = useRef(null)
    const users = useRef({})
    const music = useRef(null)

    const playMusic = (src) => {
        if (music.current) music.current.pause()
        music.current = new Audio(src)
        music.current.play()
    }

    useEffect(() => {
        (async () => {
            let followed, trending
            await fetch(`http://localhost:5000/api/followedposts?id=${userId}&page=0`)
            .then(res => res.json())
            .then(data => {
                users.current = data.usersObj
                followed = data.posts
            })
            .catch(x => console.log(x))
            fetch("http://localhost:5000/api/trending")
            .then(res => res.json())
            .then(data => {
                trending = data.posts
                trends.current = data.posts
                for (const user of data.users){
                    if (users.current && !users.current[user._id]) users.current[user._id] = user
                }
                if (followed && followed.length){
                    if (followed.length < 5) setPosts([...followed, trending[0]])
                    else{
                        let x = followed.splice(0, 5)
                        if (trending.length){
                            x.push(trending[0])
                            ++trendingIter.current
                        }
                        x = [...x, ...followed]
                        if (trending.length > 1){
                            ++trendingIter.current
                            x.push(trending[1])
                        }
                        setPosts(x)
                    }
                }
                else{
                    setPosts(["empty"])
                }
            })
            .catch(x => console.log(x))
        }
        )()
    }, [userId])

    const PlusMinus = (first, second, percentage) => {
        const range = {higher: second*(1 + percentage/100), lower: second*(1 - percentage/100)}
        if (first >= range.lower && first <= range.higher) return true
        return false
    }

    const paginate = () => {
        const div = document.querySelector("#home-page-scroller")
        const postHeight = div.getBoundingClientRect().height / 2.5
        if ((PlusMinus(div.scrollTop, (posts.length - 2.5)*postHeight, 2)) && !fetching){
            setFetching(true)
            ++page.current
            fetch(`http://localhost:5000/api/followedposts?id=${userId}&page=${page.current}`)
            .then(res => res.json())
            .then(data => {
                users.current = {...users.current, ...data.usersObj}
                if (data.posts.length){
                    if (data.posts.length < 5){
                        setPosts(p => {
                            if (trends.current < trends.current.length) return [...p, trends.current[trendingIter.current], ...data.posts]
                            return [...p, ...data.posts]
                        })
                        ++trendingIter.current
                    }
                    else{
                        let x = data.posts.splice(0, 5)
                        if (trendingIter.current < trends.current.length) x.push(trends.current[trendingIter.current])
                        ++trendingIter.current
                        setPosts(p => {
                            if (trendingIter.current < trends.current.length) return [...p, ...x, ...data.posts, trends.current[trendingIter.current]]
                            return [...p, ...x, ...data.posts]
                            
                        })
                        ++trendingIter.current
                        setFetching(false)
                    }
                }
            })
        }
    }

    return (
        <div className="flex-100" style={{height: "87.5%"}}>
           {!posts && <LoadingModal />}
           {posts && posts[0] === "empty" && <h1>. . . There's nothing here</h1>}
           {posts && posts.length && posts[0] !== "empty" && <div className="homepage-background-div" id="home-page-scroller" onScroll={paginate}>
                {posts.map((post, i) => <FollowedPost {...post} created={new Date(post.created)} key={i} index={i} usersObj={users.current} userId={userId} playMusic={playMusic}/>)}
            </div>}
        </div>
    )
}

const FollowedPost = ({ _id, by, created, likes, replies, text, title, usersObj, index, userId, playMusic }) => {

    const user = useRef(usersObj[by]).current
    const [heartSrc, setHeartSrc] = useState(likes.includes(userId) ? filled : unfilled)
    const [numLikes, setNumLikes] = useState(likes.length)
    const [changeLikedStatus, setChangeLikedStatus] = useState(true)

    const changeHeartSrc = () => {
        if (heartSrc === filled) setHeartSrc(unfilled)
        else setHeartSrc(filled)
    }

    const heartClick = () => {
        if (changeLikedStatus){
            setChangeLikedStatus(false)
            if (heartSrc === unfilled) setNumLikes(numLikes + 1)
            else setNumLikes(numLikes - 1)
            changeHeartSrc()
        }
        fetch("http://localhost:5000/api/changelikestatus", {
            method: "POST",
            body: JSON.stringify({userId: userId, id: _id}),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(data => setChangeLikedStatus(true))
        .catch(x => console.log(x))
    }

    return (
        <div className="followed-post">
            <div className="home-post-left-div flex-100" style={{backgroundImage: `url(${user.image.data ? user.image.data : defaultImage})`}}>
                {((index !== 0) && (index % 6 === 5)) && <img src={flame} alt="trending!" className="flame"/>}
                <div className="flex-100" style={{height: "20%"}}>
                    <h2 className="underline-hover" style={{fontWeight: "900", textShadow: "0 0 3px black, 0 0 5px black"}} onClick={() => window.location.assign(`/app/profile/${usersObj[by].username}`)}>@{usersObj[by].username}</h2>
                </div>
                <div className="flex-100" style={{height: "20%"}}>
                    {usersObj[by].theme && <h3 className="underline-hover" style={{textShadow: "0 0 3px black, 0 0 5px black"}} onClick={() => playMusic(usersObj[by].theme.preview_url)}>Play User Theme</h3>}
                </div>
                <div className="flex-100" style={{height: "20%", justifyContent: "space-evenly"}}>
                    <img className="home-page-heart" alt="like" src={heartSrc} onClick={heartClick}/>
                    <h3 style={{textShadow: "0 0 3px black, 0 0 5px black"}}>{numLikes === 0 ? "no likes" : numLikes === 1 ? "1 like" : `${numLikes} likes`}</h3>
                </div>
                <div className="flex-100" style={{height: "20%", justifyContent: "space-evenly"}}>
                    <img className="home-page-heart" alt="like" src={arrow} style={{cursor: "default"}}/>
                    <h3 style={{textShadow: "0 0 3px black, 0 0 5px black"}}>{replies.length === 0 ? "no replies" : replies.length === 1 ? "1 reply" : `${replies.length} replies`}</h3>
                </div>
                <h5 style={{height: "20%", width: "100%", textAlign: "center", textShadow: "0 0 3px black, 0 0 5px black", transform: "translateY(-15%)"}}>{months[created.getMonth()]} {created.getDate()}, {created.getFullYear()}</h5>
            </div>
            <div className="home-post-right-div" onClick={() => window.location.assign(`/app/post/${_id}`)}>
                <h1 style={{color: "black", wordBreak: "break-all"}}>{title.length > 49 ? `${title.substring(0, 46)}...` : title}</h1>
                <p style={{color: "black", wordBreak: "break-all"}}>{text.length > 250 ? `${text.substring(0, 250)}...` : text}</p>
            </div>
        </div>
    )
}