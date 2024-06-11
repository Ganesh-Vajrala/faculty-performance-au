import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FundedProjects = () => {
  const [projects, setProjects] = useState([
    { title: '', agency: '', grant: '', status: '', score: '' },
    { title: '', agency: '', grant: '', status: '', score: '' },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const handleAddProject = () => {
    setProjects([...projects, { title: '', agency: '', grant: '', status: '', score: '' }]);
  };

  const handleRemoveProject = (index) => {
    if (projects.length > 1) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      setProjects(updatedProjects);
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
            <th>Score (Max. 5)</th>
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
                <input
                  type="number"
                  name="score"
                  value={project.score}
                  onChange={(e) => handleInputChange(index, 'score', e.target.value)}
                  className="form-control rd-form-input"
                />
              </td>
              <td>
                <button
                  type="button"
                className='research-publications-remove-button'
                  onClick={() => handleRemoveProject(index)}
                  disabled={projects.length <= 1}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button"
       className='research-publications-add-button'
        onClick={handleAddProject}>
        Add Project
      </button>
    </div>
  );
};

export default FundedProjects;
