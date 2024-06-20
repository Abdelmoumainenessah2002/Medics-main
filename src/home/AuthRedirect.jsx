import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRedirect = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const userIsLoggedIn = localStorage.getItem('userIsLoggedIn');
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (!userIsLoggedIn || !userData) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <>
            {children}
        </>
    );
};

export default AuthRedirect;
