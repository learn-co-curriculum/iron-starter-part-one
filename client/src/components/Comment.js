import React from 'react';

const Comment = ({ campaignId, comment, deleteComment }) => {
    return (
        <div>
            <p>{comment.content} <button onClick={() => deleteComment(campaignId, comment.id)}>Delete</button></p>
        </div>
    );
};

export default Comment;