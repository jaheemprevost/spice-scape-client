import { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { commentValidationSchema } from "../../validation/CommentValidation";
import { AuthContext } from "../../context/AuthProvider";
import { ThemeContext } from "../../context/ThemeProvider";
import axiosInstance from '../../services/axios';

export default function Comment(props) {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { recipeId } = useParams();
  const [responseError, setResponseError] = useState(null);
  const [modifyingComment, setModifyingComment] = useState(false);
  const { comment, commentId, userInfo: {username, profileImage, id}, setIsEditing, deleteComment} = props;
  const isOwnComment = user.userId === id;

  const { values, errors, handleBlur, handleChange, handleSubmit, touched, isValid, dirty } = useFormik({
    initialValues: { 
      text: comment
    },
    validationSchema:  commentValidationSchema,
    onSubmit: (values, actions) => editComment(values, actions)
  });

  const handleEdit = () => {
    setModifyingComment(true);
  };

  const handleClose = () => {
    setModifyingComment(false);
  }

  const editComment = async (values, actions) => {
    try {
      setIsEditing(true);
      const response = await axiosInstance.patch(`recipes?recipeId=${recipeId}&commentId=${commentId}`, JSON.stringify({...values}));
       
      setModifyingComment(false);
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
    actions.resetForm();
  }

  return (
    <div className={`comment-${theme}`}>
      <div className='user-info'>
        <img src={profileImage} className='user-image' alt={username} />
        <p className='user-name'><Link to={`/profile/${id}`}>{username}</Link></p>

        {isOwnComment && 
          <div className='comment-options'> 
            <button onClick={handleEdit} className={`secondary-${theme}-btn`}>Edit</button>
            <button onClick={() => deleteComment(commentId)} className='option-btn red-accent'>Delete</button>
          </div>
        }
      </div>

      {!modifyingComment && <p className='comment-text'>{comment}</p>} 

      {modifyingComment && 
        <form onSubmit={(e) => handleSubmit(e)} className='comment-form'>

        {responseError && <p className='response-error'>{responseError}</p>}

        <div className='input-field'> 
          <textarea 
            className={`form-input comment-input-${theme} edit-comment-${theme}`} 
            value={values.text}  
            placeholder='Enter Comment...'
            name='text'
            onChange={handleChange}
            onBlur={handleBlur}>
          </textarea> 

          {errors.text && <p className='error-message'>{errors.text}</p>}
        </div>

        <button className='primary-light-btn' disabled={!(isValid && dirty)}>Post Comment</button>
        <button onClick={handleClose} className='primary-light-btn red-accent'>Close</button>
      </form>
      }
    </div>
  )
}
