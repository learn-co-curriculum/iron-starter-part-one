import { 
    makingAPIRequest, 
    successfulAPIRequest, 
    unsuccessfulAPIRequest 
} from './apiRequestStatus';

const API_URL = 'http://localhost:3001/api';
// @ Action Creators

export const setComments = comments => {
    return {
        type: 'SET_COMMENTS',
        comments,
        campaignId: comments[0].campaign.id
    };
};

export const addComment = comment => {
    return { 
        type: 'ADD_COMMENT', 
        comment,
        campaignId: comment.campaign.id
    };
};

export const replaceComment = comment => {
    return {
        type: 'REPLACE_COMMENT',
        comment,
        campaignId: comment.campaign.id
    }
}

export const removeComment = (commentId, campaignId) => {
    return {
        type: 'REMOVE_COMMENT', 
        commentId,
        campaignId
    };
};

// @ Async Actions 

export const fetchComments = campaignId => {
    return dispatch => {
        dispatch(makingAPIRequest());
        return fetch(`${API_URL}/campaigns/${campaignId}/comments`)
            .then(response => response.json())
            .then(comments => {
                dispatch(successfulAPIRequest());
                dispatch(setComments(comments));
            })
            .catch(err => dispatch(unsuccessfulAPIRequest()));
    };
};

export const createComment = (campaignId, newComment) => {
    return dispatch => {
        dispatch(makingAPIRequest());
        return fetch(`${API_URL}/campaigns/${campaignId}/comments`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                comment: newComment
            })
        })
        .then(response => response.json())
        .then(comment => {
            dispatch(successfulAPIRequest());
            dispatch(addComment(comment));
        })
        .catch(err => dispatch(unsuccessfulAPIRequest()));
    };
};

export const updateComment = (campaignId, updatedComment) => {
    return dispatch => {
        dispatch(makingAPIRequest());
        return fetch(`${API_URL}/campaigns/${campaignId}/comments/${updatedComment.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                comment: updatedComment
            })
        })
        .then(response => response.json())
        .then(comment => {
            dispatch(successfulAPIRequest());
            dispatch(replaceComment(comment));
        })
        .catch(err => dispatch(unsuccessfulAPIRequest()));
    };
};

export const deleteComment = (campaignId, commentId) => {
    return dispatch => {
        dispatch(makingAPIRequest());
        return fetch(`${API_URL}/campaigns/${campaignId}/comments/${commentId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                dispatch(successfulAPIRequest());
                dispatch(removeComment(commentId, campaignId));
            } else {
                dispatch(unsuccessfulAPIRequest());
            }
        })
        .catch(err => unsuccessfulAPIRequest());
    };
};
