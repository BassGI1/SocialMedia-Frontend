import { Routes, Route } from "react-router-dom"
import { useState } from "react"

import SignUp from "./components/SignUp"
import Redirection from "./components/Redirection"
import Home from "./components/Home"
import FinishSignUp from "./components/FinishSignUp"

export default function App() {

  const [userId, setUserId] = useState(document.cookie.length ? JSON.parse(document.cookie)["user_id"] : "")
  const [created, setCreated] = useState(document.cookie.length ? JSON.parse(document.cookie)["created"] : "")

  return (
    <div className="background-div">
      <Routes>
        <Route path="/app/*" element={<Home userId={userId}/>}/>
        <Route path="/signup" element={<SignUp userId={userId} setUserId={setUserId} setCreated={setCreated} />}/>
        <Route path="/signupcompletion" element={<FinishSignUp id={userId} created={created}/>}/>
        <Route path="/" element={<Redirection userId={userId} created={created}/>}/>
      </Routes>
    </div>
  )

}