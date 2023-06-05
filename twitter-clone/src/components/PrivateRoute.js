import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children, isLoggedIn }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace state={{ from: location }} />;
};

export default PrivateRoute;
