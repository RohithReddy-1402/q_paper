import { title } from 'framer-motion/client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFileViewUrl, getFileDownloadUrl } from "../services/appWrite"
import { useToast } from './ToastContext';
import { Download, Loader2, Check } from 'lucide-react';
import { Helmet } from "react-helmet-async";
import DownloadButton from './DownloadButton';
const questionPapers = ({ isLoggedIn, user, onLoginClick, onLogout, onLoadClose, isLoading, setDownloadCounts, setPapersLength, questionPapers }) => {

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [status, setStatus] = useState("idle");
  const nav = useNavigate();
  const { addToast } = useToast();
  const handleNav = () => {
    nav('/nit-kkr-pyqs')
  }
  const handleDownload = async (event, paper) => {

    event.stopPropagation();
    if (!paper.paper_id) {
      alert("Download link not available for this paper.");
      return;
    }
    const res = fetch(`https://back-6j6v.onrender.com/papers/${paper.paper_id}/downloadcount`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const link = document.createElement("a");
    link.href = getFileDownloadUrl(paper.paper_id);
    link.setAttribute("download", `${paper.title} - ${paper.examType}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`${paper.title} - ${paper.examType} downloaded successfully.`, 'success');
    //  setTimeout(() => {
    //   setStatus("loading");
    //   setTimeout(() => setStatus("idle"), 2000);
    // }, 2000);
    setStatus("done");

  };
  const handleDisplay = (event, fileId) => {
    if (!fileId) {
      alert("Download link not available for this paper.");
      return;
    }
    const res = fetch(`https://back-6j6v.onrender.com/papers/${fileId}/downloadcount`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const link = getFileViewUrl(fileId);
    window.open(link, "_blank");
  };
  const handleiconclick = () => {
    const dropdown = document.getElementById("userDropdown");

    dropdown.classList.toggle("hidden");

  };


  const years = [...new Set(questionPapers.map(paper => paper.year))].sort((a, b) => b - a);

  let filteredPapers = questionPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      paper.subject.toLowerCase().includes(searchQuery.toLowerCase().trim()) || paper.subjectCode.toLowerCase().includes(searchQuery.toLowerCase().trim()) || paper.subjectCode.replace("-", "").toLowerCase().includes(searchQuery.toLowerCase().trim())||paper.subjectCode.replace(" ","").includes(searchQuery.toLowerCase().trim());
    const matchesSemester = selectedSemester === 'all' || paper.sem === selectedSemester.split('-')[1];

    const matchesYear = selectedYear === 'all' || parseInt(paper.year) === parseInt(selectedYear);
    const matchesType = selectedType === 'all' || paper.examType === selectedType;

    if (activeTab === 'all') return matchesSearch && matchesSemester && matchesYear && matchesType;
    if (activeTab === 'recent') return matchesSearch && matchesSemester && matchesYear && matchesType;
    if (activeTab === 'popular') return matchesSearch && matchesSemester && matchesYear && matchesType;
    if (activeTab === 'Mid-1') return paper.examType === 'Mid-1' && matchesSearch && matchesSemester && matchesYear;
    if (activeTab === 'Mid-2') return paper.examType === 'Mid-2' && matchesSearch && matchesSemester && matchesYear;
    if (activeTab === 'Sem') return paper.examType === 'Sem' && matchesSearch && matchesSemester && matchesYear;

    return paper.subject.toLowerCase() === activeTab.toLowerCase() && matchesSearch && matchesSemester && matchesYear && matchesType;
  });
  if (activeTab === 'popular') {
    filteredPapers = filteredPapers.sort((a, b) => b.downloads - a.downloads);
  }
  if (activeTab === 'recent') {
    filteredPapers = filteredPapers.reverse();
  }
  const subjects = [...new Set(questionPapers.map(paper => paper.subject))];
  const semesters = ['Sem-1', 'Sem-2', 'Sem-3', 'Sem-4', 'Sem-5', 'Sem-6', 'Sem-7', 'Sem-8'];

  const additionalTabs = ['Sem', 'Mid-1', 'Mid-2'];

  return (
    <>    <Helmet>
        <title>Question Papers</title>
        <meta name="description" content="Download previous year question papers for NIT KKR" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 onClick={handleNav} className="text-3xl font-bold text-gray-900 cursor-pointer">NIT KKR PYQs</h1>

            {isLoggedIn ? (
              <div className="flex items-center">
                <div className="relative">
                  <div id="avatarButton" className="relative w-10 h-10 overflow-hidden bg-gray-100 shadow-pink-200 rounded-full dark:bg-gray-600 cursor-pointer" data-dropdown-toggle="userDropdown" onClick={handleiconclick}>
                    <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>

                  <div id="userDropdown" className="z-10 hidden absolute top-full left-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 dark:divide-gray-600">
                    <div className="px-4 py-3  text-sm text-gray-900 dark:text-white">
                      <div>{user?.name}</div>
                      <div className="font-medium truncate pt-2">{user?.email}</div>
                    </div>
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                      <li><a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a></li>
                      <li><a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a></li>
                      <li><a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a></li>
                    </ul>
                    <div className="py-1">
                      <a href="#" onClick={onLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                    </div>
                  </div>
                </div>

                <div className="font-medium dark:text-black ml-4">
                  <div>{user?.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user?.joindate || null}</div>
                </div>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative rounded-md shadow-sm flex-grow">
              <input
                type="text"
                placeholder="Search question papers... (Name , Subject Code)"
                className="block w-full rounded-md border-gray-300 pl-4 pr-10 py-3 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center poclassinter-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="relative">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-4 pr-10 py-3 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="all">All Semesters</option>
                  {semesters.map(semester => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 17a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 17z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-4 pr-10 py-3 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 17a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 17z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-4 pr-10 py-3 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="all">Mid+Sem</option>
                  {additionalTabs.map(tab => (
                    <option key={tab} value={tab}>
                      {tab}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 17a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 17z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                className={`${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('all')}
              >
                All Papers ({questionPapers.length})
              </button>
              <button
                className={`${activeTab === 'recent' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('recent')}
              >
                Recent
              </button>
              <button
                className={`${activeTab === 'popular' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('popular')}
              >
                Popular
              </button>

              {additionalTabs.map(tab => (
                <button
                  key={tab}
                  className={`${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'Sem' ? 'Semester' : `${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
                </button>
              ))}

              {subjects.map(subject => (
                <button
                  key={subject}
                  className={`${activeTab === subject.toLowerCase() ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab(subject.toLowerCase())}
                >
                  {subject}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {(selectedSemester !== 'all' || selectedYear !== 'all') && (
          <div className="mb-6 flex flex-wrap gap-2">
            <div className="text-sm text-gray-500">Active filters:</div>
            {selectedSemester !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedSemester.includes('Sem') ?
                  `Semester ${selectedSemester.split('-')[1]}` :
                  `Mid-Term ${selectedSemester.split('_')[1]}`
                }
                <button
                  onClick={() => setSelectedSemester('all')}
                  className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {selectedYear !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Year: {selectedYear}
                <button
                  onClick={() => setSelectedYear('all')}
                  className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.slice(0, 40).map((paper) => (
            <div key={paper.paper_id} className="bg-white overflow-hidden shadow rounded-lg cursor-pointer" onClick={(e) => handleDisplay(e, paper.paper_id)}>
              <div className="p-5 h-7/10">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Sem - {paper?.sem} <span className='text-xl font-bold text-black'>- -</span> {paper?.subjectCode} <span className='text-xl text-black font-bold'>- -</span> ( {paper?.year} )
                      </dt>
                      <dd>
                        {/* <div className='text-lg font-medium text-gray-900'>Sem - {paper?.sem}</div> */}
                        <div className="text-lg font-medium text-gray-900">{paper?.title + " " + paper?.examType + " Paper"}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {paper?.level}
                    </span>
                    <span className="ml-2 text-gray-500">{paper.downloads} downloads</span>
                  </div>
                  {/* <button
                      onClick={(e) => handleDownload(e, paper)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium cursor-pointer rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {status === "idle" && <Download className="w-5 h-5 text-purple-800" />}
                      {status === "loading" && <Loader2 className="w-5 h-5 text-red-600" />}
                      {status === "done" && <Check className="w-5 h-5 text-green-600" />}


                    </button> */}
                  <DownloadButton
                    key={paper.paper_id}
                    paper={paper}
                    addToast={addToast}
                    getFileDownloadUrl={getFileDownloadUrl}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No question papers found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </main>
    </div>
    </>
  );
}

export default questionPapers;
