import React, { useState } from 'react';

const App = ({ isLoggedIn, user, onLoginClick, onLogout }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const questionPapers = [
    { id: 1, title: 'Mathematics 2024 Final Exam', subject: 'Mathematics', year: 2024, level: 'Advanced', downloads: 1245 },
    { id: 2, title: 'Physics Midterm Paper', subject: 'Physics', year: 2024, level: 'Intermediate', downloads: 876 },
    { id: 3, title: 'Computer Science Data Structures', subject: 'Computer Science', year: 2023, level: 'Advanced', downloads: 2134 },
    { id: 4, title: 'English Literature Analysis', subject: 'English', year: 2023, level: 'Beginner', downloads: 543 },
    { id: 5, title: 'Chemistry Organic Compounds', subject: 'Chemistry', year: 2024, level: 'Intermediate', downloads: 987 },
    { id: 6, title: 'History World War II', subject: 'History', year: 2022, level: 'Beginner', downloads: 765 },
  ];

  const filteredPapers = questionPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          paper.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'recent') return paper.year >= 2023 && matchesSearch;
    if (activeTab === 'popular') return paper.downloads > 1000 && matchesSearch;
    return paper.subject.toLowerCase() === activeTab.toLowerCase() && matchesSearch;
  });

  const subjects = [...new Set(questionPapers.map(paper => paper.subject))];

  return (
    <div className="min-h-screen bg-gray-50">
    
      <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Question Papers</h1>
        
        {isLoggedIn ? (
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">Hello, {user?.name || 'User'}</span>
            <button 
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Login
          </button>
        )}
      </div>
    </div>
  </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="relative rounded-md shadow-sm max-w-lg mb-6">
            <input
              type="text"
              placeholder="Search question papers..."
              className="block w-full rounded-md border-gray-300 pl-4 pr-10 py-3 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('all')}
              >
                All Papers
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

        {/* Papers Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.map((paper) => (
            <div key={paper.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {paper.subject} ({paper.year})
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{paper.title}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {paper.level}
                    </span>
                    <span className="ml-2 text-gray-500">{paper.downloads} downloads</span>
                  </div>
                  <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Download
                  </button>
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
  );
}

export default App;