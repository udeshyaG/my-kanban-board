import axios from 'axios';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const history = useHistory();

  const [auth, setAuth] = useContext(AuthContext);

  const handleLogout = async () => {
    await axios.post('/api/auth/signout');

    localStorage.removeItem('auth');

    history.push('/login');
    setAuth({ user: null, isLoggedIn: false });
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <div className='container'>
        <Link className='navbar-brand' to='/'>
          Navbar
        </Link>

        <div className='d-flex' id='navbarNav'>
          <ul className='navbar-nav'>
            {auth.isLoggedIn ? (
              <>
                <li className='nav-item nav-link'>Hello {auth.user.name}</li>
                <li className='nav-item'>
                  <Link className='nav-link active' to='/'>
                    Project-List
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link active' to='/add-project'>
                    Add-Project
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link active' onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <Link className='nav-link active' to='/login'>
                    Login
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link active' to='/register'>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
