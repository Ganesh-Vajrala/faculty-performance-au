/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpinnerCircularFixed } from 'spinners-react';
import './index.css';

const Login = ({ history }) => {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [showSubmitMessage, setShowSubmitMessage] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    const [resetPasswordMode, setResetPasswordMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  const jwtToken = Cookies.get('jwt_token');

  useEffect(() => {
    if (jwtToken !== undefined) {
      navigate("/", { replace: true });
    }
  }, [jwtToken, navigate]);

    const onChangeMail = (event) => {
        setMail(event.target.value);
    };

    const onChangeCode = (event) => {
        setCode(event.target.value);
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };
    const onSubmitSuccess = (jwtToken) => {
        Cookies.set('jwt_token', jwtToken, {
            expires: 5,
            path: '/',
        });
        Cookies.set('login_mail', mail, {
            expires: 5,
            path: '/',
        });
       
        navigate('/',{ replace: true });
    };

    const onSubmitFailure = (errorMsg) => {
        setShowSubmitMessage(true);
        setErrorMsg(errorMsg);
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setLoading(true);
        const userDetails = { mail, password };
        const url = "http://localhost:3100/login/";

        try {
            const response = await Axios.post(url, userDetails);

            if (response.data && response.data.jwtToken) {
                toast.success('Login Successful !');
                onSubmitSuccess(response.data.jwtToken);
            } else {
                onSubmitFailure(response.data.error);
            }
        } catch (error) {
            onSubmitFailure(error.response.data.error);
        }finally {
            setLoading(false); 
        }
    };
    const onSubmitForgotSuccess = (data) =>{
        toast.success('Code Sent to your Mail');
        setForgotPasswordMode(false);
        setResetPasswordMode(true);
    }

    const FPsubmitForm = async (event) => {
        event.preventDefault();
        setLoading(true);
        setPassword("");
        setCode("");
        setErrorMsg("");
        setShowSubmitMessage(false);
        const userDetails = {mail};
        const url = "http://localhost:3100/forgotPassword/";
        try {
            const response = await Axios.post(url, userDetails);
            if (response.data) {
                console.log(response.data)
                onSubmitForgotSuccess(response.data);
            } else {
                onSubmitFailure(response.data.error);
            }
        } catch (error) {
            onSubmitFailure(error.response.data.error);
        }finally {
            setLoading(false); 
        }
    };

    const toggleResetPasswordMode = () => {
        setForgotPasswordMode(false);
        setShowSubmitMessage(false);
        setResetPasswordMode(false);
        setCode("");
        setMail("");
        setPassword("");
    };

    const onSubmitResetSuccess = (data) =>{
        console.log(data);
        toast.success('Password Successfully Updated !');
        toggleResetPasswordMode();
    }
    const onSubmitResetFailure = (errorMsg) =>{
        setShowSubmitMessage(true);
        setErrorMsg(errorMsg);
    }

    const RPsubmitForm = async (event) => {
        event.preventDefault();
        setLoading(true);
        const newPassword = password;
        const secretCode = code;
        const userDetails ={mail, secretCode, newPassword};
        const url = "http://localhost:3100/resetPassword/";
        try {
            const response = await Axios.post(url, userDetails);
            if (response.data) {
                console.log(response.data)
                onSubmitResetSuccess(response.data);
            } else {
                onSubmitResetFailure(response.data.error);
            }
        } catch (error) {
            onSubmitResetFailure(error.response.data.error);
        }finally {
            setLoading(false);
        }

    };

    const toggleForgotPasswordMode = () => {
        setForgotPasswordMode(true);
        setResetPasswordMode(false);
        setShowSubmitMessage(false);
        setMail("");
        setPassword("");
        setCode("");

    };

    
    const renderPasswordField = () => (
        <>
            <label className="input-label" htmlFor="userpassword">
                PASSWORD
            </label>
            <input
                type="password"
                id="userpassword"
                placeholder="PASSWORD"
                className="password-input-field"
                value={password}
                onChange={onChangePassword}
            />
        </>
    );

    const renderMailField = () => (
        <>
            <label className="input-label" htmlFor="usermail">
                USERMAIL
            </label>
            <input
                type="text"
                id="usermail"
                className="mail-input-field"
                placeholder="USERMAIL"
                value={mail}
                onChange={onChangeMail}
            />
        </>
    );

    const renderCodeField = () => (
        <>
            <label className="input-label" htmlFor="usercode">
                SECRETCODE
            </label>
            <input
                type="text"
                id="usermail"
                className="mail-input-field"
                placeholder="SECRETCODE"
                value={code}
                onChange={onChangeCode}
            />
        </>
    );

    const renderResetPasswordContent = () => (
        <form className="login-form-container" onSubmit={RPsubmitForm}>
            <img
                src="https://imgs.search.brave.com/jCVskrY9DhrUyR0CX-_mWggPcWFCuQbn577jDQ7AYaY/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9iL2I1L0xv/Z29fQW51cmFnX1Vu/aXZlcnNpdHkuc3Zn/LzUxMnB4LUxvZ29f/QW51cmFnX1VuaXZl/cnNpdHkuc3ZnLnBu/Zw"
                className="website-logo-image"
                alt="website-logo"
            />
            <div className="resetPasswordDescription-container">
                <p className="resetPasswordDescription">
                    Please enter a new password for your account.
                </p>
            </div>
            <div className="input-container">{renderMailField()}</div>
            <div className="input-container">{renderCodeField()}</div>
            <div className="input-container">{renderPasswordField()}</div>
            <button type="submit" className="login-button">
                {loading ? <SpinnerCircularFixed size={24} thickness={100} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(0, 0, 0, 0)" /> : "Reset Password"}
            </button>
            {showSubmitMessage && <p className="error-message">*{errorMsg}</p>}
            <div className="forgot-password-container">
                <a href="/login" className="forgot-password-element" onClick={toggleResetPasswordMode}>
                    Back to Login
                </a>
            </div>
            <div className="account-register-section-container">
                <p className="account-register-section-elementone">Don't have an account?</p>
                <Link to="/register" className="account-register-section-elementtwo">
                    <p>Create One</p>
                </Link>
            </div>
        </form>
    );

    const renderForgotPasswordContent = () => (
        <form className="login-form-container" onSubmit={FPsubmitForm}>
            
            <img
                src="https://imgs.search.brave.com/jCVskrY9DhrUyR0CX-_mWggPcWFCuQbn577jDQ7AYaY/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9iL2I1L0xv/Z29fQW51cmFnX1Vu/aXZlcnNpdHkuc3Zn/LzUxMnB4LUxvZ29f/QW51cmFnX1VuaXZl/cnNpdHkuc3ZnLnBu/Zw"
                className="website-logo-image"
                alt="website-logo"
            />
            <div className="resetPasswordDescription-container">
                <p className="resetPasswordDescription">
                    Please enter your email address, and we'll send you a password reset Code
                </p>
            </div>
            <div className="input-container">{renderMailField()}</div>
            <button type="submit" className="login-button">
            {loading ? <SpinnerCircularFixed size={24} thickness={100} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(0, 0, 0, 0)" /> : "Reset Password"}
            </button>
            {showSubmitMessage && <p className="error-message">*{errorMsg}</p>}
            
            <div className="account-register-section-container">
                <p className="account-register-section-elementone">Don't have an account?</p>
                <Link to="/register" className="account-register-section-elementtwo">
                    <p>Create One</p>
                </Link>
            </div>
        </form>
    );

    const renderLoginFormContent = () => (
        <form className="login-form-container" onSubmit={submitForm}>
            <img
                src="https://imgs.search.brave.com/jCVskrY9DhrUyR0CX-_mWggPcWFCuQbn577jDQ7AYaY/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9iL2I1L0xv/Z29fQW51cmFnX1Vu/aXZlcnNpdHkuc3Zn/LzUxMnB4LUxvZ29f/QW51cmFnX1VuaXZl/cnNpdHkuc3ZnLnBu/Zw"
                className="website-logo-image"
                alt="website-logo"
            />
            <div className="input-container">{renderMailField()}</div>
            <div className="input-container">{renderPasswordField()}</div>
            <button type="submit" className="login-button">
               {loading ? <SpinnerCircularFixed size={24} thickness={100} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(0, 0, 0, 0)" /> : "Login"}
            </button>
            {showSubmitMessage && <p className="error-message">*{errorMsg}</p>}
            <div className="forgot-password-container">
                <a className="forgot-password-element" href="#" onClick={toggleForgotPasswordMode}>
                    <p>Forgot Password?</p>
                </a>
            </div>
            <div className="account-register-section-container">
                <p className="account-register-section-elementone">Don't have an account?</p>
                <Link to="/register" className="account-register-section-elementtwo">
                    <p>Create One</p>
                </Link>
            </div>
        </form>
    );

    return (  
        <div className="login-container">
            {forgotPasswordMode
                ? renderForgotPasswordContent()
                : resetPasswordMode
                ? renderResetPasswordContent()
                : renderLoginFormContent()}
            
        </div>
    );
};

export default Login;
