import SuggestionBox from "../assets/suggestionBoxLogo.png" 

export default function Navbar(){

    return (
        <nav className="navbar">
            <a className="suggestion-box-logo" href="/app/suggestionbox"><img src={SuggestionBox} alt="suggestion box" style={{height: "100%"}}/></a>
        </nav>
    )
}