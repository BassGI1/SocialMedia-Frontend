import { useRef, useState } from "react"

export default function DeleteAccount({ userId }){

    const password = useRef("")
    const [deleting, setDeleting] = useState(false)

    const deleteUser = () => {
        if (!password.current.length) alert("The password field is empty!")
        else if (!deleting){
            setDeleting(true)
            fetch("http://localhost:5000/api/deleteuser", {
                method: "POST",
                body: JSON.stringify({
                    id: userId,
                    password: password.current
                }),
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.json())
            .then(data => {
                if (data.success){
                    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
                    window.location.assign("/signup")
                }
                else{
                    alert("Password Incorrect!")
                    window.location.assign("/app")
                }
            })
            .catch(x => console.log(x))
        }
    }

    return (
        <div className="flex-100 page-with-navbar-background-div">
            <dialog open className="flex-100" style={{width: "55%", height: "65%", backgroundColor: "#cca43b", flexDirection: "column", borderRadius: "2rem"}}>
                <h2 style={{color: "#363636", fontWeight: "bolder"}}>Are you absolutely sure you want to delete your account?</h2>
                <input type="password" placeholder="Enter your password" style={{width: "40%", borderRadius: "2rem", color: "black"}} onChange={(e) => password.current = e.target.value} />
                <div className="flex-100" style={{height: "12.5%", width: "60%", marginTop: "3%", justifyContent: "space-between"}}>
                    <button style={{color: "#cca43b", backgroundColor: "black", width: "30%", height: "100%", cursor: "pointer", borderRadius: "2rem", fontSize: "1.5rem", fontWeight: "bolder"}} onClick={deleteUser}>Yes</button>
                    <button style={{color: "#cca43b", backgroundColor: "black", width: "30%", height: "100%", cursor: "pointer", borderRadius: "2rem", fontSize: "1.5rem", fontWeight: "bolder"}} onClick={() => window.location.assign("/app")} >No</button>
                </div>
            </dialog>
        </div>
    )
}