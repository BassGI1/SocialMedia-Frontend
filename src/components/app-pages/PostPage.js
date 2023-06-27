import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import "./css/post-page.css"

import PostDNE from "./PostDNE.js"

import LoadingModal from "../utils/LoadingModal.js"
import filled from "../../assets/filledHeart.png"
import unfilled from "../../assets/unfilledHeart.png"
import replyArrow from "../../assets/replyArrow.png"
import trash from "../../assets/trash.png"
import yes from "../../assets/yes.png"
import no from "../../assets/no.png"

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

export default function PostPage({ id }){

    const { postId } = useParams()
    const [post, setPost] = useState(null)
    const [poster, setPoster] = useState(null)
    const [heartSrc, setHeartSrc] = useState(null)
    const [changeLikedStatus, setChangeLikedStatus] = useState(true)
    const [heartAnimate, setHeartAnimate] = useState(false)
    const [numLikes, setNumLikes] = useState(null)
    const [replies, setReplies] = useState(null)
    const [page, setPage] = useState(0)
    const [fetchingPage, setFetchingPage] = useState(false)
    const [renderDialog, setRenderDialog] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const music = useRef(null)

    useEffect(() => {
        fetch(`https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/getpost?id=${postId}`)
        .then(res => res.json())
        .then(data => {
            if (Object.keys(data).includes("success")){
                setPost("not found")
                return
            }
            setPost(data)
            setNumLikes(data["likes"].length)
            if (data["likes"].includes(id)) setHeartSrc(filled)
            else setHeartSrc(unfilled)
            fetch(`https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/getuser?_id=${data["by"]}`)
            .then(res => res.json())
            .then(x => setPoster(x))
        })
        .catch(x => console.log(x))

        setFetchingPage(true)
        fetch(`https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/getreplies?postId=${postId}&page=${0}`)
        .then(res => res.json())
        .then(data => {
            setReplies(data)
            setFetchingPage(false)
        })
        .catch(x => console.log(x))
    }, [postId, id])

    const PlusMinus = (first, second, percentage) => {
        const range = {higher: second*(1 + percentage/100), lower: second*(1 - percentage/100)}
        if (first >= range.lower && first <= range.higher) return true
        return false
    }

    const nextFewReplies = () => {
        const div = document.querySelector("#scroll-div-post-page")
        const replyHeight = div.getBoundingClientRect().height*20/87.5
        if ((PlusMinus(div.scrollTop, (page*10 + 15)*replyHeight, 2) && !fetchingPage)){
            setPage(page + 1)
            setFetchingPage(true)
            fetch(`https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/getreplies?postId=${postId}&page=${page + 1}`)
            .then(res => res.json())
            .then(data => {
                setReplies(r => [...r, ...data])
                setFetchingPage(false)
            })
            .catch(x => console.log(x))
        }
    }

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
        fetch("https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/changelikestatus", {
            method: "POST",
            body: JSON.stringify({userId: id, id: postId}),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(data => setChangeLikedStatus(true))
        .catch(x => console.log(x))
    }

    const confirmYes = () => {
        if (!deleting){
            setDeleting(true)
            fetch("https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/deletepost", {
                method: "POST",
                body: JSON.stringify({
                    postId: post._id
                }),
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.json())
            .then(data => window.location.assign(`/app/profile/${poster.username}`))
            .catch(x => console.log(x))
        }
    }

    const confirmNo = () => {
        setRenderDialog(false)
        const dialog = document.querySelector("#trash-dialog")
        dialog.close()
    }

    return (
        <div className="flex-100" style={{height: "87.5%"}}>
            {!post && !poster && <LoadingModal />}
            {post && poster && <div className="flex-100" style={{alignItems: "flex-start", overflowY: "auto"}} onScroll={nextFewReplies} id="scroll-div-post-page">
                <div className="post-background">
                    <div className="left-div">
                        {id === poster.id && <img src={trash} alt="delete post" className="trash-icon" onClick={() => {
                            setRenderDialog(true)
                            const dialog = document.querySelector("#trash-dialog")
                            dialog.showModal()
                        }}/>}
                        {id === poster.id && <dialog id="trash-dialog" className="trash-dialog flex-100" style={{display: `${!renderDialog ? "none" : "flex"}`}} onClose={confirmNo}>
                            <h2>Are you sure you want to delete this post?</h2>
                            <div className="flex-100" style={{height: "auto", justifyContent: "space-evenly"}}>
                                <div className="confirm-button-yes" onClick={confirmYes}>
                                    <div className="flex-100" style={{width: "25%", height: "100%"}}>
                                        <img className="flex-100" src={yes} alt="yes" style={{position: "relative", transform: "translateX(15%)"}}/>
                                    </div>
                                    <div className="flex-100" style={{position: "relative", width: "75%", height: "100%", color: "white", fontSize: "1.25rem"}}>
                                        Yes
                                    </div>
                                </div>
                                <div className="confirm-button-no" onClick={confirmNo}>
                                <div className="flex-100" style={{width: "25%", height: "80%"}}>
                                        <img className="flex-100" src={no} alt="yes" style={{position: "relative", transform: "translateX(15%)"}}/>
                                    </div>
                                    <div className="flex-100" style={{position: "relative", width: "75%", height: "100%", color: "white", fontSize: "1.25rem"}}>
                                        No
                                    </div>
                                </div>
                            </div>
                        </dialog>}
                        <h2 style={{color: "black"}} className="hover-underline" onClick={() => window.location.assign(`/app/profile/${poster["username"]}`)}>
                            {poster.username}
                        </h2>
                        <img src={heartSrc} alt="like" onClick={heartClick} className={`heart ${heartAnimate ? "heart-animate-here" : ""}`} style={{width: "25%", cursor: "pointer"}} />
                        <h2 style={{color: "black"}}>
                            {numLikes === 0 ? "no likes" : numLikes === 1 ? "1 like" : `${numLikes} likes`}
                        </h2>
                        <h5 style={{color: "black", position: "absolute", bottom: "1.5%"}}>
                            {`${months[new Date(post["created"]).getMonth()]} ${new Date(post["created"]).getDate()}, ${new Date(post["created"]).getFullYear()}`}
                        </h5>
                    </div>
                    <div className="right-div">
                        <h1 style={{width: "100%", height: "20%", color: "black", fontSize: "2.5rem", position: "absolute", top: "0%", transform: "translateY(-25%)", lineHeight: "100%", textAlign: "center"}}>
                            {post["title"]}
                        </h1>
                        <p className="p-tag" style={{color: "black", transform: "translateY(20%)", overflowY: "scroll"}}>
                            {post["text"]}
                        </p>
                        <div style={{width: "12.5%", height: "7.5%", position: "absolute", bottom: "1.5%", right: "0%", display: "flex", alignItems: "center", justifyContent: "center", transform: "translateX(35%)"}}>
                            <img src={replyArrow} alt="replies" style={{height: "80%", position: "absolute", left: "0px"}}/>
                            <h6 style={{transform: "translateX(5%)", color: "black"}}>
                                {post["replies"].length === 0 ? "no replies" : post["replies"].length === 1 ? "1 reply" : `${post["replies"].length} replies`}
                            </h6>
                        </div>
                    </div>
                </div>
                <div className="reply-div">
                    <CreateReply id={id} postId={postId}/>
                    {!replies && <div className="single-reply-div"><LoadingModal barColor="#363636" backgroundColor="#cca43b" height="3rem" width="3rem" barWidth="3.5px"/></div>}
                    {replies && !replies.length && <NoReplies />}
                    {replies ? replies.length ? replies.map((x, i) => <Reply key={i} userId={id} music={music} {...x} postId={post._id}/>) : "" : ""}
                </div>
            </div>}
            {post === "not found" && <PostDNE />}
        </div>
    )
}

const CreateReply = ({ id, postId }) => {

    const postText = useRef("")
    const [replying, setReplying] = useState(false)
    
    const reply = () => {
        if (!postText.current.length) alert("Your reply is empty!")
        else if (!replying){
            setReplying(true)
            fetch("https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/createreply", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    postId: postId,
                    userId: id,
                    text: postText.current
                })
            })
            .then(res => res.json())
            .then(data => window.location.reload())
            .catch(x => console.log(x))
        }
    }

    return (
    <div className="create-reply-div flex-100" style={{flexDirection: "column"}}>
        <h2 style={{color: "black", height: "20%"}}>
            Write a reply
        </h2>
        <textarea maxLength={500} style={{resize: "none", color: "black", height: "50%", width: "70%", backgroundColor: "transparent", borderRadius: "1rem"}} placeholder="Enter your reply" onChange={(e) => postText.current = e.target.value}></textarea>
        <button className="reply-button" onClick={reply}>Reply</button>
    </div>
    )
}

