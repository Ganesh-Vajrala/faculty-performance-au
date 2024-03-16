/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { SpinnerCircularFixed } from 'spinners-react';

import './index.css';

const Register = () => {
    const departments = ["Information Technology", "Computer Science", "Cyber Security","Artifical Intelligence", "Data Science"];
    const [username, setUsername] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [showSubmitMessage, setShowSubmitMessage] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const jwtToken = Cookies.get('jwt_token');
    useEffect(() => {
        if (jwtToken !== undefined) {
          navigate("/", { replace: true });
        }
      }, [jwtToken, navigate]);

    
    const onSubmitRegisterSuccess = (data) =>{
        console.log(data.message);
        navigate("/login", { replace: true });
    }

    const onSubmitRegisterFailure = (errorMsg) =>{
        console.log(errorMsg)
        setShowSubmitMessage(true);
        setErrorMsg(errorMsg);
    }

    const submitForm = async (event) => {
        event.preventDefault();
        setLoading(true);
        const userDetails = { mail, username, password, department };
        const url = "http://localhost:3100/register/";

        try {
            const response = await Axios.post(url, userDetails);
            if (response.data) {
                toast.success('Account Successfully Created !');
                onSubmitRegisterSuccess(response.data);
            } else {
                onSubmitRegisterFailure(response.data.error);
            }
        } catch (error) {
            onSubmitRegisterFailure(error.response.data.error);
        }finally {
            setLoading(false);
        }
    };

    const onChangeMail = (event) => {
        setMail(event.target.value);
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const onChangeName = (event) => {
        setUsername(event.target.value);
    };

    const onChangeDepartment = (event) => {
        setDepartment(event.target.value);
    };

    const renderPasswordField = () => {
        return (
            <>
                <label className="input-label" htmlFor="userpassword">
                    PASSWORD
                </label>
                <input
                    type="password"
                    id="userpassword"
                    placeholder="PASSWORD"
                    className="passwordr-input-field"
                    value={password}
                    onChange={onChangePassword}
                />
            </>
        );
    };

    const renderNameField = () => {
        return (
            <>
                <label className="input-label" htmlFor="username">
                    USERNAME
                </label>
                <input
                    type="text"
                    id="username"
                    placeholder="USERNAME"
                    className="usernamer-input-field"
                    value={username}
                    onChange={onChangeName}
                />
            </>
        );
    };

    const renderDepartmentField = () => {
        return (
            <>
                <label className="input-label" htmlFor="department">
                    DEPARTMENT
                </label>
                <select
                id="department"
                className="departmentr-input-field"
                value={department}
                onChange={onChangeDepartment}
            >
                <option value="" disabled>
                    Select Department
                </option>
                {departments.map((dept) => (
                    <option key={dept} value={dept}>
                        {dept}
                    </option>
                ))}
            </select>
            </>
        );
    };

    const renderMailField = () => {
        return (
            <>
                <label className="input-label" htmlFor="usermail">
                    USERMAIL
                </label>
                <input
                    type="text"
                    id="usermail"
                    className="mailr-input-field"
                    placeholder="USERMAIL"
                    value={mail}
                    onChange={onChangeMail}
                />
            </>
        );
    };

    return (
        <div className="register-main-container">
            <form className="register-form-container" onSubmit={submitForm}>
                <img
                    src="https://imgs.search.brave.com/jCVskrY9DhrUyR0CX-_mWggPcWFCuQbn577jDQ7AYaY/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9iL2I1L0xv/Z29fQW51cmFnX1Vu/aXZlcnNpdHkuc3Zn/LzUxMnB4LUxvZ29f/QW51cmFnX1VuaXZl/cnNpdHkuc3ZnLnBu/Zw"
                    className="website-logo-image"
                    alt="website-logo"
                />
                <div className="input-container">{renderNameField()}</div>
                <div className="input-container">{renderMailField()}</div>
                <div className="input-container">{renderPasswordField()}</div>
                <div className="input-container">{renderDepartmentField()}</div>
                <button type="submit" className="register-button">
                {loading ? <SpinnerCircularFixed size={24} thickness={100} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(0, 0, 0, 0)" /> : "Create Now"}
                </button>
                {showSubmitMessage && <p className="error-message">*{errorMsg}</p>}
                <div className="account-register-section-container">
                    <p className="account-register-section-elementone">Already a User?</p>
                    <Link to="/login" className="account-register-section-elementtwo">
                        <p>Login</p>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
