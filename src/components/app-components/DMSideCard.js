import { useState } from "react"
import "./css/DMs.css"

export default function DMSideCard({ userId, setRenderDMs }){

    const [closing, setClosing] = useState(false)

    const close = () => {
        setTimeout(() => setRenderDMs(false), 250)
        setClosing(true)
    }

    return (
        <div className={`background-side-card ${closing ? "closing" : ""}`}>
            <h1 className="return-x" onClick={close}>x</h1>
            <div className="dm-title-div">Direct Messages</div>
            <div className="conversation-div">
                
            </div>
        </div>
    )
}