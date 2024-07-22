import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { RiNotionFill } from 'react-icons/ri';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-step-progress-bar/styles.css';
import './index.css';
import ResearchPublications from '../ResearchPublications';
import FundedProjects from '../FundedProjects';
import PresentationAndFDP from '../PresentationAndFDP';
import CertificationsUpload from '../CertificationsUpload';
import { BiArrowBack } from "react-icons/bi";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../../Apis';

const ResearchAndDevelopment = () => {
    const jwtToken = Cookies.get('jwt_token');
  const navigate = useNavigate();
  const selectedYear = useSelector((state) => state.selectedYear);


  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [showSections, setShowSections] = useState({ a: false, b: false, c: false, d: false });

  const [formData, setFormData] = useState({
    universityName: '',
    registrationDate: '',
    supervisorName: '',
    prePhdCompletionDate: '',
    researchReviewsCompleted: '',
    phdCompletionDate: '',
    registeredForPhd: false,
    receivedPhdIn2023: false,
    universityName2023: '',
    registrationDate2023: '',
    supervisorName2023: '',
    prePhdCompletionDate2023: '',
    researchReviewsCompleted2023: '',
    phdCompletionDate2023: '',
    researchPublications: [],
    researchUploadedFiles: [],
    presentationAndFDP:[],
    presentationAndFDPUplodedFiles:[],
    fundedProjects:[],
    fundedProjectsUploadedFiles:[],
    certifications:[],
    certificationsUploadedFiles:[],
    researchPublicationsApiScore:0,
    presentationAndFDPApiScore:0,
    fundedProjectsApiScore:0,
    certificationsApiScore:0
  });
  const lightSilverColor = '#e5e5e5';
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [researchPublicationsValidationError, setResearchPublicationsValidationError] = useState('');
  const [researchPublicationsFileValidationError, setResearchPublicationsFileValidationError] = useState(false);
  const [presentationAndFDPValidationError, setPresentationAndFDPValidationError] = useState('');
  const [presentationAndFDPFileValidationError, setPresentationAndFDPFileValidationError] = useState(false);
  const [fundedProjectsValidationError, setFundedProjectsValidationError] = useState('');
  const [fundedProjectsFileValidationError, setFundedProjectsFileValidationError] = useState(false);
  const [certificationsValidationError, setCertificationsValidationError] = useState('');
  const [certificationsFileValidationError, setCertificationsFileValidationError] = useState(false);
  const [phdRecievedOrAppliedFileValidationError, setPhdRecievedOrAppliedFileValidationError] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [swalSaveAndContinue,setSwalSaveAndContinue] = useState(false)
  const [dataFetched, setDataFetched] = useState(false);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

   const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
  };

  const fetchResearchDevelopment = async (year) => {
    try {
      const response = await axios.get(`${baseUrl}/research-development/${year}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      const data = response.data;
  
      // Format the dates here
      const formattedData = {
        ...data,
        registrationDate: data.registrationDate ? formatDate(data.registrationDate) : '',
        prePhdCompletionDate: data.prePhdCompletionDate ? formatDate(data.prePhdCompletionDate) : '',
        phdCompletionDate: data.phdCompletionDate ? formatDate(data.phdCompletionDate) : '',
        registrationDate2023: data.registrationDate2023 ? formatDate(data.registrationDate2023) : '',
        prePhdCompletionDate2023: data.prePhdCompletionDate2023 ? formatDate(data.prePhdCompletionDate2023) : '',
        phdCompletionDate2023: data.phdCompletionDate2023 ? formatDate(data.phdCompletionDate2023) : '',
      };
  
      setFormData((prevData) => {
        return {
          ...prevData,
          universityName: formattedData.universityName,
          registrationDate: formattedData.registrationDate,
          supervisorName: formattedData.supervisorName || '',
          prePhdCompletionDate: formattedData.prePhdCompletionDate || '',
          researchReviewsCompleted: formattedData.researchReviewsCompleted || '',
          phdCompletionDate: formattedData.phdCompletionDate || '',
          registeredForPhd: formattedData.registeredForPhd || false,
          receivedPhdIn2023: formattedData.receivedPhdIn2023 || false,
          universityName2023: formattedData.universityName2023 || '',
          registrationDate2023: formattedData.registrationDate2023 || '',
          supervisorName2023: formattedData.supervisorName2023 || '',
          prePhdCompletionDate2023: formattedData.prePhdCompletionDate2023 || '',
          researchReviewsCompleted2023: formattedData.researchReviewsCompleted2023 || '',
          phdCompletionDate2023: formattedData.phdCompletionDate2023 || '',
          researchPublications: formattedData.researchPublications || [],
          researchUploadedFiles: formattedData.researchUploadedFiles || [],
          presentationAndFDP: formattedData.presentationAndFDP || [],
          presentationAndFDPUplodedFiles: formattedData.presentationAndFDPUplodedFiles || [],
          fundedProjects: formattedData.fundedProjects || [],
          fundedProjectsUploadedFiles: formattedData.fundedProjectsUploadedFiles || [],
          certifications: formattedData.certifications || [],
          certificationsUploadedFiles: formattedData.certificationsUploadedFiles || [],
          researchPublicationsApiScore: formattedData.researchPublicationsApiScore || 0,
          presentationAndFDPApiScore: formattedData.presentationAndFDPApiScore || 0,
          fundedProjectsApiScore: formattedData.fundedProjectsApiScore || 0,
          certificationsApiScore: formattedData.certificationsApiScore || 0
        };
      });
      setUploadedFiles([...formattedData.uploadedFiles]);
    } catch (error) {

      throw error;
    }
  };
  
  const resetForm = () => {
    setFormData({
      universityName: '',
      registrationDate: '',
      supervisorName: '',
      prePhdCompletionDate: '',
      researchReviewsCompleted: '',
      phdCompletionDate: '',
      registeredForPhd: false,
      receivedPhdIn2023: false,
      universityName2023: '',
      registrationDate2023: '',
      supervisorName2023: '',
      prePhdCompletionDate2023: '',
      researchReviewsCompleted2023: '',
      phdCompletionDate2023: '',
      researchPublications: [],
      researchUploadedFiles: [],
      presentationAndFDP: [],
      presentationAndFDPUplodedFiles: [],
      fundedProjects: [],
      fundedProjectsUploadedFiles: [],
      certifications: [],
      certificationsUploadedFiles: [],
      researchPublicationsApiScore: 0,
      presentationAndFDPApiScore: 0,
      fundedProjectsApiScore: 0,
      certificationsApiScore: 0
    });
    setUploadedFiles([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!jwtToken) {
        navigate('/login', { replace: true });
        return;
      }
      if (!selectedYear) {
        navigate('/academic-work', { replace: true });
        return;
      }
      try {
        await fetchResearchDevelopment(selectedYear);
        setDataFetched(true); 
      } catch (error) {
        console.log("Error fetching research development data:", error);
        if(error.response.status === 404)
          setDataFetched(true);
        resetForm();
      }
    };
  
    fetchData();
  }, [jwtToken, navigate, selectedYear]);
  
  
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const { registeredForPhd, receivedPhdIn2023, universityName, registrationDate, supervisorName, prePhdCompletionDate, researchReviewsCompleted, phdCompletionDate } = formData;
    let isValid = true;

    if (registeredForPhd || receivedPhdIn2023) {
      isValid = universityName && registrationDate && supervisorName && prePhdCompletionDate && researchReviewsCompleted && phdCompletionDate;
    }

    setIsSaveButtonDisabled(!isValid);

    if (registeredForPhd || receivedPhdIn2023) {
      setShowSections({ a: true, b: true, c: true, d: false });
    } else {
      setShowSections({ a: true, b: true, c: false, d: true });
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const uniqueFiles = selectedFiles.filter(file => !uploadedFiles.some(existingFile => (existingFile.name || existingFile.originalName) === file.name));
    setUploadedFiles([...uploadedFiles, ...uniqueFiles]);
    setPhdRecievedOrAppliedFileValidationError(false);
  };

  
  const handleDeleteFile = async (index) => {
    const fileToDelete = uploadedFiles[index];
    const { fileName } = fileToDelete; 
  
    try {
      const response = await axios.delete(`${baseUrl}/delete-research-development-file`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        data: {
          year: selectedYear,
          fileName: fileName,
          fileType: 'uploadedFiles'
        }
      });

      if (response.status === 200 || response.status === 404) {
        const newFiles = [...uploadedFiles];
        newFiles.splice(index, 1);
        setUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
    } catch (error) {
      if(error.response.status === 404){
        const newFiles = [...uploadedFiles];
        newFiles.splice(index, 1);
        setUploadedFiles(newFiles);
        toast.success('File deleted successfully');
      }
      else
      toast.error('Failed to delete file. Please try again.');
    }
  };

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

  const handleResearchPublicationsChange = (data) => {
    const trimmedPublications = trimFields(data.publications);
    const nonEmptyPublications = removeEmptyRows(trimmedPublications);
    console.log(nonEmptyPublications)
    setFormData(prevData => {
      if (nonEmptyPublications.length === 0) {
        console.log("empty",)
        return {
          ...prevData,
          researchPublications: nonEmptyPublications,
          researchUploadedFiles: [],
        };
      } else {
        return {
          ...prevData,
          researchPublications: nonEmptyPublications,
          researchUploadedFiles: data.researchUploadedFiles,
        };
      }
    });
  
    if (data.researchUploadedFiles.length > 0) {
      setResearchPublicationsFileValidationError(false);
      setResearchPublicationsValidationError("");
    } else {
      setResearchPublicationsFileValidationError(false); 
      setResearchPublicationsValidationError("");
    }
  };

  
  const handlePresentationAndFDP = (data) =>{
    const trimmedPresentations = trimFields(data.presentations);
  const nonEmptyPresentations = removeEmptyRows(trimmedPresentations);
    setFormData((prevData)=>({
      ...prevData,
      presentationAndFDP: nonEmptyPresentations,
      presentationAndFDPUplodedFiles: data.presentationUploadedFiles,
    }));
    if (data.presentationUploadedFiles.length > 0) {
      setPresentationAndFDPFileValidationError(false);
      setPresentationAndFDPValidationError("");
    }
    if(nonEmptyPresentations.length === 0)
      setPresentationAndFDPFileValidationError(false);
      setPresentationAndFDPValidationError("");
  }
  
  const handleFundedProjects = (data) =>{
    const trimmedProjects = trimFields(data.projects);
  const nonEmptyProjects = removeEmptyRows(trimmedProjects);
    setFormData((prevData)=>({
      ...prevData,
      fundedProjects: nonEmptyProjects,
      fundedProjectsUploadedFiles: data.fundedProjectsUploadedFiles,
    }));
    if (data.fundedProjectsUploadedFiles.length > 0) {
      setFundedProjectsFileValidationError(false);
      setFundedProjectsValidationError("");
    }
    if(nonEmptyProjects.length === 0)
      setFundedProjectsFileValidationError(false);
      setFundedProjectsValidationError("");
    
  }

  const handleCertificationsUpload = (data) =>{
    const trimmedCertifications = trimFields(data.certifications);
  const nonEmptyCertifications = removeEmptyRows(trimmedCertifications);
    setFormData((prevData)=>({
      ...prevData,
      certifications: nonEmptyCertifications,
      certificationsUploadedFiles: data.certificationsUploadedFiles,
      }));
      if (data.certificationsUploadedFiles.length > 0) {
        setCertificationsFileValidationError(false);
        setCertificationsValidationError("");
      }
      if(nonEmptyCertifications.length === 0)
        setCertificationsFileValidationError(false);
        setCertificationsValidationError("");
  }

 

  const calculateResearchPublicationsApiScore = () => {
    const validateSubFields = (publications) => {
      for (const publication of publications) {
        const values = Object.values(publication);
        const anyFieldFilled = values.some(val => val.trim() !== '');
        const allFieldsFilled = values.every(val => val.trim() !== '');
        if (anyFieldFilled && !allFieldsFilled) {
          setResearchPublicationsValidationError('Please fill out all fields in Attempted row.');
          return false;
        }
      }
  
      if (publications.length === 0) {
        return false;
      }
  
      if (publications.length !== 0 && formData.researchUploadedFiles.length === 0) {
        setResearchPublicationsValidationError('Please upload at least one file.');
        setResearchPublicationsFileValidationError(true);
        return false;
      }
  
      setResearchPublicationsValidationError('');
      return true;
    };
  
    const calculateResearchPublicationsApiScore = () => {
      const trimmedPublications = removeEmptyRows(formData.researchPublications);
  
      let score = 0;
      for (const publication of trimmedPublications) {
        if (publication.indexedIn === "WoS")
          score += 5;
        if (publication.indexedIn === "Scopus")
          score += 3;
        if (publication.indexedIn === "UGC approved")
          score += 1;
        score += 9;
      }
  
      if (score > 10) score = 10;
  
      setFormData((prevData) => ({
        ...prevData,
        researchPublications: trimmedPublications,
        researchPublicationsApiScore: score
      }));
    };
    if (validateSubFields(formData.researchPublications)) {
      calculateResearchPublicationsApiScore();
    } else {
      setFormData((prevData) => ({
        ...prevData,
        researchPublicationsApiScore: 0
      }));
    }
  };
  

  const calculatePresentationAndFDPApiScore = () => {
  const validateFDPSubFields = (presentations) => {
    for (const presentation of presentations) {
      const values = Object.values(presentation);
      const anyFieldFilled = values.some(val => val.trim() !== '');
      const allFieldsFilled = values.every(val => val.trim() !== '');
      if (anyFieldFilled && !allFieldsFilled) {
        setPresentationAndFDPValidationError('Please fill out all fields in Attempted row.');
        return false;
      }
    }
    if(presentations.length === 0){
      return false;
    }
    if(presentations.length !== 0 && formData.presentationAndFDPUplodedFiles.length === 0){
      setPresentationAndFDPValidationError('Please upload at least one file.');
      setPresentationAndFDPFileValidationError(true)
    }
    else
     setPresentationAndFDPValidationError('');
    return true;

  };

  if (validateFDPSubFields(formData.presentationAndFDP)) {
    let score = 0;
    for (const presentation of formData.presentationAndFDP) {
      if (presentation.indexedIn === "WoS" || presentation.indexedIn === 'Scopus')
        score += 2.5;
      if (parseInt(presentation.daysIndexed) >= 5)
        score += 2.5;
    }
    if (score > 5) score = 5;

    setFormData((prevData) => ({
      ...prevData,
      presentationAndFDPApiScore: score
    }));
  } else {
    setFormData((prevData) => ({
      ...prevData,
      presentationAndFDPApiScore: 0
    }));
  }
};

const calculateCertificationsUploadApiScore = () =>{
  const validateCertifications = (certificates) => {
    for (const certificate of certificates) {
      const values = Object.values(certificate);
      const anyFieldFilled = values.some(val => val.trim() !== '');
      const allFieldsFilled = values.every(val => val.trim() !== '');
      if (anyFieldFilled && !allFieldsFilled) {
        setCertificationsValidationError('Please fill out all fields in Attempted row.');
        return false;
      }
    }
    if(certificates.length === 0){
      return false;
    }
    if(certificates.length !== 0 && formData.certificationsUploadedFiles.length === 0){
      setCertificationsValidationError('Please upload at least one file.');
      setCertificationsFileValidationError(true)
    }
    else
    setCertificationsValidationError('');
    return true;

  };

  if (validateCertifications(formData.certifications)) {
    let score = 0;
    for (const certificate of formData.certifications) {
      score += 2
    }
    if (score > 5) score = 5;
    setFormData((prevData) => ({
      ...prevData,
      certificationsApiScore: score
    }));
  } else {
    setFormData((prevData) => ({
      ...prevData,
      certificationsApiScore: 0
    }));
  }
};

const calculateFundedProjectsApiScore = () =>{
  const validateFundedProjects = (fundedProjects) => {
  for (const fundedProject of fundedProjects) {
    const values = Object.values(fundedProject);
    const anyFieldFilled = values.some(val => val.trim() !== '');
    const allFieldsFilled = values.every(val => val.trim() !== '');
    if (anyFieldFilled && !allFieldsFilled) {
      setFundedProjectsValidationError('Please fill out all fields in Attempted row.');
      return false;
    }
  }
  if(fundedProjects.length === 0){
    return false;
    }
  if(fundedProjects.length !== 0 && formData.fundedProjectsUploadedFiles.length === 0){
      setFundedProjectsValidationError('Please upload at least one file.');
      setFundedProjectsFileValidationError(true)
  }
  else
    setFundedProjectsValidationError('');
    return true;
  };
  if (validateFundedProjects(formData.fundedProjects)) {
    let score = 0;
    for (const fundedProject of formData.fundedProjects) {
      if(fundedProject.status === "Sanctioned")
        score += 5;
      else 
        score += 1;
    }
    if (score > 5) score = 5;
    setFormData((prevData) => ({
      ...prevData,
      fundedProjectsApiScore: score
    }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        fundedProjectsApiScore: 0
      }));
    }
  };
                      


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
  const checkPhdFileUploadedOrNot = () =>{
    if((formData.receivedPhdIn2023 && uploadedFiles.length === 0) || (formData.registeredForPhd && uploadedFiles.length === 0))
      setPhdRecievedOrAppliedFileValidationError(true);
    else
      setPhdRecievedOrAppliedFileValidationError(false);

  }
  useEffect(() => {
    const handleSubmit = async () => {
      if (submitClicked && (
          researchPublicationsValidationError !== '' || 
          researchPublicationsFileValidationError || 
          fundedProjectsValidationError !== '' || 
          fundedProjectsFileValidationError || 
          presentationAndFDPValidationError !== '' || 
          presentationAndFDPFileValidationError || 
          certificationsValidationError !== "" || 
          certificationsFileValidationError || 
          phdRecievedOrAppliedFileValidationError || 
          isSaveButtonDisabled
        )) {
        toast.warning("Please complete all the attempted fields and upload the corresponding files for each field."); 
      } else if (submitClicked) {
        if (formData.receivedPhdIn2023 || formData.registeredForPhd) {
          if (formData.researchPublications.length === 0 || formData.presentationAndFDP.length === 0 || formData.fundedProjects.length === 0) {
            sweetAlertFunction();
          }else{
            setSwalSaveAndContinue(true);
          }
        } else if (formData.researchPublications.length === 0 || formData.presentationAndFDP.length === 0 || formData.certifications.length === 0) {
          sweetAlertFunction();
        }else{
          setSwalSaveAndContinue(true);
        }
      }
      if (swalSaveAndContinue ) {
        console.log("hihi")
        const formContent = new FormData();
        formContent.append('year', selectedYear);
        formContent.append('universityName', formData.universityName);
        formContent.append('registrationDate', formData.registrationDate);
        formContent.append('supervisorName', formData.supervisorName);
        formContent.append('prePhdCompletionDate', formData.prePhdCompletionDate);
        formContent.append('researchReviewsCompleted', formData.researchReviewsCompleted);
        formContent.append('phdCompletionDate', formData.phdCompletionDate);
        formContent.append('registeredForPhd', formData.registeredForPhd);
        formContent.append('receivedPhdIn2023', formData.receivedPhdIn2023);
        formContent.append('universityName2023', formData.universityName2023);
        formContent.append('registrationDate2023', formData.registrationDate2023);
        formContent.append('supervisorName2023', formData.supervisorName2023);
        formContent.append('prePhdCompletionDate2023', formData.prePhdCompletionDate2023);
        formContent.append('researchReviewsCompleted2023', formData.researchReviewsCompleted2023);
        formContent.append('phdCompletionDate2023', formData.phdCompletionDate2023);
        formContent.append('researchPublications', JSON.stringify(formData.researchPublications));
        formData.researchUploadedFiles.forEach((file) => {
          formContent.append('researchUploadedFiles', file);
        });
        formContent.append('presentationAndFDP', JSON.stringify(formData.presentationAndFDP));
        formData.presentationAndFDPUplodedFiles.forEach((file) => {
          formContent.append('presentationAndFDPUplodedFiles', file);
        });
        console.log(formData.fundedProjects);
        formContent.append('fundedProjects', JSON.stringify(formData.fundedProjects));
        formData.fundedProjectsUploadedFiles.forEach((file) => {
          formContent.append('fundedProjectsUploadedFiles', file);
        });
        formContent.append('certifications', JSON.stringify(formData.certifications));
        formData.certificationsUploadedFiles.forEach((file) => {
          formContent.append('certificationsUploadedFiles', file);
        });

        formContent.append('researchPublicationsApiScore', formData.researchPublicationsApiScore);
        formContent.append('presentationAndFDPApiScore', formData.presentationAndFDPApiScore);
        formContent.append('fundedProjectsApiScore', formData.fundedProjectsApiScore);
        formContent.append('certificationsApiScore', formData.certificationsApiScore);

        uploadedFiles.forEach((file) => {
          formContent.append('uploadedFiles', file);
        });

        try {

          const response = await axios.post(`${baseUrl}/save-research-development`, formContent, {
            headers: {
             Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          toast.success('Research & Development saved successfully');
          navigate("/contributions-upload");
        } catch (error) {
          console.error('Error saving or updating Research and Development data:', error);
        }
        setSwalSaveAndContinue(false);
      }

      setSubmitClicked(false);
    };

    handleSubmit();
  }, [
    submitClicked, 
    selectedYear, 
    researchPublicationsValidationError,
    researchPublicationsFileValidationError,
    fundedProjectsFileValidationError,
    fundedProjectsValidationError,
    presentationAndFDPValidationError,
    presentationAndFDPFileValidationError,
    certificationsValidationError,
    certificationsFileValidationError,
    phdRecievedOrAppliedFileValidationError, 
    formData.receivedPhdIn2023, 
    formData.registeredForPhd,
    formData.researchPublications, 
    formData.presentationAndFDP, 
    formData.certifications, 
    formData.fundedProjects,
    swalSaveAndContinue,
    isSaveButtonDisabled, 
    navigate
  ]);

  const ResearchAndDevelopmentSubmitForm = async () => {
    await Promise.all([
      calculateResearchPublicationsApiScore(),
      calculatePresentationAndFDPApiScore(),
      calculateCertificationsUploadApiScore(),
      calculateFundedProjectsApiScore(),
      checkPhdFileUploadedOrNot(),
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


    return(
        <div className='home-main-container'>
            <Header/>
            <div className='container container-wide pt-5'>
            <BiArrowBack className='form-backnavigation-button' onClick={()=>navigate("/academic-work")}/>
            <div className='academic-work-main-head-element-container'>
          <div className='academic-work-main-head-element-inner-container mb-0'>
              <h1 className='academic-work-main-head-element'>II. Research and Development</h1>
              <div className='notion-help-guide-container'>
              <a href="https://smart-crafter-843.notion.site/Anurag-University-Academic-Performance-Form-Guide-5e50ac0e13074d95be8755d86c4c4a51" target="_blank" rel="noopener noreferrer" className='notion-help-guide-link'>
             <RiNotionFill id="notion-help-guide" className='notion-help-guide'/>
              <span for="notion-help-guide" className='notion-help-guide-content'>Help Guide</span>
              </a>
              </div>

          </div>
          <p className='rd-main-heading-para'>The section summarizes the progress of the candidate in Research and Development.</p>
        </div>
      <form onSubmit={handleSubmit}>
        <table className="table mt-0">
          <thead>
              <th></th>
              <th>Did you register for Ph. D. in {selectedYear}?<br />If yes, please fill this column.</th>
              <th>Did you receive your Ph. D. in {selectedYear}?<br />If yes, please fill this column.</th>
          </thead>
          <tbody>
            <tr>
              <td>Name of the University</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }}
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="text"
                  name="universityName2023"
                  value={formData.universityName2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td>Date of Registration</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }}                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="date"
                  name="registrationDate2023"
                  value={formData.registrationDate2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td>Name of Supervisor and Co-Supervisor</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }}                  type="text"
                  name="supervisorName"
                  value={formData.supervisorName}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="text"
                  name="supervisorName2023"
                  value={formData.supervisorName2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td>Pre-Ph.D. completion Date</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }} 
                 type='date'
                  name="prePhdCompletionDate"
                  value={formData.prePhdCompletionDate}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="date"
                  name="prePhdCompletionDate2023"
                  value={formData.prePhdCompletionDate2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td>No. of Research Reviews completed</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }}                  
                  type="number"
                  name="researchReviewsCompleted"
                  value={formData.researchReviewsCompleted}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="number"
                  name="researchReviewsCompleted2023"
                  value={formData.researchReviewsCompleted2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td>Expected date/Date of completion of Ph.D.</td>
              <td style={{ backgroundColor: formData.registeredForPhd ? 'transparent' : lightSilverColor }}>
                <input
style={{ backgroundColor: formData.registeredForPhd ? 'initial' : '#e5e5e5', cursor:formData.registeredForPhd?'':"not-allowed" }}                  type='date'
                  name="phdCompletionDate"
                  value={formData.phdCompletionDate}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.registeredForPhd}
                />
              </td>
              <td style={{ backgroundColor: formData.receivedPhdIn2023 ? 'transparent' : lightSilverColor }}>
                <input
                  style={{ backgroundColor: formData.receivedPhdIn2023 ? 'initial' : '#e5e5e5', cursor:formData.receivedPhdIn2023?'':"not-allowed" }}
                  type="date"
                  name="phdCompletionDate2023"
                  value={formData.phdCompletionDate2023}
                  onChange={handleInputChange}
                  className="form-control rd-form-input"
                  disabled={!formData.receivedPhdIn2023}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="registeredForPhd"
                    checked={formData.registeredForPhd}
                    onChange={handleInputChange}
                    className="form-check-input"
                    id="registeredForPhd"
                  />
                  <label className="form-check-label" htmlFor="registeredForPhd">
                    Yes
                  </label>
                </div>
              </td>
              <td>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="receivedPhdIn2023"
                    checked={formData.receivedPhdIn2023}
                    onChange={handleInputChange}
                    className="form-check-input"
                    id="receivedPhdIn2023"
                  />
                  <label className="form-check-label" htmlFor="receivedPhdIn2023">
                    Yes
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
        <div className='upload-description-container'>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          id="file-input"
          className="file-input file-upload-input"
          />
        <label htmlFor="file-input" className= {`file-input-label ${phdRecievedOrAppliedFileValidationError ? 'error-border' : ''}`}
        title="Upload Files">
          <IoCloudUploadOutline  />
          <p>Choose Files</p>
        </label>
        <button className={!isSaveButtonDisabled?'rd-main-form-save-button'  : 'button-options-save disabled button-width'} 
        disabled = {isSaveButtonDisabled}>Save & Continue</button>
          </div>
        {uploadedFiles.length > 0 && (
          <div className="file-list">
            <p className='upload-file-container-head'>Selected Files</p>
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>
                  <span className="filename" title={file.originalName?file.originalName:file.name}
                  onClick={() => handleFileClick(file)}
                  style={{ cursor: 'pointer' }}
                  >{file.originalName?file.originalName:file.name}</span>
                  <button onClick={() => handleDeleteFile(index)}><RxCross1 />  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </form>
      <div className='mb-5'>
      {showSections.a && dataFetched && (
        <ResearchPublications 
          onDataChange={handleResearchPublicationsChange} 
          validationError={researchPublicationsValidationError}
          validationFileError={researchPublicationsFileValidationError}
          fetchedPublications={formData.researchPublications.length > 0 ? formData.researchPublications : undefined}
          fetchedResearchUploadedFiles={formData.researchUploadedFiles.length > 0 ? formData.researchUploadedFiles : undefined}
        />
      )}
          {showSections.b && dataFetched && (<PresentationAndFDP onDataChange={handlePresentationAndFDP} 
          validationError={presentationAndFDPValidationError}
          validationFileError = {presentationAndFDPFileValidationError}
          fetchedPresentations ={formData.presentationAndFDP.length >0 ? formData.presentationAndFDP : undefined}
          fetchedPresentationUploadedFiles={formData.presentationAndFDPUplodedFiles.length > 0 ? formData.presentationAndFDPUplodedFiles : undefined}
          />)}
          {showSections.c && dataFetched && (<FundedProjects onDataChange={handleFundedProjects}
          validationError = {fundedProjectsValidationError}
          validationFileError = {fundedProjectsFileValidationError}
          fetchedProjects ={formData.fundedProjects.length >0 ? formData.fundedProjects : undefined}
          fetchedProjectsUploadedFiles={formData.fundedProjectsUploadedFiles.length > 0 ? formData.fundedProjectsUploadedFiles : undefined}
          />)}
          {showSections.d && dataFetched && (<CertificationsUpload onDataChange={handleCertificationsUpload}
          validationError = {certificationsValidationError}
          validationFileError = {certificationsFileValidationError}
          fetchedCertifications ={formData.certifications.length >0 ? formData.certifications : undefined}
          fetchedCertificationsUploadedFiles={formData.certificationsUploadedFiles.length > 0 ? formData.certificationsUploadedFiles : undefined}
          />)}
      </div>
      {/* ()=>navigate("/contributions-upload") */}
      <div className='aca-work-next-prev-buttons-container'>
        <button  className='aca-work-next-prev-buttons button-width' onClick={ResearchAndDevelopmentSubmitForm} >
          Save & Next
        </button>
      </div>
            </div>
        </div>
    )
}
export default ResearchAndDevelopment