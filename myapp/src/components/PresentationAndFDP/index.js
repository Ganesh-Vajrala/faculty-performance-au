import React, { useState } from 'react';

const PresentationAndFDP = () => {
  const [presentations, setPresentations] = useState([
    {
      sno: '',
      paperTitle: '',
      conferenceTitle: '',
      organizedBy: '',
      indexedIn: '',
      daysIndexed: '',
    }
  ]);

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

  const handleAddPresentation = () => {
    setPresentations([...presentations, {
      sno: '',
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
            <th>Actions</th>
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
                <button onClick={() => handleRemovePresentation(index)} className='research-publications-remove-button' disabled={presentations.length <= 1}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddPresentation}
       className='research-publications-add-button'
      >Add Presentation</button>
    </div>
  );
};

export default PresentationAndFDP;
