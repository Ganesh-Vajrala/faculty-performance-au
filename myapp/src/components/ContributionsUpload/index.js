import React, { useEffect, useState, } from 'react';
import Cookies from 'js-cookie';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { RiNotionFill } from 'react-icons/ri';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-step-progress-bar/styles.css';
import { BiArrowBack } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import './index.css';
import {useSelector } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../../Apis';

const initialSchoolContributions = [
  { activity: '', contribution: '' },
    { activity: '', contribution: '' },
];

const initialDepartmentContributions =[
  { activity: '', contribution: '' },
    { activity: '', contribution: '' },
]

const ContributionsUpload = () => {
    const jwtToken = Cookies.get('jwt_token');
  const navigate = useNavigate();
  const selectedYear = useSelector((state) => state.selectedYear);

  
  const [schoolContributions, setSchoolContributions] = useState([...initialSchoolContributions]);
  const [departmentContributions, setDepartmentContributions] = useState([...initialDepartmentContributions]);
  const [schoolUploadedFiles, setSchoolUploadedFiles] = useState([]);
  const [departmentUploadedFiles, setDepartmentUploadedFiles] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [contributionSchoolApiScore,setContributionSchoolApiScore] = useState(0);
  const [contributionSchoolValidationError,setContributionSchoolValidationError] = useState('');
  const [contributionDepartmentApiScore,setContributionDepartmentApiScore] = useState(0);
  const [contributionDepartmentValidationError,setContributionDepartmentValidationError] = useState('');
  const [contributionSchoolFileValidationError, setContributionSchoolFileValidationError] = useState(false);
  const [contributionDepartmentFileValidationError, setContributionDepartmentFileValidationError] = useState(false);
  const [swalSaveAndContinue, setSwalSaveAndContinue] = useState(false);
  

  const fetchContributionUpload = async(year) =>{
    try{
      const response = await axios.get(`${baseUrl}/contribution/upload/${year}`, {
        headers: { Authorization: `Bearer ${jwtToken}`
        }
        });
        if(response.status === 200){
          setSchoolContributions(response.data.schoolContributions);
          setDepartmentContributions(response.data.departmentContributions);
          setSchoolUploadedFiles(response.data.schoolUploadedFiles);
          setDepartmentUploadedFiles(response.data.departmentUploadedFiles);
          setContributionSchoolApiScore(response.data.contributionSchoolApiScore);
          setContributionDepartmentApiScore(response.data.contributionDepartmentApiScore);
        } 
    }catch(error){
      throw error;
    }
  }


  const resetForm = () =>{
    setSchoolContributions([...initialSchoolContributions]);
    setDepartmentContributions([...initialDepartmentContributions]);
    setSchoolUploadedFiles([]);
    setDepartmentUploadedFiles([]);
    setContributionDepartmentApiScore(0);
    setContributionSchoolApiScore(0);
  };

  useEffect(() => {
    const fetchData = async () =>{
      if (!jwtToken) {
      navigate('/login', { replace: true });
    }else if(selectedYear){
      try{
        await fetchContributionUpload(selectedYear);
      }catch(error){
        console.error("Error fetching");
        resetForm();
      }
    }else{
      resetForm();
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
  
  const schoolHandleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
  
    const uniqueFiles = selectedFiles.filter(file => !schoolUploadedFiles.some(existingFile => (existingFile.name || existingFile.originalName) === file.name));
    const newSchoolUploadedFiles = [...schoolUploadedFiles, ...uniqueFiles]
    setSchoolUploadedFiles(newSchoolUploadedFiles);
    if(newSchoolUploadedFiles.length > 0){
      setContributionSchoolFileValidationError(false);
      setContributionSchoolValidationError('');
    }
    if(removeEmptyRows(trimFields(schoolContributions)).length === 0)
      setContributionSchoolFileValidationError(false);
      setContributionSchoolValidationError("");
  };
  
  const schoolHandleDeleteFile = async (index) => {
    const fileToDelete = schoolUploadedFiles[index];
    const { fileName } = fileToDelete; 
    try {
      const response = await axios.delete(`${baseUrl}/delete-contributions-uploaded-file`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        data: {
          year: selectedYear,
          fileName: fileName,
          fileType: 'schoolUploadedFiles'
        }
      });

      if (response.status === 200 || response.status === 404) {
        const newFiles = [...schoolUploadedFiles];
        newFiles.splice(index, 1);
        setSchoolUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
    } catch (error) {
      if(error.response.status === 404){
        const newFiles = [...schoolUploadedFiles];
        newFiles.splice(index, 1);
        setSchoolUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
      else
      toast.error('Failed to delete file. Please try again.');
    }
  };

  const departmentHandleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const uniqueFiles = selectedFiles.filter(file =>!departmentUploadedFiles.some(existingFile => (existingFile.name || existingFile.originalName) === file.name));
    const newDepartmentUploadedFiles = [...departmentUploadedFiles,...uniqueFiles];
    setDepartmentUploadedFiles(newDepartmentUploadedFiles);
    if(newDepartmentUploadedFiles.length > 0){
      setContributionDepartmentFileValidationError(false);
      setContributionDepartmentValidationError("");
    }
    if(removeEmptyRows(trimFields(departmentContributions)).length === 0)
      setContributionDepartmentFileValidationError(false);
      setContributionDepartmentValidationError("");
  };

  
  const departmentHandleDeleteFile = async (index) => {
    const fileToDelete = departmentUploadedFiles[index];
    const { fileName } = fileToDelete; 
  
    try {
      const response = await axios.delete(`${baseUrl}/delete-contributions-uploaded-file`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        data: {
          year: selectedYear,
          fileName: fileName,
          fileType: 'departmentUploadedFiles'
        }
      });

      if (response.status === 200 || response.status === 404) {
        const newFiles = [...departmentUploadedFiles];
        newFiles.splice(index, 1);
        setDepartmentUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
    } catch (error) {
      if(error.response.status === 404){
        const newFiles = [...departmentUploadedFiles];
        newFiles.splice(index, 1);
        setDepartmentUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
      else
      toast.error('Failed to delete file. Please try again.');
    }
  };


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

  

    const calculateContributionSchoolApiScore = () =>{
      const validateSubFields = (contributions) => {
        for (const contribution of contributions) {
          const values = Object.values(contribution);
          const anyFieldFilled = values.some(val => val.trim() !== '');
          const allFieldsFilled = values.every(val => val.trim() !== '');
          if (anyFieldFilled && !allFieldsFilled) {
            setContributionSchoolValidationError('Please fill out all fields in Attempted row.');
            return false;
          }
        }
    
        if (contributions.length === 0) {
          return false;
        }
    
        if (contributions.length !== 0 && schoolUploadedFiles.length === 0) {
          setContributionSchoolValidationError('Please upload at least one file.');
          setContributionSchoolFileValidationError(true);
          return false;
        }
    
        setContributionSchoolValidationError('');
        return true;
      };

      const InnerCalculateContributionSchoolApiScore = () =>{
        const trimmedSchoolContributions =  removeEmptyRows(schoolContributions);
        console.log(trimmedSchoolContributions);
        let score = 0;
        for(const _ of trimmedSchoolContributions){
          score += 2.5;
        }
        if(score > 5) score = 5;
        setSchoolContributions(trimmedSchoolContributions)
        setContributionSchoolApiScore(score);
      };
      const trimmedPublications = trimFields(schoolContributions);
      const nonEmptyPublications = removeEmptyRows(trimmedPublications);
      if(validateSubFields(nonEmptyPublications)){
        InnerCalculateContributionSchoolApiScore();;
      }else{
        setContributionSchoolApiScore(0);
      }
  }

const calculateContributionDepartmentApiScore = () =>{
  const validateSubFields = (contributions) => {
    for (const contribution of contributions) {
      const values = Object.values(contribution);
      const anyFieldFilled = values.some(val => val.trim() !== '');
      const allFieldsFilled = values.every(val => val.trim() !== '');
      if (anyFieldFilled && !allFieldsFilled) {
        setContributionDepartmentValidationError('Please fill out all fields in Attempted row.');
        return false;
      }
    }

    if (contributions.length === 0) {
      return false;
    }

    if (contributions.length !== 0 && departmentUploadedFiles.length === 0) {
      setContributionDepartmentValidationError('Please upload at least one file.');
      setContributionDepartmentFileValidationError(true);
      return false;
    }

    setContributionDepartmentValidationError('');
    return true;
  };

  const InnerCalculateContributionDepartmentApiScore = () =>{
    const trimmedDepartmentContributions =  removeEmptyRows(departmentContributions);
    let score = 0;
    for(const _ of trimmedDepartmentContributions){
      score += 2;
    }
    if(score > 5) score = 5;
    setDepartmentContributions(trimmedDepartmentContributions);
    setContributionDepartmentApiScore(score);
  };
  const trimmedPublications = trimFields(departmentContributions);
      const nonEmptyPublications = removeEmptyRows(trimmedPublications);
  if(validateSubFields(nonEmptyPublications)){
    InnerCalculateContributionDepartmentApiScore();;
  }else{
    setContributionDepartmentApiScore(0);
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
      contributionDepartmentValidationError !== '' ||
      contributionDepartmentFileValidationError ||
      contributionSchoolValidationError !== '' ||
      contributionSchoolFileValidationError
    )){
      console.log(departmentUploadedFiles,contributionDepartmentFileValidationError,contributionSchoolFileValidationError)
      toast.warning("Please complete all the attempted fields and upload the corresponding files for each field.");
    }else if(submitClicked){
      if(removeEmptyRows(trimFields(schoolContributions)).length === 0 || removeEmptyRows(trimFields(departmentContributions)).length === 0){
        sweetAlertFunction();
      }else{
        setSwalSaveAndContinue(true);
      }
    }
    
    if(swalSaveAndContinue){
      const formData = new FormData();
      formData.append('year', selectedYear);
      formData.append('schoolContributions', JSON.stringify(schoolContributions));
      formData.append('departmentContributions', JSON.stringify(departmentContributions));
      schoolUploadedFiles.forEach((file, index) => {
        formData.append(`schoolUploadedFiles`, file);
      });
      departmentUploadedFiles.forEach((file, index) => {
        formData.append(`departmentUploadedFiles`, file);
        });
      formData.append('contributionSchoolApiScore',contributionSchoolApiScore);
      formData.append('contributionDepartmentApiScore',contributionDepartmentApiScore);
      try{
      await axios.post(`${baseUrl}/save-contributions-upload`, formData,{
        headers: {
          Authorization:  `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      navigate('/contributions-form-extra');
      toast.success('Contributions Saved successfully');
      }catch(error){
        console.log(error);
        toast.error('Failed to save contributions. Please try again.');
      }
      setSwalSaveAndContinue(false);
    }
    setSubmitClicked(false);
  };
  handleSubmit();
},[contributionDepartmentFileValidationError, contributionDepartmentValidationError, contributionSchoolFileValidationError, contributionSchoolValidationError, departmentContributions, schoolContributions, submitClicked, contributionDepartmentApiScore,contributionSchoolApiScore, departmentUploadedFiles, schoolUploadedFiles, jwtToken,selectedYear])

  const ContributionSubmitForm = async () =>{
    await Promise.all([
    calculateContributionSchoolApiScore(),
    calculateContributionDepartmentApiScore(),
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
    <div className='home-main-container'>
        <Header/>
    <div className="container container-wide mt-5 mb-2">
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
      <table className="table mt-0 mb-0 pb-0">
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
                  className="research-publications-remove-button-icon" disabled={schoolContributions.length <= 1}
                >
                  <RiDeleteBinLine className='form-delete-icon'/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='error-message'>
        <p>{contributionSchoolValidationError}</p>
      </div>
      <div className='mt-0 pt-0 margin-setting'>
        <div className='upload-description-container mt-0 pt-0'>
          <button className='research-publications-add-button mt-0 mb-0' onClick={addSchoolContribution}>Add Contribution</button>
        <input
          type="file"
          multiple
          onChange={schoolHandleFileChange}
          id="file-school-input"
          className="file-input file-upload-input"
          />
        <label htmlFor="file-school-input" className="file-input-label" title="Upload Files">
          <IoCloudUploadOutline  />
          <p>Choose Files</p>
        </label>
          </div>
        {schoolUploadedFiles.length > 0 && (
          <div className="file-list">
            <p className='upload-file-container-head'>Selected Files</p>
            <ul>
              {schoolUploadedFiles.map((file, index) => (
                <li key={index}>
                  <span className="filename"
                   onClick={() => handleFileClick(file)}
                   style={{ cursor: 'pointer' }}
                  title={file.originalName?file.originalName:file.name}>{file.originalName?file.originalName:file.name}</span>
                  <button onClick={() => schoolHandleDeleteFile(index)}><RxCross1 />  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
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
      <table className="table mt-0 mb-0">
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
                  className="research-publications-remove-button-icon" disabled={departmentContributions.length <= 1}
                >
                  <RiDeleteBinLine className='form-delete-icon'/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='error-message'>
        <p>{contributionDepartmentValidationError}</p>
      </div>
      <div className='mt-0  margin-setting'>
        <div className='upload-description-container'>
      <button className='research-publications-add-button' onClick={addDepartmentContribution}>Add Contribution</button>
        <input
          type="file"
          multiple
          onChange={departmentHandleFileChange}
          id="file-department-input"
          className="file-input file-upload-input"
          />
        <label htmlFor="file-department-input" className="file-input-label" title="Upload Files">
          <IoCloudUploadOutline  />
          <p>Choose Files</p>
        </label>
          </div>
        {departmentUploadedFiles.length > 0 && (
          <div className="file-list">
            <p className='upload-file-container-head'>Selected Files</p>
            <ul>
              {departmentUploadedFiles.map((file, index) => (
                <li key={index}>
                  <span className="filename"
                   onClick={() => handleFileClick(file)}
                   style={{ cursor: 'pointer' }}
                  title={file.originalName?file.originalName:file.name}>{file.originalName?file.originalName:file.name}</span>
                  <button onClick={() => departmentHandleDeleteFile(index)}><RxCross1 />  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className='aca-work-next-prev-buttons-container mt-0'>
        <button  className='aca-work-next-prev-buttons' onClick={ContributionSubmitForm}>
          Next
        </button>
      </div>
    </div>
    </div>
  );
}
export default ContributionsUpload;
