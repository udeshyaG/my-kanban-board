import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from './spinner.gif';

const AddTaskModal = ({ membersList, projectId }) => {
  // Context API
  const [auth, setAuth] = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(auth.user.userId);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const history = useHistory();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    console.log('Im here');
    e.preventDefault();

    const data = new FormData();
    data.append('file', selectedFile);
    data.append('title', title);
    data.append('description', description);
    data.append('assignedUserId', selectedUserId);
    data.append('projectId', projectId);

    setLoading(true);

    try {
      await axios.post('/api/tasks/new', data, {
        withCredentials: true,
      });
      setLoading(false);

      history.go(0);
    } catch (error) {
      setErrorMsg('Something went wrong. Please enter all fields');
      setLoading(false);
    }
  };

  return (
    <div className='modal fade' id='addTaskModal'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Add new Task</h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body'>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='form-label'>Title</label>
                <input
                  type='text'
                  className='form-control'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className='mb-3'>
                <label className='form-label'>Description</label>
                <textarea
                  className='form-control'
                  name='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className='mb-3'>
                <label className='form-label'>Assign to Member</label>
                <select
                  className='form-select'
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value={auth.user.userId}>Me</option>
                  {membersList.map((member) => {
                    return (
                      <option value={member.user_id} key={member.user_id}>
                        {member.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className='mb-3'>
                <label className='form-label'>Add Image</label>
                <input
                  className='form-control'
                  type='file'
                  onChange={handleFileChange}
                />
              </div>

              {errorMsg && (
                <div class='alert alert-danger my-3' role='alert'>
                  {errorMsg}
                </div>
              )}

              <button type='submit' className='btn btn-primary'>
                Add Todo
              </button>

              {loading && <img className='mx-5' src={Spinner} alt='Spinner' />}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
