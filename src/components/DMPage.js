import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import LoadingModal from "./utils/LoadingModal.js"

import noImage from "../assets/noImage.png"
import sendButton from "../assets/sendButton.png"

export default function DMPage({ userId }){

    const { RoomId } = useParams()
    const [room, setRoom] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [otherUser, setOtherUser] = useState(null)
    const [messages, setMessages] = useState(null)
    const [int, setInt] = useState(null)

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
                else setOtherUser(userOne)
            })
            fetch(`http://localhost:5000/api/getuser?_id=${data.userTwo}`)
            .then(res => res.json())
            .then(userTwo => {
                if (userTwo.id === userId) setCurrentUser(userTwo)
                else setOtherUser(userTwo)
            })
        })
        .catch(x => console.log(x))
        setInt(setInterval(() => {
            fetch(`http://localhost:5000/api/getroom?id=${RoomId}`)
            .then(res => res.json())
            .then(data => {
                const m = [...data.messages].reverse()
                setMessages(m)
            })
            .catch(x => console.log(x))
        }, 3000))
    }, [])

    return (
        <div className="flex-100">
            <div className="room-background-div">
                {!currentUser && !otherUser && <LoadingModal backgroundColor="#1e1b1b" barColor="white"/>}
                {currentUser && otherUser && <div className="messages-background">
                    <div className="top-header-dm-div flex-100">
                        <img src={noImage} alt="profile image" style={{height: "60%", borderRadius: "50%", border: "0.2rem solid white", marginRight: "5%"}}/>
                        {`${otherUser.firstName} ${otherUser.lastName}`}
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
                console.log(data)
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
            {!messages && <LoadingModal backgroundColor="#1e1b1b" barColor="white"/>}
            {messages && messages.length && messages.map(x => <MessageBubble key={x.created} fromCurrentUser={x.userId === currentUserId} created={x.created} message={x.message} />)}
        </div>
    )
}

const MessageBubble = ({ message, fromCurrentUser, created }) => {
    return (
        <div className={`${fromCurrentUser ? "message-bubble-from-me" : "message-bubble-not-from-me"}`}>
            {message}
        </div>
    )
}