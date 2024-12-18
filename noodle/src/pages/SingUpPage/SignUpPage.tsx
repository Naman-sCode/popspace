import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // For React Router v5
import Logo from "../../images/logo.svg";

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory(); // Initialize useHistory

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign Up Details:', { username, email, password });
    // Add your registration logic here
    alert('Account created successfully! Redirecting to Sign In...');
    history.push('/signin'); // Navigate to the sign-in page after sign-up
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
      }}
    >
      <button
        onClick={() => history.push('/signin')} // Navigate to the sign-in page
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 10px',
          backgroundColor: '#645cbc',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Sign In?
      </button>
      <div
        style={{
          width: '30%',
          aspectRatio: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          backgroundColor: '#fff',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '15px',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: '50%',
          }}
        />
        <form
          onSubmit={handleSignUp}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            width: '80%',
          }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              width: '100%',
              borderRadius: '10px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              width: '100%',
              borderRadius: '10px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              width: '100%',
              borderRadius: '10px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#645cbc',
              color: '#fff',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
