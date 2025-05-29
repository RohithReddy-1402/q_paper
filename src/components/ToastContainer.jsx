import React from "react";
import "./toast.css";
const ToastContainer =({toasts})=>{
    
    return(
        <div className="toast-container">
            {
                toasts.map(({id,message,type})=>{
                    return(
                    <div key={id} className={`toast toast-${type}`}>
                        {message}
                    </div>
                    );
                })
            }

        </div>
    )
}
export default ToastContainer;