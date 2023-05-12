import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { commentValidationSchema } from '../../validation/CommentValidation'; 
import { AuthContext } from '../../context/AuthProvider';
import { ThemeContext } from '../../context/ThemeProvider';
import Comment from './Comment';
import axiosInstance from '../../services/axios';

export default function CommentSection({ recipeId }) {
  const { logOut } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [commentData, setCommentData] = useState(null);
  const [responseError, setResponseError] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`recipes/${recipeId}/comments`); 
      
        if (response.data.comments) {
          setCommentData(response.data.comments);
        } else if (response.data.message) {
          setCommentData(response.data.message);
        }

      } catch(err) {
        if (err.response.status === 500) {
          navigate('/something-wrong');
        } else if (err.response.status === 404) {
          navigate('/not-found')
        } else if (err.response.status === 401) {
          logOut();
          navigate('/login');
        }  
      }
    }
    
    fetchComments();
  }, [recipeId]);

  useEffect(() => {
    if (isPosting || isEditing || isDeleting) {
      const fetchComments = async () => {
        try {
          const response = await axiosInstance.get(`recipes/${recipeId}/comments`); 
        
          if (response.data.comments) {
            setCommentData(response.data.comments);
          } else if (response.data.message) {
            setCommentData(response.data.message);
          }
  
        } catch(err) {
          if (err.response.status === 500) {
            navigate('/something-wrong');
          } else if (err.response.status === 404) {
            navigate('/not-found')
          } else if (err.response.status === 401) {
            logOut();
            navigate('/login');
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
      const response = await axiosInstance.post(`recipes/${recipeId}/comments`, JSON.stringify({...values}));  
      
      setIsPosting(true);
    } catch(err) {  
      if (err.response.status === 500) {
        navigate('/something-wrong');
      } else if (err.response.status === 404) {
        navigate('/not-found')
      }  else if (err.response.status === 403) {
        navigate('/not-authorized');
      } else if (err.response.status === 401) {
        logOut();
        navigate('/login');
      } else { 
        setResponseError(err.response.data.message);
      }
    } 
  
    actions.resetForm();
  }; 
  
  const deleteComment = async (commentId) => {
    try {
      const response = await axiosInstance.delete(`recipes?recipeId=${recipeId}&commentId=${commentId}`); 

      setIsDeleting(true);
    } catch(err) {
      if (err.response.status === 500) {
        navigate('/something-wrong');
      } else if (err.response.status === 404) {
        navigate('/not-found')
      }  else if (err.response.status === 403) {
        navigate('/not-authorized');
      } else if (err.response.status === 401) {
        logOut();
        navigate('/login');
      }
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
                className={`form-input comment-input-${theme}`} 
                value={values.text}  
                placeholder='Enter Comment...'
                name='text'
                onChange={handleChange}
                onBlur={handleBlur}>
              </textarea> 

              {errors.text && <p className='error-message'>{errors.text}</p>}
            </div>

            <button type='submit' className='primary-light-btn' disabled={!(isValid && dirty)}>Post Comment</button>
          </form>

          <div className='comments'>
            {comments}
          </div>
        </section>
  )
}
