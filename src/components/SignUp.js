import { useRef, useState } from "react"
import emailIcon from "../assets/emailIcon.png"
import passwordIcon from "../assets/passwordIcon.png"

export default function SignUp({ userId, setUserId, setCreated }) {

    const [onLeft, setOnLeft] = useState(true)
    const [animate, setAnimate] = useState(false)

    if (userId){
        window.location.assign("/")
    }

    function moveDiv(){
        setAnimate(true)
        setTimeout(() => {
            setAnimate(false)
            setOnLeft(!onLeft)
        }, 1500)
    }

    return (
        <div className="signup-background">
            <section className="signup-section">
                <div className={`signup-movement-div ${onLeft && animate ? "signup-move-right" : ""} ${!onLeft && animate ? "signup-move-left" : ""}`} style={{transform: `translateX(${!onLeft ? "100%" : "0%"})`}}>
                    {!animate && <div onClick={moveDiv} className="move-signup-button">
                        {`Sign ${onLeft ? "Up" : "In"}`}
                    </div>}
                </div>
                <div className="signup-movement-div" style={{backgroundColor: "transparent", transform: `translateX(${onLeft ? "0%" : "-100%"})`, color: "#242F40"}}>
                    {!animate && onLeft && <SignInInfo setUserId={setUserId} setCreated={setCreated}/>}
                    {!animate && !onLeft && <SignUpInfo setUserId={setUserId} setCreated={setCreated} />}
                </div>
            </section>            
        </div>
    )
}

function SignInInfo({ setUserId, setCreated }) {

    let info = useRef({email: "", password: ""}).current

    const submit = () => {
        fetch("http://localhost:5000/api/login", {method: "POST", body: JSON.stringify(info), headers: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .then(data => {
            if (data["success"]){
                const jsonString = JSON.stringify({user_id: data["_id"], created: data["created"]})
                document.cookie = jsonString
                setCreated(data["created"])
                setUserId(data["_id"])
                window.location.assign("/")
            }
            else{
                alert("The entered credentials do not correspond to an account")
            }
        })
        .catch(x => console.log("Error found"))
    }

    return (
        <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#242F40", backgroundColor: "transparent", flexWrap: "wrap"}}>
            <h1 className="sign-page-title" style={{transform: "translateY(5%)"}}>Sign In</h1>
            <div className="signup-input-div" style={{transform: "translateY(-48%)"}}>
                <img src={emailIcon} alt="email icon" style={{height: "34%", margin: "2%"}}/>
                <input type="email" className="signup-input" style={{color: "black"}} placeholder="Enter your email" onChange={(e) => {
                    info.email = e.target.value
                }}/>
                <div style={{width: "100%", height: "50%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <img src={passwordIcon} alt="password icon" style={{height: "100%", margin: "2%"}}/>
                    <input type="password" className="signup-input" style={{color: "black"}} placeholder="Enter your password" onChange={(e) => {
                        info.password = e.target.value
                    }}/>
                </div>
            </div>
            <button className="signup-submit-button" onClick={submit}>
                Sign in
            </button>
        </div>
    )
}

function SignUpInfo({ setUserId, setCreated }){

    let info = useRef({email: "", username: "", password: "", passwordVerifier: "", firstName: "", lastName: ""}).current

    const submit = () => {
        if (info.password !== info.passwordVerifier){
            alert("Passwords do not match")
            return
        }
        else if (info.email.length === 0 || info.password.length === 0 || info.firstName.length === 0 || info.lastName.length === 0){
            alert("Invalid input")
            return
        }
        fetch("http://localhost:5000/api/signup", {method: "POST", body: JSON.stringify({...info, created: new Date()}), headers: {"Content-Type": "application/json"}})
        .then(res => res.json())
        .then(data => {
            if (data["success"]){
                const jsonString = JSON.stringify({user_id: data["_id"], created: data["created"]})
                document.cookie = jsonString
                setCreated(data["created"])
                setUserId(data["_id"])
                window.location.assign("/signupcompletion")
            }
            else{
                alert("Failed to create account")
            }
        })
        .catch(x => console.log("error found"))
    }

    return (
        <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#242F40", backgroundColor: "transparent", flexWrap: "wrap"}}>
            <h1 className="sign-page-title" style={{transform: "translateY(10%)"}}>Sign Up</h1>
            <div className="signup-input-div" style={{height: "37.5%", transform: "translateY(-35%)"}}>
                <div style={{width: "100%", height: "20%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <input type="email" placeholder="Enter your email" maxLength={25} className="signup-input" onChange={(e) => {
                        info.email = e.target.value
                    }}/>
                </div>
                <div style={{width: "100%", height: "20%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <input type="text" placeholder="Enter your username" maxLength={12} className="signup-input" onChange={(e) => {
                        info.username = e.target.value
                    }}/>
                </div>
                <div style={{width: "100%", height: "20%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <input type="password" placeholder="Enter your password" minLength={7} maxLength={20} className="signup-input" onChange={(e) => {
                        info.password = e.target.value
                    }}/>
                </div>
                <div style={{width: "100%", height: "20%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <input type="password" placeholder="Verify your password" minLength={7} maxLength={20}  className="signup-input" onChange={(e) => {
                        info.passwordVerifier = e.target.value
                    }}/>
                </div>
                <div style={{width: "100%", height: "20%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <input type="text" placeholder="Enter your first name" maxLength={15} className="signup-input" onChange={(e) => {
                        info.firstName = e.target.value
                    }}/>
                </div>
                <div style={{width: "100%", height: "20%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <input type="text" placeholder="Enter your last name" maxLength={15} className="signup-input" onChange={(e) => {
                        info.lastName = e.target.value
                    }}/>
                </div>
            </div>
            <button className="signup-submit-button" style={{transform: "translateY(-150%)"}} onClick={submit}> 
                Sign up
            </button>
        </div>
    )

}