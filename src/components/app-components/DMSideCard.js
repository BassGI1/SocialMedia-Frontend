import { useEffect, useState } from "react"
import "./css/DMs.css"

import LoadingModal from "../utils/LoadingModal.js"
import defaultImage from "../../assets/noImage.png"

export default function DMSideCard({ userId, setRenderDMs }){

    const [closing, setClosing] = useState(false)
    const [DMs, setDMs] = useState(null)

    useEffect(() => {
        fetch(`https://harmonise-backend-server.onrender.com/api/getallroomsforuser?id=${userId}`)
        .then(res => res.json())
        .then(data => setDMs(data))
        .catch(x => console.log(x))
    }, [userId])

    const close = () => {
        setTimeout(() => setRenderDMs(false), 250)
        setClosing(true)
    }

    return (
        <div className={`background-side-card ${closing ? "closing" : ""}`}>
            <h1 className="return-x" onClick={close}>x</h1>
            <div className="dm-title-div">Direct Messages</div>
            <div className={`conversation-div ${!DMs ? "flex-100" : ""}`}>
                {!DMs && <LoadingModal backgroundColor="#1e1b1b" barColor="white" height="5rem" width="5rem" barWidth="5px"/>}
                {DMs && !DMs.length && <h2 className="flex-100" style={{color: "white"}}>No Direct Messages . . .</h2>}
                {DMs && DMs.length && <div className="DMs-containerooni">
                    {DMs.map((dm, i) => <DM name={dm.name} roomId={dm.roomId} image={dm.image} key={i} />)}
                </div>}
            </div>
        </div>
    )
}

const DM = ({ name, roomId, image }) => {
    return (
        <div className="dm-div" onClick={() => window.location.assign(`/room/${roomId}`)}>
            <img src={image || defaultImage} alt="user" style={{height: "40%", borderRadius: "50%", marginRight: "5%", border: "0.2rem solid white"}}/>
            <h2 style={{color: "white", fontWeight: "lighter"}}>{name}</h2>
        </div>
    )
}