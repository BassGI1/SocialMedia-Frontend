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

    useEffect(() => {
        fetch(`http://localhost:5000/api/getroom?id=${RoomId}`)
        .then(res => res.json())
        .then(data => {
            setRoom(data)
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
                    <Messages />
                    <WriteMessage />
                </div>}
            </div>
        </div>
    )
}

const WriteMessage = () => {

    const text = useRef("")

    return (
        <div className="write-message-div">
            <textarea className="message-input-textarea" placeholder="Enter your message" onChange={(e) => text.current = e.target.value} maxLength={250}></textarea>
            <button className="send-message-button"><img src={sendButton} alt="send" style={{width: "80%", height: "80%", marginLeft: "10%"}}/></button>
        </div>
    )
}

const Messages = () => {
    return (
        <div className="messages-container">

        </div>
    )
}