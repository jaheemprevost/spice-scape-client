import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useFormik } from 'formik';
import {userCreationSchema} from '../../validation/UserValidation';
import axios from 'axios';



export default function Register() { 
  const [responseError, setResponseError] = useState('');
  const navigate = useNavigate(); 

  const registerUser = async (values, actions) => { 
    try {
      const response = await axios.post('https://spice-scape-server.onrender.com//api/v1/auth/register', JSON.stringify({...values}),
      {
        headers: {'Content-Type': 'application/json'} 
      }); 
      if (response.status === 201) {  
        navigate('/login');
      } 
    } catch(err) {  
      setResponseError(err.response.data.message);
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
    <main className='registration'>

      <h1>SpiceScape</h1>

      <form onSubmit={(e) => handleSubmit()} className='register-form'>
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

        <button className='submit-btn' disabled={!(isValid && dirty)} type='submit'>Sign Up</button>

        <Link to='/login'>Already have an account? Login here</Link>
      </form>
    </main>
  )
}
