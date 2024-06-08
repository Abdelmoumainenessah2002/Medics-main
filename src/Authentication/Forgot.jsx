import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../database';
import '../css/general.css';
import '../css/auth.css';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent!');
            setMessageType('success');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setMessageType('error');
        }
    };

    return (
        <>
            <header>
                <div className="container">
                    <div className="header-content">
                        <div className="logo">
                            <h2>
                                <a href="/">Wasalni</a>
                            </h2>
                        </div>
                        <div className="start">
                            <a href="login.html" className="start-btn">Sign In</a>
                        </div>
                    </div>
                </div>
            </header>
            <div className="forgot-pass login">
                <div className="wrapper">
                    <h2>Reset Password</h2>
                    <p style={{ marginTop: '10px' }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <form className="login-form" onSubmit={handleResetPassword}>
                        <div className="input-box">
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>
                        <div className="input-box button">
                            <input type="submit" value="Reset Password" />
                        </div>
                        <div className="err" style={{ color: messageType === 'success' ? 'green' : 'red' }}>
                            {message}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
