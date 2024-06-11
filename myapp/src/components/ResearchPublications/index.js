import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiDeleteBinLine } from "react-icons/ri";
import './index.css'


const ResearchPublications = () => {
  const [publications, setPublications] = useState([
    { title: '', journal: '', indexedIn: '', date: '', authorRole: '' },
    {title: '', journal: '', indexedIn: '', date: '', authorRole: '' },
  ]);

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
                <input
                  type="text"
                  name="indexedIn"
                  value={publication.indexedIn}
                  onChange={(e) => handleInputChange(index, 'indexedIn', e.target.value)}
                  className="form-control rd-form-input"
                />
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
                 <RiDeleteBinLine />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className='research-publications-add-button' onClick={handleAddPublication}>
        Add Publication
      </button>
    </div>
  );
};

export default ResearchPublications;
