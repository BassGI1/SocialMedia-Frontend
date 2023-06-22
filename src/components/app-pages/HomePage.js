import { useEffect, useRef, useState } from "react"

export default function HomePage({ userId }){

    const [page, setPage] = useState({
        followers: 0,
        trending: 0
    })
    const [followedPosts, setFollowedPosts] = useState([])
    const followedUsers = useRef({})

    useEffect(() => {
        fetch(`http://localhost:5000/api/followedposts?id=${userId}&page=0`)
        .then(res => res.json())
        .then(data => {
            followedUsers.current = data.usersObj
            setFollowedPosts(data.posts)
        })
        .catch(x => console.log(x))
        fetch("http://localhost:5000/api/trending")
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(x => console.log(x))
    }, [])

    return (
        <div>
            {userId}
        </div>
    )
}