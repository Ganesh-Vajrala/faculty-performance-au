import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { RiNotionFill } from 'react-icons/ri';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiArrowBack } from "react-icons/bi";
import 'react-step-progress-bar/styles.css';
import './index.css';

const ContributionsForm = () => {

    const jwtToken = Cookies.get('jwt_token');
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!jwtToken) {
        navigate('/login', { replace: true });
      }
    }, [jwtToken, navigate]);
  

  const [contributions, setContributions] = useState([
    { responsibilities: '', contributions: '' },
    { responsibilities: '', contributions: '' }
  ]);
  const [textFieldValue, setTextFieldValue] = useState('');

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedContributions = [...contributions];
    updatedContributions[index][name] = value;
    setContributions(updatedContributions);
  };

  const handleAddRow = () => {
    setContributions([...contributions, { responsibilities: '', contributions: '' }]);
  };

  const handleRemoveRow = (index) => {
    const updatedContributions = contributions.filter((_, i) => i !== index);
    setContributions(updatedContributions);
  };

  const handleTextFieldValueChange = (event) => {
    setTextFieldValue(event.target.value);
  };

  return (
    <div className='home-main-container'> 
     <Header/>
    <div className="container container-wide mt-5 mb-4">
    <BiArrowBack className='form-backnavigation-button' onClick={()=>navigate("/contributions-upload")}/>
    <div className='academic-work-main-head-element-container'>
          <div className='academic-work-main-head-element-inner-container'>
              <h1 className='academic-work-main-head-element'>V. Extra Contributions</h1>
              <div className='notion-help-guide-container'>
              <a href="https://smart-crafter-843.notion.site/Anurag-University-Academic-Performance-Form-Guide-5e50ac0e13074d95be8755d86c4c4a51" target="_blank" rel="noopener noreferrer" className='notion-help-guide-link'>
             <RiNotionFill id="notion-help-guide" className='notion-help-guide'/>
              <span for="notion-help-guide" className='notion-help-guide-content'>Help Guide</span>
              </a>
              </div>
          </div>
          <p className='rd-main-heading-para'>Contribution to Society/Academic/Co-Curricular/Extra Curricular/Social Contribution/NSS/NCC</p>
        </div>
      <table className="table mt-0">
          <tr>
            <th>S.No</th>
            <th>Responsibilities assigned</th>
            <th>Contributions</th>
            <th>Actions</th>
          </tr>
        <tbody>
          {contributions.map((contribution, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  name="responsibilities"
                  value={contribution.responsibilities}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control rd-form-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="contributions"
                  value={contribution.contributions}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control rd-form-input"
                />
              </td>
              <td>
                <button
                  onClick={() => handleRemoveRow(index)}
                  className="research-publications-remove-button"
                  disabled={contributions.length === 1}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handleAddRow} className="research-publications-add-button">
          Add Row
        </button>
      </div>
      <div>
        <h3 className='academic-work-main-p2-element'>Do you wish to submit any other achievement or contribution?</h3>
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
      <p>{textFieldValue}</p>
      <div className='declaration-main-conditions-container'>
        <input
         type='checkbox'
         className='form-check-input decleration-conditions-checkbox'
         id ="declaration-form-condition-check-1"
        />
        <label for="declaration-form-condition-check-1">I hereby declare that the information provided is true and correct. I state that I have enclosed valid documentary evidence(s) for all claims.</label>
      </div>
      <div className='declaration-main-conditions-container'>
        <input
         type='checkbox'
         className='form-check-input decleration-conditions-checkbox'
         id ="declaration-form-condition-check-2"
        />
        <label for="declaration-form-condition-check-2">I understand that any willful dishonesty may render for refusal of this application or immediate penal action including termination from 
the service.
</label>
      </div>
      <div className='aca-work-next-prev-buttons-container'>
        
        <button  className='aca-work-next-prev-buttons entire-form-submit-button' onClick={()=>navigate("/")}>
          Submit Form
        </button>
      </div> 
    </div>
    </div>
    </div>
  );
};

export default ContributionsForm;
