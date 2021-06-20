import React from 'react';

const ProjectMembersList = ({ membersList }) => {
  return (
    <div>
      <h3 className='my-4'>Members List</h3>

      <div className='mb-5'>
        {membersList.map((member) => {
          return (
            <div className='row align-items-center mb-3'>
              <div className='col-2'>
                <img
                  src={member.image_url}
                  class='img-thumbnail rounded-image'
                  alt='...'
                ></img>
              </div>
              <div className='col-5'>
                <h5>{member.name}</h5>
                <p className='mb-0 fw-light'>{member.user_id}</p>
                <p className='fw-light'>{member.desig}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectMembersList;
