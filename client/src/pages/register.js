import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/spinner.gif';

const Register = () => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [desig, setDesig] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Context API
  const [auth, setAuth] = useContext(AuthContext);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('file', selectedFile);
    data.append('userId', userId);
    data.append('name', name);
    data.append('desig', desig);
    data.append('password', password);

    try {
      setLoading(true);
      const response = await axios.post('/api/auth/signup', data, {
        withCredentials: true,
      });

      const loggedInUser = response.data;
      delete loggedInUser.msg;

      setAuth({ user: loggedInUser, isLoggedIn: true });

      localStorage.setItem(
        'auth',
        JSON.stringify({ user: loggedInUser, isLoggedIn: true })
      );
      setLoading(false);

      history.push('/');
    } catch (error) {
      setErrorMsg('Please fill all fields');
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className='container login-card mt-3 p-4'>
      <h1 className='text-center mb-4'>Register New User</h1>

      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label'>User Id</label>
          <input
            type='text'
            className='form-control'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className='mb-3'>
          <label className='form-label'>Name</label>
          <input
            type='text'
            className='form-control'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='mb-3'>
          <label className='form-label'>Designation</label>
          <input
            type='text'
            className='form-control'
            value={desig}
            onChange={(e) => setDesig(e.target.value)}
          />
        </div>

        <div className='mb-3'>
          <label className='form-label'>Set Password</label>
          <input
            type='password'
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div class='mb-4'>
          <label class='form-label'>Profile Picture</label>
          <input class='form-control' type='file' onChange={handleFileChange} />
        </div>

        {errorMsg && (
          <div class='alert alert-danger' role='alert'>
            {errorMsg}
          </div>
        )}

        <button type='submit' className='btn btn-success'>
          Register
        </button>

        {loading && <img className='mx-5' src={Spinner} alt='Spinner' />}
      </form>
    </div>
  );
};

export default Register;
