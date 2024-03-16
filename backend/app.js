const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt  = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
require('dotenv').config()
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

credentialsSchema.pre('save', async function (next) {
    try {
        next();
    } catch (err) {
        next(err);
    }
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
        const newProfile = new ProfileDetails({mail});
        await newProfile.save();
        return response.json({message: 'Account Created Successfully'});
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

        const result = await transporter.sendMail(mailOptions);
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
        const payload = {mail:mail};
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
      jwt.verify(jwtToken, process.env.SECRET_TOKEN, async (error, payload) => {
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
    let {mail} = request
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

app.get("/profile-details", authenticateToken, async (request, response)=>{
    const {mail} = request;
    try {
        const userProfile = await Credentials.aggregate([
            {
                $match:{mail:mail}
            },
            {
                $lookup:{
                    from:"profiledetails",
                    localField:"mail",
                    foreignField:"mail",
                    as:"userProfile"
                }
            },
            {
              $unwind:"$userProfile"
            },
            {
                $project:{
                    _id:0,
                    mail:1,
                    username:1,
                    department:1,
                    profile:"$userProfile",
                
                }
            }

        ]);
        if(userProfile.length === 0){
            return response.status(404).json({ error: "No User Found!" });
        }
        response.json(userProfile[0]);
    }catch(error){
        response.status(400).send("Server Error!");
    }

});

const PORT = process.env.PORT

app.listen(PORT, () => console.log("server running"));
 