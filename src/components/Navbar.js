import SuggestionBox from "../assets/suggestionBoxLogo.png" 

import DM from "../assets/DM.png"

export default function Navbar({ renderDMs, setRenderDMs }){

    return (
        <nav className="navbar">
            <a className="suggestion-box-logo" href="/app/suggestionbox"><img src={SuggestionBox} alt="suggestion box" style={{height: "100%"}}/></a>
            <img src={DM} alt="direct messages" style={{height: "80%", cursor: "pointer"}} onClick={() => setRenderDMs(!renderDMs)}/>
        </nav>
    )
}