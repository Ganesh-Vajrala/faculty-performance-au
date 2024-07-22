import React, { useState, useEffect } from 'react';
import { RiDeleteBinLine } from "react-icons/ri";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import axios from 'axios';
import { baseUrl } from '../../Apis';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

const PresentationAndFDP = ({onDataChange, validationError, validationFileError, fetchedPresentations, fetchedPresentationUploadedFiles}) => {
  const jwtToken = Cookies.get('jwt_token');
  const selectedYear = useSelector((state) => state.selectedYear);
  
  const [presentations, setPresentations] = useState(fetchedPresentations ||[{
      paperTitle: '',
      conferenceTitle: '',
      organizedBy: '',
      indexedIn: '',
      daysIndexed: '',
    }
  ]);
  const [presentationUploadedFiles, setPresentationUploadedFiles] = useState(fetchedPresentationUploadedFiles || []);
  
  useEffect(() => {
    console.log(presentations)
    onDataChange({ presentations, presentationUploadedFiles });
  }, [presentations, presentationUploadedFiles]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedPresentations = [...presentations];
    updatedPresentations[index] = {
      ...updatedPresentations[index],
      [name]: value
    };
    setPresentations(updatedPresentations);
  };

  const handleIndexedInChange = (index, event) => {
    const { value } = event.target;
    const updatedPresentations = [...presentations];
    updatedPresentations[index] = {
      ...updatedPresentations[index],
      indexedIn: value
    };
    setPresentations(updatedPresentations);
  };

  const handleAddPresentation = () => {setPresentations([...presentations, {
      paperTitle: '',
      conferenceTitle: '',
      organizedBy: '',
      indexedIn: '',
      daysIndexed: '',
    }]);
  };

  const handleRemovePresentation = (index) => {
    if (presentations.length > 1) {
    const updatedPresentations = presentations.filter((_, i) => i !== index);
    setPresentations(updatedPresentations);
    }
  };

  const presentationHandleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const uniqueFiles = selectedFiles.filter(file => !presentationUploadedFiles.some(existingFile => (existingFile.name || existingFile.originalName) === file.name));
    setPresentationUploadedFiles([...presentationUploadedFiles, ...uniqueFiles]);
  };

  
  const presentationHandleDeleteFile = async (index) => {
    const fileToDelete = presentationUploadedFiles[index];
    const { fileName } = fileToDelete; 
  
    try {
      const response = await axios.delete(`${baseUrl}/delete-research-development-file`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        data: {
          year: selectedYear,
          fileName: fileName,
          fileType: 'presentationAndFDPUplodedFiles'
        }
      });

      if (response.status === 200 || response.status === 404) {
        const newFiles = [...presentationUploadedFiles];
        newFiles.splice(index, 1);
        setPresentationUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
    } catch (error) {
      if(error.response.status === 404){
        const newFiles = [...presentationUploadedFiles];
        newFiles.splice(index, 1);
        setPresentationUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
      else
      toast.error('Failed to delete file. Please try again.');
    }
    const newFiles = [...presentationUploadedFiles];
    newFiles.splice(index, 1);
    setPresentationUploadedFiles(newFiles);
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
    <div className="mb-5 mt-5">
      <h3 className='academic-work-main-p2-element'>b. Presentation in International Conference/Symposia or Attended FDP/STTP</h3>
      <table className="table">
        <thead>
            <th>SNO</th>
            <th>Title of the paper presented</th>
            <th>Title / Theme of Conference/Symposia/FDP/STTP</th>
            <th>Organized by</th>
            <th>Indexed in? (WoS/Scopus)</th>
            <th>No. of days indexed in</th>
            <th>Action</th>
        </thead>
        <tbody>
          {presentations.map((presentation, index) => (
            <tr key={index}>
              <td>
               {index + 1}
              </td>
              <td>
                <input type="text" name="paperTitle"  value={presentation.paperTitle} onChange={(e) => handleInputChange(index, e)} className="form-control rd-form-input" />
              </td>
              <td>
                <input type="text" name="conferenceTitle" value={presentation.conferenceTitle} onChange={(e) => handleInputChange(index, e)} className="form-control rd-form-input" />
              </td>
              <td>
                <input type="text" name="organizedBy" value={presentation.organizedBy} onChange={(e) => handleInputChange(index, e)} className="form-control rd-form-input" />
              </td>
              <td>
                <select name="indexedIn" value={presentation.indexedIn} onChange={(e) => handleIndexedInChange(index, e)} className="form-select">
                  <option value="">Select</option>
                  <option value="WoS">WoS</option>
                  <option value="Scopus">Scopus</option>
                </select>
              </td>
              <td>
                <input type="number" name="daysIndexed" value={presentation.daysIndexed} onChange={(e) => handleInputChange(index, e)} className="form-control rd-form-input" />
              </td>
              <td>
                <button onClick={() => handleRemovePresentation(index)} className='research-publications-remove-button-icon' disabled={presentations.length <= 1}>
                
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
      <button onClick={handleAddPresentation}
       className='research-publications-add-button'
      >Add Presentation</button>
      
        <input
          type="file"
          multiple
          onChange={presentationHandleFileChange}
          id="file-presentation-input"
          className="file-input file-upload-input"
          />
        <label htmlFor="file-presentation-input" className= {`file-input-label ${validationFileError ? 'error-border' : ''}`}
         title="Upload Files">
          <IoCloudUploadOutline  />
          <p>Choose Files</p>
        </label>
          </div >
        {presentationUploadedFiles.length > 0 && (
          <div className="file-list">
            <p className='upload-file-container-head'>Selected Files</p>
            <ul>
              {presentationUploadedFiles.map((file, index) => (
                <li key={index}>
                  <span className="filename"
                   title={file.originalName?file.originalName:file.name}
                   onClick={() => handleFileClick(file)}
                   style={{ cursor: 'pointer' }}
                   >{file.originalName?file.originalName:file.name}</span>
                  <button onClick={() => presentationHandleDeleteFile(index)}><RxCross1 />  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationAndFDP;
