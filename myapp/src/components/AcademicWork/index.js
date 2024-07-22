import React, { useEffect, useState,useRef } from 'react';
import Cookies from 'js-cookie';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-step-progress-bar/styles.css';
import { RiNotionFill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setSelectedYear } from '../../actions';
import axios from 'axios';
import { baseUrl } from '../../Apis';
import './index.css';

const initialSemesters = [
    {
      name: '1st Semester',
      courses: [
        { name: 'Course-1', scheduledClasses: '', classesHeld: '', passPercentage: '', apiScoreResults: '', studentFeedback: '', apiScoreFeedback: '' },
        { name: 'Course-2', scheduledClasses: '', classesHeld: '', passPercentage: '', apiScoreResults: '', studentFeedback: '', apiScoreFeedback: '' },
        { name: 'Course-3', scheduledClasses: '', classesHeld: '', passPercentage: '', apiScoreResults: '', studentFeedback: '', apiScoreFeedback: '' }
      ]
    },
    {
      name: '2nd Semester',
      courses: [
        { name: 'Course-1', scheduledClasses: '', classesHeld: '', passPercentage: '', apiScoreResults: '', studentFeedback: '', apiScoreFeedback: '' },
        { name: 'Course-2', scheduledClasses: '', classesHeld: '', passPercentage: '', apiScoreResults: '', studentFeedback: '', apiScoreFeedback: '' },
        { name: 'Course-3', scheduledClasses: '', classesHeld: '', passPercentage: '', apiScoreResults: '', studentFeedback: '', apiScoreFeedback: '' }
      ]
    }
  ];

