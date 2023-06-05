import React, {useState} from 'react';
import './LoginForm.css';
import {Link, Navigate, useLocation} from "react-router-dom";


const LoginForm = ({ isLoggedIn, setIsLoggedIn, setUser}) => {


    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [onError, setOnError] = useState(false);
    const [invalidInput, setInvalidInput] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleInvalidInput = () => {
        setInvalidInput(true);
        setIsLoggedIn(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setInvalidInput(false);
        if (!email || !password) {
            handleInvalidInput();
            return;
        }
        fetch(`http://localhost:3000/users?email=${email}`)
            .then(response => {
                if (response.status === 404) {
                    handleInvalidInput();
                } else if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                if(data && data.length > 0) {
                    // Check if password matches
                    if (data[0].password === password) {
                        localStorage.setItem('token', email);
                        setIsLoggedIn(true);
                        setUser({ id: data[0].id, fullname: data[0].fullname });
                        localStorage.setItem('user', JSON.stringify({ id: data[0].id, fullname: data[0].fullname }));
                    } else {
                        handleInvalidInput();
                    }
                } else {
                    handleInvalidInput();
                }
            })
            .catch(error => {
                setOnError(true);
                console.log('There has been a problem with your fetch operation: ', error.message);
            });
    };

    return (
        isLoggedIn ? <Navigate to="/tweets" replace state={{ from: location }} /> :
        <div className="form-container">
            <div className="login-wrapper">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2 className="form-title">Login</h2>
                    <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={handleEmailChange}  required/><br/>
                    <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={handlePasswordChange} required/><br/>
                    <button className="login-button" type="submit">Sign In</button>
                </form>
                {invalidInput && <p className="error-message-color">Invalid email or password</p>}
                {onError && <p className="error-message-color">Something went wrong</p>}
            </div>
            <p className="login-text">Don't have an account?? <Link to="/signup">Sign up</Link></p>
        </div>
    )
}

export default LoginForm;