const NoReplies = () => {
    return (
        <div className="single-reply-div">
            <h1 style={{color: "black"}}>. . . There's Nothing Here</h1>
        </div>
    )
}

const Reply = ({userId, id, likes, text, user, created, music, postId}) => {

    const [heartSrc, setHeartSrc] = useState(likes.includes(userId) ? filled : unfilled)
    const [numLikes, setNumLikes] = useState(likes.length)
    const [changeLikedStatus, setChangeLikedStatus] = useState(true)
    const [deleting, setDeleting] = useState(false)

    const changeMusic = () => {
        if (music.current) music.current.pause()
        music.current = new Audio(user.theme.preview_url)
        music.current.play()
    }

    const likeUnlike = () => {
        if (changeLikedStatus){
            setChangeLikedStatus(false)
            fetch("https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/likereply", {
                method: "POST",
                body: JSON.stringify({
                    replyId: id,
                    userId: userId
                }),
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.json())
            .then(data => {
                if (heartSrc === filled){
                    setHeartSrc(unfilled)
                    setNumLikes(numLikes - 1)
                }
                else {
                    setHeartSrc(filled)
                    setNumLikes(numLikes + 1)
                }
                setChangeLikedStatus(true)
            })
            .catch(x => console.log(x))
        }
    }

    const deleteReply = () => {
        if (!deleting){
            setDeleting(true)
            fetch("https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/deletereply", {
                method: "POST",
                body: JSON.stringify({
                    userId: userId,
                    replyId: id,
                    postId: userId === user._id ? postId : null
                }),
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.json())
            .then(data => window.location.reload())
            .catch(x => console.log(x))
        }
    }

    return (
        <div className="single-reply-div">
            <div className="left-reply-div">
                <h3 style={{color: "black", wordBreak: "break-word", height: "0%"}} className="hover-underline" onClick={() => window.location.assign(`/app/profile/${user.username}`)}>
                    {user.username}
                </h3>
                <h5 style={{color: "black", wordBreak: "break-word", height: "0%"}} className="hover-underline" onClick={changeMusic}>
                    play theme music
                </h5>
                <img src={heartSrc} alt="like" className="reply-heart" onClick={likeUnlike}/>
                <h3 style={{color: "black", wordBreak: "break-word", height: "0%"}}>
                    {numLikes === 0 ? "no likes" : numLikes === 1 ? "1 like" : `${numLikes} likes`}
                </h3>
                <h6 style={{color: "black", wordBreak: "break-word", height: "0%"}}>
                {`${months[new Date(created).getMonth()]} ${new Date(created).getDate()}, ${new Date(created).getFullYear()}`}
                </h6>
            </div>
            <div className="right-reply-div" style={{position: "relative"}}>
                <p style={{color: "black", wordBreak: "break-all"}}>{text}</p>
                {user._id === userId && <img src={trash} alt="delete reply" className="trash-icon" style={{position: "absolute", height: "20%", top: "80%", marginLeft: "90%"}} onClick={deleteReply}/>}
            </div>
        </div>
    )
}