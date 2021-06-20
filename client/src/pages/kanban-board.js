import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddTaskModal from '../components/add-task-modal';
import EditTaskModal from '../components/edit-task-modal';
import TaskDetailsModal from '../components/task-details-modal';
import ProjectMembersList from '../components/project-members-list';
import Task from '../components/task';

const KanbanBoard = () => {
  const { projectId } = useParams();
  const [membersList, setMembersList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [modalTask, setModalTask] = useState(null);
  const [projectDetails, setProjectDetails] = useState({});

  function handleChangeModalTask(taskId) {
    console.log(taskId);
    setModalTask(tasksList.find((task) => task.task_id === taskId));
  }

  useEffect(() => {
    async function fetchData() {
      const projectDetailsResponse = await axios.get(
        `/api/project/details/${projectId}`,
        { withCredentials: true }
      );
      setProjectDetails(projectDetailsResponse.data[0]);

      const membersListResponse = await axios.get(
        `/api/project/members/${projectId}`,
        { withCredentials: true }
      );
      setMembersList(membersListResponse.data);

      const tasksListResponse = await axios.get(
        `/api/tasks/list/${projectId}`,
        { withCredentials: true }
      );
      setTasksList(tasksListResponse.data);

      setModalTask(tasksListResponse.data[0]);
    }

    fetchData();
  }, []);

  return (
    <div className='container'>
      <div className='row align-items-center'>
        <div className='col-5'>
          <h1 className='mt-3 mb-4'>{projectDetails.project_name}</h1>
        </div>
        <div className='col-4 fw-light'>
          Created by : {projectDetails.created_by_user_id}
        </div>
        <div className='col-3 fw-light'>
          Created at :{' '}
          {projectDetails.date_created &&
            projectDetails.date_created.slice(0, 10)}
        </div>
      </div>
      <div className='row kanban-table-header'>
        <div className='col kanban column-header text-center fs-4 pt-1 first'>
          Todo
        </div>
        <div className='col kanban column-header text-center fs-4 pt-1'>
          In Progress
        </div>
        <div className='col kanban column-header text-center fs-4 pt-1'>
          Testing
        </div>
        <div className='col kanban column-header text-center fs-4 pt-1 last'>
          Done
        </div>
      </div>
      <div className='row'>
        <div className='kanban column todo'>
          {tasksList.map((task) => {
            if (task.status === 'Todo') {
              return (
                <Task
                  task={task}
                  bgColorClass='status-todo'
                  membersList={membersList}
                  key={task.task_id}
                  handleChangeModalTask={handleChangeModalTask}
                />
              );
            }
          })}
        </div>
        <div className='kanban column in-progress'>
          {tasksList.map((task) => {
            if (task.status === 'In Progress') {
              return (
                <Task
                  task={task}
                  bgColorClass='status-in-progress'
                  handleChangeModalTask={handleChangeModalTask}
                  key={task.task_id}
                />
              );
            }
          })}
        </div>
        <div className='kanban column testing'>
          {tasksList.map((task) => {
            if (task.status === 'Testing') {
              return (
                <Task
                  task={task}
                  bgColorClass='status-testing'
                  handleChangeModalTask={handleChangeModalTask}
                  key={task.task_id}
                />
              );
            }
          })}
        </div>
        <div className='kanban column done'>
          {tasksList.map((task) => {
            if (task.status === 'Done') {
              return (
                <Task
                  task={task}
                  bgColorClass='status-done'
                  handleChangeModalTask={handleChangeModalTask}
                  key={task.task_id}
                />
              );
            }
          })}
        </div>
      </div>
      <button
        type='button'
        className='btn btn-success btn-lg my-4'
        data-bs-toggle='modal'
        data-bs-target='#addTaskModal'
      >
        Add New Task <i class='fa fa-plus'></i>
      </button>
      <AddTaskModal membersList={membersList} projectId={projectId} />
      {modalTask && <TaskDetailsModal task={modalTask} />}
      {modalTask && (
        <EditTaskModal task={modalTask} membersList={membersList} />
      )}

      {membersList.length > 0 && (
        <ProjectMembersList membersList={membersList} />
      )}
    </div>
  );
};

export default KanbanBoard;
