const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt  = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { type } = require('os');
const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
app.use("/uploads",express.static("uploads"))
require('dotenv').config()
const baseUrl = process.env.PORT;

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("DB connected..."))
    .catch(err => console.log(err));

const credentialsSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique:true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    secretCode: {
        type: String,
    },
});

const Credentials = mongoose.model('Credentials', credentialsSchema);

const profileSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
    },
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    gender: {
        type: String,
    },
    designation:{
        type:String,
    },
    dateOfjoining: {
        type: Date,
    },
    experience: {
        type: Number,
    },
    working:{
        type:[mongoose.Schema.Types.Mixed],
    },
    doctrate:{
        type:String,
    },
});
const ProfileDetails = mongoose.model('ProfileDetails', profileSchema);

const academicWorkSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    semesters: [
        {
            name: String,
            courses: [
                {
                    name: String,
                    scheduledClasses: String,
                    classesHeld: String,
                    passPercentage: String,
                    apiScoreResults: String,
                    studentFeedback: String,
                    apiScoreFeedback: String,
                },
            ],
        },
    ],
    averagePercentage: {
        passPercentage: String,
        feedbackPercentage: String,
    },
    totalApiScore: String,
    extraMileDescription: String,
    extraMileApiScore:Number,
    uploadedFiles: [
        {
            fieldname: String,   
            originalName: String,
            encoding: String,
            mimetype: String,
            destination: String,
            fileName: String,
            path: String,
            size: Number
        }
    ],
});

const AcademicWork = mongoose.model('AcademicWork', academicWorkSchema);
const publicationSchema = new mongoose.Schema({
    title: { type: String },
    journal: { type: String },
    indexedIn: {type:String},
    date:{type:Date}, 
    authorRole: {type:String} 
});

const presentationSchema = new mongoose.Schema({
    paperTitle: { type: String},
    conferenceTitle: { type: String },
    organizedBy: { type: String },
    indexedIn:{type:String},
    daysIndexed:{type:String}
});

const projectSchema = new mongoose.Schema({
    title: { type: String},
    agency: { type: String },
    grant: { type: String },
    status:{type:String}
});

const certificationSchema = new mongoose.Schema({
    name: { type: String},
    organization: { type: String },
    score: { type: String }
});

const fileSchema = new mongoose.Schema({
    fieldname: { type: String  },
    originalName: { type: String },
    encoding: { type: String },
    mimetype: { type: String },
    destination: { type: String },
    fileName: { type: String },
    path: { type: String },
    size: { type: Number }
});

const researchDevelopmentSchema = new mongoose.Schema({
    mail: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    universityName: {type: String},
    registrationDate: {type: Date},
    supervisorName: {type: String},
    prePhdCompletionDate: {type: Date},
    researchReviewsCompleted: {type: String},
    phdCompletionDate: {type: Date},
    registeredForPhd: {type: Boolean},
    receivedPhdIn2023: {type: Boolean},
    universityName2023: {type: String},
    registrationDate2023: {type: Date},
    supervisorName2023: {type: String},
    prePhdCompletionDate2023: {type: Date},
    researchReviewsCompleted2023: {type: String},
    phdCompletionDate2023: {type: Date},
    researchPublications: {type: [publicationSchema]},
    researchUploadedFiles: [fileSchema],
    presentationAndFDP: {type: [presentationSchema]},
    presentationAndFDPUplodedFiles: [fileSchema],
    fundedProjects: {type: [projectSchema]},
    fundedProjectsUploadedFiles: [fileSchema],
    certifications: {type: [certificationSchema]},
    certificationsUploadedFiles: [fileSchema],
    researchPublicationsApiScore: {type: Number},
    presentationAndFDPApiScore: {type: Number},
    fundedProjectsApiScore: {type: Number},
    certificationsApiScore: {type: Number},
    uploadedFiles: [fileSchema]
  });
  
  const ResearchDevelopment = mongoose.model('ResearchDevelopment', researchDevelopmentSchema);

const contributionsDataSchema = new mongoose.Schema({
    activity:{type:String},
    contribution:{type:String}
})

const contributionsUploadSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true
        },
    year:{
        type: Number,
        required: true
    },
    schoolContributions:{type:[contributionsDataSchema]},
    departmentContributions:{type:[contributionsDataSchema]},
    schoolUploadedFiles:{type:[fileSchema]},
    departmentUploadedFiles:{type:[fileSchema]},
    contributionSchoolApiScore:{type:Number},
    contributionDepartmentApiScore:{type:Number}
});

const ContributionsUpload = mongoose.model('ContributionsUpload',contributionsUploadSchema);

