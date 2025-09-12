import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const JobRecommendation = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  
  // Initial job data
  const initialJobs = [
    { title: "Angular Developer", company: "Resolute Solutions", applied: "0 Shortlist", daysLeft: "23 days left", location: "Surat", updatedOn: "Mar 12, 2025", gender: "Female / Male", salary: "2.42 LPA - 2.45 LPA", experience: "Minimum: 1 year", description: ["Developing user interfaces with Angular and JavaScript.", "Ensuring high performance of applications.", "Troubleshooting front-end issues."], skills: ["Software Engineering", "TypeScript", "Angular", "CSS", "HTML5", "JavaScript"], perks: ["🎓 Learning Allowance", "📞 Counselling", "💡 Support"] },
    { title: "Software Engineer", company: "CloudSEK", applied: "32 Applied", daysLeft: "23 days left", location: "Bangalore", updatedOn: "Mar 15, 2025", gender: "Female / Male", salary: "7.5 LPA - 12 LPA", experience: "Minimum: 2 years", description: ["Developing scalable backend solutions.", "Working with cloud infrastructure.", "Implementing security features."], skills: ["Java", "Spring Boot", "AWS", "MongoDB", "Microservices", "REST API"], perks: ["🏥 Health Insurance", "🏠 Work From Home", "💻 Laptop Provided"] },
    { title: "Software Engineer", company: "Capgemini", applied: "212 Applied", daysLeft: "5 days left", location: "Mumbai", updatedOn: "Mar 10, 2025", gender: "Female / Male", salary: "5.5 LPA - 9 LPA", experience: "Minimum: 1 year", description: ["Full stack development.", "Client communication.", "Agile methodology implementation."], skills: ["Python", "Django", "React", "PostgreSQL", "Git", "Docker"], perks: ["💰 Performance Bonus", "🏋️ Gym Membership", "🍽️ Free Lunch"] },
    { title: "Software Engineer-Chennai", company: "Temenos Private Limited", applied: "44 Applied", daysLeft: "10 days left", location: "Chennai", updatedOn: "Mar 17, 2025", gender: "Female / Male", salary: "6 LPA - 10 LPA", experience: "Minimum: 3 years", description: ["Developing banking solutions.", "Integration testing.", "Documentation and support."], skills: ["C#", ".NET", "SQL Server", "Azure", "WPF", "Entity Framework"], perks: ["🚕 Transport Allowance", "📱 Phone Allowance", "🎓 Training Programs"] },
    { title: "DevOps Engineer-Delhi", company: "Technotasks Pvt. Ltd.", applied: "14 Applied", daysLeft: "7 days left", location: "Delhi", updatedOn: "Mar 14, 2025", gender: "Female / Male", salary: "8 LPA - 14 LPA", experience: "Minimum: 2 years", description: ["CI/CD pipeline management.", "Infrastructure as code.", "Monitoring and logging."], skills: ["Jenkins", "Kubernetes", "Docker", "Terraform", "AWS", "Linux"], perks: ["🏆 Career Growth", "🌐 Remote Work", "⏰ Flexible Hours"] }
  ];
  
  // State to store jobs and selected job
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState(initialJobs[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    location: 'all',
    salary: 'all',
    experience: 'all'
  });
  const [userResume, setUserResume] = useState(null);
  const [jobScores, setJobScores] = useState({});
 
  // Function to calculate job matching score
  const calculateJobScore = (job, resume) => {
    if (!resume) return 0;

    let score = 0;
    const maxScore = 100;

    // Extract skills from resume (this is a simplified version)
    const resumeSkills = resume.skills || [];
    const resumeExperience = resume.experience || 0;

    // Skills match (50% of total score)
    const skillsScore = job.skills.reduce((acc, skill) => {
      if (resumeSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        return acc + (50 / job.skills.length);
      }
      return acc;
    }, 0);

    // Experience match (30% of total score)
    const requiredExp = parseInt(job.experience.split(': ')[1].split(' ')[0]);
    const experienceScore = resumeExperience >= requiredExp ? 30 : 
      (resumeExperience / requiredExp) * 30;

    // Location match (20% of total score)
    const locationScore = resume.location === job.location ? 20 : 0;

    score = Math.round(skillsScore + experienceScore + locationScore);
    return Math.min(score, maxScore);
  };

  // Function to get score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  // Function to get match text based on score
  const getMatchText = (score) => {
    if (score >= 80) return t('job_match_excellent');
    if (score >= 60) return t('job_match_good');
    if (score >= 40) return t('job_match_fair');
    return t('job_match_poor');
  };

  // Function to calculate detailed scores
  const calculateDetailedScores = (job, resume) => {
    if (!resume) return null;

    const resumeSkills = resume.skills || [];
    const resumeExperience = resume.experience || 0;

    // Skills match (50% of total score)
    const skillsScore = job.skills.reduce((acc, skill) => {
      if (resumeSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        return acc + (50 / job.skills.length);
      }
      return acc;
    }, 0);

    // Experience match (30% of total score)
    const requiredExp = parseInt(job.experience.split(': ')[1].split(' ')[0]);
    const experienceScore = resumeExperience >= requiredExp ? 30 : 
      (resumeExperience / requiredExp) * 30;

    // Location match (20% of total score)
    const locationScore = resume.location === job.location ? 20 : 0;

    return {
      skills: Math.round(skillsScore),
      experience: Math.round(experienceScore),
      location: locationScore,
      total: Math.min(Math.round(skillsScore + experienceScore + locationScore), 100)
    };
  };

  // Effect to fetch user's resume when component mounts
  useEffect(() => {
    const fetchUserResume = async () => {
      if (currentUser) {
        try {
          // This is a placeholder - implement actual resume fetching logic
          const mockResume = {
            skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
            experience: 2,
            location: 'Bangalore'
          };
          setUserResume(mockResume);
        } catch (error) {
          console.error('Error fetching resume:', error);
        }
      }
    };

    fetchUserResume();
  }, [currentUser]);

  // Effect to calculate scores when jobs or resume changes
  useEffect(() => {
    if (userResume) {
      const scores = jobs.reduce((acc, job) => {
        acc[job.title] = calculateJobScore(job, userResume);
        return acc;
      }, {});
      setJobScores(scores);
    }
  }, [jobs, userResume]);

  // Effect to calculate detailed scores when jobs or resume changes
  useEffect(() => {
    if (userResume) {
      const scores = jobs.reduce((acc, job) => {
        acc[job.title] = calculateDetailedScores(job, userResume);
        return acc;
      }, {});
      setJobScores(scores);
    }
  }, [jobs, userResume]);
 
  // Function to simulate fetching updated job data
  const fetchUpdatedJobs = () => {
    setIsLoading(true);
   
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Generate some random new job data
      const updatedJobs = [
        ...jobs.slice(0, 3), // Keep first 3 jobs
        // Add some new jobs
        {
          title: "Frontend Developer",
          company: "TechInnovate",
          applied: `${Math.floor(Math.random() * 100)} Applied`,
          daysLeft: `${Math.floor(Math.random() * 30)} days left`,
          location: "Hyderabad",
          updatedOn: "Mar 18, 2025",
          gender: "Female / Male",
          salary: "6 LPA - 12 LPA",
          experience: "Minimum: 2 years",
          description: [
            "Building responsive web applications.",
            "Implementing UI/UX designs.",
            "Optimizing application performance."
          ],
          skills: ["React", "JavaScript", "Redux", "CSS", "HTML5", "Webpack"],
          perks: ["🏠 Remote Work", "💻 Latest Equipment", "🏥 Health Insurance"]
        },
        {
          title: "Backend Engineer",
          company: "DataSystems Inc",
          applied: `${Math.floor(Math.random() * 150)} Applied`,
          daysLeft: `${Math.floor(Math.random() * 20)} days left`,
          location: "Pune",
          updatedOn: "Mar 20, 2025",
          gender: "Female / Male",
          salary: "8 LPA - 15 LPA",
          experience: "Minimum: 3 years",
          description: [
            "Designing and implementing APIs.",
            "Database optimization.",
            "Security implementation."
          ],
          skills: ["Node.js", "Express", "MongoDB", "Redis", "GraphQL", "Docker"],
          perks: ["💰 Stock Options", "🎓 Learning Budget", "🏋️ Wellness Programs"]
        }
      ];
     
      setJobs(updatedJobs);
      setSelectedJob(updatedJobs[0]);
      setIsLoading(false);
    }, 1500); // 1.5 second delay to simulate network request
  };
 
  // Function to handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
   
    if (!term.trim()) {
      applyFilters(filterOptions, initialJobs);
      return;
    }
   
    const filtered = initialJobs.filter(job =>
      job.title.toLowerCase().includes(term.toLowerCase()) ||
      job.company.toLowerCase().includes(term.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(term.toLowerCase()))
    );
   
    applyFilters(filterOptions, filtered);
  };
 
  // Function to apply filters
  const applyFilters = (filters, jobList = null) => {
    const listToFilter = jobList || (searchTerm ? jobs : initialJobs);
   
    let filtered = [...listToFilter];
   
    if (filters.location !== 'all') {
      filtered = filtered.filter(job => job.location === filters.location);
    }
   
    if (filters.salary !== 'all') {
      // Simple salary filtering based on minimum value
      if (filters.salary === 'high') {
        filtered = filtered.filter(job => {
          const minSalary = parseFloat(job.salary.split(' LPA')[0].split(' - ')[0]);
          return minSalary >= 8;
        });
      } else if (filters.salary === 'medium') {
        filtered = filtered.filter(job => {
          const minSalary = parseFloat(job.salary.split(' LPA')[0].split(' - ')[0]);
          return minSalary >= 5 && minSalary < 8;
        });
      } else {
        filtered = filtered.filter(job => {
          const minSalary = parseFloat(job.salary.split(' LPA')[0].split(' - ')[0]);
          return minSalary < 5;
        });
      }
    }
   
    if (filters.experience !== 'all') {
      filtered = filtered.filter(job => {
        const minExp = parseInt(job.experience.split(': ')[1].split(' ')[0]);
        if (filters.experience === '3+') return minExp >= 3;
        if (filters.experience === '2-3') return minExp >= 2 && minExp < 3;
        return minExp < 2;
      });
    }
   
    setJobs(filtered);
    if (filtered.length > 0) {
      setSelectedJob(filtered[0]);
    }
  };
 
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filterOptions, [filterType]: value };
    setFilterOptions(newFilters);
    applyFilters(newFilters);
  };
 
  // Select a job to display details
  const selectJob = (job) => {
    setSelectedJob(job);
  };
 
  // Get unique locations for filter
  const locations = [...new Set(initialJobs.map(job => job.location))];
 
  // Skeleton Loader Component
  const JobCardSkeleton = () => (
    <div className="bg-white rounded-lg p-4 text-black shadow-lg animate-pulse mb-4">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/3 mt-4" />
      <div className="h-3 bg-gray-100 rounded w-1/4 mt-2" />
    </div>
  );

  // Progress Bar Component
  const ProgressBar = ({ value, color }) => (
    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
      <div
        className={`h-3 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-white px-4 sm:px-6 md:px-8 lg:px-25 py-14 sm:py-8 md:py-10">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4 md:gap-6 lg:gap-5 py-4 sm:py-6 md:py-15 sticky top-0 z-30 bg-black bg-opacity-90 backdrop-blur-md">
        <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold shadow-md">
          {t('job_search_title')}
        </button>
        {/* Salary Filter */}
        <div className="relative w-full sm:w-auto">
          <select
            className="bg-white text-black px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm md:text-base w-full sm:w-auto border border-gray-300 focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilterChange("salary", e.target.value)}
            value={filterOptions.salary}
          >
            <option value="all">{t('filter_all_salaries')}</option>
            <option value="low">{t('filter_salary_below')}</option>
            <option value="medium">{t('filter_salary_medium')}</option>
            <option value="high">{t('filter_salary_above')}</option>
          </select>
        </div>
        {/* Experience Filter */}
        <div className="relative w-full sm:w-auto">
          <select
            className="bg-white text-black px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm md:text-base w-full sm:w-auto border border-gray-300 focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilterChange("experience", e.target.value)}
            value={filterOptions.experience}
          >
            <option value="all">{t('filter_all_experience')}</option>
            <option value="0-2">{t('filter_exp_0_2')}</option>
            <option value="2-3">{t('filter_exp_2_3')}</option>
            <option value="3+">{t('filter_exp_3_plus')}</option>
          </select>
        </div>
        {/* Location Filter */}
        <div className="relative w-full sm:w-auto">
          <select
            className="bg-white text-black px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm md:text-base w-full sm:w-auto border border-gray-300 focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilterChange("location", e.target.value)}
            value={filterOptions.location}
          >
            <option value="all">{t('filter_all_locations')}</option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        {/* Search Bar */}
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder={t('job_search_placeholder')}
            className="bg-white text-black px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm md:text-base placeholder:text-gray-600 placeholder:italic border border-gray-300 w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleSearch(e.target.value)}
            value={searchTerm}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* Left Column - Job Listings */}
        <div className="w-full lg:w-1/3 p-2 space-y-4">
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 4 }).map((_, idx) => <JobCardSkeleton key={idx} />)
          ) : jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg p-4 text-black shadow-lg hover:shadow-2xl transition-shadow cursor-pointer border-2 ${selectedJob === job ? 'border-blue-600 ring-2 ring-blue-300' : 'border-transparent'} group relative`}
                onClick={() => selectJob(job)}
                style={{
                  animation: isLoading ? 'pulse 1.5s infinite' : 'none',
                  minHeight: '120px',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center text-white text-lg font-bold mr-3 shadow-md">
                      <span>{job.title.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-base">{job.title}</div>
                      <div className="text-xs text-gray-600">{job.company}</div>
                    </div>
                  </div>
                  {userResume && jobScores[job.title] && (
                    <div className="flex flex-col items-end">
                      <span className={`text-lg font-bold ${getScoreColor(jobScores[job.title].total)}`}>{jobScores[job.title].total}%</span>
                      <ProgressBar value={jobScores[job.title].total} color={getScoreColor(jobScores[job.title].total).replace('text-', 'bg-')} />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">{job.location}</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">{job.experience}</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">{job.salary}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-3">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                  </svg>
                  {new Date(job.updatedOn).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 sm:py-8 bg-white rounded-lg p-3 sm:p-4">
              <p className="text-gray-500 text-sm sm:text-base">{t('no_jobs_found')}</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterOptions({location: 'all', salary: 'all', experience: 'all'});
                  setJobs(initialJobs);
                  setSelectedJob(initialJobs[0]);
                }}
                className="mt-3 sm:mt-4 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm"
              >
                {t('reset_filters')}
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Job Details */}
        {selectedJob && (
          <div className="w-full lg:w-2/3 bg-white text-black rounded-lg shadow-lg p-6 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  <span>{selectedJob.title.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                  <p className="text-gray-600 text-sm">{selectedJob.company}</p>
                </div>
              </div>
              {userResume && jobScores[selectedJob.title] && (
                <div className="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center min-w-[140px]">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600">{t('job_match_score')}</div>
                    <div className={`text-2xl font-bold ${getScoreColor(jobScores[selectedJob.title].total)}`}>{jobScores[selectedJob.title].total}%</div>
                    <ProgressBar value={jobScores[selectedJob.title].total} color={getScoreColor(jobScores[selectedJob.title].total).replace('text-', 'bg-')} />
                    <div className="text-xs text-gray-600 mt-1">{getMatchText(jobScores[selectedJob.title].total)}</div>
                  </div>
                  <div className="mt-3 space-y-2 w-full">
                    <div className="flex justify-between text-xs">
                      <span>{t('job_match_skills')}</span>
                      <span className={getScoreColor(jobScores[selectedJob.title].skills)}>{jobScores[selectedJob.title].skills}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>{t('job_match_experience')}</span>
                      <span className={getScoreColor(jobScores[selectedJob.title].experience)}>{jobScores[selectedJob.title].experience}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>{t('job_match_location')}</span>
                      <span className={getScoreColor(jobScores[selectedJob.title].location)}>{jobScores[selectedJob.title].location}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <hr className="my-2 border-gray-200" />

            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">📍 {selectedJob.location}</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">🔹 {selectedJob.experience}</span>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">💰 {selectedJob.salary}</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-semibold">🗓️ {t('job_updated_on')} {selectedJob.updatedOn}</span>
            </div>

            {/* Divider */}
            <hr className="my-2 border-gray-200" />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-md text-base font-semibold hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto">
                {t('job_apply')}
              </button>
            </div>

            {/* Divider */}
            <hr className="my-2 border-gray-200" />

            <div>
              <h3 className="text-lg font-semibold mb-2">{t('job_eligibility')}</h3>
              <p className="text-gray-600 text-sm">✔️ {t('job_experienced_prof')}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t('job_salary_experience')}</h3>
              <p className="text-gray-600 text-sm">💰 {selectedJob.salary}</p>
              <p className="text-gray-600 text-sm">🔹 {selectedJob.experience}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t('job_description')}</h3>
              <ul className="list-disc pl-6 text-gray-700 text-sm">
                {selectedJob.description.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t('job_key_skills')}</h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded text-xs font-semibold text-gray-800">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default JobRecommendation;