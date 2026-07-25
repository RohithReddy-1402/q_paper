import { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";

export default function DownloadButton({ paper, addToast, getFileDownloadUrl }) {
    const [status, setStatus] = useState("idle");
    const handleDownload = async (event) => {
        event.stopPropagation();
        if (!paper.paper_id) {
            alert("Download link not available for this paper.");
            return;
        }
        setStatus("loading");
        const res = fetch(`https://back-6j6v.onrender.com/papers/${paper.paper_id}/downloadcount`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        // const link = document.createElement("a");
        // link.href = getFileDownloadUrl(paper.paper_id);
        const link = document.createElement("a");

    link.href =
    `https://back-6j6v.onrender.com/api/papers/download/${paper.paper_id}`;
        link.setAttribute("download", `${paper.title} - ${paper.examType}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast(`${paper.title} - ${paper.examType} downloaded successfully.`, 'success');
       
        setStatus("done");
        setTimeout(() => setStatus("idle"), 2000);
    };
    return (
        <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-70"
            disabled={status === "loading"}
        >
            {status === "idle" && (
                <>
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                </>
            )}
            {status === "loading" && (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Downloading...</span>
                </>
            )}
            {status === "done" && (
                <>
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">Done!</span>
                </>
            )}
        </button>
    );
}
