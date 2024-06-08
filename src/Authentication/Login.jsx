import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../database';
import '../css/general.css';
import '../css/auth.css';

const Login = () => {

  document.title = "Medics || Login"; // Change the title of the web page

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            // Sign in with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user data from Firestore
            const doctorDoc = await getDoc(doc(db, 'doctors', user.uid));
            const sickDoc = await getDoc(doc(db, 'sicks', user.uid));

            let userData = {};
            if (doctorDoc.exists()) {
                userData = doctorDoc.data();
                localStorage.setItem('userIsLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify(userData));
                setMessage('Login successful!');
                setMessageType('success');
                setTimeout(() => {
                  navigate('/doctors/home');
              }, 1200);
            } else if (sickDoc.exists()) {
                userData = sickDoc.data();
                localStorage.setItem('userIsLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify(userData));
                setMessage('Login successful!');
                setMessageType('success');
                setTimeout(() => {
                  navigate('/sicks/home/');
              }, 1200);
            } else {
                throw new Error('User data not found');
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setMessageType('error');
        }
    };

    return (
        <div className="login">
            <div className="wrapper">
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-box">
                        <input
                            type="text"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <a href="/forgot" className="forgot">Forgot password?</a>
                    </div>
                    <div className="input-box button" style={{ marginTop: '38px' }}>
                        <input type="submit" value="Login" />
                    </div>
                    <div className="err" style={{ color: messageType === 'success' ? 'green' : 'red' }}>
                        {message}
                    </div>
                    <div className="text">
                        <h3>Don't have an account? <a href="/register">Sign up now</a></h3>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
