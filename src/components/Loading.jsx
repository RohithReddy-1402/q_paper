import {useState} from "react"
const Loading = (isLoadingOpen) => {
    const [open,setOpen]=useState(false);
    return (
        <>
            <div className="w-full h-full z-[100] backdrop-blur-3xl">
                <h1>Hello World</h1>
            </div>
        </>
    )
}
export default Loading;