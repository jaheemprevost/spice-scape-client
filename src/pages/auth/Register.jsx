import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useFormik } from 'formik';
import {userCreationSchema} from '../../validation/UserValidation';
import axiosInstance from '../../services/axios';

export default function Register() { 
  const navigate = useNavigate();
  const [responseError, setResponseError] = useState(''); 

  const registerUser = async (values, actions) => { 
    try {
      const response = await axiosInstance.post('auth/register', JSON.stringify({...values}),
      {
        headers: { 
          'Content-Type': 'application/json'
        }
      }); 

      navigate('/login');
    } catch(err) {  
      if (err.response.status === 500) {
        navigate('/something-wrong');
      } else {
        setResponseError(err.response.data.message);
      }
    }
  
    actions.resetForm();
  };

  const { values, errors, handleBlur, handleChange, handleSubmit, touched, isValid, dirty } = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: ''
    },
    validationSchema: userCreationSchema,
    onSubmit: (values, actions) => registerUser(values, actions)
  });
    
  return (
    <main className='form-container'>

      <h1>SpiceScape</h1>

      <form onSubmit={(e) => handleSubmit(e)} className='register-form'>
        <p className='form-title'>Sign Up Form</p>

        {responseError && <p className='response-error'>{responseError}</p>}

        <div className='input-field'>
          <label className='form-label' htmlFor='username'>
            Username
            <input 
            className={errors.username && touched ? 'error-border form-input' : 'form-input'}
            id='username'
            value={values.username} 
            type='text' 
            placeholder='Enter a username'
            name='username'
            onChange={handleChange}
            onBlur={handleBlur}
            />
          </label>

          {(errors.username && touched.username) && <p className='error-message'>{errors.username}</p>}
        </div>
        

        <div className='input-field'>
          <label className='form-label' htmlFor='email'>
            Email
            <input 
            className={errors.username && touched ? 'error-border form-input' : 'form-input'}
            id='email'
            value={values.email} 
            type='email' 
            placeholder='Enter an email'
            name='email'
            onChange={handleChange}
            onBlur={handleBlur}
            />
          </label>

          {(errors.email && touched.email) && <p className='error-message'>{errors.email}</p>}
        </div>
       
        <div className='input-field'>
          <label className='form-label' htmlFor='password'>
            Password
            <input
            className={errors.username && touched ? 'error-border form-input' : 'form-input'}
            id='password' 
            value={values.password} 
            type='password' 
            placeholder='Enter a password'
            name='password'
            onChange={handleChange}
            onBlur={handleBlur}
            />
          </label>

          {(errors.password && touched.password) && <p className='error-message'>{errors.password}</p>}
        </div>

        <button className='primary-light-btn' disabled={!(isValid && dirty)} type='submit'>Sign Up</button>

        <Link to='/login'>Already have an account? Login here</Link>
      </form>
    </main>
  )
}
