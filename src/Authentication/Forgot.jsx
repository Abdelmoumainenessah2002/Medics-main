import React, { useState, useEffect } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../database';
import { useNavigate } from 'react-router-dom';
import '../css/general.css';
import '../css/auth.css';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already logged in
        const userIsLoggedIn = localStorage.getItem('userIsLoggedIn');
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (userIsLoggedIn && userData) {
            // Navigate to the appropriate home page
            if (userData.role === 'doctor') {
                navigate('/doctors/home');
            } else if (userData.role === 'sick') {
                navigate('/sicks/home');
            }
        }
    }, [navigate]);

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
