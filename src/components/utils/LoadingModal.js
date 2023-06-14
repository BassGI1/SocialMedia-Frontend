import "./css/loading-modal.css"

export default function LoadingModal({height = "10rem", width = "10rem", barWidth = "10px", barColor = "rgb(172, 171, 171)", backgroundColor = "#363636"}){

    return (
        <div className="loading-modal-outer" style={{height: height, width: width, boxShadow: `inset 0px 0px 0px ${barWidth} ${barColor}`}}>
            <div className="loading-modal-inner"  style={{width: `calc(103% - ${barWidth})`, height: `calc(103% - ${barWidth})`, backgroundColor: backgroundColor}}>
             </div>
        </div>
    )

}