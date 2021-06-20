import React from 'react';

const CommentsList = ({ commentsList }) => {
  return (
    <div>
      {commentsList.length > 0 ? (
        commentsList.map((comment) => {
          return (
            <div className='single-comment px-4 pt-1 mb-3'>
              <h6 className='text-primary'>{comment.user_id}</h6>
              <p className='my-1'>{comment.text}</p>
            </div>
          );
        })
      ) : (
        <p className='text-danger'>No Comments Yet</p>
      )}
    </div>
  );
};

export default CommentsList;
