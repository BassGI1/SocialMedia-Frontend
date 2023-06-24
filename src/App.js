import { Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"

import SignUp from "./components/SignUp"
import Redirection from "./components/Redirection"
import Home from "./components/Home.js"
import FinishSignUp from "./components/FinishSignUp.js"
import DMPage from "./components/DMPage.js"

export default function App() {

  const [userId, setUserId] = useState(document.cookie.length ? JSON.parse(document.cookie.substring(5))["user_id"] : "")
  const [created, setCreated] = useState(document.cookie.length ? JSON.parse(document.cookie.substring(5))["created"] : "")

  useEffect(() => console.log(window.innerWidth), [])

  return (
    <div className="background-div">
      <Routes>
        <Route path="/app/*" element={<Home userId={userId}/>}/>
        <Route path="/signup" element={<SignUp userId={userId} setUserId={setUserId} setCreated={setCreated} />}/>
        <Route path="/signupcompletion" element={<FinishSignUp id={userId} created={created}/>}/>
        <Route path="/room/:RoomId" element={<DMPage userId={userId}/>}/>
        <Route path="/" element={<Redirection userId={userId} created={created}/>}/>
      </Routes>
    </div>
  )

}