import React, { useState } from 'react';
import './SignupForm.css';
import { Link, useNavigate } from "react-router-dom";

const SignupForm = ({setIsLoggedIn, setUser}) => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!require("email-validator").validate(email)) {
            setErrorMessage("Invalid email");
            return;
        }

        if (password.length < 8 || password.length > 256) {
            setErrorMessage("Password should be between 8 and 256 characters long");
            return;
        }

        if (fullname.length < 1 || fullname.length > 512) {
            setErrorMessage("Full name should be between 1 and 512 characters long");
            return;
        }

        const id = email.split("@")[0];
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                fullname,
                email,
                password,
            }),
        });

        if (response.ok) {
            // handle successful response
            setErrorMessage(''); // clear any previous error messages
            localStorage.setItem('token', email);
            setIsLoggedIn(true);
            setUser({ id, fullname });
            navigate('/tweets');
        } else {
            // handle error response
            setErrorMessage("Signup failed, something went wrong");
        }
    };

    return (
        <div className="form-container">
            <div className="signup-wrapper">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h2 className="form-title">Sign Up</h2>
                    <input type="text" id="fullname" name="fullname" placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} required minLength="1" maxLength="512" /><br/>
                    <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br/>
                    <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="8" maxLength="256" /><br/>
                    <button className="signup-button" type="submit">Sign Up</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <p className="login-text">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
    );
}

export default SignupForm;
