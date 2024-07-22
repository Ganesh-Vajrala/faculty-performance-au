import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { RiNotionFill } from 'react-icons/ri';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiArrowBack } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import { IoCloudUploadOutline } from "react-icons/io5";
import {RiDeleteBinLine} from "react-icons/ri"
import 'react-step-progress-bar/styles.css';
import './index.css';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../../Apis';
import { useSelector } from 'react-redux';

const initialContributions = [
  { responsibilities: '', contributions: '', status: '' },
  { responsibilities: '', contributions: '', status: '' }
]


const ContributionsForm = () => {

    const jwtToken = Cookies.get('jwt_token');
    const navigate = useNavigate();
    const selectedYear = useSelector((state) => state.selectedYear);

  
  const [contributions, setContributions] = useState([...initialContributions]);
  const [textFieldValue, setTextFieldValue] = useState('');
  const [extraUploadedFiles, setExtraUploadedFiles] = useState([]);
  const [extraAchivementUploadedFiles, setAchivementExtraUploadedFiles] = useState([]);
  const [contributionApiScore, setContributionApiScore] = useState(0);
  const [contributionValidationError, setContributionValidationError] = useState("");
  const [contributionFileValidationError,setContributionFileValidationError] = useState(false);
  const [extraAchivementValidationError,setExtraAchivementValidationError] = useState("");
  const [extraAchivementFileValidationError,setExtraAchivementFileValidationError] = useState(false);
  const [submitClicked,setSubmitClicked]= useState(false);
  const [declarationChecked1, setDeclarationChecked1] = useState(false);
  const [declarationChecked2, setDeclarationChecked2] = useState(false);
 const [error1, setError1] = useState(false);
 const [error2, setError2] = useState(false);
  const [swalSaveAndContinue, setSwalSaveAndContinue] = useState(false);
  

const fetchContributionForm = async(year) =>{
  try{
    const response = await axios.get(`${baseUrl}/contribution/form/${year}`,{
      headers: { Authorization: `Bearer ${jwtToken}`
      }
      });
      if(response.status === 200){
        setContributions(response.data.contributions);
        setContributionApiScore(response.data.contributionApiScore);
        setTextFieldValue(response.data.textFieldValue);
        setExtraUploadedFiles(response.data.extraUploadedFiles);
        setAchivementExtraUploadedFiles(response.data.extraAchivementUploadedFiles);
    }
  }catch(error){
    throw error;
  }
}

const resetForm = () =>{
  setContributions([...initialContributions]);
  setTextFieldValue('');
  setExtraUploadedFiles([]);
  setAchivementExtraUploadedFiles([]);
  setContributionApiScore(0);
}

  useEffect(() => {
    const fetchData = async () =>{
    if (!jwtToken) {
      navigate('/login', { replace: true });
    }else if(selectedYear){
      try{
        await fetchContributionForm(selectedYear);
      }catch(error){
        console.log(error);
        resetForm();
      }
    }
  }
  fetchData();
  }, [jwtToken, navigate,selectedYear]);



  const trimFields = (data) => {
    return data.map(pub => {
      return Object.fromEntries(Object.entries(pub).map(([key, value]) => [key, value.trim()]));
    });
  };
  
  const removeEmptyRows = (data) => {
    return data.filter(pub => {
      return Object.values(pub).some(value => value.trim() !== '');
    });
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedContributions = [...contributions];
    updatedContributions[index][name] = value;
    setContributions(updatedContributions);
  };

  const handleAddRow = () => {
    setContributions([...contributions, { responsibilities: '', contributions: '', status: '' }]);
  };

  const handleRemoveRow = (index) => {
    const updatedContributions = contributions.filter((_, i) => i !== index);
    setContributions(updatedContributions);
  };

  const handleTextFieldValueChange = (event) => {
    setTextFieldValue(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const uniqueFiles = selectedFiles.filter(file => !extraUploadedFiles.some(existingFile => (existingFile.name || existingFile.originalName) === file.name));
    const newExtraFiles = [...extraUploadedFiles, ...uniqueFiles]
    setExtraUploadedFiles(newExtraFiles);
    if(newExtraFiles.length > 0){
      setContributionFileValidationError(false);
      setContributionValidationError('');
    }
    if(removeEmptyRows(trimFields(contributions)).length === 0)
      setContributionFileValidationError(false);
      setContributionValidationError("");
  };

  
  const handleDeleteFile = async (index) => {
    const fileToDelete = extraUploadedFiles[index];
    const { fileName } = fileToDelete; 
    try {
      const response = await axios.delete(`${baseUrl}/delete-contributions-form-file`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        data: {
          year: selectedYear,
          fileName: fileName,
          fileType: 'extraUploadedFiles'
        }
      });

      if (response.status === 200 || response.status === 404) {
        const newFiles = [...extraUploadedFiles];
        newFiles.splice(index, 1);
        setExtraUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
    } catch (error) {
      if(error.response.status === 404){
        const newFiles = [...extraUploadedFiles];
        newFiles.splice(index, 1);
        setExtraUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
      else
      toast.error('Failed to delete file. Please try again.');
    }
  };

  const achievementHandleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const uniqueFiles = selectedFiles.filter(file => !extraAchivementUploadedFiles.some(existingFile =>(existingFile.name || existingFile.originalName) === file.name));
    const newAchivementFiles = [...extraAchivementUploadedFiles, ...uniqueFiles]
    setAchivementExtraUploadedFiles(newAchivementFiles);
    if(newAchivementFiles.length > 0){
      setExtraAchivementFileValidationError(false);
      setExtraAchivementValidationError('');
      }
      if(textFieldValue === '')
      setExtraAchivementFileValidationError(false);
      setExtraAchivementValidationError("");

  };

  
  const achievementHandleDeleteFile = async (index) => {
    const fileToDelete = extraAchivementUploadedFiles[index];
    const { fileName } = fileToDelete; 
    try {
      const response = await axios.delete(`${baseUrl}/delete-contributions-form-file`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        data: {
          year: selectedYear,
          fileName: fileName,
          fileType: 'extraAchivementUploadedFiles'
        }
      });

      if (response.status === 200 || response.status === 404) {
         const newFiles = [...extraAchivementUploadedFiles];
    newFiles.splice(index, 1);
    setAchivementExtraUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
    } catch (error) {
      if(error.response.status === 404){
        const newFiles = [...extraAchivementUploadedFiles];
        newFiles.splice(index, 1);
        setAchivementExtraUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
      else
      toast.error('Failed to delete file. Please try again.');
    }
  };

  const calculateContributionsAPiscore = () =>{
    const validateSubFields = (contributions) => {
      for (const contribution of contributions) {
        const values = Object.values(contribution);
        const anyFieldFilled = values.some(val => val.trim() !== '');
        const allFieldsFilled = values.every(val => val.trim() !== '');
        if (anyFieldFilled && !allFieldsFilled) {
          setContributionValidationError('Please fill out all fields in Attempted row.');
          return false;
        }
      }
  
      if (contributions.length === 0) {
        return false;
      }
  
      if (contributions.length !== 0 && extraUploadedFiles.length === 0) {
        setContributionValidationError('Please upload at least one file.');
        setContributionFileValidationError(true);
        return false;
      }
  
      setContributionValidationError('');
      return true;
    };

    const InnerCalculateContributionApiScore = () =>{
      const trimmedSchoolContributions =  removeEmptyRows(contributions);
      console.log(trimmedSchoolContributions);
      let score = 0;
      for(const contribution of trimmedSchoolContributions){
        if(contribution.status === 'Ongoing')
          score += 1;
        else if(contribution.status === 'Completed')
          score += 2;
      }
      if(score > 5) score = 5;
      setContributions(trimmedSchoolContributions)
      setContributionApiScore(score);
    };
    const trimmedPublications = trimFields(contributions);
    const nonEmptyPublications = removeEmptyRows(trimmedPublications);
    if(validateSubFields(nonEmptyPublications)){
      InnerCalculateContributionApiScore();;
    }else{
      setContributionApiScore(0);
    }
  };

  const calculateExtraAchivementsApiScore = () =>{
      if(textFieldValue !== '' && extraAchivementUploadedFiles.length === 0){
        setExtraAchivementValidationError('Please upload at least one file.');
        setExtraAchivementFileValidationError(true);
      }else{
      setExtraAchivementValidationError('');
      }
  }

  const sweetAlertFunction = () =>{
    Swal.fire({
      title:"Some Fields are Not filled",
      icon:"warning",
      text:"Would you like to save your changes and proceed?",
      showCancelButton:true,
      showCloseButton:true,
      confirmButtonText:"Save and Next",
      cancelButtonText:"Cancel",
      confirmButtonColor: "#1c5fe6",
      willOpen: () => {
        const icon = document.querySelector('.swal2-icon');
        const title = document.querySelector('.swal2-title');
        const text = document.querySelector('.swal2-text');
        const confirmButton = document.querySelector('.swal2-confirm');
        const cancelButton = document.querySelector('.swal2-cancel');
        if (icon) {
          icon.style.fontSize = '1em'; 
        }
        if (title) {
          title.style.fontSize = '22px'; 
        }
        if (text) {
          text.style.fontSize = '18px'; 
        }
        if(confirmButton){
          confirmButton.style.fontSize="14px";
        }
        if(cancelButton){
          cancelButton.style.fontSize="14px";
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setSwalSaveAndContinue(true); 
      }
    });
  }
  

  useEffect(()=>{
    const handleSubmit = async () =>{
      if(submitClicked &&(
        contributionValidationError !== '' ||
        contributionFileValidationError||
        extraAchivementValidationError !== '' ||
        extraAchivementFileValidationError
      )){
        toast.warning("Please complete all the attempted fields and upload the corresponding files for each field.");
      }else if(submitClicked && (!declarationChecked1 || !declarationChecked2) ){
        toast.warning("Please check the declaration checkbox for each field.");
        if(!declarationChecked1)
          setError1(true);
        if(!declarationChecked2)
          setError2(true);
      }else if(submitClicked){
        console.log(removeEmptyRows(trimFields(contributions)).length)
        if(removeEmptyRows(trimFields(contributions)).length === 0 || textFieldValue === ''){
          sweetAlertFunction();
        }else{
          setSwalSaveAndContinue(true);
        }
      }

      if(swalSaveAndContinue){
        const formData = new FormData();
        formData.append('year', selectedYear);
        formData.append('contributions',JSON.stringify(contributions))
        extraUploadedFiles.forEach((file,index)=>{
          formData.append(`extraUploadedFiles`,file);
        })
        formData.append('contributionApiScore',contributionApiScore)
        formData.append("textFieldValue",textFieldValue);
        extraAchivementUploadedFiles.forEach((file, index)=>{
          formData.append(`extraAchivementUploadedFiles`,file);
        })
        formData.append('declarationChecked1',declarationChecked1);
        formData.append('declarationChecked2',declarationChecked2);
        try{
          await axios.post(`${baseUrl}/save-contributions-form`, formData,{
            headers:{
              Authorization:  `Bearer ${jwtToken}`,
              'Content-Type': 'multipart/form-data',
            }
          });
          navigate('/');
          toast.success('Contributions Saved successfully');
        }catch(error){
        console.log(error);
        toast.error('Failed to save contributions. Please try again.');
        }
        setSwalSaveAndContinue(false);
      }

      setSubmitClicked(false);
    }
    handleSubmit();
  }, [contributionFileValidationError,contributionValidationError,contributions,declarationChecked1,declarationChecked2,extraAchivementFileValidationError,extraAchivementValidationError,submitClicked,swalSaveAndContinue,textFieldValue])

  const contributionsFormSubmit = async () =>{
    await Promise.all([
    calculateContributionsAPiscore(),
    calculateExtraAchivementsApiScore(),
  ]).then(() => {
    setSubmitClicked(true);
  });
  }

  const handleCheckboxChange = (index, event) => {
    const { checked } = event.target;
    if (index === 1) {
        setDeclarationChecked1(checked);
    } else if (index === 2) {
        setDeclarationChecked2(checked);
    }
};

const handleFileClick = (file) => {
  const { fileName } = file; 
  console.log("asdlfknasodfkn",file)
  if (fileName) {
    window.open(`${baseUrl}/uploads/${fileName}`, '_blank');
  } else {
    toast.error('File Preview not available.');
  }
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
      <table className="table mt-0 mb-0">
          <tr>
            <th>S.No</th>
            <th>Responsibilities assigned</th>
            <th>Contributions</th>
            <th>Status</th>
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
                <select
                  name="status"
                  value={contribution.status}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control"
                >
                  <option value="">Select Status</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => handleRemoveRow(index)}
                  className="research-publications-remove-button-icon"
                  disabled={contributions.length <= 1}
                >
                  <RiDeleteBinLine className='form-delete-icon'/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='error-message mt-0'>
        <p>{contributionValidationError}</p>
      </div>
      <div >
        <div>
        <div className='upload-description-container'>
        <button onClick={handleAddRow} className="research-publications-add-button">
          Add Row
        </button>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          id="file-extra-input"
          className="file-input file-upload-input"
          />
        <label htmlFor="file-extra-input" className="file-input-label" title="Upload Files">
          <IoCloudUploadOutline  />
          <p>Choose Files</p>
        </label>
          </div>
        {extraUploadedFiles.length > 0 && (
          <div className="file-list">
            <p className='upload-file-container-head'>Selected Files</p>
            <ul>
              {extraUploadedFiles.map((file, index) => (
                <li key={index}>
                  <span className="filename"
                  onClick={() => handleFileClick(file)}
                  style={{ cursor: 'pointer' }}
                  title={file.originalName?file.originalName:file.name}>{file.originalName?file.originalName:file.name}</span>
                  <button onClick={() => handleDeleteFile(index)}><RxCross1 />  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
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
      <div className='error-message'>
        <p>{extraAchivementValidationError}</p>
      </div>
      <div>
        <div className='upload-description-container'>
          <p className='rd-main-heading-para pb-0 mb-0'>Submit the documentary evidences for your claims</p>
        <input
          type="file"
          multiple
          onChange={achievementHandleFileChange}
          id="file-achivement-input"
          className="file-input file-upload-input"
          />
         
        <label htmlFor="file-achivement-input" className="file-input-label" title="Upload Files">
          <IoCloudUploadOutline  />
          <p>Choose Files</p>
        </label>
          </div>
        {extraAchivementUploadedFiles.length > 0 && (
          <div className="file-list">
            <p className='upload-file-container-head'>Selected Files</p>
            <ul>
              {extraAchivementUploadedFiles.map((file, index) => (
                <li key={index}>
                  <span className="filename"
                  onClick={() => handleFileClick(file)} 
                  style={{ cursor: 'pointer' }}
                  title={file.originalName?file.originalName:file.name}>{file.originalName?file.originalName:file.name}</span>
                  <button onClick={() => achievementHandleDeleteFile(index)}><RxCross1 />  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className='declaration-main-conditions-container mt-3'>
        <input
         type='checkbox'
         className={`form-check-input decleration-conditions-checkbox ${error1?"error-border":""}`}
         id ="declaration-form-condition-check-1"
         checked={declarationChecked1}
         onChange={(e) => handleCheckboxChange(1, e)}
        />
        <label for="declaration-form-condition-check-1">I hereby declare that the information provided is true and correct. I state that I have enclosed valid documentary evidence(s) for all claims.</label>
      </div>
      <div className='declaration-main-conditions-container'>
        <input
         type='checkbox'
         className={`form-check-input decleration-conditions-checkbox ${error2?"error-border":""}`}
         id ="declaration-form-condition-check-2"
         checked={declarationChecked2}
         onChange={(e) => handleCheckboxChange(2, e)}
        />
        <label for="declaration-form-condition-check-2">I understand that any willful dishonesty may render for refusal of this application or immediate penal action including termination from 
the service.
</label>
      </div>
      <div className='aca-work-next-prev-buttons-container'>
        
        <button  className='aca-work-next-prev-buttons entire-form-submit-button' onClick={contributionsFormSubmit}>
          Submit Form
        </button>
      </div> 
    </div>
    </div>
    </div>
  );
};

export default ContributionsForm;
