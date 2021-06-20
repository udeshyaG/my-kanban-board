import React from 'react';
import { Link } from 'react-router-dom';

const SingleProject = ({ project }) => {
  return (
    <Link
      to={`/kanban-board/${project.project_id}`}
      className='list-group-item list-group-item-action'
      key={project.project_id}
    >
      <div className='row'>
        <div className='col-2'>
          <i class='fas fa-folder-open mx-3 mt-3 text-primary project-icon'></i>
        </div>
        <div className='col-10'>
          <div className='d-flex w-100 justify-content-between'>
            <h5 className='mb-1'>{project.project_name}</h5>
            <small>
              Created at:{' '}
              {new Date(project.date_created).toISOString().slice(0, 10)}
            </small>
          </div>
          <p className='mb-3'>Created By {project.created_by_user_id}</p>
          <small className='fw-light '>Click to view Kanban board</small>
        </div>
      </div>
    </Link>
  );
};

export default SingleProject;
