import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const AddProject = () => {
  const [projectName, setProjectName] = useState('');
  const [newProjectId, setNewProjectId] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const history = useHistory();

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      '/api/projects/new',
      { projectName },
      { withCredentials: true }
    );

    setNewProjectId(response.data.projectId[0]);
  };

  const handleCheckChange = (userId) => {
    let flag = false;

    let temp = selectedUsers.map((user) => {
      if (user.userId === userId) {
        flag = true;
        user.checked = !user.checked;
        return user;
      } else {
        return user;
      }
    });

    if (flag === true) {
      setSelectedUsers(temp);
    } else {
      setSelectedUsers([...selectedUsers, { userId, checked: true }]);
    }
  };

  const handleMembersSubmit = async () => {
    let usersList = [];
    selectedUsers.forEach((user) => {
      if (user.checked === true) {
        usersList.push(user.userId);
      }
    });

    const requestData = {
      projectId: newProjectId,
      usersList,
    };

    try {
      await axios.post('/api/projects/add-members', requestData, {
        withCredentials: true,
      });

      history.push('/');
    } catch (error) {
      setErrorMsg('Something went wrong. Please select members again');
    }
  };

  useEffect(() => {
    async function fetchUsers() {
      const users = await axios.get('/api/users/all', {
        withCredentials: true,
      });
      setUsersList(users.data);
    }

    fetchUsers();
  }, []);

  return (
    <div className='container'>
      <h1 className='text-center mt-2 mb-4'>New Project</h1>

      <div className='add-project-content'>
        <form className='row' onSubmit={handleProjectSubmit}>
          <div className='col-10'>
            <div className='input-group'>
              <div className='input-group-text'>Project Name</div>
              <input
                type='text'
                className='form-control'
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
          </div>

          <div className='col-2'>
            <button type='submit' className='btn btn-primary'>
              Submit
            </button>
          </div>
        </form>

        {newProjectId && (
          <div>
            <h4 className='my-4'>Add Members</h4>

            <ul className='list-group'>
              {usersList.map((user) => {
                return (
                  <li className='list-group-item' key={user.user_id}>
                    <div className='row align-items-center'>
                      <div className='col-1 add-project-checkbox'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          value={user.user_id}
                          onChange={() => handleCheckChange(user.user_id)}
                        />
                      </div>

                      <div className='col-3'>
                        <img
                          src={user.image_url}
                          class='img-thumbnail rounded-image'
                          alt='...'
                        ></img>
                      </div>

                      <div className='col-6'>
                        <h5>{user.name}</h5>
                        <p className='fw-light'>{user.desig}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {errorMsg && (
              <div class='alert alert-danger' role='alert'>
                {errorMsg}
              </div>
            )}

            <button
              className='btn btn-success btn-lg mt-3 mb-5'
              onClick={handleMembersSubmit}
            >
              Add Members
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProject;
