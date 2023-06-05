import React, { useState, useEffect } from 'react';
import './Tweets.css';
import { ReactComponent as TwitterLogo } from './twitter-logo.svg';

const Tweet = ({ tweet }) => {
    const [authorFullName, setAuthorFullName] = useState('');

    useEffect(() => {
        const fetchAuthorFullName = async () => {
            const response = await fetch(`http://localhost:3000/users/${tweet.author_id}`);
            const data = await response.json();
            if (response.ok) {
                setAuthorFullName(data.fullname);
            }
        };

        console.log(tweet.author_id)
        fetchAuthorFullName();
    }, [tweet.author_id]);

    const initials = authorFullName ? authorFullName.split(' ').map((namePart) => namePart[0].toUpperCase()).join('') : '';

    return (
        <div className="tweet-card">
            <div className="tweet-header">
                <div className="initials">
                    {initials}
                </div>
                <div className="fullname">{authorFullName || 'Anonymous'}</div>
            </div>
            <div className="tweet-content">
                <div className="tweet-text">
                    {tweet.text}
                </div>
            </div>
        </div>
    );
};



const Tweets = ({ user }) => {
    const [tweetText, setTweetText] = useState('');
    const [tweets, setTweets] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        fetchTweets();
    }, []);

    const handleInputChange = e => {
        setTweetText(e.target.value);
    };

    const handleTweet = async () => {
        await fetch('http://localhost:3000/tweets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: tweetText, author_id: user.id }),
        });

        setTweetText('');
        fetchTweets();
    };

    const fetchTweets = async () => {
        const response = await fetch('http://localhost:3000/tweets');
        const data = await response.json();
        if (response.ok) {
            // Sort the tweets by index in descending order
            const sortedTweets = data.sort((a, b) => data.indexOf(b) - data.indexOf(a));
            setTweets(sortedTweets);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setTweets([]); // Clear the tweets state
        window.location.href = '/login'; // Full page reload to the login page
    };

    const getInitials = name => {
        let initials = name.match(/\b\w/g) || [];
        return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    };

    return (
        <div className="main-container">
            <div className="navbar">
                <div className="left-section">
                    <TwitterLogo className="twitter-logo" />
                    <h1>Another Twitter Clone</h1>
                </div>
                <div
                    className="user-profile"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                    style={{ position: 'relative' }}
                >
                    <div
                        className="user-initials"
                        style={{
                            backgroundColor: '#555',
                            color: '#fff',
                            width: '30px',
                            height: '30px',
                            borderRadius: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {getInitials(user.fullname)}
                    </div>
                    {dropdownOpen && (
                        <div className="dropdown">
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="tweet-form">
                <input type="text" value={tweetText} onChange={handleInputChange} />
                <button onClick={handleTweet}>Tweet</button>
            </div>
            <div className="tweets-display">{tweets.map((tweet, index) => <Tweet key={index} tweet={tweet} user={user} />)}</div>
        </div>
    );
};

export default Tweets;
