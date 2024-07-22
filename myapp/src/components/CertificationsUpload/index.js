import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiDeleteBinLine } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { IoCloudUploadOutline } from "react-icons/io5";
import './index.css';
import axios from 'axios';
import { baseUrl } from '../../Apis';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const CertificationsUpload = ({onDataChange,validationError, validationFileError, fetchedCertifications, fetchedCertificationsUploadedFiles}) => {
  const jwtToken = Cookies.get('jwt_token');
  const selectedYear = useSelector((state) => state.selectedYear);
  const [ certifications, setCertifications] = useState(fetchedCertifications || [
    { name: '', organization: '', score: '' }
  ]);
  const [certificationsUploadedFiles, setCertificationsUploadedFiles] = useState(fetchedCertificationsUploadedFiles ||[]);

  useEffect(()=>{
    onDataChange({certifications,certificationsUploadedFiles})
  },[certifications, certificationsUploadedFiles])
  
  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newCertifications = [...certifications];
    newCertifications[index][name] = value;
    setCertifications(newCertifications);
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: '', organization: '', score: '' }]);
  };

  const removeCertification = (index) => {
    if(certifications.length > 1){
    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
    }
  };
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const uniqueFiles = selectedFiles.filter(file => !certificationsUploadedFiles.some(existingFile => (existingFile.name || existingFile.originalName) === file.name));
    setCertificationsUploadedFiles([...certificationsUploadedFiles, ...uniqueFiles]);
  };

  
  const handleDeleteFile = async (index) => {
    const fileToDelete = certificationsUploadedFiles[index];
    const { fileName } = fileToDelete; 
  
    try {
      const response = await axios.delete(`${baseUrl}/delete-research-development-file`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        data: {
          year: selectedYear,
          fileName: fileName,
          fileType: 'certificationsUploadedFiles'
        }
      });

      if (response.status === 200 || response.status === 404) {
        const newFiles = [...certificationsUploadedFiles];
        newFiles.splice(index, 1);
        setCertificationsUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
    } catch (error) {
      if(error.response.status === 404){
        const newFiles = [...certificationsUploadedFiles];
        newFiles.splice(index, 1);
        setCertificationsUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
      else
      toast.error('Failed to delete file. Please try again.');
    }
  };

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
    <div className='mt-5'>
      <h3 className='academic-work-main-p2-element'>d. Certifications from reputed Professional Bodies/NPTEL/SWAYAM/Industry/other notable certification agencies</h3>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name of the Certification</th>
            <th>Organization from which it is acquired</th>
            <th>Score / Grade</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {certifications.map((certification, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  name="name"
                  className='form-control rd-form-input'
                  value={certification.name}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="organization"
                  className='form-control rd-form-input'
                  value={certification.organization}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="score"
                  className='form-control rd-form-input'
                  value={certification.score}
                  onChange={(event) => handleChange(index, event)}
                />
              </td>
              <td>
                <button onClick={() => removeCertification(index)} className='research-publications-remove-button-icon'disabled={certifications.length <= 1}>
                <RiDeleteBinLine className='form-delete-icon'/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='error-message'>
        <p>{validationError}</p>
      </div>
      <div>
        <div className='upload-description-container'>
        <button className='research-publications-add-button' onClick={addCertification}>Add Certification</button>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          id="file-certifications-input"
          className="file-input file-upload-input"
          />
        <label htmlFor="file-certifications-input" className= {`file-input-label ${validationFileError ? 'error-border' : ''}`}
         title="Upload Files">
          <IoCloudUploadOutline  />
          <p>Choose Files</p>
        </label>
          </div>
        {certificationsUploadedFiles.length > 0 && (
          <div className="file-list">
            <p className='upload-file-container-head'>Selected Files</p>
            <ul>
              {certificationsUploadedFiles.map((file, index) => (
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
  );
}

export default CertificationsUpload;
