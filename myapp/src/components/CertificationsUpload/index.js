

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const CertificationsUpload = () => {
  const [ certifications, setCertifications] = useState([
    { name: '', organization: '', score: '' }
  ]);

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
                <button onClick={() => removeCertification(index)} className='research-publications-remove-button'>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className='research-publications-add-button' onClick={addCertification}>Add Certification</button>
    </div>
  );
}

export default CertificationsUpload;
