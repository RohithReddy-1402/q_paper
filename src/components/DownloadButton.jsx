import { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";
import { apiFetch, parseRateLimit, readRateLimitError } from "../services/api";

export default function DownloadButton({ paper, addToast, isLoggedIn, onLoginClick }) {
    const [status, setStatus] = useState("idle");
    const [remaining, setRemaining] = useState(null);

    const trackRemaining = (res) => {
        const { remaining: left } = parseRateLimit(res);
        if (left !== null) setRemaining(left);
    };

    const handleRateLimited = async (res) => {
        const { message } = await readRateLimitError(res);
        addToast(message, "error");
        if (!isLoggedIn) {
            addToast("Sign in for unlimited downloads.", "info");
            if (onLoginClick) onLoginClick();
        }
        setRemaining(0);
        setStatus("idle");
    };

    const handleDownload = async (event) => {
        event.stopPropagation();
        if (!paper.r2Key) {
            addToast("Download link not available for this paper.", "error");
            return;
        }
        setStatus("loading");
        try {
            // Rate limit is enforced on the request itself — check 429 first.
            const countRes = await apiFetch(`/papers/downloadcount`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ r2Key: paper.r2Key }),
            });
            if (countRes.status === 429) {
                await handleRateLimited(countRes);
                return;
            }
            trackRemaining(countRes);

            const fileRes = await apiFetch(`/api/download/${paper.r2Key}`);
            if (fileRes.status === 429) {
                await handleRateLimited(fileRes);
                return;
            }
            if (!fileRes.ok) throw new Error("Download failed");
            trackRemaining(fileRes);

            const blob = await fileRes.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${paper.title} - ${paper.examType}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            addToast(
                `${paper.title} - ${paper.examType} downloaded successfully.`,
                "success"
            );
            setStatus("done");
        } catch (err) {
            addToast("Download failed. Please try again.", "error");
            setStatus("error");
        } finally {
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-70"
                disabled={status === "loading" || remaining === 0}
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
                {status === "error" && (
                    <>
                        <Download className="w-5 h-5" />
                        <span>Retry</span>
                    </>
                )}
            </button>
            {remaining !== null && (
                <span className="text-xs text-gray-500">
                    {remaining > 0
                        ? `${remaining} downloads left today`
                        : "Daily limit reached — sign in for more"}
                </span>
            )}
        </div>
    );
}
