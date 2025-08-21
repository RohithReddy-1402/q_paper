import React, { useState } from 'react';
import './Modal.css';
import { useToast } from './ToastContext';
import { useNavigate } from 'react-router-dom';
import { sub } from 'framer-motion/client';
import {ID} from 'appwrite';
import { storage } from "../services/appWrite";
function ContributeModal({ onClose, isContributeOpen,user }) {
        

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [institution, setInstitution] = useState('');
  const [file, setFile] = useState(null);
  const [semester, setSemester] = useState('');
  const [subCode, setSubCode] = useState('');
  const { addToast } = useToast();
  const nav = useNavigate();
  const totalFields = 7;
  const filledFields = [title, subject, semester, subCode, year, institution, file].filter(Boolean).length;

  const opacity = (filledFields / totalFields) * 100;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('year', year);
    formData.append('institution', institution);
    formData.append('paperFile', file);
    formData.append('semester', semester);
    formData.append('subCode', subCode)
    addToast("Details sent for verification", "success")
    console.log('Contributing paper:', { title, subject, year, institution, file, semester });
    try {
      const response = await storage.createFile(
        "68a5689f000a8af36f8a", 
        ID.unique(),      
        file              
      );
      
      console.log("Uploaded:", response.$id);
      const fileId=response.$id;
      const res=await fetch("https://back-u7se.onrender.com/upload",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          title,
          subject,
          fileId,
          semester,
          subCode,
          year,
          institution,
          name:user.name,
          mail:user.email
        })
      })
      console.log(res)
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
    }

  };
  const handleClose = () => {
    onClose();
    nav("/")
  }
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  if (!isContributeOpen) return null;
  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center overflow-y-auto  bg-gray-500 bg-opacity-75 transition-opacity" >
      <div className="modal contribute-modal">
        <div className="modal-header">
          <h2>Contribute Question Paper</h2>
          <button
            type="button"
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Paper Title</label>
            <input
              type="text"
              id="title"
              placeholder="E.g., Data Structures Final Exam"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              placeholder="E.g., Computer Science"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="semester">Semester</label>
              <input
                type="text"
                id="semester"
                placeholder="E.g., Sem-1,Sem-2"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
              />
            </div>
            <div className='form-group half'>
              <label htmlFor='subCode'>Subject Code</label>
              <input
                type="text"
                id="subCode"
                placeholder="E.g., CSIC-101"
                value={subCode}
                onChange={(e) => setSubCode(e.target.value)}
                required
              />
            </div>


          </div>
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="year">Year</label>
              <input
                type="text"
                id="year"
                placeholder="E.g., 2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </div>
            <div className="form-group half">
              <label htmlFor="type">Exam Type</label>
              <input
                type="text"
                id="type"
                placeholder="E.g., Mid-1 ,Mid-2"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="file-upload">Upload File (PDF only)</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <i className="fas fa-cloud-upload-alt"></i>
                {file ? file.name : 'Choose a file'}
              </label>
            </div>
          </div>
          <button type="submit" className="form-btn" style={{ opacity: opacity / 100, cursor: filledFields === totalFields ? 'pointer' : 'not-allowed' }}
  disabled={filledFields !== totalFields}>Contribute Paper</button>
        </form>
      </div>
    </div>
  );
}

export default ContributeModal;
