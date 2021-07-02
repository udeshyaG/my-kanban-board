import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import SingleProject from '../components/single-project';

const MyProjects = () => {
  const [projectList, setProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchProjectList() {
      setIsLoading(true);
      const response = await axios.get('/api/projects/list', {
        withCredentials: true,
      });

      setProjectList(response.data);
      setIsLoading(false);
    }
    fetchProjectList();
  }, []);

  return (
    <div className='container'>
      <h1 className='text-center mt-2 mb-4'>My Projects</h1>

      <div className='list-group project-list mb-5'>
        {projectList.length > 0 ? (
          projectList.map((project) => {
            return <SingleProject project={project} />;
          })
        ) : isLoading ? (
          <p className='text-warning text-center'>Loading Projects ⏳</p>
        ) : (
          <p className='text-danger text-center'>No Projects Yet</p>
        )}
      </div>
    </div>
  );
};

export default withRouter(MyProjects);