const extraContributionsSchema = new mongoose.Schema({
    responsibilities:{type:String},
    contributions:{type:String},
    status:{type:String}
})
const contributionsFormSchema = mongoose.Schema({
    mail: {
        type: String,
        required: true
        },
    year:{
        type: Number,
        required: true
        },
    contributions:{type:[extraContributionsSchema]},
    extraUploadedFiles:{type:[fileSchema]},
    contributionApiScore:{type:Number},
    textFieldValue:{type:String},
    extraAchivementUploadedFiles:{type:[fileSchema]},
    declarationChecked1:{type:Boolean},
    declarationChecked2:{type:Boolean}
});

const ContributionsForm = mongoose.model('ContributionsForm', contributionsFormSchema);


const appendFilePaths = (data, fieldName) => {
    if (!data || !data[fieldName]) return;
    data[fieldName] = data[fieldName].map(file => ({
        ...file,
        path: `${baseUrl}/uploads/${file.fileName}`
    }));
};
const addText = (page, text, font, x, y, size = 12) => {
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
    return y - size - 5;
};

const addFiles = (page, files, label, font, y) => {
    if (files && files.length) {
        y = addText(page, `${label}:`, font, 50, y, 14);
        files.forEach(file => {
            y = addText(page, `- ${file.originalName}: ${file.path}`, font, 60, y);
        });
    }
    return y;
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
//
const upload = multer({ storage: storage });

app.post('/register', async (request, response) => {
    const { mail, username, password, department } = request.body;
    try {
        const existingUser = await Credentials.findOne({ mail });
        if (existingUser) {
            return response.status(400).json({ error: 'User with Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newData = new Credentials({ mail, username, password: hashedPassword, department });
        await newData.save();
        const newProfile = new ProfileDetails({ mail });
        await newProfile.save();
        return response.json({ message: 'Account Created Successfully' });
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
});

app.post('/forgotPassword', async (request, response) => {
    const { mail } = request.body;
    try {
        const secretCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await Credentials.findOneAndUpdate(
            { mail },
            { $set: { secretCode } },
            { new: true }
        );

        if (!user) {
            return response.status(404).json({ error: 'User not found' });
        }

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.USER_PASSWORD
            }
        });

        var mailOptions = {
            from: process.env.USER_MAIL,
            to: mail,
            subject: 'Account Password Reset Code',
            text: `Your password reset code is: ${secretCode}`
        };

        await transporter.sendMail(mailOptions);
        response.send('Email sent successfully');
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
});

app.post('/resetPassword', async (request, response) => {
    const { mail, secretCode, newPassword } = request.body;
    try {
        const user = await Credentials.findOne({ mail, secretCode });
        if (!user) {
            return response.status(401).json({ error: 'Invalid secret code' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.secretCode = undefined;
        await user.save();

        response.json({ message: 'Password reset successful' });
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
});

app.post('/login', async (request, response) => {
    const { mail, password } = request.body;
    try {
        const user = await Credentials.findOne({ mail });

        if (!user) {
            return response.status(401).json({ error: 'Invalid User' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return response.status(401).json({ error: 'Invalid Password' });
        }

        const payload = { mail: mail };
        const jwtToken = jwt.sign(payload, process.env.SECRET_TOKEN);
        response.send({ jwtToken });

    } catch (err) {
        return response.status(500).json({ error: err.message });
    }
});

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
        response.status(401);
        response.send("Access Denied");
    } else {
        jwt.verify(jwtToken, process.env.SECRET_TOKEN, (error, payload) => {
            if (error) {
                response.status(401);
                response.send("Access Denied");
            } else {
                request.mail = payload.mail;
                next();
            }
        });
    }
};

app.post('/edit-profile', authenticateToken, async (request, response) => {
    let { mail } = request;
    const { image, firstname, lastname, gender, designation, dateOfjoining, experience, working, doctrate } = request.body;
    try {
        const updatedProfile = await ProfileDetails.findOneAndUpdate(
            { mail },
            {
                image,
                firstname,
                lastname,
                gender,
                designation,
                dateOfjoining,
                experience,
                working,
                doctrate
            },
            { new: true }
        );

        if (!updatedProfile) {
            return response.status(404).json({ error: 'User profile not found' });
        }

        response.json({ message: 'Profile updated successfully', updatedProfile });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

app.get("/profile-details", authenticateToken, async (request, response) => {
    const { mail } = request;
    try {
        const userProfile = await Credentials.aggregate([
            {
                $match: { mail: mail }
            },
            {
                $lookup: {
                    from: "profiledetails",
                    localField: "mail",
                    foreignField: "mail",
                    as: "userProfile"
                }
            },
            {
                $unwind: "$userProfile"
            },
            {
                $project: {
                    _id: 0,
                    mail: 1,
                    username: 1,
                    department: 1,
                    profile: "$userProfile",
                }
            }
        ]);
        if (userProfile.length === 0) {
            return response.status(404).json({ error: "No User Found!" });
        }
        response.json(userProfile[0]);
    } catch (error) {
        response.status(400).send("Server Error!");
    }
});

app.post('/save-academic-work', authenticateToken, upload.array('uploadedFiles'), async (request, response) => {
    const { mail } = request;
    const { year, averagePercentage, totalApiScore, extraMileDescription,extraMileApiScore } = request.body;
    const uploadedFiles = request.files;
    let semesters;
    let avgPercentage;

    try {
        semesters = JSON.parse(request.body.semesters);
    } catch (error) {
        console.error('Invalid JSON format for semesters:', error);
        return response.status(400).json({ error: 'Invalid JSON format for semesters' });
    }

    try {
        avgPercentage = JSON.parse(averagePercentage);
    } catch (error) {
        console.error('Invalid JSON format for averagePercentage:', error);
        return response.status(400).json({ error: 'Invalid JSON format for averagePercentage' });
    }

    try {
        const existingRecord = await AcademicWork.findOne({ mail, year });

        if (existingRecord) {
            const existingFiles = existingRecord.uploadedFiles;
            const newFiles = uploadedFiles.map(file => ({
                fieldname: file.fieldname,
                originalName: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                destination: file.destination,
                fileName: file.filename,
                path: file.path,
                size: file.size
            }));
            
            await AcademicWork.updateOne(
                { mail, year },
                {
                    semesters,
                    averagePercentage: avgPercentage,
                    totalApiScore,
                    extraMileDescription,
                    extraMileApiScore,
                    uploadedFiles: [...existingFiles, ...newFiles]
                }
            );
        } else {
            const newAcademicWork = new AcademicWork({
                mail,
                year,
                semesters,
                averagePercentage: avgPercentage,
                totalApiScore,
                extraMileDescription,
                extraMileApiScore,
                uploadedFiles: uploadedFiles.map(file => ({
                    fieldname: file.fieldname,
                    originalName: file.originalname,
                    encoding: file.encoding,
                    mimetype: file.mimetype,
                    destination: file.destination,
                    fileName: file.filename,
                    path: file.path,
                    size: file.size
                })),
            });

            await newAcademicWork.save();
        }

        response.status(200).json({ message: 'Academic work saved successfully' });
    } catch (error) {
        console.error('Error saving academic work:', error);
        response.status(500).json({ error: 'Unknown error occurred. Try again later.' });
    }
});

app.get('/academic-work/:year', authenticateToken, async (request, response) => {
    const { mail } = request;
    const { year } = request.params;

    try {
        const academicWork = await AcademicWork.findOne({ mail, year });

        if (!academicWork) {
            return response.status(404).json({ error: 'No academic work found for the specified year' });
        }

        response.json(academicWork);
    } catch (error) {
        console.error("Error fetching academic work:", error);
        response.status(500).json({ error: 'Server Error' });
    }
});

// Example endpoint to delete a file by ID
app.delete('/delete-file', authenticateToken, async (request, response) => {
    const { mail } = request;
    const { year, fileName } = request.body;

    try {
        const academicWork = await AcademicWork.findOne({ mail, year });
        if (!academicWork) {
            return response.status(404).json({ error: 'No academic work found for the specified year' });
        }

        const fileIndex = academicWork.uploadedFiles.findIndex(file => file.fileName === fileName);
        if (fileIndex === -1) {
            return response.status(404).json({ error: 'File not found' });
        }
        const filePath = path.join(__dirname, academicWork.uploadedFiles[fileIndex].path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); 
            academicWork.uploadedFiles.splice(fileIndex, 1);
            await academicWork.save();

            return response.status(200).json({ message: 'File deleted successfully' });
        } else {
            return response.status(404).json({ error: 'File not found on server' });
        }
    } catch (error) {
        console.error("Error deleting file:", error);
        response.status(500).json({ error: 'Server Error' });
    }
});

app.post('/save-research-development', authenticateToken, upload.fields([
    { name: 'researchUploadedFiles' },
    { name: 'presentationAndFDPUplodedFiles' },
    { name: 'fundedProjectsUploadedFiles' },
    { name: 'certificationsUploadedFiles' },
    { name: 'uploadedFiles' }
]), async (request, response) => {
    const { mail } = request;
    const {
        year,
        universityName,
        registrationDate,
        supervisorName,
        prePhdCompletionDate,
        researchReviewsCompleted,
        phdCompletionDate,
        registeredForPhd,
        receivedPhdIn2023,
        universityName2023,
        registrationDate2023,
        supervisorName2023,
        prePhdCompletionDate2023,
        researchReviewsCompleted2023,
        phdCompletionDate2023,
        researchPublications,
        presentationAndFDP,
        fundedProjects,
        certifications,
        researchPublicationsApiScore,
        presentationAndFDPApiScore,
        fundedProjectsApiScore,
        certificationsApiScore
    } = request.body;
    const researchUploadedFiles = request.files['researchUploadedFiles'] || [];
    const presentationAndFDPUplodedFiles = request.files['presentationAndFDPUplodedFiles'] || [];
    const fundedProjectsUploadedFiles = request.files['fundedProjectsUploadedFiles'] || [];
    const certificationsUploadedFiles = request.files['certificationsUploadedFiles'] || [];
    const uploadedFiles = request.files['uploadedFiles'] || [];

    try {
        let existingRecord = await ResearchDevelopment.findOne({ mail, year });
        if (existingRecord) {
            
            existingRecord.universityName = universityName;
            existingRecord.registrationDate = registrationDate;
            existingRecord.supervisorName = supervisorName;
            existingRecord.prePhdCompletionDate = prePhdCompletionDate;
            existingRecord.researchReviewsCompleted = researchReviewsCompleted;
            existingRecord.phdCompletionDate = phdCompletionDate;
            existingRecord.registeredForPhd = registeredForPhd;
            existingRecord.receivedPhdIn2023 = receivedPhdIn2023;
            existingRecord.universityName2023 = universityName2023;
            existingRecord.registrationDate2023 = registrationDate2023;
            existingRecord.supervisorName2023 = supervisorName2023;
            existingRecord.prePhdCompletionDate2023 = prePhdCompletionDate2023;
            existingRecord.researchReviewsCompleted2023 = researchReviewsCompleted2023;
            existingRecord.phdCompletionDate2023 = phdCompletionDate2023;
            existingRecord.researchPublications = JSON.parse(researchPublications);
            existingRecord.presentationAndFDP = JSON.parse(presentationAndFDP);
            existingRecord.fundedProjects = JSON.parse(fundedProjects);
            existingRecord.certifications = JSON.parse(certifications);
            existingRecord.researchPublicationsApiScore = researchPublicationsApiScore;
            existingRecord.presentationAndFDPApiScore = presentationAndFDPApiScore;
            existingRecord.fundedProjectsApiScore = fundedProjectsApiScore;
            existingRecord.certificationsApiScore = certificationsApiScore;
            existingRecord.researchUploadedFiles = [
                ...existingRecord.researchUploadedFiles,
                ...researchUploadedFiles.map(file => ({
                  fieldname: file.fieldname,
                  originalName: file.originalname,
                  encoding: file.encoding,
                  mimetype: file.mimetype,
                  destination: file.destination,
                  fileName: file.filename,
                  path: file.path,
                  size: file.size
                }))
              ];
              existingRecord.presentationAndFDPUplodedFiles = [
                ...existingRecord.presentationAndFDPUplodedFiles,
                ...presentationAndFDPUplodedFiles.map(file => ({
                  fieldname: file.fieldname,
                  originalName: file.originalname,
                  encoding: file.encoding,
                  mimetype: file.mimetype,
                  destination: file.destination,
                  fileName: file.filename,
                  path: file.path,
                  size: file.size
                }))
              ];
            
            existingRecord.fundedProjectsUploadedFiles = [
                ...existingRecord.fundedProjectsUploadedFiles,
                ...fundedProjectsUploadedFiles.map(file => ({
                  fieldname: file.fieldname,
                  originalName: file.originalname,
                  encoding: file.encoding,
                  mimetype: file.mimetype,
                  destination: file.destination,
                  fileName: file.filename,
                  path: file.path,
                  size: file.size
                }))
            ];
            existingRecord.certificationsUploadedFiles = [
                ...existingRecord.certificationsUploadedFiles,
                ...certificationsUploadedFiles.map(file => ({
                  fieldname: file.fieldname,
                  originalName: file.originalname,
                  encoding: file.encoding,
                  mimetype: file.mimetype,
                  destination: file.destination,
                  fileName: file.filename,
                  path: file.path,
                  size: file.size
                }))
            ];
            existingRecord.uploadedFiles = [
                ...existingRecord.uploadedFiles,
                ...uploadedFiles.map(file => ({
                  fieldname: file.fieldname,
                  originalName: file.originalname,
                  encoding: file.encoding,
                  mimetype: file.mimetype,
                  destination: file.destination,
                  fileName: file.filename,
                  path: file.path,
                  size: file.size
                }))
            ];

            await existingRecord.save();

            return response.status(200).json({ message: 'Research and Development data updated successfully' });
        }

        // If no existing record found, create a new one
        const newResearchDevelopment = new ResearchDevelopment({
            mail,
            year,
            universityName,
            registrationDate,
            supervisorName,
            prePhdCompletionDate,
            researchReviewsCompleted,
            phdCompletionDate,
            registeredForPhd,
            receivedPhdIn2023,
            universityName2023,
            registrationDate2023,
            supervisorName2023,
            prePhdCompletionDate2023,
            researchReviewsCompleted2023,
            phdCompletionDate2023,
            researchPublications:JSON.parse(researchPublications),
            researchUploadedFiles: researchUploadedFiles.map(file => ({
                fieldname: file.fieldname,
                originalName: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                destination: file.destination,
                fileName: file.filename,
                path: file.path,
                size: file.size
            })),
            presentationAndFDP: JSON.parse(presentationAndFDP),
            presentationAndFDPUplodedFiles: presentationAndFDPUplodedFiles.map(file => ({
                fieldname: file.fieldname,
                originalName: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                destination: file.destination,
                fileName: file.filename,
                path: file.path,
                size: file.size
            })),
            fundedProjects:JSON.parse(fundedProjects),
            fundedProjectsUploadedFiles: fundedProjectsUploadedFiles.map(file => ({
                fieldname: file.fieldname,
                originalName: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                destination: file.destination,
                fileName: file.filename,
                path: file.path,
                size: file.size
            })),
            certifications:JSON.parse(certifications),
            certificationsUploadedFiles: certificationsUploadedFiles.map(file => ({
                fieldname: file.fieldname,
                originalName: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                destination: file.destination,
                fileName: file.filename,
                path: file.path,
                size: file.size
            })),
            researchPublicationsApiScore,
            presentationAndFDPApiScore,
            fundedProjectsApiScore,
            certificationsApiScore,
            uploadedFiles: uploadedFiles.map(file => ({
                fieldname: file.fieldname,
                originalName: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                destination: file.destination,
                fileName: file.filename,
                path: file.path,
                size: file.size
            }))
        });

        await newResearchDevelopment.save();

        return response.status(200).json({ message: 'Research and Development data saved successfully' });
    } catch (error) {
        response.status(500).json({ error: 'Unknown error occurred. Try again later.' });
    }
});

app.get('/research-development/:year', authenticateToken, async (request, response) => {
    const { mail } = request;
    const { year } = request.params;

    try {
        const researchDevelopment = await ResearchDevelopment.findOne({ mail, year });

        if (!researchDevelopment) {
            return response.status(404).json({ error: 'No Data found for the specified year' });
        }

        response.json(researchDevelopment);
    } catch (error) {
        console.error("Error fetching academic work:", error);
        response.status(500).json({ error: 'Server Error' });
    }
});

app.delete('/delete-research-development-file', authenticateToken, async (req, res) => {
    const { mail } = req;
    const { year, fileName, fileType } = req.body;
    try {
        const researchDevelopment = await ResearchDevelopment.findOne({ mail, year });
        if (!researchDevelopment) {
          return res.status(404).json({ error: 'No research development data found for the specified year' });
        }
    
        let fileArray;
        switch (fileType) {
          case 'researchUploadedFiles':
            fileArray = researchDevelopment.researchUploadedFiles;
            break;
          case 'presentationAndFDPUplodedFiles':
            fileArray = researchDevelopment.presentationAndFDPUplodedFiles;
            break;
          case 'fundedProjectsUploadedFiles':
            fileArray = researchDevelopment.fundedProjectsUploadedFiles;
            break;
          case 'certificationsUploadedFiles':
            fileArray = researchDevelopment.certificationsUploadedFiles;
            break;
         case 'uploadedFiles':
            fileArray = researchDevelopment.uploadedFiles;
          default:
            return res.status(400).json({ error: 'Invalid file type' });
        }
    
        const fileIndex = fileArray.findIndex(file => file.fileName === fileName);
        if (fileIndex === -1) {
          return res.status(404).json({ error: 'File not found' });
        }
    
        const filePath = path.join(__dirname, fileArray[fileIndex].path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          fileArray.splice(fileIndex, 1);
          await researchDevelopment.save();
    
          return res.status(200).json({ message: 'File deleted successfully' });
        } else {
          return res.status(404).json({ error: 'File not found on server' });
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ error: 'Server Error' });
      }
    });


    app.post('/save-contributions-upload', authenticateToken, upload.fields([
        {name: 'schoolUploadedFiles'},
        {name: 'departmentUploadedFiles'}
      ]), async (request, response) => {
        try {
          const {year, schoolContributions, departmentContributions, contributionSchoolApiScore, contributionDepartmentApiScore} = request.body;
          const schoolUploadedFiles = request.files['schoolUploadedFiles'] || [];
          const departmentUploadedFiles = request.files['departmentUploadedFiles'] || [];
      
          let schoolContributionsParsed;
          let departmentContributionsParsed;
      
          try {
            schoolContributionsParsed = JSON.parse(schoolContributions);
          } catch (error) {
            console.error('Invalid JSON format for schoolContributions:', error);
            return response.status(400).json({ error: 'Invalid JSON format for schoolContributions' });
          }
      
          try {
            departmentContributionsParsed = JSON.parse(departmentContributions);
          } catch (error) {
            console.error('Invalid JSON format for departmentContributions:', error);
            return response.status(400).json({ error: 'Invalid JSON format for departmentContributions' });
          }
          const {mail} = request; // Assuming you're storing the user's mail in the request
      
          const existingRecord = await ContributionsUpload.findOne({mail, year});
      
          if (existingRecord) {
            const existingSchoolFiles = existingRecord.schoolUploadedFiles;
            const existingDepartmentFiles = existingRecord.departmentUploadedFiles;
            const newSchoolFiles = schoolUploadedFiles.map(file => ({
              fieldname: file.fieldname,
              originalName: file.originalname,
              encoding: file.encoding,
              mimetype: file.mimetype,
              destination: file.destination,
              fileName: file.filename,
              path: file.path,
              size: file.size
            }));
            const newDepartmentFiles = departmentUploadedFiles.map(file => ({
              fieldname: file.fieldname,
              originalName: file.originalname,
              encoding: file.encoding,
              mimetype: file.mimetype,
              destination: file.destination,
              fileName: file.filename,
              path: file.path,
              size: file.size
            }));
      
            await ContributionsUpload.updateOne(
              { mail, year },
              {
                schoolContributions: schoolContributionsParsed,
                departmentContributions: departmentContributionsParsed,
                contributionSchoolApiScore: parseInt(contributionSchoolApiScore),
                contributionDepartmentApiScore: parseInt(contributionDepartmentApiScore),
                schoolUploadedFiles: [...existingSchoolFiles,...newSchoolFiles],
                departmentUploadedFiles: [...existingDepartmentFiles,...newDepartmentFiles]
              }
            );
          } else {
            const newContributionsUpload = new ContributionsUpload({
              mail,
              year: parseInt(year),
              schoolContributions: schoolContributionsParsed,
              departmentContributions: departmentContributionsParsed,
              contributionSchoolApiScore: parseInt(contributionSchoolApiScore),
              contributionDepartmentApiScore: parseInt(contributionDepartmentApiScore),
              schoolUploadedFiles: schoolUploadedFiles.map(file => ({
                fieldname: file.fieldname,
                originalName: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                destination: file.destination,
                fileName: file.filename,
                path: file.path,
                size: file.size
              })),
              departmentUploadedFiles: departmentUploadedFiles.map(file => ({
                fieldname: file.fieldname,
                originalName: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                destination: file.destination,
                fileName: file.filename,
                path: file.path,
                size: file.size
              })),
            });
            await newContributionsUpload.save();
          }
      
          response.status(200).json({ message: 'Contributions saved successfully' });
        } catch (error) {
          console.error('Error saving contributions:', error);
          response.status(500).json({ error: 'Unknown error occurred. Try again later.' });
        }
      });

app.get('/contribution/upload/:year', authenticateToken, async (request, response) => {
        const year = parseInt(request.params.year);
        const {mail} = request; 
        try {
            const contributionUpload = await ContributionsUpload.findOne({ mail, year });
    
            if (!contributionUpload) {
               response.status(404).json({ message: 'No contributions found for the specified year' });
            }
            response.json(contributionUpload)

        } catch (error) {
            console.error('Error fetching contributions:', error);
            response.status(500).json({ error: 'Unknown error occurred. Try again later.' });
        }
    });

app.delete('/delete-contributions-uploaded-file', authenticateToken, async (req, res) => {
        const { mail } = req;
        const { year, fileName, fileType } = req.body;
      
        try {
          const contributionsUpload = await ContributionsUpload.findOne({ mail, year });
      
          if (!contributionsUpload) {
            return res.status(404).json({ error: 'No contributions data found for the specified year' });
          }
      
          let fileArray;
          switch (fileType) {
            case 'schoolUploadedFiles':
              fileArray = contributionsUpload.schoolUploadedFiles;
              break;
            case 'departmentUploadedFiles':
              fileArray = contributionsUpload.departmentUploadedFiles;
              break;
            default:
              return res.status(400).json({ error: 'Invalid file type' });
          }
      
          const fileIndex = fileArray.findIndex(file => file.fileName === fileName);
          if (fileIndex === -1) {
            return res.status(404).json({ error: 'File not found' });
          }
      
          const filePath = path.join(__dirname, fileArray[fileIndex].path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            fileArray.splice(fileIndex, 1);
            await contributionsUpload.save();
      
            return res.status(200).json({ message: 'File deleted successfully' });
          } else {
            return res.status(404).json({ error: 'File not found on server' });
          }
        } catch (error) {
          console.error("Error deleting file:", error);
          res.status(500).json({ error: 'Server Error' });
        }
    });

    app.post('/save-contributions-form', authenticateToken, upload.fields([
        { name: 'extraUploadedFiles' },
        { name: 'extraAchivementUploadedFiles' }
      ]), async (req, res) => {
        try {
           const { mail } = req;
          const {year, textFieldValue,contributionApiScore, declarationChecked1, declarationChecked2 } = req.body;
          let contributionsParsed;
      
          try {
            contributionsParsed = JSON.parse(req.body.contributions);
          } catch (error) {
            console.error('Invalid JSON format for contributions:', error);
            return res.status(400).json({ error: 'Invalid JSON format for contributions' });
          }
      
          const extraUploadedFiles = req.files['extraUploadedFiles'] || [];
          const extraAchivementUploadedFiles = req.files['extraAchivementUploadedFiles'] || [];
      
          const extraUploadedFilesData = extraUploadedFiles.map(file => ({
            fieldname: file.fieldname,
            originalName: file.originalname,
            encoding: file.encoding,
            mimetype: file.mimetype,
            destination: file.destination,
            fileName: file.filename,
            path: file.path,
            size: file.size
          }));
      
          const extraAchivementUploadedFilesData = extraAchivementUploadedFiles.map(file => ({
            fieldname: file.fieldname,
            originalName: file.originalname,
            encoding: file.encoding,
            mimetype: file.mimetype,
            destination: file.destination,
            fileName: file.filename,
            path: file.path,
            size: file.size
          }));
      
          const existingRecord = await ContributionsForm.findOne({ mail, year });
      
          if (existingRecord) {
            existingRecord.contributions = contributionsParsed;
            existingRecord.extraUploadedFiles = [...existingRecord.extraUploadedFiles, ...extraUploadedFilesData];
            existingRecord.textFieldValue = textFieldValue;
            existingRecord.contributionApiScore = contributionApiScore;
            existingRecord.extraAchivementUploadedFiles = [...existingRecord.extraAchivementUploadedFiles, ...extraAchivementUploadedFilesData];
            existingRecord.declarationChecked1 = declarationChecked1;
            existingRecord.declarationChecked2 = declarationChecked2;
      
            await existingRecord.save();
          } else {
            const newContributionsForm = new ContributionsForm({
              mail,
              year: parseInt(year),
              contributions: contributionsParsed,
              extraUploadedFiles: extraUploadedFilesData,
              textFieldValue,
              contributionApiScore,
              extraAchivementUploadedFiles: extraAchivementUploadedFilesData,
              declarationChecked1,
              declarationChecked2
            });
            await newContributionsForm.save();
          }
      
          res.status(200).json({ message: 'Contributions saved successfully' });
        } catch (error) {
          console.error('Error saving contributions:', error);
          res.status(500).json({ error: 'Unknown error occurred. Try again later.' });
        }
      });
app.get('/contribution/form/:year', authenticateToken, async (request, response) => {
const year = parseInt(request.params.year);
const {mail} = request; 
try {
    const contributionForm = await ContributionsForm.findOne({ mail, year });

    if (!contributionForm) {
        response.status(404).json({ message: 'No contributions found for the specified year' });
    }
    response.json(contributionForm)

} catch (error) {
    console.error('Error fetching contributions:', error);
    response.status(500).json({ error: 'Unknown error occurred. Try again later.' });
}
});

app.delete('/delete-contributions-form-file', authenticateToken, async (req, res) => {
    const { mail } = req;
    const { year, fileName, fileType } = req.body;
    try {
      const contributionsUpload = await ContributionsForm.findOne({ mail, year });
  
      if (!contributionsUpload) {
        return res.status(404).json({ error: 'No contributions data found for the specified year' });
      }
  
      let fileArray;
      switch (fileType) {
        case 'extraUploadedFiles':
          fileArray = contributionsUpload.extraUploadedFiles;
          break;
        case 'extraAchivementUploadedFiles':
          fileArray = contributionsUpload.extraAchivementUploadedFiles;
          break;
        default:
          return res.status(400).json({ error: 'Invalid file type' });
      }
      const fileIndex = fileArray.findIndex(file => file.fileName === fileName);
      if (fileIndex === -1) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      const filePath = path.join(__dirname, fileArray[fileIndex].path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        fileArray.splice(fileIndex, 1);
        await contributionsUpload.save();
  
        return res.status(200).json({ message: 'File deleted successfully' });
      } else {
        return res.status(404).json({ error: 'File not found on server' });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ error: 'Server Error' });
    }
});

app.get('/api/generate-pdf', authenticateToken, async (req, res) => {
    try {
        const { year } = req.query;
        const { mail } = req;

        const [credentials, profile, academicWork, researchDevelopment, contributionsUpload, contributionsForm] = await Promise.all([
            Credentials.findOne({ mail }).lean(),
            ProfileDetails.findOne({ mail }).lean(),
            AcademicWork.findOne({ mail, year }).lean(),
            ResearchDevelopment.findOne({ mail, year }).lean(),
            ContributionsUpload.findOne({ mail, year }).lean(),
            ContributionsForm.findOne({ mail, year }).lean()
        ]);

        appendFilePaths(academicWork, 'uploadedFiles');
        appendFilePaths(researchDevelopment, 'researchUploadedFiles');
        appendFilePaths(researchDevelopment, 'presentationAndFDPUplodedFiles');
        appendFilePaths(researchDevelopment, 'fundedProjectsUploadedFiles');
        appendFilePaths(researchDevelopment, 'certificationsUploadedFiles');
        appendFilePaths(contributionsUpload, 'schoolUploadedFiles');
        appendFilePaths(contributionsUpload, 'departmentUploadedFiles');
        appendFilePaths(contributionsForm, 'extraUploadedFiles');
        appendFilePaths(contributionsForm, 'extraAchivementUploadedFiles');

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        let y = 750;
        const addText = (text, x = 50, fontSize = 12) => {
            page.drawText(text, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= 20;
        };

        const addFiles = (files, label) => {
            if (files && files.length) {
                addText(`${label}:`);
                files.forEach(file => {
                    addText(`- ${file.originalName}: ${file.path}`, 60);
                });
            }
        };

        addText('Consolidated Data Report', 50, 16);

        if (credentials) {
            addText('Credentials:', 50, 14);
            addText(`- Mail: ${credentials.mail}`);
            addText(`- Username: ${credentials.username}`);
            addText(`- Department: ${credentials.department}`);
        }

        if (profile) {
            addText('Profile:', 50, 14);
            addText(`- Mail: ${profile.mail}`);
            addText(`- First Name: ${profile.firstname}`);
            addText(`- Last Name: ${profile.lastname}`);
            addText(`- Gender: ${profile.gender}`);
            addText(`- Designation: ${profile.designation}`);
            addText(`- Date of Joining: ${profile.dateOfjoining}`);
            addText(`- Experience: ${profile.experience} years`);
        }

        if (academicWork) {
            addText('Academic Work:', 50, 14);
            addText(`- Year: ${academicWork.year}`);
            if (academicWork.semesters && academicWork.semesters.length) {
                academicWork.semesters.forEach(semester => {
                    addText(`  - Semester: ${semester.name}`, 70);
                    semester.courses.forEach(course => {
                        addText(`    - Course: ${course.name}`, 80);
                        addText(`      - Scheduled Classes: ${course.scheduledClasses}`, 90);
                        addText(`      - Classes Held: ${course.classesHeld}`, 90);
                        addText(`      - Pass Percentage: ${course.passPercentage}`, 90);
                        addText(`      - API Score Results: ${course.apiScoreResults}`, 90);
                        addText(`      - Student Feedback: ${course.studentFeedback}`, 90);
                        addText(`      - API Score Feedback: ${course.apiScoreFeedback}`, 90);
                    });
                });
            }
            addText(`- Average Percentage:`, 60);
            addText(`  - Pass Percentage: ${academicWork.averagePercentage.passPercentage}`, 70);
            addText(`  - Feedback Percentage: ${academicWork.averagePercentage.feedbackPercentage}`, 70);
            addText(`- Total API Score: ${academicWork.totalApiScore}`, 60);
            addText(`- Extra Mile Description: ${academicWork.extraMileDescription}`, 60);
            addText(`- Extra Mile API Score: ${academicWork.extraMileApiScore}`, 60);
            addFiles(academicWork.uploadedFiles, 'Academic Work Files');
        }

        if (researchDevelopment) {
            addText('Research Development:', 50, 14);
            addText(`- Year: ${researchDevelopment.year}`);
            addText(`- University Name: ${researchDevelopment.universityName}`);
            addText(`- Registration Date: ${researchDevelopment.registrationDate}`);
            addText(`- Supervisor Name: ${researchDevelopment.supervisorName}`);
            addText(`- Pre-PhD Completion Date: ${researchDevelopment.prePhdCompletionDate}`);
            addText(`- Research Reviews Completed: ${researchDevelopment.researchReviewsCompleted}`);
            addText(`- PhD Completion Date: ${researchDevelopment.phdCompletionDate}`);
            addText(`- Registered for PhD: ${researchDevelopment.registeredForPhd}`);
            addFiles(researchDevelopment.researchUploadedFiles, 'Research Development Files');
            addFiles(researchDevelopment.presentationAndFDPUplodedFiles, 'Presentation and FDP Files');
            addFiles(researchDevelopment.fundedProjectsUploadedFiles, 'Funded Projects Files');
            addFiles(researchDevelopment.certificationsUploadedFiles, 'Certifications Files');
        }

        if (contributionsUpload) {
            addText('Contributions Upload:', 50, 14);
            addFiles(contributionsUpload.schoolUploadedFiles, 'School Contributions Files');
            addFiles(contributionsUpload.departmentUploadedFiles, 'Department Contributions Files');
        }

        if (contributionsForm) {
            addText('Contributions Form:', 50, 14);
            addFiles(contributionsForm.extraUploadedFiles, 'Extra Contributions Files');
            addFiles(contributionsForm.extraAchivementUploadedFiles, 'Extra Achievement Files');
        }

        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="consolidated-data.pdf"');
        res.send(pdfBytes);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});


app.get("/", (request, response) => {
    response.send("welcome to Server");
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("server running"));
