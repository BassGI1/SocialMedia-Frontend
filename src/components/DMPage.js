import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import LoadingModal from "./utils/LoadingModal.js"

import defaultImage from "../assets/noImage.png"
import sendButton from "../assets/sendButton.png"
import play from "../assets/play.png"
import pause from "../assets/pause.png"

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

export default function DMPage({ userId }){

    const { RoomId } = useParams()
    const [room, setRoom] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [otherUser, setOtherUser] = useState(null)
    const [messages, setMessages] = useState(null)
    const [music, setMusic] = useState(null)
    const [musicImg, setMusicImg] = useState(play)
    const [profileImage, setProfileImage] = useState(defaultImage)

    useEffect(() => {
        fetch(`http://localhost:5000/api/getroom?id=${RoomId}`)
        .then(res => res.json())
        .then(data => {
            setRoom(data)
            if (data.userOne !== userId && data.userTwo !== userId) window.location.assign("/")
            fetch(`http://localhost:5000/api/getuser?_id=${data.userOne}`)
            .then(res => res.json())
            .then(userOne => {
                if (userOne.id === userId) setCurrentUser(userOne)
                else {
                    setOtherUser(userOne)
                    if (userOne.theme) setMusic(new Audio(userOne.theme.preview_url))
                    fetch(`http://localhost:5000/api/image?id=${userOne.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data) setProfileImage(data.data)
                    })
                }
            })
            fetch(`http://localhost:5000/api/getuser?_id=${data.userTwo}`)
            .then(res => res.json())
            .then(userTwo => {
                if (userTwo.id === userId) setCurrentUser(userTwo)
                else {
                    setOtherUser(userTwo)
                    if (userTwo.theme) setMusic(new Audio(userTwo.theme.preview_url))
                    fetch(`http://localhost:5000/api/image?id=${userTwo.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data) setProfileImage(data.data)
                    })
                }
            })
        })
        .catch(x => console.log(x))
        setInterval(() => {
            fetch(`http://localhost:5000/api/getroom?id=${RoomId}`)
            .then(res => res.json())
            .then(data => {
                const m = [...data.messages].reverse()
                setMessages(m)
            })
            .catch(x => console.log(x))
        }, 3000)
    }, [RoomId, userId])

    useEffect(() => {
        if (music) music.addEventListener("ended", (e) => setMusicImg(play))
    }, [music])

    const playMusic = () => {
        if (music){
            if (music.paused && ((music.readyState === 4) || (music.readyState === 3))){
                setMusicImg(pause)
                music.play()
            }
            else {
                setMusicImg(play)
                music.pause()
            }
        }
    }

    return (
        <div className="flex-100">
            <div className="room-background-div">
                {!currentUser && !otherUser && <LoadingModal backgroundColor="#1e1b1b" barColor="white"/>}
                {currentUser && otherUser && <div className="messages-background">
                    <div className="top-header-dm-div flex-100">
                        <img src={profileImage} alt="profile" style={{height: "60%", borderRadius: "50%", border: "0.2rem solid white", marginRight: "5%", cursor: "pointer"}} onClick={() => window.location.assign(`/app/profile/${otherUser.username}`)}/>
                        {`${otherUser.name || "deleted user"}`}
                        {music && <img src={musicImg} alt={`${musicImg === play ? "play" : "pause"}`}  onClick={playMusic} style={{height: "45%", marginLeft: "5%", cursor: "pointer"}}/>}
                    </div>
                    <Messages messages={messages} currentUserId={currentUser.id}/>
                    <WriteMessage roomId={room._id} userId={currentUser.id} />
                </div>}
            </div>
        </div>
    )
}

const WriteMessage = ({ roomId, userId }) => {

    const text = useRef("")
    const [sending, setSending] = useState(false)

    const send = () => {
        if (!sending && text.current.length){
            setSending(true)
            fetch("http://localhost:5000/api/sendmessage", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    text: text.current,
                    userId: userId,
                    roomId: roomId
                })
            })
            .then(res => res.json())
            .then(data => {
                setSending(false)
                document.querySelector("#message").value = ""
                text.current = ""
            })
            .catch(x => console.log(x))
        }
    }

    return (
        <div className="write-message-div">
            <textarea className="message-input-textarea" placeholder="Enter your message" onChange={(e) => text.current = e.target.value} maxLength={250} id="message"></textarea>
            <button className="send-message-button"><img src={sendButton} alt="send" style={{width: "80%", height: "80%", marginLeft: "10%"}} onClick={send} /></button>
        </div>
    )
}

const Messages = ({ messages, currentUserId }) => {
    return (
        <div className={`${messages ? "messages-container" : "flex-100"}`}>
            {messages && !messages.length && <h1 className="flex-100" style={{color: "white"}}>No messages . . . Start the conversation!</h1>}
            {!messages && <LoadingModal backgroundColor="#1e1b1b" barColor="white" height="3.5rem" width="3.5rem" barWidth="3.5px"/>}
            {messages && messages.length ? messages.map(x => <MessageBubble key={x.created} fromCurrentUser={x.userId === currentUserId} created={x.created} message={x.message} />) : ""}
        </div>
    )
}

const MessageBubble = ({ message, fromCurrentUser, created }) => {
    const date = useRef(() => {
        const d = new Date(created)
        const td = new Date()
        if (d.getDate() === td.getDate() && d.getFullYear() === td.getFullYear() && d.getMonth() === td.getMonth()){
            if (d.getHours() > 11) return `${d.getHours() % 12 === 0 ? 12 : d.getHours() % 12}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()} PM`
            return `${d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()} AM`
        }
        if (d.getHours() > 11) return `${d.getHours() % 12 === 0 ? 12 : d.getHours() % 12}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()} PM on ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` 
        return `${d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()} AM on ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` 
    })
    return (
        <div className={`${fromCurrentUser ? "message-bubble-from-me" : "message-bubble-not-from-me"}`}>
            {message}
            <p className="message-date">Sent {date.current()}</p>
        </div>
    )
}