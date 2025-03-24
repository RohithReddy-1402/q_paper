import React, { useState } from 'react';
import './Modal.css';

function ContributeModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [institution, setInstitution] = useState('');
  const [file, setFile] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Create form data for file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('year', year);
    formData.append('institution', institution);
    formData.append('paperFile', file);
    
    console.log('Contributing paper:', { title, subject, year, institution, file });
    // You would typically make an API call here
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal contribute-modal">
        <div className="modal-header">
          <h2>Contribute Question Paper</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
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
              <label htmlFor="institution">Institution</label>
              <input
                type="text"
                id="institution"
                placeholder="E.g., MIT"
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
          <button type="submit" className="form-btn">Contribute Paper</button>
        </form>
      </div>
    </div>
  );
}

export default ContributeModal;
