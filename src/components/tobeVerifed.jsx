import React, { useEffect, useState } from 'react';
import { Clock, FileText, Eye, Calendar, User, ArrowLeft, Edit3, Check, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useToast } from './ToastContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import ModalShell from './profile/ModalShell';
import { BONUS_REASONS } from './profile/bonusReasons';

const REJECT_REASONS = [
    { value: 'duplicate', label: 'Already available (duplicate)' },
    { value: 'fake', label: 'Fake / not a question paper' },
    { value: 'low_quality', label: 'Low quality / unreadable' },
    { value: 'other', label: 'Other' },
];

const QuestionPapersVerification = ({ user, authChecked, isLoading, onLoadClose }) => {

    const [selectedPaper, setSelectedPaper] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [pdfUrl, setPdfUrl] = useState('');
    const [questionPapers, setQuestionPapers] = useState([]);
    const [approveOpen, setApproveOpen] = useState(false);
    const [bonusPoints, setBonusPoints] = useState('');
    const [bonusReason, setBonusReason] = useState('recency');
    const [bonusNote, setBonusNote] = useState('');
    const [approving, setApproving] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('duplicate');
    const [rejectNote, setRejectNote] = useState('');
    const [rejecting, setRejecting] = useState(false);
    const { addToast } = useToast();
    const navigate=useNavigate();
    const isAdmin = user?.role === 'admin';
    useEffect(() => {
        if (!isAdmin) return;
        async function fetchPapers() {
            try {
                const res = await apiFetch('/verifypapers');
                if (!res.ok) {
                    addToast(res.status === 403 ? "Admin access required" : "Could not load papers", "error");
                    return;
                }
                setQuestionPapers(await res.json());
            } catch (err) {
                console.error("Error fetching papers:", err);
            }
        }
        fetchPapers();
        // refetch only when admin-ness changes, not when addToast's identity does
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin]);

    const handleDetailsClick = (paper) => {
        setSelectedPaper(paper);
        setEditData(paper);
        setIsEditing(false);
    };
    

    const handleBackClick = () => {
        setSelectedPaper(null);
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        setQuestionPapers(papers =>
            papers.map(paper =>
                paper.id === editData.id ? editData : paper
            )
        );
        setSelectedPaper(editData);
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleApprove = () => {
        setBonusPoints('');
        setBonusReason('recency');
        setBonusNote('');
        setApproveOpen(true);
    };

    const confirmApprove = async () => {
        setApproving(true);
        try {
            const points = Number(bonusPoints) || 0;
            const res = await apiFetch(`/verifiedpaper/${selectedPaper.r2Key}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: selectedPaper.title,
                    subject: selectedPaper.subject,
                    fileId: selectedPaper.fileId,
                    sem: selectedPaper.sem,
                    subjectCode: selectedPaper.subjectCode,
                    year: selectedPaper.year,
                    examType: selectedPaper.examType,
                    r2Key: selectedPaper.r2Key,
                    bonusPoints: points,
                    bonusReason: points > 0 ? bonusReason : undefined,
                    bonusNote: points > 0 ? bonusNote : undefined,
                })
            })
            if (res.status === 401) {
                addToast("Session expired — please sign in again.", "error");
                return;
            }
            if (res.status === 403) {
                addToast("Admin access required", "error");
                return;
            }
            if (res.ok) {
                addToast(
                    points > 0 ? `Paper approved — 10 + ${points} bonus points awarded` : "Paper approved — 10 points awarded",
                    "success"
                );
                setQuestionPapers(papers => papers.filter(paper => paper.r2Key !== selectedPaper.r2Key));
                setApproveOpen(false);
                setSelectedPaper(null);
            } else {
                addToast("Could not approve the paper", "error");
            }
        } finally {
            setApproving(false);
        }
    };

    const handleDelete = () => {
        setRejectReason('duplicate');
        setRejectNote('');
        setRejectOpen(true);
    };

    const confirmReject = async () => {
        setRejecting(true);
        try {
            const result = await apiFetch(`/deletepaper/${selectedPaper.r2Key}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: rejectReason, note: rejectNote })
            });
            if (result.status === 401) {
                addToast("Session expired — please sign in again.", "error");
                return;
            }
            if (result.status === 403) {
                addToast("Admin access required", "error");
                return;
            }
            if (result.ok) {
                addToast("Paper rejected", "success");
                setQuestionPapers(papers => papers.filter(paper => paper.r2Key !== selectedPaper.r2Key));
                setRejectOpen(false);
                setSelectedPaper(null);
            } else {
                addToast("Could not reject the paper", "error");
            }
        } finally {
            setRejecting(false);
        }
    };
    useEffect(()=>{
        if (selectedPaper) {
            const fetchPdfUrl = async () => {
                const url = await `https://pdf.nitkkrpyqs.in/${selectedPaper.r2Key}`
                setPdfUrl(url);
            
            };
            fetchPdfUrl();
        }
        console.log(selectedPaper)
    }, [selectedPaper]);
    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }
    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
                <div className="bg-white rounded-xl border border-blue-100 shadow-lg p-8 text-center max-w-sm">
                    <h1 className="text-xl font-bold text-blue-900">Admins only</h1>
                    <p className="mt-2 text-sm text-gray-600">You need an admin account to verify papers.</p>
                    <button onClick={() => navigate('/nit-kkr-pyqs')} className="mt-5 text-sm font-medium text-blue-600 hover:text-blue-800">
                        Back to home
                    </button>
                </div>
            </div>
        );
    }
    if (selectedPaper) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
                <ModalShell
                    isOpen={approveOpen}
                    onClose={() => !approving && setApproveOpen(false)}
                    title="Approve this paper?"
                    maxWidth="sm:max-w-md"
                >
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            The contributor earns <span className="font-semibold text-gray-900">10 base points</span> the moment this goes live.
                        </p>
                        <div>
                            <label htmlFor="bonus-points" className="block text-sm font-medium text-gray-700">
                                Bonus points <span className="text-gray-400 font-normal">(optional, up to 500)</span>
                            </label>
                            <input
                                id="bonus-points"
                                type="number"
                                min="0"
                                max="500"
                                value={bonusPoints}
                                onChange={(e) => setBonusPoints(e.target.value)}
                                placeholder="0"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 h-11 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        {Number(bonusPoints) > 0 && (
                            <>
                                <div>
                                    <label htmlFor="bonus-reason" className="block text-sm font-medium text-gray-700">Reason for the bonus</label>
                                    <select
                                        id="bonus-reason"
                                        value={bonusReason}
                                        onChange={(e) => setBonusReason(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 h-11 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    >
                                        {BONUS_REASONS.map(({ value, label }) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="bonus-note" className="block text-sm font-medium text-gray-700">
                                        Note to the uploader <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        id="bonus-note"
                                        value={bonusNote}
                                        onChange={(e) => setBonusNote(e.target.value)}
                                        maxLength={300}
                                        rows={2}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </>
                        )}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setApproveOpen(false)}
                                disabled={approving}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmApprove}
                                disabled={approving}
                                className="rounded-lg bg-green-600 hover:bg-green-700 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
                            >
                                {approving ? 'Approving…' : 'Approve paper'}
                            </button>
                        </div>
                    </div>
                </ModalShell>
                <ModalShell
                    isOpen={rejectOpen}
                    onClose={() => !rejecting && setRejectOpen(false)}
                    title="Reject this paper?"
                    maxWidth="sm:max-w-md"
                >
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            The paper is removed from the queue and the contributor earns no reward.
                        </p>
                        <div>
                            <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700">Reason</label>
                            <select
                                id="reject-reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 h-11 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            >
                                {REJECT_REASONS.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="reject-note" className="block text-sm font-medium text-gray-700">
                                Note for the uploader <span className="text-gray-400 font-normal">(optional, shown on their profile)</span>
                            </label>
                            <textarea
                                id="reject-note"
                                value={rejectNote}
                                onChange={(e) => setRejectNote(e.target.value)}
                                maxLength={300}
                                rows={2}
                                placeholder="e.g. this exact paper was uploaded last month"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setRejectOpen(false)}
                                disabled={rejecting}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={rejecting}
                                className="rounded-lg bg-red-600 hover:bg-red-700 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
                            >
                                {rejecting ? 'Rejecting…' : 'Reject paper'}
                            </button>
                        </div>
                    </div>
                </ModalShell>

                <div className="bg-white border-b border-blue-100 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center gap-4">
                        <button
                            onClick={handleBackClick}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5 text-blue-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-blue-900">{selectedPaper.title}</h1>
                            <p className="text-sm text-blue-600">{selectedPaper.subject} • {selectedPaper.subjectCode}</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">

                        <div className="bg-white rounded-xl border border-blue-100 shadow-lg overflow-hidden">
                            <div className="p-4 border-b border-blue-100 bg-blue-50">
                                <h3 className="font-semibold text-blue-900">PDF Preview</h3>
                            </div>
                            <div className="h-full flex items-center justify-center bg-gray-50">
                                {/* <div className="text-center p-8">
                                    <FileText className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">PDF Preview</p>
                                    <p className="text-sm text-gray-500">{selectedPaper.pdfUrl}</p>
                                </div> */}
                                <iframe src={pdfUrl} width="100%" height="100%" title={selectedPaper.title} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-blue-100 shadow-lg overflow-hidden">
                            <div className="p-4 border-b border-blue-100 bg-blue-50 flex items-center justify-between">
                                <h3 className="font-semibold text-blue-900">Paper Information</h3>
                                <button
                                    onClick={handleEditClick}
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit
                                </button>
                            </div>

                            <div className="p-6 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-blue-900 mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={editData.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-blue-900 mb-1">Subject</label>
                                            <input
                                                type="text"
                                                value={editData.subject}
                                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-blue-900 mb-1">Subject Code</label>
                                            <input
                                                type="text"
                                                value={editData.subjectCode}
                                                onChange={(e) => handleInputChange('subjectCode', e.target.value)}
                                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-blue-900 mb-1">Year</label>
                                            <input
                                                type="text"
                                                value={editData.year}
                                                onChange={(e) => handleInputChange('year', e.target.value)}
                                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-blue-900 mb-1">Semester</label>
                                            <input
                                                type="text"
                                                value={editData.semester}
                                                onChange={(e) => handleInputChange('sem', e.target.value)}
                                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-blue-900 mb-1">Exam Type</label>
                                            <input
                                                type="text"
                                                value={editData.examType}
                                                onChange={(e) => handleInputChange('examType', e.target.value)}
                                                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <button
                                            onClick={handleSaveEdit}
                                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-blue-900 mb-2">Basic Information</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Title:</span>
                                                    <span className="font-medium">{selectedPaper.title}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Subject:</span>
                                                    <span className="font-medium">{selectedPaper.subject}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Subject Code:</span>
                                                    <span className="font-medium">{selectedPaper.subjectCode}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Year:</span>
                                                    <span className="font-medium">{selectedPaper.year}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Semester:</span>
                                                    <span className="font-medium">{selectedPaper.sem}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Exam Type :</span>
                                                    <span className="font-medium">{selectedPaper.examType}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-blue-900 mb-2">Submission Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User className="w-4 h-4" />
                                                    <span>{selectedPaper.name}</span>
                                                    <span onClick={() => window.open(`mailto:${selectedPaper.mail}`)}>{selectedPaper.mail}</span>
                                                </div>
                                                {/* <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(selectedPaper.submittedDate).toLocaleDateString()}</span>
                                                </div> */}
                                            </div>
                                        </div>

                                        {/* <div>
                                            <h4 className="font-semibold text-blue-900 mb-2">Description</h4>
                                            <p className="text-sm text-gray-700">{selectedPaper.description}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-blue-900 mb-2">Instructions</h4>
                                            <p className="text-sm text-gray-700">{selectedPaper.instructions}</p>
                                        </div> */}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-blue-100 bg-gray-50 flex gap-3">
                                <button
                                    onClick={handleApprove}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Approve
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-7xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">Question Papers Verification</h1>
                    <p className="text-blue-600">Review and verify submitted question papers</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Total Papers</p>
                                <p className="text-2xl font-bold text-blue-900">{questionPapers.length}</p>
                            </div>
                            <FileText className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Pending Review</p>
                                <p className="text-2xl font-bold text-blue-900">{questionPapers.length}</p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 font-medium">This Week</p>
                                <p className="text-2xl font-bold text-blue-900">{questionPapers.length}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {questionPapers.map((paper) => (
                        <div
                            key={paper.r2Key}
                            className="bg-white rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="p-6 border-b border-blue-50">
                                <h3 className="text-lg font-bold text-blue-900 mb-3 line-clamp-2">
                                    {paper.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                    <span className="font-medium">{paper.subject}</span>
                                    <span className="text-blue-300">•</span>
                                    <span>{paper.subjectCode}</span>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="w-4 h-4" />
                                    <span>Submitted by: {paper.mail}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>{paper.year}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>{paper.sem}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="font-medium">{paper.examType} marks</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FileText className="w-4 h-4" />
                                    <span>{paper.name} questions</span>
                                </div>
                            </div>

                            <div className="p-6 pt-0 flex gap-2">
                                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    Review
                                </button>
                                <button
                                    onClick={() => handleDetailsClick(paper)}
                                    className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionPapersVerification;
