import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CommentsList from '../components/comments-list';

const TaskDetailsModal = ({ task }) => {
  const [commentsList, setCommentsList] = useState([]);
  const [text, setText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const history = useHistory();

  const handleShowComments = async () => {
    const commentsResponse = await axios.get(
      `/api/comments/list/${task.task_id}`,
      { withCredentials: true }
    );

    setCommentsList(commentsResponse.data);
    setShowComments(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      '/api/comment/new',
      { taskId: task.task_id, text },
      { withCredentials: true }
    );

    history.go(0);
  };

  return (
    <div className='modal fade' id='taskDetailsModal'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{task.title}</h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              onClick={() => setShowComments(false)}
            ></button>
          </div>
          <div className='modal-body'>
            <img src={task.image_url} className='img-fluid' alt='Task' />

            <h5 className='mt-3'>Description</h5>
            <p>{task.description}</p>

            {!showComments && (
              <button
                className='btn btn-light btn-sm mb-3'
                onClick={handleShowComments}
              >
                Show Comments
              </button>
            )}

            {showComments && (
              <div>
                <h5>Comments</h5>
                <CommentsList commentsList={commentsList} />
              </div>
            )}

            <form
              className='row row-cols-lg-auto g-3 align-items-center'
              onSubmit={handleSubmit}
            >
              <div className='col-12'>
                <div className='input-group'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Add Comment ...'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </div>

              <div className='col-12'>
                <button type='submit' className='btn btn-primary'>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
