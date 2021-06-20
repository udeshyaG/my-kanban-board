import { useState } from 'react';
import axios from 'axios';

function App() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(userId, password);

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

    console.log('Login', response);
  };

  const handleClick = async () => {
    const response = await axios.get('/api/projects/list', {
      withCredentials: true,
    });

    console.log('check login', response);
  };

  return (
    <div className='App'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type='text'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type='submit' value='Login' />
      </form>

      <button onClick={handleClick}>Check Login</button>
    </div>
  );
}

export default App;
