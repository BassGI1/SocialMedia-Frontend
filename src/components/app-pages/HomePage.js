import { useEffect, useRef, useState } from "react"
import "./css/home-page.css"

import LoadingModal from "../utils/LoadingModal"
import flame from "../../assets/flame.png"
import filled from "../../assets/filledHeart.png"
import unfilled from "../../assets/unfilledHeart.png"
import defaultImage from "../../assets/noImage.png"

export default function HomePage({ userId }){

    const page = useRef(0)
    const [posts, setPosts] = useState(null)
    const users = useRef({})

    useEffect(() => {
        (async () => {
            let followed, trending
            await fetch(`http://localhost:5000/api/followedposts?id=${userId}&page=0`)
            .then(res => res.json())
            .then(data => {
                users.current = data.usersObj
                followed = data.posts
            })
            .catch(x => console.log(x))
            fetch("http://localhost:5000/api/trending")
            .then(res => res.json())
            .then(data => {
                trending = data.posts
                for (const user of data.users){
                    if (!users.current[user._id]) users.current[user._id] = user
                }
                if (followed.length){
                    if (followed.length < 5) setPosts([...followed, trending[0]])
                    else{
                        let x = followed.splice(0, 5)
                        x.push(trending[0])
                        x = [...x, ...followed]
                        x.push(trending[1])
                        console.log(x)
                        setPosts(x)
                    }
                }
            })
            .catch(x => console.log(x))
        }
        )()
    }, [userId])

    return (
        <div className="flex-100" style={{height: "87.5%"}}>
           {!posts && <LoadingModal />}
           {posts && posts.length && <div className="homepage-background-div">
                {posts.map((post, i) => <FollowedPost {...post} created={new Date(post.created)} key={i} index={i} usersObj={users.current} lengthPosts={posts.length}/>)}
            </div>}
        </div>
    )
}

const FollowedPost = ({ _id, by, created, likes, replies, text, title, usersObj, index, lengthPosts }) => {

    const user = useRef(usersObj[by]).current
    console.log(usersObj)

    return (
        <div className="followed-post">
            <div className="home-post-left-div flex-100">
                <img src={user.image.data ? user.image.data : defaultImage} alt="profile"/>
            </div>
            <div className="home-post-right-div">

            </div>
        </div>
    )
}