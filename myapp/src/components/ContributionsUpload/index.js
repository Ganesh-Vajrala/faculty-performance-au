import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { RiNotionFill } from 'react-icons/ri';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-step-progress-bar/styles.css';
import { BiArrowBack } from "react-icons/bi";
import './index.css';

const ContributionsUpload = () => {
    const jwtToken = Cookies.get('jwt_token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwtToken) {
      navigate('/login', { replace: true });
    }
  }, [jwtToken, navigate]);

  const [schoolContributions, setSchoolContributions] = useState([
    { activity: '', contribution: '' },
    { activity: '', contribution: '' },
  ]);

  const [departmentContributions, setDepartmentContributions] = useState([
    { activity: '', contribution: '' },
    { activity: '', contribution: '' },
  ]);

  const handleSchoolChange = (index, event) => {
    const { name, value } = event.target;
    const newContributions = [...schoolContributions];
    newContributions[index][name] = value;
    setSchoolContributions(newContributions);
  };

  const handleDepartmentChange = (index, event) => {
    const { name, value } = event.target;
    const newContributions = [...departmentContributions];
    newContributions[index][name] = value;
    setDepartmentContributions(newContributions);
  };

  const addSchoolContribution = () => {
    setSchoolContributions([...schoolContributions, { activity: '', contribution: '' }]);
  };

  const addDepartmentContribution = () => {
    setDepartmentContributions([...departmentContributions, { activity: '', contribution: '' }]);
  };

  const removeSchoolContribution = (index) => {
    if (schoolContributions.length > 1) {
      const newContributions = schoolContributions.filter((_, i) => i !== index);
      setSchoolContributions(newContributions);
    }
  };

  const removeDepartmentContribution = (index) => {
    if (departmentContributions.length > 1) {
      const newContributions = departmentContributions.filter((_, i) => i !== index);
      setDepartmentContributions(newContributions);
    }
  };

  return (
    <div className='home-main-container'>
        <Header/>
    <div className="container container-wide mt-5 mb-4">
    <BiArrowBack className='form-backnavigation-button' onClick={()=>navigate("/research-development")}/>
    <div className='academic-work-main-head-element-container'>
          <div className='academic-work-main-head-element-inner-container'>
              <h1 className='academic-work-main-head-element'>III. Contribution to the School / University</h1>
              <div className='notion-help-guide-container'>
              <a href="https://smart-crafter-843.notion.site/Anurag-University-Academic-Performance-Form-Guide-5e50ac0e13074d95be8755d86c4c4a51" target="_blank" rel="noopener noreferrer" className='notion-help-guide-link'>
             <RiNotionFill id="notion-help-guide" className='notion-help-guide'/>
              <span for="notion-help-guide" className='notion-help-guide-content'>Help Guide</span>
              </a>
              </div>
          </div>
          <p className='rd-main-heading-para'>All the responsibilities assigned by the authorities of the university to the candidate during academic year under 
              consideration through a proper office order</p>
        </div>
      <table className="table mt-0">
        <thead>
            <th>S.No</th>
            <th>Name of the Responsibility / Activity organized</th>
            <th>Contribution(s)</th>
            <th>Action</th>
        </thead>
        <tbody>
          {schoolContributions.map((contribution, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  name="activity"
                  className="form-control rd-form-input"
                  value={contribution.activity}
                  onChange={(event) => handleSchoolChange(index, event)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="contribution"
                  className="form-control rd-form-input"
                  value={contribution.contribution}
                  onChange={(event) => handleSchoolChange(index, event)}
                />
              </td>
              <td>
                <button 
                  onClick={() => removeSchoolContribution(index)} 
                  className="research-publications-remove-button"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className='research-publications-add-button mt-0 mb-0' onClick={addSchoolContribution}>Add Contribution</button>
      <div className='academic-work-main-head-element-container mt-3'>
          <div className='academic-work-main-head-element-inner-container'>
              <h1 className='academic-work-main-head-element'>IV. Contribution to the Department</h1>
              <div className='notion-help-guide-container'>
              <a href="https://smart-crafter-843.notion.site/Anurag-University-Academic-Performance-Form-Guide-5e50ac0e13074d95be8755d86c4c4a51" target="_blank" rel="noopener noreferrer" className='notion-help-guide-link'>
             <RiNotionFill id="notion-help-guide" className='notion-help-guide'/>
              <span for="notion-help-guide" className='notion-help-guide-content'>Help Guide</span>
              </a>
              </div>
          </div>
          
        </div>
      <table className="table mt-0">
        <thead>
            <th>S.No</th>
            <th>Name of the Responsibility / Activity organized</th>
            <th>Contribution(s)</th>
            <th>Action</th>
        </thead>
        <tbody>
          {departmentContributions.map((contribution, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  name="activity"
                  className="form-control rd-form-input"
                  value={contribution.activity}
                  onChange={(event) => handleDepartmentChange(index, event)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="contribution"
                  className="form-control rd-form-input"
                  value={contribution.contribution}
                  onChange={(event) => handleDepartmentChange(index, event)}
                />
              </td>
              <td>
                <button 
                  onClick={() => removeDepartmentContribution(index)} 
                  className="research-publications-remove-button"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className='research-publications-add-button' onClick={addDepartmentContribution}>Add Contribution</button>
      <div className='aca-work-next-prev-buttons-container mt-0'>
        <button  className='aca-work-next-prev-buttons' onClick={()=>navigate("/contributions-form-extra")}>
          Next
        </button>
      </div>
    </div>
    </div>
  );
}
export default ContributionsUpload;
