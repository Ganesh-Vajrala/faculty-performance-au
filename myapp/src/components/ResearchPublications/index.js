import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiDeleteBinLine } from "react-icons/ri";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import './index.css'
import { BiUpload } from 'react-icons/bi';
import axios from 'axios';
import { baseUrl } from '../../Apis';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';


const ResearchPublications = ({onDataChange, validationError, validationFileError,fetchedPublications,fetchedResearchUploadedFiles }) => {
  const selectedYear = useSelector((state) => state.selectedYear);
  const jwtToken = Cookies.get('jwt_token');
  const [publications, setPublications] = useState(
    fetchedPublications?.map((publication) => ({
      ...publication,
      date: publication.date.split("T")[0],
    })) || [
      { title: '', journal: '', indexedIn: '', date: '', authorRole: '' },
      { title: '', journal: '', indexedIn: '', date: '', authorRole: '' },
    ]
  );
  const [researchUploadedFiles, setResearchUploadedFiles] = useState(fetchedResearchUploadedFiles ||[]);

  useEffect(() => {
    onDataChange({ publications, researchUploadedFiles });
  }, [publications, researchUploadedFiles]);

  const trimFields = (data) => {
    const trimmedData = data ? data.map(pub => {
      return Object.fromEntries(Object.entries(pub).map(([key, value]) => [key, value.trim()]));
    }) : [];
    return trimmedData;
  };
  
  const removeEmptyRows = (data) => {
    const nonEmptyData = data ? data.filter(pub => {
      return Object.values(pub).some(value => value.trim() !== '');
    }) : [];
    return nonEmptyData;
  };

  const trimmedPublications = trimFields(publications);
  const nonEmptyPublications = removeEmptyRows(trimmedPublications);

  const handleInputChange = (index, field, value) => {
    const updatedPublications = [...publications];
    updatedPublications[index][field] = value;
    setPublications(updatedPublications);
  };

  const handleAddPublication = () => {
    setPublications([...publications, { title: '', journal: '', indexedIn: '', date: '', authorRole: '' }]);
  };

  const handleRemovePublication = (index) => {
    if (publications.length > 1) {
      const updatedPublications = publications.filter((_, i) => i !== index);
      setPublications(updatedPublications);
    }
  };

  const researchHandleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const uniqueFiles = selectedFiles.filter(file => !researchUploadedFiles.some(existingFile => (existingFile.name || existingFile.originalName) === file.name));
    setResearchUploadedFiles([...researchUploadedFiles, ...uniqueFiles]);
  };

  
  const researchHandleDeleteFile = async (index) => {
    const fileToDelete = researchUploadedFiles[index];
    const { fileName } = fileToDelete;
    try{
      const response = await axios.delete(`${baseUrl}/delete-research-development-file`,{
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        data : {
          year:selectedYear,
          fileName: fileName,
          fileType: 'researchUploadedFiles'
        }
      });
      if (response.status === 200 || response.status === 404) {
        const newFiles = [...researchUploadedFiles];
        newFiles.splice(index, 1);
        setResearchUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
    }catch (error){
      if(error.response.status === 404){
        const newFiles = [...researchUploadedFiles];
        newFiles.splice(index, 1);
        setResearchUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
      else
      toast.error('Failed to delete file. Please try again.');
    }
  };

  const indexedInOptions = [
    { value: '', label: 'Select' },
    { value: 'WoS', label: 'WoS' },
    { value: 'Scopus', label: 'Scopus' },
    { value: 'UGC approved', label: 'UGC approved' }
  ];

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
    <div className='mb-4'>
      <h3 className='academic-work-main-p1-element mb-2'>a. Details of Research Publications</h3>
      <table className="table">          
        <thead>
              <th>S.No</th>
              <th>Article title</th>
              <th>Journal  name with ISSN/ISBN No.</th>
              <th>Indexed in? (WoS, Scopus, UGC approved)</th>
              <th>Date of Publication</th>
              <th>Whether you are the 1.st or corresponding author?</th>
              <th>Action</th>
          </thead>
        <tbody>
          {publications.map((publication, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  name="title"
                  value={publication.title}
                  onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                  className="form-control rd-form-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="journal"
                  value={publication.journal}
                  onChange={(e) => handleInputChange(index, 'journal', e.target.value)}
                  className="form-control rd-form-input"
                />
              </td>
              <td>
                <select
                  name="indexedIn"
                  value={publication.indexedIn}
                  onChange={(e) => handleInputChange(index, 'indexedIn', e.target.value)}
                  className="form-control rd-form-input"
                >
                  {indexedInOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="date"
                  name="date"
                  value={publication.date}
                  onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                  className="form-control rd-form-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="authorRole"
                  value={publication.authorRole}
                  onChange={(e) => handleInputChange(index, 'authorRole', e.target.value)}
                  className="form-control rd-form-input"
                />
              </td>
              <td>
                <button
                  type="button"
                  className='research-publications-remove-button-icon'
                  onClick={() => handleRemovePublication(index)}
                  disabled={publications.length <= 1}
                >
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
      <button type="button" className='research-publications-add-button' onClick={handleAddPublication}>
        Add Publication
      </button>
        <input
          type="file"
          multiple
          onChange={researchHandleFileChange}
          id="file-research-input"
          className="file-input file-upload-input"
          />
        <label htmlFor="file-research-input" className={`file-input-label ${nonEmptyPublications.length === 0 ? 'disabled' : ''} ${validationFileError ? 'error-border' : ''}`}
        title="Upload Files">
          <IoCloudUploadOutline  />
          <p>Choose Files</p>
        </label>
          </div >
        {researchUploadedFiles.length > 0 && (
          <div className="file-list">
            <p className='upload-file-container-head'>Selected Files</p>
            <ul>
              {researchUploadedFiles.map((file, index) => (
                <li key={index}>
                  <span className="filename"
                   onClick={() => handleFileClick(file)}
                   style={{ cursor: 'pointer' }}
                    title={file.originalName?file.originalName:file.name}>{file.originalName?file.originalName:file.name}</span>
                  <button onClick={() => researchHandleDeleteFile(index)}><RxCross1 />  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchPublications;
