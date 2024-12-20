import React, { ReactEventHandler, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Logo from "../../images/logo.svg";
import { RouteNames } from '@constants/RouteNames';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.includes('@mentor') || username.includes('@admin')) {
      history.push(RouteNames.ADMIN_KANBAN); // Path for mentors
    } else if (username.includes('@intern')) {
      history.push(RouteNames.INTERN_KANBAN); // Path for interns
    } else {
      alert('Invalid username format. Please include a valid role identifier.');
    }
  };
  const handleForgotPassword = () => {
    alert('Redirect to Forgot Password functionality.');
  };

  const navigateToSignUp = () => {
    history.push('/signup');
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
        onClick={navigateToSignUp}
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
        Sign Up?
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
            width: '50%'
          }}
        />

        <form
          onSubmit={handleSubmit}
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
              color: '#ffff',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            Sign In
          </button>
          <p
          onClick={handleForgotPassword}
          style={{
            marginTop: '10px',
            fontSize: '14px',
            color: '#645cbc',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Forgot Password?
        </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;