import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiDeleteBinLine } from "react-icons/ri";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { baseUrl } from '../../Apis';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import axios from 'axios';

const FundedProjects = ({onDataChange,validationError, validationFileError, fetchedProjects, fetchedProjectsUploadedFiles}) => {
  const jwtToken = Cookies.get('jwt_token');
  const selectedYear = useSelector((state) => state.selectedYear);
  const [projects, setProjects] = useState(fetchedProjects || [
    { title: '', agency: '', grant: '', status: '' },
    { title: '', agency: '', grant: '', status: '' },
  ]);
  const [fundedProjectsUploadedFiles, setFundedProjectsUploadedFiles] = useState(fetchedProjectsUploadedFiles || []);

  useEffect(() => {
    onDataChange({ projects, fundedProjectsUploadedFiles });
  }, [projects, fundedProjectsUploadedFiles]);

  const handleInputChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const handleAddProject = () => {
    setProjects([...projects, { title: '', agency: '', grant: '', status: '' }]);
  };

  const handleRemoveProject = (index) => {
    if (projects.length > 1) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      setProjects(updatedProjects);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const uniqueFiles = selectedFiles.filter(file => !fundedProjectsUploadedFiles.some(existingFile => (existingFile.name || existingFile.originalName) === file.name));
    setFundedProjectsUploadedFiles([...fundedProjectsUploadedFiles, ...uniqueFiles]);
  };

  
  const handleDeleteFile = async (index) => {
    const fileToDelete = fundedProjectsUploadedFiles[index];
    const { fileName } = fileToDelete; 
  
    try {
      const response = await axios.delete(`${baseUrl}/delete-research-development-file`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        data: {
          year: selectedYear,
          fileName: fileName,
          fileType: 'fundedProjectsUploadedFiles'
        }
      });

      if (response.status === 200 || response.status === 404) {
        const newFiles = [...fundedProjectsUploadedFiles];
        newFiles.splice(index, 1);
        setFundedProjectsUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
    } catch (error) {
      if(error.response.status === 404){
        const newFiles = [...fundedProjectsUploadedFiles];
        newFiles.splice(index, 1);
        setFundedProjectsUploadedFiles(newFiles);
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
    <div>
      <h3 className='academic-work-main-p2-element'>c. Sanction of funded projects and projects applied</h3>
      <table className="table ">
        <thead>
            <th>S.No</th>
            <th>Title of the funding proposal, give details</th>
            <th>Details of Funding agency</th>
            <th>Grant (in Rs.)</th>
            <th>Status (Sanctioned/Submitted)</th>
            <th>Action</th>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  name="title"
                  value={project.title}
                  onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                  className="form-control rd-form-input"
                  
                />
              </td>
              <td>
                <input
                  type="text"
                  name="agency"
                  value={project.agency}
                  onChange={(e) => handleInputChange(index, 'agency', e.target.value)}
                  className="form-control rd-form-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  name="grant"
                  value={project.grant}
                  onChange={(e) => handleInputChange(index, 'grant', e.target.value)}
                  className="form-control rd-form-input"
                />
              </td>
              <td>
                <select
                  name="status"
                  value={project.status}
                  onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Status</option>
                  <option value="Sanctioned">Sanctioned</option>
                  <option value="Submitted">Submitted</option>
                </select>
              </td>
              <td>
                <button
                  type="button"
                className='research-publications-remove-button-icon'
                  onClick={() => handleRemoveProject(index)}
                  disabled={projects.length <= 1}
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
        <button type="button"
       className='research-publications-add-button'
        onClick={handleAddProject}>
        Add Project
      </button>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          id="file-funded-input"
          className="file-input file-upload-input"
          />
        <label htmlFor="file-funded-input" className= {`file-input-label ${validationFileError ? 'error-border' : ''}`}
         title="Upload Files">
          <IoCloudUploadOutline  />
          <p>Choose Files</p>
        </label>
          </div>
        {fundedProjectsUploadedFiles.length > 0 && (
          <div className="file-list">
            <p className='upload-file-container-head'>Selected Files</p>
            <ul>
              {fundedProjectsUploadedFiles.map((file, index) => (
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
};

export default FundedProjects;
