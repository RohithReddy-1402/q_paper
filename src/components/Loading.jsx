import { useState } from "react"
const Loading = ({ isLoadingOpen }) => {
    const [open, setOpen] = useState(false);
   
    if (!isLoadingOpen) {
        return null;
    }
    return (

        <>

            <div className="inset-0 fixed 0  bg-red  z-[1000] backdrop-blur-sm flex items-center justify-center">

                <div className="wrapper">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="shadow_circle"></div>
                    <div className="shadow_circle"></div>
                    <div className="shadow_circle"></div>
                </div>
            </div>

        </>

    )
}
export default Loading;