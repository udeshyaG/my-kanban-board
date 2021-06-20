import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const history = useHistory();

  // Context API
  const [auth, setAuth] = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '/api/auth/signin',
        {
          userId,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const loggedInUser = response.data;
      delete loggedInUser.msg;

      setAuth({ user: loggedInUser, isLoggedIn: true });

      localStorage.setItem(
        'auth',
        JSON.stringify({ user: loggedInUser, isLoggedIn: true })
      );

      history.push('/');
    } catch (err) {
      setErrorMsg('Unable to Login. Check Credentials');
    }
  };

  return (
    <div className='container login-card mt-4 p-4'>
      <h1 className='text-center mb-4'>Login</h1>

      <form action='' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='form-label'>User Id</label>
          <input
            type='text'
            className='form-control'
            value={userId}
            onChange={(e) => {
              setErrorMsg('');
              setUserId(e.target.value);
            }}
          />
        </div>

        <div className='mb-4'>
          <label className='form-label'>Password</label>
          <input
            type='password'
            className='form-control'
            value={password}
            onChange={(e) => {
              setErrorMsg('');
              setPassword(e.target.value);
            }}
          />
        </div>

        {errorMsg && (
          <div class='alert alert-danger mb-3' role='alert'>
            {errorMsg}
          </div>
        )}

        <button type='submit' className='btn btn-primary'>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
