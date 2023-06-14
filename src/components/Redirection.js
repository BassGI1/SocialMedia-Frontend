export default function Redirection({ userId, created }){

    const goToSignUpCompletion = () => {
        let createdDate = new Date(created)
        createdDate.setTime(createdDate.getTime() + 300000)
        return createdDate < new Date()
    }

    const signupcompletion = !goToSignUpCompletion()

    if (userId.length && !signupcompletion){
        window.location.assign("/app")
    }
    else if (signupcompletion && created.length){
        window.location.assign("/signupcompletion")
    }
    else{
        window.location.assign("/signup")
    }
    
}