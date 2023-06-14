import alert from "../../assets/alert.png"

export default function UserDNE({ username }){
    return (
        <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
            <img src={alert} alt="alert" style={{height: "30%"}} />
            <h1>@{username} does not exist</h1>
        </div>
    )
}