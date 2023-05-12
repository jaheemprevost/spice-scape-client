import { useState, useEffect } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { userRevisionSchema } from '../../validation/UserValidation';
import axiosInstance from '../../services/axios'; 

export default function EditProfile() {
  const [profile, setProfile] = useState({
    profileImage: '',
    username: '',
    followerCount: 0,
    followingCount: 0,
    biography: ''
  });
  const [responseError, setResponseError] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const navigate = useNavigate();
  const { profileId } = useParams();

  useEffect(() => {
    try {
      const fetchProfile = async () => {
        const response = await axiosInstance.get(`profile/${profileId}`); 
      
        if (response.data.user) {
          const { user } = response.data
          setProfile(user); 
          setImgSrc(user.profileImage);
        } 
      };

      fetchProfile();
    } catch(err) {
       if (err.response.status === 500) {
        navigate('/something-wrong');
      } else if (err.response.status = 404) {
        navigate('/not-found')
      }  
      console.log(err);
    }

  }, []);

  if (imgSrc.startsWith('https')) {
    fetch(imgSrc)
    .then(response => response.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const dataUrl = reader.result; 
        setImgSrc(dataUrl);
      }
    });
  }
  
  const editProfile = async (values, actions) => { 

    try {
      let profileImage = imgSrc;   
      
      if (!values.file) {
        delete values.file;
      }
 
      const profileData = {...values, profileImage};
  
      if (profileData.file) {
        delete profileData.file;
      } 

      const response = await axiosInstance.patch(`profile/${profileId}`, JSON.stringify({...profileData})); 
    if (response.status === 200) {
      navigate(`/profile/${profileId}`);
    } 

    } catch(err) {  
      setResponseError(err.response.data.message);
    } 
  
    actions.resetForm();
  };  

  const { values, errors, handleBlur, handleChange, handleSubmit, touched, isValid, dirty, setFieldValue } = useFormik({
    initialValues: { 
      username: profile && profile.username,
      biography: profile && profile.biography, 
      file: ''
    },
    validationSchema:  userRevisionSchema,
    onSubmit: (values, actions) => editProfile(values, actions),
    enableReinitialize: true
  });

  const backgroundStyles = {
    backgroundImage: `url(${imgSrc ? imgSrc: ''})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    width: '100%',
    height: '250px',
    marginTop: '1em'
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      setImgSrc(reader.result);
    };
  
    reader.readAsDataURL(file);
  };

  return (
    <main className='form-container'>

      <form onSubmit={(e) => handleSubmit(e)} className='form'>

        {responseError && <p className='response-error'>{responseError}</p>}

        {imgSrc && <div style={backgroundStyles}>

        </div>}

        <div className='input-field file-input'>

          <label className='form-label' htmlFor='profile-image'>
            Upload Profile Image
            <input 
            className='form-input file'
            id='profile-image'
            defaultValue={values.file}  
            type='file' 
            name='file'
            onChange={(e) => {
              setFieldValue('file', e.currentTarget.files[0]);
              handleImageUpload(e);
            }}
            onBlur={handleBlur} 
            />
          </label>

          {(errors.file && touched.file) && <p className='error-message'>{errors.file}</p>}
        </div>

        <div className='input-field'>
          <label className='form-label' htmlFor='username'>
            Username
            <input 
            className='form-input'
            id='username'
            value={values.username} 
            type='text' 
            placeholder='Enter Username'
            name='username'
            onChange={handleChange}
            onBlur={handleBlur}
            />
          </label>

          {(errors.username && touched.username) && <p className='error-message'>{errors.username}</p>}
        </div>

        <div className='input-field'>
          <label className='form-label' htmlFor='biography'>
            Biography
            <textarea 
            className='form-input'
            id='biography'
            value={values.biography}  
            placeholder='Enter Biography'
            name='biography'
            onChange={handleChange}
            onBlur={handleBlur}>
            </textarea>
          </label>

          {(errors.biography && touched.biography) && <p className='error-message'>{errors.biography}</p>}
        </div>

        <button className='primary-light-btn' type='submit' disabled={!(isValid)}>Edit Profile</button>

      </form>
    </main>
  )
}
