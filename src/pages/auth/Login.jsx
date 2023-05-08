import { useState, useContext } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { userLoginSchema } from '../../validation/UserValidation';
import axios from 'axios';
import { AuthContext } from '../../context/AuthProvider';

export default function Login() {
  const [responseError, setResponseError] = useState('');
  const navigate = useNavigate();

  const { setUser, setLoggedIn } = useContext(AuthContext);

  const loginUser = async (values, actions) => {
    try {
      const response = await axios.post('https://spice-scape-server.onrender.com//api/v1/auth/login', JSON.stringify({...values}),
      {
        headers: {'Content-Type': 'application/json'},
        withCredentials: true
      }); 
      if (response.status === 200) {
        const { data } = response;
        setLoggedIn(true);
        setUser(data.user);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user)); 
        localStorage.setItem('theme', 'light');
        navigate('/');
      } 
    } catch(err) {  
      setResponseError(err.response.data.message);
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
    <main className='login'>
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

        <button className='submit-btn' type='submit' disabled={!(isValid && dirty)}>Log In</button>

        <Link to='/register'>Don't have an account? Register here</Link>
      </form>
    </main>
  )
}
