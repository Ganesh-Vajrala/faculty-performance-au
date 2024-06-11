import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { RiNotionFill } from 'react-icons/ri';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-step-progress-bar/styles.css';
import './index.css';
import ResearchPublications from '../ResearchPublications';
import FundedProjects from '../FundedProjects';
import PresentationAndFDP from '../PresentationAndFDP';
import CertificationsUpload from '../CertificationsUpload';
import { BiArrowBack } from "react-icons/bi";

const ResearchAndDevelopment = () => {
    const jwtToken = Cookies.get('jwt_token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwtToken) {
      navigate('/login', { replace: true });
    }
  }, [jwtToken, navigate]);
  
  const [formData, setFormData] = useState({
    universityName: '',
    registrationDate: '',
    supervisorName: '',
    prePhdCompletionDate: '',
    researchReviewsCompleted: '',
    phdCompletionDate: '',
    registeredForPhd: false,
    receivedPhdIn2023: false,
    universityName2023: '',
    registrationDate2023: '',
    supervisorName2023: '',
    prePhdCompletionDate2023: '',
    researchReviewsCompleted2023: '',
    phdCompletionDate2023: ''
  });
  const lightSilverColor = '#e5e5e5';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

    return(
        <div className='home-main-container'>
            <Header/>
            <div className='container container-wide pt-5'>
            <BiArrowBack className='form-backnavigation-button' onClick={()=>navigate("/academic-work")}/>
            <div className='academic-work-main-head-element-container'>
          <div className='academic-work-main-head-element-inner-container mb-0'>
              <h1 className='academic-work-main-head-element'>II. Research and Development</h1>
              <div className='notion-help-guide-container'>
              <a href="https://smart-crafter-843.notion.site/Anurag-University-Academic-Performance-Form-Guide-5e50ac0e13074d95be8755d86c4c4a51" target="_blank" rel="noopener noreferrer" className='notion-help-guide-link'>
             <RiNotionFill id="notion-help-guide" className='notion-help-guide'/>
              <span for="notion-help-guide" className='notion-help-guide-content'>Help Guide</span>
              </a>
              </div>

          </div>
          <p className='rd-main-heading-para'>The section summarizes the progress of the candidate in Research and Development.</p>
        </div>
      <form onSubmit={handleSubmit}>
        <table className="table mt-0">
          <thead>
               <th></th>
              <th>Did you register for Ph. D. in 2023?<br />If yes, please fill this column.</th>
              <th>Did you receive your Ph. D. in 2023?<br />If yes, please fill this column.</th>
          </thead>
          <tbody>
            <tr>
              <td>Name of the University</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }}
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="text"
                  name="universityName2023"
                  value={formData.universityName2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td>Date of Registration</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }}                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="date"
                  name="registrationDate2023"
                  value={formData.registrationDate2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td>Name of Supervisor and Co-Supervisor</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }}                  type="text"
                  name="supervisorName"
                  value={formData.supervisorName}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="text"
                  name="supervisorName2023"
                  value={formData.supervisorName2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td>Pre-Ph.D. completion Date</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }}                  type='date'
                  name="prePhdCompletionDate"
                  value={formData.prePhdCompletionDate}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="date"
                  name="prePhdCompletionDate2023"
                  value={formData.prePhdCompletionDate2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td>No. of Research Reviews completed</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }}                  type="number"
                  name="researchReviewsCompleted"
                  value={formData.researchReviewsCompleted}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="number"
                  name="researchReviewsCompleted2023"
                  value={formData.researchReviewsCompleted2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td>Expected date/Date of completion of Ph.D.</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }}                  type='date'
                  name="phdCompletionDate"
                  value={formData.phdCompletionDate}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="date"
                  name="phdCompletionDate2023"
                  value={formData.phdCompletionDate2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="registeredForPhd"
                    checked={formData.registeredForPhd}
                    onChange={handleInputChange}
                    className="form-check-input"
                    id="registeredForPhd"
                  />
                  <label className="form-check-label" htmlFor="registeredForPhd">
                    Yes
                  </label>
                </div>
              </td>
              <td>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="receivedPhdIn2023"
                    checked={formData.receivedPhdIn2023}
                    onChange={handleInputChange}
                    className="form-check-input"
                    id="receivedPhdIn2023"
                  />
                  <label className="form-check-label" htmlFor="receivedPhdIn2023">
                    Yes
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className='rd-main-form-save-button-container'>
            <button className='rd-main-form-save-button'>Save & Continue</button>
        </div>
      </form>
      <div className='mb-5'>
        <ResearchPublications/>
        <PresentationAndFDP/>
        <FundedProjects/>
        <CertificationsUpload/>
      </div>
      <div className='aca-work-next-prev-buttons-container'>
        <button  className='aca-work-next-prev-buttons' onClick={()=>navigate("/contributions-upload")} >
          Next
        </button>
      </div>
            </div>
        </div>
    )
}
export default ResearchAndDevelopment