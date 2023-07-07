import { useRef, useState } from "react"

export default function SuggestionBox({ id }){

    const [canSuggest, setCanSuggest] = useState(true)
    const suggestion = useRef("")

    const suggest = () => {
        if (!suggestion.current.length) alert("You haven't entered anything!")
        else if (canSuggest){
            setCanSuggest(false)
            fetch("https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/suggest", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: id, text: suggestion.current})
            })
            .then(res => res.json())
            .then(data => {
                if (!data["success"]) alert("You've already used this month's suggestion!")
                window.location.assign("/app/profile/Suggestion Box")
            })
            .catch(x => console.log(x))
        }
    }

    return (
        <div className="flex-100" style={{flexDirection: "row", height: "87.5%"}}>
            <h3 style={{width: "80%"}}>
               Hello! I'm the person behind this application. I created it because I wanted a place for people to come together and share their happiness with one another. Like you, I want this application to succeed in this goal, which is why I came up with and am pushing the suggestion box. The premise is fairly simple: you suggest, I implement. Every month, I'll check all the submissions to the box and pick the idea that people want implemented, and do my best to create it before the start of the next month. Every user gets one suggestion per month, so please do your best to suggest something that is genuinely needed. After all, this application only thrives because of you; the user. Of course, I'll do my best to be as transparent as possible, so you can check updates right <a href="/app/profile/Suggestion Box">here</a>. Thank you all in advance!
            </h3>
            <input placeholder="Enter your suggestion" maxLength={100} style={{width: "50%", color: "black"}} onChange={(e) => suggestion.current = e.target.value}/>
            <button style={{color: "black", cursor: "pointer"}} onClick={suggest} >Suggest!</button>
        </div>
    )
}