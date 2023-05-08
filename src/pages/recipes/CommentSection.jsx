import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { commentValidationSchema } from '../../validation/CommentValidation'; 
import Comment from './Comment';
import axios from 'axios'; 

export default function CommentSection({ recipeId }) {
  const [commentData, setCommentData] = useState(null);
  const [responseError, setResponseError] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://spice-scape-server.onrender.com/api/v1/recipes/${recipeId}/comments`,
      {
      headers: { 
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        withCredentials: true
      } 
      }); 
      
      if (response.data.comments) {
        setCommentData(response.data.comments);
      } else if (response.data.message) {
        setCommentData(response.data.message);
      }

      } catch(err) {
        if (err.response.status === 500) { 
          // navigate('/login');
        } 
      }
    }
    
    fetchComments();
  }, [recipeId]);

  useEffect(() => {
    if (isPosting || isEditing || isDeleting) {
      const fetchComments = async () => {
        try {
          const response = await axios.get(`https://spice-scape-server.onrender.com/api/v1/recipes/${recipeId}/comments`,
        {
        headers: { 
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
          withCredentials: true
        } 
        }); 
        
        if (response.data.comments) {
          setCommentData(response.data.comments);
        } else if (response.data.message) {
          setCommentData(response.data.message);
        }
  
        } catch(err) {
          if (err.response.status === 500) { 
            // navigate('/login');
          } 
        } finally {
          setIsPosting(false);
          setIsEditing(false);
          setIsDeleting(false);
        }
      } 
      fetchComments();
    }
  }, [isPosting, isEditing, isDeleting]);

  const { values, errors, handleBlur, handleChange, handleSubmit, touched, isValid, dirty } = useFormik({
    initialValues: { 
      text: '' 
    },
    validationSchema:  commentValidationSchema,
    onSubmit: (values, actions) => postComment(values, actions)
  });

  const postComment = async (values, actions) => {
    try {
      const response = await axios.post(`https://spice-scape-server.onrender.com/api/v1/recipes/${recipeId}/comments`, JSON.stringify({...values}),
      {
        headers: { 
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
          'Content-Type': 'application/json',
          withCredentials: true
        } 
      });  
      setIsPosting(true);
    } catch(err) {  
      setResponseError(err.response.data.message);
    } 
  
    actions.resetForm();
  }; 
  
  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`https://spice-scape-server.onrender.com/api/v1/recipes?recipeId=${recipeId}&commentId=${commentId}`,
    {
      headers: { 
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json',
        withCredentials: true
      }  
    }); 
    setIsDeleting(true);
    } catch(err) {
      // if (err.response.status === 401) {
      //   setUser({});
      //   setLoggedIn(false);
      //   localStorage.removeItem('accessToken');
      //   localStorage.removeItem('user');
      //   navigate('/login');
      // }
      console.log(err);
    } 
  };

  let comments = null;

  if (commentData && Array.isArray(commentData)) {
    comments = commentData.map(comment => {
      comment.setIsEditing = setIsEditing;
      comment.deleteComment = deleteComment;
      return <Comment key={comment.commentId} {...comment} />
    });
  } else if (commentData && !Array.isArray(commentData)) {
    comments = commentData;
  }

  return (
    <section className='comment-section'>
          <form onSubmit={(e) => handleSubmit(e)} className='comment-form'>

            {responseError && <p className='response-error'>{responseError}</p>}

            <div className='input-field'> 
              <textarea 
                className='form-input comment-input' 
                value={values.text}  
                placeholder='Enter Comment...'
                name='text'
                onChange={handleChange}
                onBlur={handleBlur}>
              </textarea> 

              {errors.text && <p className='error-message'>{errors.text}</p>}
            </div>

            <button type='submit' className='comment-btn' disabled={!(isValid && dirty)}>Post Comment</button>
          </form>

          <div className='comments'>
            {comments}
          </div>
        </section>
  )
}
