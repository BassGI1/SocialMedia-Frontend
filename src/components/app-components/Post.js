import "./css/post.css"
import filled from "../../assets/filledHeart.png"
import unfilled from "../../assets/unfilledHeart.png"
import replyArrow from "../../assets/replyArrow.png"
import { useState } from "react"

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

export default function Post({ postId, title, text, likes, created, username, userId, numReplies }){

    const [heartAnimate, setHeartAnimate] = useState(false)
    const [numLikes, setNumLikes] = useState(likes.length)
    const [heartSrc, setHeartSrc] = useState(likes.includes(userId) ? filled : unfilled)
    const [changeLikedStatus, setChangeLikedStatus] = useState(true)

    const changeHeartSrc = () => {
        if (heartSrc === filled) setHeartSrc(unfilled)
        else setHeartSrc(filled)
    }

    const heartClick = () => {
        if (changeLikedStatus){
            setChangeLikedStatus(false)
            if (heartSrc === unfilled) {
                setHeartAnimate(true)
                setNumLikes(numLikes + 1)
                setTimeout(() => setHeartAnimate(false), 260)
            }
            else setNumLikes(numLikes - 1)
            changeHeartSrc()
        }
        fetch("http://localhost:5000/api/changelikestatus", {
            method: "POST",
            body: JSON.stringify({userId: userId, id: postId}),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(data => setChangeLikedStatus(true))
        .catch(x => console.log(x))
    }

    return (
        <div className="post-background-div flex-100" onClick={(e) => {
            if (e.target.nodeName !== "IMG" && e.target.nodeName !== "H3"){
                window.location.assign(`/app/post/${postId}`)
            }
        }}>
            <div className="info-div flex-100">
                <h3 className="underline-hover" onClick={() => window.location.assign(`/app/profile/${username}`)}>@{username}</h3>
                <h5>{months[created.getMonth()]} {created.getDate()}, {created.getFullYear()}</h5>
            </div>
            <div className="post-div flex-100">
                <h1 style={{transform: "translateY(-15%)"}} >{title.length > 49 ? `${title.substring(0, 46)}...` : title}</h1>
                {userId && <div className="flex-100" style={{height: "auto", position: "absolute", transform: "translateX(-2.5%)"}}>
                    <img src={heartSrc} alt="heart" className={`heart ${heartAnimate ? "heart-animate" : ""}`} onClick={heartClick} />
                    <h5 style={{position: "absolute", left: "52.5%", transform: "translateY(-50%)"}}>{numLikes} {numLikes === 1 ? "like" : "likes"}</h5>
                    <div className="flex-100" style={{height: "auto", marginTop: "1%"}}>
                        <img src={replyArrow} alt="replies" className="heart"/>
                        <h5 style={{position: "absolute", left: "52.5%"}}>{numReplies === 0 ? "no" : numReplies} {numReplies === 1 ? "reply" : "replies"}</h5>
                    </div>
                </div>}
                <h6 style={{width: "90%", textAlign: "center"}}>{text.length > 250 ? `${text.substring(0, 250)}...` : text}</h6>
            </div>
        </div>
    )
}