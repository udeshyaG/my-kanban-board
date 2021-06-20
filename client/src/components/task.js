import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Task = ({ task, bgColorClass, handleChangeModalTask }) => {
  const [auth, setAuth] = useContext(AuthContext);

  return (
    <>
      <div className={`task my-2 ${bgColorClass}`}>
        <h5 className='text-center'>{task.title}</h5>
        <p className='my-0'>Desription : {task.description}</p>

        <p className='my-0'>
          Assigned to :{' '}
          <span className='fw-bold'>
            {task.assigned_user_id === auth.user.userId
              ? 'Me'
              : task.assigned_user_id}{' '}
          </span>
        </p>
        {auth.user.userId === task.assigned_user_id && (
          <button
            className='btn btn-link'
            data-bs-toggle='modal'
            data-bs-target='#editTaskModal'
            onClick={() => handleChangeModalTask(task.task_id)}
          >
            Edit
          </button>
        )}
        <button
          className='btn btn-link'
          data-bs-toggle='modal'
          data-bs-target='#taskDetailsModal'
          onClick={() => handleChangeModalTask(task.task_id)}
        >
          Details
        </button>
      </div>
    </>
  );
};

export default Task;
