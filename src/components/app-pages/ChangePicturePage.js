import { useState } from "react"

import defaultImage from "../../assets/noImage.png"

export default function ChangePicturePage({ userId, setImage, image }){

    const [newImage, setNewImage] = useState(null)
    const [changingImage, setChangingImage] = useState(false)

    return (
        <div className="flex-100" style={{height: "87.5%"}}>
            <div className="flex-100" style={{width: "40%", flexDirection: "column"}}>
                <img src={image || defaultImage} style={{height: "60%"}}/>
                <h2>Current Image</h2>
            </div>
            <div className="flex-100" style={{width: "20%"}}>
                <h1 style={{fontSize: "6rem", fontWeight: "900"}}>→</h1>
            </div>
            <div className="flex-100" style={{width: "40%", flexDirection: "column"}}>
                {newImage && <img src={newImage} style={{height: "60%"}}/>}
                <input type="file" onChange={(e) => {
                    if (e.target.files[0].size / (1024 * 1024) > 5){
                        alert("file size exceeds 5MB!")
                        window.location.reload()
                    }
                    const reader = new FileReader()
                    reader.readAsDataURL(e.target.files[0])
                    reader.onloadend = () => {
                        setNewImage(reader.result)
                    }
                }} style={{cursor: "pointer", marginTop: "5%", transform: "translateX(15%)"}}/>
            </div>
            {newImage && <button style={{position: "absolute", width: "12.5%", height: "7.5%", borderRadius: "1rem", cursor: "pointer", backgroundColor: "#242f40", fontSize: "1.5rem", top: "80%"}} onClick={(e) => {
                if (!changingImage){
                    setChangingImage(true)
                    setImage(newImage)
                    fetch("https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/image", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({imageString: newImage, id: userId})
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data) window.location.assign("/app")
                    })
                    .catch(x => console.log(x))
                }
            }}>Complete</button>}
        </div>
    )
}