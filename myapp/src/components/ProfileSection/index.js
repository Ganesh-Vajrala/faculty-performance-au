import React, { useEffect, useState, useRef } from "react";
import Header from "../Header";
import Cookies from "js-cookie";
import DatePicker from 'react-datepicker';
import { useNavigate } from "react-router-dom";
import { Modal} from 'react-bootstrap'
import AvatarEditor from "react-avatar-editor";
import {  SlClose } from "react-icons/sl";
import { FiMinus, FiPlus } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { SpinnerCircularFixed } from "spinners-react";
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './index.css'


const ProfileSection = () =>{
  const [show, setShow] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [editPhoto, setEditPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const editorRef = useRef();
  const [photo, setPhoto] = useState("");
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [selectedGender, setSelectedGender] = useState('Male');
  const [designation,setDesignation] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [experience, setExperience] = useState('');
  const [jobExperiences, setJobExperiences] = useState([{ industry: "", startDate: null, endDate: null }]);
  const [isRequired,setisRequired] = useState([0, 0, 0, 0, 0]);
  const [doctrate,setDoctrate] = useState("");
  const [error,setError] = useState("");
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const myData = useSelector(state => state.myData);
  const [loading, setLoading] = useState(false);
  const [totalYearsWorked, setTotalYearsWorked] = useState(0);

    const jwtToken = Cookies.get('jwt_token');
    const navigate = useNavigate()
    useEffect(()=>{
        if(jwtToken === undefined){
            navigate("/login", {replace:true})
        }
        console.log(myData);
        setPhoto(myData?.profile?.image?myData.profile.image:"");
        setFirstName(myData && myData?.profile && myData?.profile?.firstname?myData.profile.firstname:"");
        setLastName(myData && myData?.profile && myData?.profile?.lastname?myData.profile.lastname:"");
        setSelectedGender(myData?.profile?.gender ? myData.profile.gender : 'Male');
        setDesignation(myData?.profile?.designation?myData.profile.designation:"");
        setStartDate(myData?.profile?.dateOfjoining?myData.profile.dateOfjoining:new Date());
        setExperience(myData?.profile?.experience?myData.profile.experience:'0');
        setJobExperiences(myData?.profile?.working?myData.profile.working:[{ industry: "", startDate: null, endDate: null }]);
        setDoctrate(myData?.profile?.doctrate?myData.profile.doctrate:"");
        setEditPhoto(Boolean(myData?.profile?.image));
    },[jwtToken,navigate, myData])
    const handleClick = () => {
        fileInputRef.current.click();
      };
    
      const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if(file !== undefined){
            const fileUrl = URL.createObjectURL(file);
            setPhoto(fileUrl);
            ModalHandleShow()
        }
      };
    
      const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
    
      const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if(file !== undefined){}
            
      };
      

    const handleCropingPicture = () =>{

    }

    const ModalHandleClose = () => setShow(false);
    const ModalHandleShow = () =>{
        setShow(true);
        handleCropingPicture()
    }
    const ModalHandleCloseSave = () =>{
        const editedImage = editorRef.current.getImageScaledToCanvas().toDataURL();
        setPhoto(editedImage);
        setEditPhoto(true);
        setShow(false);
    }

    const handleZoomIn = () =>{
        setScale((prevScale)=>prevScale + .2);
    }

    const handleZoomOut = () => {
        setScale((prevScale) => Math.max(1.0, prevScale - .2)); 
      };
    
    const removePicture = () =>{
        setEditPhoto(false);
        setPhoto("");
    }
      const handleAddExperience = () => {
        setJobExperiences([...jobExperiences, { industry: "", startDate: null, endDate: null }]);
      };
      const handleExperienceDateChange = (index, field, date) => {
        const updatedExperiences = [...jobExperiences];
        updatedExperiences[index][field] = date;
        console.log(jobExperiences);
        setJobExperiences(updatedExperiences);
      };
    
      const handleRemoveExperience = (index) => {
       if(jobExperiences.length === 1){
        const updatedExperiences = jobExperiences.map((experience, i) =>
        i === 0 ? { industry: "", startDate: null, endDate: null } : experience
      );
      setJobExperiences(updatedExperiences);
       }
        if (jobExperiences.length > 1){
        const updatedExperiences = [...jobExperiences];
        updatedExperiences.splice(index, 1);
        setJobExperiences(updatedExperiences);
        }
      };
      
      const calculateTotalYearsWorked = () => {
        let tempJobExperiences = jobExperiences;
      
        if (experience === '0' || experience === "") {
          tempJobExperiences = [];
          setJobExperiences([]);
        }
      
        for (let i = tempJobExperiences.length - 1; i >= 0; i--) {
          const experience = tempJobExperiences[i];
          const isObjectEmpty = Object.values(experience).every(value => value === null || value === '');
          if (isObjectEmpty)
            tempJobExperiences.pop();
          else
            break;
        }
      
        let totalYearsWorked = 0;
        tempJobExperiences.forEach((experience) => {
          let { startDate, endDate } = experience;
      
          if (startDate && endDate) {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            const startYear = startDate.getFullYear();
            const startMonth = startDate.getMonth();
            const endYear = endDate.getFullYear();
            const endMonth = endDate.getMonth();
      
            let yearsWorked = endYear - startYear;
            let monthsWorked = endMonth - startMonth;
      
            if (monthsWorked < 0) {
              yearsWorked--;
              monthsWorked += 12;
            }
      
            totalYearsWorked += yearsWorked + monthsWorked / 12;
          }
        });
      
        setTotalYearsWorked(totalYearsWorked);
        return totalYearsWorked;
      };


      const handleFirstNameChange = (e) =>{
        setisRequired((prevIsRequired) => [(e.target.value === "" ? 1 : 0), prevIsRequired[1], prevIsRequired[2],prevIsRequired[3],prevIsRequired[4]]);
       
        setFirstName(e.target.value)
      }

      const handleLastNameChange = (e) =>{
        setisRequired((prevIsRequired) => [prevIsRequired[0],(e.target.value === "" ? 1 : 0), prevIsRequired[2],prevIsRequired[3],prevIsRequired[4]]);
       
        setLastName(e.target.value);
      }

      const handleDesignationChange = (e) =>{
        setisRequired((prevIsRequired) => [prevIsRequired[0], prevIsRequired[1],(e.target.value === "" ? 1 : 0),prevIsRequired[3],prevIsRequired[4]]);
        setDesignation(e.target.value);
      }

      const handleExperienceChange = (e) => {
        setisRequired((prevIsRequired) => [prevIsRequired[0], prevIsRequired[1],prevIsRequired[2],(e.target.value === "" ? 1 : 0),prevIsRequired[4]]);
        const input = e.target.value;
        const roundedValue = Math.ceil(parseFloat(input));
        console.log(roundedValue);
        setExperience(isNaN(roundedValue) ? '' : roundedValue.toString());
      };
      const handleGenderChange = (e) =>{
        console.log("Selected Gender:", e.target.value);
        setSelectedGender(e.target.value);
      }

      const handleDoctrateChange = (e) =>{
        setisRequired((prevIsRequired) => [prevIsRequired[0], prevIsRequired[1],prevIsRequired[2],prevIsRequired[3],(e.target.value === "" ? 1 : 0)]);
        setDoctrate(e.target.value);
      }

      const validateFormData = () =>{
        let flag = 1;
        if(firstName === ""){
          flag = 0;
          setisRequired((prevIsRequired) => [(firstName === "" ? 1 : 0), prevIsRequired[1], prevIsRequired[2],prevIsRequired[3],prevIsRequired[4]]);       
        }
        if(lastName === ""){
          flag = 0;
          setisRequired((prevIsRequired) => [prevIsRequired[0],(lastName === "" ? 1 : 0), prevIsRequired[2],prevIsRequired[3],prevIsRequired[4]]);
       
        }
        if(designation === ""){
          flag = 0;
          setisRequired((prevIsRequired) => [prevIsRequired[0], prevIsRequired[1],(designation === "" ? 1 : 0),prevIsRequired[3],prevIsRequired[4]]);
        }
        if(experience === ""){
          flag = 0;
          setisRequired((prevIsRequired) => [prevIsRequired[0], prevIsRequired[1],prevIsRequired[2],(experience === "" ? 1 : 0),prevIsRequired[4]]);
        }
        if(doctrate === ""){
          flag = 0;
          setisRequired((prevIsRequired) => [prevIsRequired[0], prevIsRequired[1],prevIsRequired[2],prevIsRequired[3],(doctrate === "" ? 1 : 0)]);
        }
        return flag;
      }

      const onSubmitUpdateSuccess = (data) =>{
        console.log(data.message);
        navigate("/", { replace: true });
    }

    const onSubmitUpdateFailure = (errorMsg) =>{
      console.log(errorMsg)
      setShowSubmitMessage(true);
      setErrorMsg(errorMsg);
    }

    const handleProfilesubmit = async (event) => {
      event.preventDefault();
      const flag = validateFormData();
      if (flag === 1) {
        let tempJobExperiences = jobExperiences;
    
        if (experience === '0' || experience === "") {
          tempJobExperiences = [];
          setJobExperiences([]);
        }
    
        if (calculateTotalYearsWorked(tempJobExperiences) === parseInt(experience)) {
          console.log(experience);
          setError("");
          const postData = {
            image: photo,
            firstname: firstName,
            lastname: lastName,
            gender: selectedGender,
            designation,
            dateOfjoining: startDate,
            experience,
            working: tempJobExperiences, 
            doctrate
          };
    
          const headers = {
            'authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          };
          
          setLoading(true);
          const url = "http://localhost:3100/edit-profile/";
          
          try {
            const response = await Axios.post(url, postData, { headers });
            if (response.data) {
              toast.success('Details Saved!');
              onSubmitUpdateSuccess(response.data);
            } else {
              onSubmitUpdateFailure(response.data.error);
            }
          } catch (error) {
            onSubmitUpdateFailure(error.response.data.error);
          } finally {
            setLoading(false);
          }
        } else {
          console.log("error", experience);
          setError("*Experience and Work Total Time Period not Matched");
        }
      }
    };

    return(
        <>
        <Header/>
        <div className="edit-profile-main-container pb-3">
            <div className="container edit-profile-main-inner-container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="edit-profile-main-heading">Faculty Profile</h1>
                    </div>
                    <div className="col-12">
                        <p className="edit-profile-main-description">The details you input will be utilized.
                             Please ensure accurate information and enter your name and other 
                             details with the same care you would employ when filling out an official document.</p>
                    </div>
                    <div className="col-12 mt-3">
                    <h1 className="profile-pic-main-heading">Photo</h1>
                    <p className="profile-pic-main-description">
                        This photo will your be your profile pic
                    </p>
                    </div>
                    
                   {!editPhoto && 
                   <div className="col-12 upload-pic-main-outer-container">
                   <div className="upload-pic-main-container">
                        <div
                                className="upload-from-device-container"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={handleClick}
                                >
                                <LuImagePlus fontSize={"xx-large"} style={{color:"#989898", fontWeight:"400"}} />
                                <p className="mt-3 upload-pic-item">Upload Photo</p>
                                <p className="mt-0 upload-pic-item-drag">or Drag and Drop</p>
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                />
                                </div>
                                </div>
                                </div>}
            

                {
                <Modal  className="custom-modal"
                 show={show} centered
                 onHide={ModalHandleClose} 
                 style={{color: "rgba(255, 255, 255, 1)"}}
                 animation={false}>
                    
                    <Modal.Body  className="modal-body d-flex flex-column align-items-center justify-content-center">
                      <div>
                        <p style={{color:"Black", fontFamily:'Roboto', fontSize:"20px"}}>Adjust Photo</p>
                      </div>
                    <AvatarEditor
                        ref ={editorRef}
                        image={photo}
                        width={160}
                        height={180}
                        border={30}
                        color={[0, 0, 0, 0.6]} 
                        scale={scale}
                        rotate={0}
                    />
                    <div className="modal-button-container">
                        <button onClick={handleZoomIn}><FiPlus fontSize={"x-large"} /> </button>
                        <button onClick={handleZoomOut}><FiMinus fontSize={"x-large"}/></button>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className="profile-submit-button" onClick={ModalHandleCloseSave}>
                        Save
                    </button>
                    </Modal.Footer>
                </Modal>}
                {editPhoto && (
                <div className="edited-image-container">
                    <img src={photo} className="cropped-image" alt="Cropped" />
                    <div className = "edited-image-options-container">
                        <div className="edited-image-options-inner-container" onClick={removePicture}>
                            <SlClose className="edited-image-options-icons"/>
                            <p>Delete Pic</p>
                        </div>
                    </div>
                </div>
                )}
                </div>
            <form className="row g-4 mt-4" onSubmit={handleProfilesubmit} noValidate>
                <div className="col-md-6 mb-3">
                    <label htmlFor="form-first-name" className="form-label">
                        First Name
                    </label>
                    <input
                    type="text"
                    className="form-control"
                    id="form-first-name"
                    onChange={handleFirstNameChange}
                    value={firstName || ""}
                    required
                    />
                    {(isRequired[0] === 1) && (
                    <div style={{color:"red", fontSize:"14px"}}>
                        *Required
                    </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="form-last-name" className="form-label">
                        Last Name
                    </label>
                    <input 
                    type="text"
                     className="form-control"
                    id="form-last-name" 
                    value={lastName}
                    onChange={handleLastNameChange}
                    required/>
                     {(isRequired[1] === 1) && (
                    <div style={{color:"red", fontSize:"14px"}}>
                        *Required
                    </div>
                    )}
                </div>
                <div className="gender-heading-container col-12 mt-0 mb-0">
                    <p>Gender</p>
                </div>
                <div className="col-12 mt-0 gender-option-container">
                <div className="form-check">
                    <input className="form-check-input"
                     type="radio"
                    name="gender"
                    value="Male"
                    id="male"
                    checked={selectedGender === 'Male'}
                    onChange={handleGenderChange}
                    />
                    <label className="form-check-label" htmlFor="male"  style={{cursor:"pointer"}}>
                        Male
                    </label>
                </div>
                <div className="form-check" >
                    <input 
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="Female"
                    id="female"
                    checked={selectedGender === 'Female'}
                    onChange={handleGenderChange}/>
                    <label className="form-check-label" htmlFor="female" style={{cursor:"pointer"}}>
                        Female
                    </label>
                    
                </div>
                </div>
                <div className="col-md-6">
                    <label className="form-label">
                        Designation
                    </label>
                    <select className="form-select" aria-label="Default select example" value={designation} onChange={handleDesignationChange} >
                        <option value="">select designation</option>
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                    </select>
                    {(isRequired[2] === 1) && (
                    <div style={{color:"red", fontSize:"14px"}}>
                        *Required
                    </div>
                    )}
                </div>

                <div className="col-md-6 datepicker-container">
                    <label className="form-label">
                        Joining Date
                    </label>
                    <DatePicker className="form-control" selected={startDate}
                     onChange={(date) => setStartDate(date)} 
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    showMonthDropdown
                    scrollableYearDropdown
                    showYearDropdown
                    style={{ width: "300px" }}
                    calendarClassName="custom-calendar"
                    popperClassName="custom-popper"
                    
                    wrapperClassName="custom-datepicker-wrapper"
                    
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="experience">
                        Experience in Years
                    </label>
                    <input className="form-control number-input" value={experience} onChange={handleExperienceChange} id="experience" max="50" min="0" type="number" required/>
                    {(isRequired[3] === 1) && (
                    <div style={{color:"red", fontSize:"14px"}}>
                        *Required
                    </div>
                    )}
                </div>
                {!(experience==='0' || experience==='') && jobExperiences.map((experience, index) => (
      <div key={index} className="row mt-3">
        {index === 0 && 
      <div className="col-md-12 mt-3 mb-0">
        <p>Teaching + Area of work</p>
      </div>}
        <div className="col-md-3 col-sm-6">
          <label className="form-label" htmlFor={`startDate-${index}`}>
            Start Date
          </label>
          <DatePicker
                  className="form-control"
                  selected={experience.startDate}
                  onChange={(date) => handleExperienceDateChange(index, "startDate", date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                  isClearable
                  placeholderText="Select Month and .."
                  id={`startMonthYear-${index}`}
                  required
                />
        </div>

        <div className="col-md-3 col-sm-6">
          <label className="form-label" htmlFor={`endDate-${index}`}>
            End Date
          </label>
          <DatePicker
                  className="form-control"
                  selected={experience.endDate}
                  onChange={(date) => handleExperienceDateChange(index, "endDate", date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                  isClearable
                  placeholderText="Select Month and .."
                  id={`endMonthYear-${index}`}
                  required
                />
        </div>
        <div className="col-md-4" >
          <label className="form-label" htmlFor={`industry-${index}`}>
            Industry/Field of Work
          </label>
          <input
            className="form-control"
            value={experience.industry}
            onChange={(e) => handleExperienceDateChange(index, "industry", e.target.value)}
            id={`industry-${index}`}
            type="text"
            required
          />
        </div>
        <div className="col-md-2 align-self-center clear-remove-button-container">
                <button type="button" onClick={() => handleRemoveExperience(index)}>
                  {index === 0? "Clear":"Remove"}
                </button>
              </div>
      </div>
    ))}
    <div className="col-4 add-experience-button-container">
    {!(experience==='0' || experience==='') &&  <button type="button" className="add-experience-button" onClick={handleAddExperience}>
      Add Experience
    </button>}
    </div>
    <div className="doctrate-section-headeing-container col-12 mt-0 mb-0">
        <p>Are you a doctorate degree holder?</p>
    </div>
    <div className="col-12 mt-0 gender-option-container">
    <div className="form-check mt-0">
        <input 
        className="form-check-input"
         type="radio"
         name="doctrate"
         value="Yes"
         id="yes"
        checked={doctrate === 'Yes'}
        onChange={handleDoctrateChange}
         required/>
        <label className="form-check-label" htmlFor="yes"  style={{cursor:"pointer"}}>
            Yes
        </label>
    </div>
    <div className="form-check mt-0" >
        <input
        className="form-check-input"
        type="radio"
        name="doctrate"
        value="No"
        id="no"
        checked={doctrate === 'No'}
        onChange={handleDoctrateChange}
        required/>
        <label className="form-check-label" htmlFor="no" style={{cursor:"pointer"}}>
            No
        </label>
        {(isRequired[4] === 1) && (
          <div style={{color:"red", fontSize:"14px"}}>
              *Required
          </div>
          )}
    </div>
    </div>
    <div className="col-12 d-flex justify-content-center align-items-center " style={{color:"red", fontSize:"14px"}}>
      {error}
    </div>
    {showSubmitMessage && <p className="error-message">*{errorMsg}</p>}
    <div className="col-12 ">
        <button className="profile-submit-button" type="submit">
        {loading ? <SpinnerCircularFixed size={24} thickness={100} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(0, 0, 0, 0)" /> : "Save"}
          </button>
    </div>
     </form>
     
    </div>
    </div>
        </>
    )
}
export default ProfileSection