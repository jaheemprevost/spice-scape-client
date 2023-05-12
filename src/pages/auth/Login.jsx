import { useState, useContext } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { userLoginSchema } from '../../validation/UserValidation';
import axiosInstance from '../../services/axios';
import { AuthContext } from '../../context/AuthProvider';

export default function Login() {
  const { logIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [responseError, setResponseError] = useState('');

  const loginUser = async (values, actions) => {
    try {
      const response = await axiosInstance.post('auth/login', JSON.stringify({...values}),
      {
        headers: { 
          'Content-Type': 'application/json'
        }
      }); 
      
      const { data } = response;
      logIn(data);
      navigate('/');
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
      email: '',
      password: ''
    },
    validationSchema:  userLoginSchema,
    onSubmit: (values, actions) => loginUser(values, actions)
  });
 
  return (
    <main className='form-container'>
      <h1>SpiceScape</h1>

      <form onSubmit={(e) => handleSubmit(e)} className='login-form'>
        <p className='form-title'>Log In Form</p>

        {responseError && <p className='response-error'>{responseError}</p>}

        <div className='input-field'>
          <label className='form-label' htmlFor='email'>
            Email
            <input 
            className='form-input'
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
            className='form-input'
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

        <button className='primary-light-btn' type='submit' disabled={!(isValid && dirty)}>Log In</button>

        <Link to='/register'>Don't have an account? Register here</Link>
      </form>
    </main>
  )
}
