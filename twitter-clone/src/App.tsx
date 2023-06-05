import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoginForm, PrivateRoute, SignupForm, Tweets } from './components';

function App() {
    const [user, setUser] = useState({ id: '', fullname: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setIsLoggedIn(true);
            setUser(storedUser ? JSON.parse(storedUser) : { id: '', fullname: '' });
        } else {
            setIsLoggedIn(false);
            setUser({ id: '', fullname: '' });
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
                />
                <Route
                    path="/login"
                    element={<LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
                />
                <Route path="/signup" element={<SignupForm setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />

                <Route
                    path="/tweets"
                    element={<PrivateRoute isLoggedIn={isLoggedIn}><Tweets user={user} /></PrivateRoute>}
                />
            </Routes>
        </Router>
    );
}

export default App;
