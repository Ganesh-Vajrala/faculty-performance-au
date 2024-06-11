import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-step-progress-bar/styles.css';
import { RiNotionFill } from "react-icons/ri";
import './index.css';

const AcademicWork = () => {
  const jwtToken = Cookies.get('jwt_token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwtToken) {
      navigate('/login', { replace: true });
    }
  }, [jwtToken, navigate]);

  const [semesters, setSemesters] = useState([
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
  ]);

  const [averagePercentage, setAveragePercentage] = useState({ passPercentage: '', feedbackPercentage: '' });
  const [totalApiScore, setTotalApiScore] = useState('');
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState('');

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
      updatedSemesters[semesterIndex].courses.pop(); // Remove the last course
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
      alert('Please fill in all required fields.');
    }
  };

  const handleTextFieldValueChange = (event) => {
    setTextFieldValue(event.target.value);
  };

  return (
    <div className="home-main-container">
      <Header />
      <div className="container container-wide pt-5">
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
          <h3 className='academic-work-main-p1-element'>a. Teaching Performance indicator for 2023</h3>
        </div>
        <table className="table pt-0 mt-0" >
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
                      <button onClick={() => addCourse(semesterIndex)} className='button-options-save actived-button add-button'>Add Filed</button>
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
      disabled={!allFieldsFilled} 
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
        <h3 className='academic-work-main-p2-element'>b. Describe extra mile in academics during 2023</h3>
        </div>
        <div>
      <textarea
        type="text"
        value={textFieldValue}
        onChange={handleTextFieldValueChange}
        placeholder="Enter here"
        rows={8} 
        style={{ width: '100%' }}
        className='my-textarea'
      />
      <div className='aca-work-next-prev-buttons-container'>
        
        <button  className='aca-work-next-prev-buttons' onClick={()=>navigate("/research-development")}>
          Next
        </button>
      </div> 
    </div>
      </div>
    </div>
  );
};

export default AcademicWork;
