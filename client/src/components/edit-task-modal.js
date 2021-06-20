import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EditTaskModal = ({ task, membersList }) => {
  // Context API
  const [auth, setAuth] = useContext(AuthContext);

  const [taskStatus, setTaskStatus] = useState('Todo');
  const [newAssignedUserId, setNewAssignedUserId] = useState(auth.user.userId);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      '/api/task/update',
      {
        taskId: task.task_id,
        status: taskStatus,
        newAssignedUserId,
      },
      { withCredentials: true }
    );

    history.go(0);
  };

  return (
    <div class='modal fade ' id='editTaskModal'>
      <div class='modal-dialog '>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title'>{task.title}</h5>
            <button
              type='button'
              class='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div class='modal-body'>
            <img src={task.image_url} class='img-fluid' alt='Task' />

            <form onSubmit={handleSubmit} className='mt-3'>
              <div className='mb-3'>
                <label className='form-label'>Task Status</label>
                <select
                  class='form-select'
                  onChange={(e) => setTaskStatus(e.target.value)}
                >
                  <option value='Todo'>Todo</option>
                  <option value='In Progress'>In Progress</option>
                  <option value='Testing'>Testing</option>
                  <option value='Done'>Done</option>
                </select>
              </div>

              <div className='mb-3'>
                <label className='form-label'>Assign To</label>
                <select
                  class='form-select'
                  onChange={(e) => setNewAssignedUserId(e.target.value)}
                >
                  <option value={auth.user.userId}>Me</option>
                  {membersList.map((member) => (
                    <option value={member.user_id} key={member.user_id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type='submit' class='btn btn-primary'>
                Update Todo
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
