import { useEffect, useRef, useState } from "react"
import "./css/user-posts.css"

import LoadingModal from "../utils/LoadingModal.js"
import Post from "./Post.js"

export default function UserPosts({ username, userId, create }){

    const [posts, setPosts] = useState(null)
    const [page, setPage] = useState(0)
    const [fetchingPage, setFetchingPage] = useState(false)
    const id = useRef("")

    useEffect(() => {
        (async () => {
            if (!id.current.length){
                await fetch(`https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/getuser?username=${username}`)
                .then(res => res.json())
                .then(data => id.current = data["id"])
                .catch(x => console.log(x))
            }
            fetch(`https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/userposts?id=${id.current}&page=${page}`)
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(x => console.log(x))
        })()
    }, [username])

    const PlusMinus = (first, second, percentage) => {
        const range = {higher: second*(1 + percentage/100), lower: second*(1 - percentage/100)}
        if (first >= range.lower && first <= range.higher) return true
        return false
    }

    const nextFewPosts = () => {
        const div = document.querySelector("#user-posts-background")
        const postHeight = div.getBoundingClientRect().height / 3
        if ((PlusMinus(div.scrollTop, (page*10 + 7)*postHeight, 2) && !fetchingPage)){
            setPage(page + 1)
            setFetchingPage(true)
            fetch(`https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/userposts?id=${id.current}&page=${page + 1}`)
            .then(res => res.json())
            .then(data => {
                if (data[0] !== "empty"){
                    setPosts(p => [...p, ...data])
                    setFetchingPage(false)
                }
            })
            .catch(x => console.log(x))
        }
    }

    return (
        <div className="user-posts-background flex-100" id="user-posts-background" onScroll={nextFewPosts}>
            {create && <NewPost id={userId}/>}
            {!posts && <LoadingModal />}
            {(posts && posts.length && posts[0] === "empty") ? <div><h1>. . . There's Nothing Here</h1></div> : ""}
            {(posts && posts.length) && (posts[0] !== "empty") ? posts.map(post => <Post username={username} title={post.title} text={post.text} created={new Date(post.created)} postId={post._id} likes={post.likes} userId={userId} key={post._id} numReplies={post.replies.length} />) : ""}
        </div>
    )
}

const NewPost = ({ id }) => {

    const postInfo = useRef({title: "", text: ""})
    const [posting, setPosting] = useState(false)

    const makeIt = () => {
        if (!postInfo.current.title.length){
            alert("Your post has no title!")
            return
        }
        if (!postInfo.current.text.length){
            alert("Your post has no content!")
            return
        }
        if (!posting){
            setPosting(true)
            fetch(`https://iedl3ci5va6dyptka0nmbag3gzkqxa.onrender.com/api/userposts`, {
                method: "POST",
                body: JSON.stringify({
                    id: id,
                    text: postInfo.current.text,
                    title: postInfo.current.title
                }),
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.json())
            .then(data => {
                if (data["success"]){
                    setPosting(false)
                    window.location.reload()
                }
            })
            .catch(x => console.log(x))
        }
    }

    return (
        <div className="flex-100" style={{zIndex: 5, height: "33.33%", boxShadow: "0 0.65rem 0.35rem -0.35rem #26262e", flexDirection: "column", justifyContent: "space-evenly"}}>
            <button className="post-button" onClick={makeIt}>Post</button>
            <input type="text" placeholder="Create a new post" className="title-input" maxLength={70} onChange={(e) => postInfo.current.title = e.target.value}/>
            <textarea placeholder="Post content" className="post-content-textarea" onChange={(e) => postInfo.current.text = e.target.value} maxLength={1000} ></textarea>
        </div>
    )
}