const AcademicWork = () => {
  const jwtToken = Cookies.get('jwt_token');
  const navigate = useNavigate();
  
  const [semesters, setSemesters] = useState([...initialSemesters]);
  

  const [averagePercentage, setAveragePercentage] = useState({ passPercentage: '', feedbackPercentage: '' });
  const [totalApiScore, setTotalApiScore] = useState('');
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const dispatch = useDispatch();
  const selectedYear = useSelector((state) => state.selectedYear);
  const [year, setYear] = useState(selectedYear || '');
  const [showError, setShowError] = useState(false);
  const [extraMileApiScore, setExtraMileApiScore] = useState(0);
  const tableRef = useRef(null);
  const extraMileRef = useRef(null);
  const uploadedFilesRef = useRef(null);
  const [submitClicked, setSubmitClicked] = useState(false);


  const fetchAcademicWork = async (year) => {
    try {
      const response = await axios.get(`${baseUrl}/academic-work/${year}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      const data = response.data;
      setSemesters(data.semesters);
      setAveragePercentage(data.averagePercentage);
      setTotalApiScore(data.totalApiScore);
      setTextFieldValue(data.extraMileDescription);
      setUploadedFiles(data.uploadedFiles);
      setExtraMileApiScore(data.extraMileApiScore)
      console.log(uploadedFiles);
    } catch (error) {
      throw error;
    }
  };

  const resetForm = () => {
    setSemesters([...initialSemesters]);
    setAveragePercentage({ passPercentage: '', feedbackPercentage: '' });
    setTotalApiScore('');
    setTextFieldValue('');
    setUploadedFiles([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!jwtToken) {
        navigate('/login', { replace: true });
      } else if (selectedYear) {
        try {
          await fetchAcademicWork(selectedYear);
        } catch (error) {
          console.error("Error fetching academic work:", error);
          resetForm();
        }
      } else {
        resetForm();
      }
    };

    fetchData();
  }, [jwtToken, navigate, selectedYear]);

  useEffect(() => {
    validateAllFields();
  }, [semesters]);

  const validateAllFields = () => {
    let allFilled = true;
    semesters.forEach((semester) => {
      semester.courses.forEach((course) => {
        if (
          course.scheduledClasses === '' ||
          course.classesHeld === '' ||
          course.passPercentage === '' ||
          course.studentFeedback === ''
        ) {
          allFilled = false;
        }
      });
    });
    setAllFieldsFilled(allFilled);
  };

  const addCourse = (semesterIndex) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex].courses.push({ name: `Course-${updatedSemesters[semesterIndex].courses.length + 1}`, scheduledClasses: '', classesHeld: '', passPercentage: '', apiScoreResults: '', studentFeedback: '', apiScoreFeedback: '' });
    setSemesters(updatedSemesters);
  };

  const clearCourses = (semesterIndex) => {
    const updatedSemesters = [...semesters];
    if (updatedSemesters[semesterIndex].courses.length > 1) {
      updatedSemesters[semesterIndex].courses.pop();
    }
    setSemesters(updatedSemesters);
  };

  const handleInputChange = (semesterIndex, courseIndex, field, value) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex].courses[courseIndex][field] = value;
  
    setSemesters(updatedSemesters);
  };
  
  
  const calculateAveragePercentage = () => {
    let totalPassPercentage = 0;
    let totalFeedbackPercentage = 0;
    let totalCourses = 0;
  
    semesters.forEach((semester) => {
      semester.courses.forEach((course) => {
        totalPassPercentage += parseFloat(course.passPercentage);
        totalFeedbackPercentage += parseFloat(course.studentFeedback);
        totalCourses++;
      });
    });
  
    const averagePassPercentage = totalPassPercentage / totalCourses;
    const averageFeedbackPercentage = totalFeedbackPercentage / totalCourses;
  
    setAveragePercentage({ passPercentage: averagePassPercentage.toFixed(2), feedbackPercentage: averageFeedbackPercentage.toFixed(2) });
  };
  
  
  const calculateTotalApiScore = () => {
    const totalCourses = semesters.reduce((total, semester) => total + semester.courses.length, 0);
    let totalPassPercentage = 0;
    let totalFeedbackPercentage = 0;
    console.log(averagePercentage)
    semesters.forEach((semester) => {
      semester.courses.forEach((course) => {
        totalPassPercentage += parseFloat(course.passPercentage);
        totalFeedbackPercentage += parseFloat(course.studentFeedback);
      });
    });
  
    const averagePassPercentage = totalPassPercentage / totalCourses;
    const averageFeedbackPercentage = totalFeedbackPercentage / totalCourses;
  
    let totalApiScore = 0;
    totalApiScore += calculateApiScore(averagePassPercentage);
    totalApiScore += calculateApiScore(averageFeedbackPercentage);
  
    setTotalApiScore(totalApiScore.toFixed(2));
  };
  
  const calculateApiScore = (percentage) => {
    if (percentage >= 90) {
      return 20;
    } else if (percentage >= 80) {
      return 15;
    } else if (percentage >= 70) {
      return 10;
    } else if (percentage >= 60) {
      return 5;
    } else {
      return 2;
    }
  };
  
  const handleSave = () => {
    if (allFieldsFilled) {
      calculateAveragePercentage();
      calculateTotalApiScore();
    } else {
      toast.error('All Fileds in Table are Required');
    }
  };

  const handleTextFieldValueChange = (event) => {
    if(textFieldValue.length !== '') setExtraMileApiScore(5);
    setTextFieldValue(event.target.value);
  };


  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const uniqueFiles = selectedFiles.filter(file => !uploadedFiles.some(existingFile => (existingFile.name || existingFile.originalName) === file.name));
    setUploadedFiles([...uploadedFiles, ...uniqueFiles]);

  };

  
  const handleDeleteFile = async (index) => {
    const fileToDelete = uploadedFiles[index];
    const { fileName } = fileToDelete; 
  
    try {
      const response = await axios.delete(`${baseUrl}/delete-file`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        data: {
          year: selectedYear,
          fileName: fileName
        }
      });

      if (response.status === 200 || response.status === 404) {
        const newFiles = [...uploadedFiles];
        newFiles.splice(index, 1);
        setUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
    } catch (error) {
      if(error.response.status === 404){
        const newFiles = [...uploadedFiles];
        newFiles.splice(index, 1);
        setUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
      else
      toast.error('Failed to delete file. Please try again.');
    }
  };
  
  

  const handleYearChange = async (event) => {
    const selectedYear = event.target.value;
    setYear(selectedYear);
    dispatch(setSelectedYear(selectedYear));
  };
  
  
  useEffect(() => {
    const saveAcademicWork = async () => {
      if (submitClicked) {
        const formData = new FormData();
        formData.append('year', selectedYear);
        formData.append('semesters', JSON.stringify(semesters));
        formData.append('averagePercentage', JSON.stringify(averagePercentage));
        formData.append('totalApiScore', totalApiScore);
        formData.append('extraMileDescription', textFieldValue);
        formData.append('extraMileApiScore', extraMileApiScore);
        uploadedFiles.forEach((file, index) => {
          formData.append(`uploadedFiles`, file);
        });
  
        try {
          await axios.post(`${baseUrl}/save-academic-work`, formData, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          toast.success('Academic work saved successfully');
          navigate("/research-development");
          setShowError(false);
        } catch (error) {
          console.error("Error saving academic work:", error);
          toast.error("Failed to save academic work. Please try again.");
        }
      }
      setSubmitClicked(false);
    };
  
    saveAcademicWork(); 
  
  }, [submitClicked, semesters, selectedYear,jwtToken,navigate, averagePercentage, totalApiScore, textFieldValue, extraMileApiScore, uploadedFiles]); // Dependencies to watch for changes
  
  

  const handleSectionFiledsSubmit = async () => {
    if (!selectedYear) {
      setShowError(true);
      toast.warning("Please select a year.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!allFieldsFilled) {
      setShowError(true);
      toast.warning("Please fill in all fields in the table.");
      window.scrollTo({top: 0, behavior: 'smooth' });
      return;
    }
    if (!textFieldValue) {
      setShowError(true);
      toast.warning("Please enter a description for the extra mile.");
      extraMileRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (uploadedFiles.length === 0) {
      setShowError(true);
      toast.warning("Please upload files for the extra mile.");
      uploadedFilesRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    await Promise.all([
      calculateAveragePercentage(),
      calculateTotalApiScore(),
    ]).then(() => {
      setSubmitClicked(true);
    });
  }  

  

  const handleFileClick = (file) => {
    const { fileName } = file; 
    console.log(file)
    if (fileName) {
      
      window.open(`${baseUrl}/uploads/${fileName}`, '_blank');
    } else {
      toast.error('File Preview not available.');
    }
  };

  return (
    <div className="home-main-container">
      <Header />
      <div className="container container-wide pt-5">
      <div className='year-selection-container'>
            <label htmlFor="year-selection">Select Year: </label>
            <select id="year-selection" value={year} onChange={handleYearChange} className={showError && !selectedYear ? 'error-border' : ''}>
              <option value="">-- Select Year --</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
        </div>
  
        {selectedYear && (
          <>
          <div className='academic-work-main-head-element-container'>
          
          <div className='academic-work-main-head-element-inner-container'>
              <h1 className='academic-work-main-head-element'>I. Academic Work</h1>
              <div className='notion-help-guide-container'>
              <a href="https://smart-crafter-843.notion.site/Anurag-University-Academic-Performance-Form-Guide-5e50ac0e13074d95be8755d86c4c4a51" target="_blank" rel="noopener noreferrer" className='notion-help-guide-link'>
             <RiNotionFill id="notion-help-guide" className='notion-help-guide'/>
              <span for="notion-help-guide" className='notion-help-guide-content'>Help Guide</span>
              </a>
              </div>

          </div>
        <h3 className='academic-work-main-p1-element'>a. Teaching Performance indicator for {selectedYear}</h3>
        </div>
        <table className="table pt-0 mt-0" ref={tableRef} >
          <thead>
              <th>Semester</th>
              <th>Course taught</th>
              <th>No. of Scheduled Classes</th>
              <th>No. of classes actually held</th>
              <th>Result (Pass %)</th>
              <th>Student Feedback %</th>
              <th>Actions</th>

          </thead>
          <tbody>
            {semesters.map((semester, semesterIndex) => (
              semester.courses.map((course, courseIndex) => (
                <tr key={`${semesterIndex}-${courseIndex}`}>
                  {courseIndex === 0 && (
                    <td rowSpan={semester.courses.length}>{semester.name}</td>
                  )}
                  <td>{course.name}</td>
                  <td><input className="academic-part-1-form-input" type="number" value={course.scheduledClasses} onChange={(e) => handleInputChange(semesterIndex, courseIndex, 'scheduledClasses', e.target.value)} /></td>
                  <td><input className="academic-part-1-form-input" type="number" value={course.classesHeld} onChange={(e) => handleInputChange(semesterIndex, courseIndex, 'classesHeld', e.target.value)} /></td>
                  <td><input className="academic-part-1-form-input" type="number" value={course.passPercentage} onChange={(e) => handleInputChange(semesterIndex, courseIndex, 'passPercentage', e.target.value)} /></td>
                  <td><input className="academic-part-1-form-input" type="number" value={course.studentFeedback} onChange={(e) => handleInputChange(semesterIndex, courseIndex, 'studentFeedback', e.target.value)} /></td>
                 
                  {courseIndex === 0 && (
                    <td rowSpan={semester.courses.length}>
                      <button onClick={() => addCourse(semesterIndex)} className='button-options-save actived-button add-button'>Add Field</button>
                      <button onClick={() => clearCourses(semesterIndex)} className='button-options-save actived-button add-button'>Clear Field</button>
                    </td>
                  )}
                </tr>
              ))
            ))}
          </tbody>
        </table>
        <div className='save-button-bg'>
    <button 
      onClick={handleSave} 
      className={allFieldsFilled ? 'button-options-save actived-button' : 'button-options-save disabled'} 
      data-bs-toggle="popover" 
  data-bs-placement="bottom" 
  title="Fill all Fields" 
  data-bs-content={allFieldsFilled ? 'Click to save' : 'All fields must be filled'}
      >
      Save
    </button>
      </div>
        <table>
          <thead>
            <th></th>
            <th>Result (Pass %)</th>
            <th>Student Feedback %</th>
          </thead>
          <tbody>
            <tr>
              <td colSpan="1"><b>Average percentage</b></td>
              <td colSpan="1">{averagePercentage.passPercentage}</td>
              <td colSpan="1">{averagePercentage.feedbackPercentage}</td>
            </tr>
            <tr>
              <td colSpan="1"><b>Total API score (Results + Feedback)</b></td>
              <td colSpan="2">{totalApiScore}</td>
            </tr>
          </tbody>
        </table>
        <div>
        <h3 className='academic-work-main-p2-element mb-0'>b. Describe extra mile in academics during {selectedYear}</h3>
        </div>
        <div>
      <textarea
      ref={extraMileRef}
        type="text"
        value={textFieldValue}
        onChange={handleTextFieldValueChange}
        placeholder="Enter here"
        rows={8} 
        style={{ width: '100%' }}
        className={showError && !textFieldValue ? 'error-border my-textarea mt-0 p-3' : 'my-textarea mt-0 p-3'}
      />
      {showError && !textFieldValue && <p className='error-message mt-0'>*Required</p>}
      <div>
        <div className='upload-description-container'>
          <p className='rd-main-heading-para pb-0 mb-0'>Submit the documentary evidences for your claims</p>
        <input
          type="file"
          multiple
          ref={uploadedFilesRef}
          onChange={handleFileChange}
          id="file-input"
          accept='application/pdf'
          className="file-input file-upload-input"
          />
        <label htmlFor="file-input"
        className={showError && uploadedFiles.length === 0 ? 'error-border file-input-label' : 'file-input-label'}
        title="Upload Files">
          <IoCloudUploadOutline  />
          <p>Choose Files</p>
        </label>
          </div>
        {uploadedFiles.length > 0 && (
          <div className="file-list">
            <p className='upload-file-container-head'>Selected Files</p>
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>
                  <span className="filename" 
                  title={file.originalName?file.originalName:file.name}
                  onClick={() => handleFileClick(file)}
                  style={{ cursor: 'pointer' }}
                   >{file.originalName?file.originalName:file.name}</span>

                  <button onClick={() => handleDeleteFile(index)}><RxCross1 />  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    
      <div className='aca-work-next-prev-buttons-container'>
        
        <button  className='aca-work-next-prev-buttons save-next-button' onClick={handleSectionFiledsSubmit}>
           Save & Next
        </button>
      </div> 
    </div>
    </>)}
      </div>
    </div>
  );
};

export default AcademicWork;
