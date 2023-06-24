import { useEffect, useRef, useState } from "react"

export default function HomePage({ userId }){

    const page = useRef(0)
    const [followedPosts, setFollowedPosts] = useState([])
    const [trendingPosts, setTrendingPosts] = useState([])
    const followedUsers = useRef({})
    const trendingUsers = useRef({})

    useEffect(() => {
        fetch(`http://localhost:5000/api/followedposts?id=${userId}&page=0`)
        .then(res => res.json())
        .then(data => {
            console.log("followed", data)
            followedUsers.current = data.usersObj
            setFollowedPosts(data.posts)
        })
        .catch(x => console.log(x))
        fetch("http://localhost:5000/api/trending")
        .then(res => res.json())
        .then(data => {
            console.log("trending", data)
            for (const user of data.users){
                if (!trendingUsers.current[user._id]) trendingUsers.current[user._id] = user
            }
            setTrendingPosts(data.posts)
        })
        .catch(x => console.log(x))
        console.log(window.screen.height, window.screen.width)
    }, [userId])

    return (
        <div>
            {userId}
        </div>
    )
}