import { useState, useEffect, useContext } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { useFormik } from 'formik';
import { recipeValidationSchema } from '../../validation/RecipeValidation';
import axiosInstance from '../../services/axios';

export default function EditRecipe() {
  const { logOut } = useContext(AuthContext);
  const [recipe, setRecipe] = useState('');
  const [responseError, setResponseError] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const navigate = useNavigate();
  const { recipeId } = useParams();

  useEffect(() => {
    try {
      const fetchRecipe = async () => {
        const response = await axiosInstance.get(`recipes/${recipeId}`); 
      
        if (response.data.recipe) {
          const { recipe } = response.data
          setRecipe(recipe); 
          setImgSrc(recipe.recipeImage.url);
        } 
      };

      fetchRecipe();
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
    })
    .catch(err => navigate('/something-wrong'));
  }

  const editRecipe = async (values, actions) => { 

    try {
      let recipeImage = imgSrc;    

      if (!values.file) {
        delete values.file;
      }
 
      const recipeData = {...values, recipeImage};
      
      if (recipeData.file) {
        delete recipeData.file;
      } 

      const response = await axiosInstance.patch(`recipes?recipeId=${recipeId}`, JSON.stringify({...recipeData})); 
 
      navigate(`/recipes/${recipeId}`); 
    } catch(err) { 
      if (err.response.status === 500) {
        navigate('/something-wrong');
      } else if (err.response.status === 404) {
        navigate('/not-found')
      } else if (err.response.status === 403) {
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

  const { values, errors, handleBlur, handleChange, handleSubmit, touched, isValid, dirty, setFieldValue } = useFormik({
    initialValues: { 
      recipeTitle: recipe && recipe.recipeTitle,
      recipeDescription: recipe && recipe.recipeDescription,
      recipeIngredients: recipe && recipe.recipeIngredients,
      recipeSteps: recipe && recipe.recipeSteps,
      file: ''
    },
    validationSchema:  recipeValidationSchema,
    onSubmit: (values, actions) => editRecipe(values, actions),
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

          <label className='form-label' htmlFor='recipe-image'>
            Upload Recipe Image
            <input 
            className='form-input file'
            id='recipe-image'
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

          {(errors.recipeImage && touched.recipeImage) && <p className='error-message'>{errors.recipeImage}</p>}
        </div>

        <div className='input-field'>
          <label className='form-label' htmlFor='recipe-title'>
            Recipe Title
            <input 
            className='form-input'
            id='recipe-title'
            value={values.recipeTitle} 
            type='text' 
            placeholder='Enter Recipe Title'
            name='recipeTitle'
            onChange={handleChange}
            onBlur={handleBlur}
            />
          </label>

          {(errors.recipeTitle && touched.recipeTitle) && <p className='error-message'>{errors.recipeTitle}</p>}
        </div>

        <div className='input-field'>
          <label className='form-label' htmlFor='recipe-description'>
            Recipe Description
            <textarea 
            className='form-input'
            id='recipe-description'
            value={values.recipeDescription}  
            placeholder='Enter Recipe Description'
            name='recipeDescription'
            onChange={handleChange}
            onBlur={handleBlur}>
            </textarea>
          </label>

          {(errors.recipeDescription && touched.recipeDescription) && <p className='error-message'>{errors.recipeDescription}</p>}
        </div>
        
        <div className='input-field'>
          <label className='form-label' htmlFor='recipe-ingredients'>
            Recipe Ingredients
            <textarea 
            className='form-input'
            id='recipe-ingredients'
            value={values.recipeIngredients}  
            placeholder='Enter Recipe Ingredients'
            name='recipeIngredients'
            onChange={handleChange}
            onBlur={handleBlur}>
            </textarea>
          </label>

          {(errors.recipeIngredients && touched.recipeIngredients) && <p className='error-message'>{errors.recipeIngredients}</p>}
        </div>

        <div className='input-field'>
          <label className='form-label' htmlFor='recipe-steps'>
            Recipe Steps
            <textarea 
            className='form-input'
            id='recipe-steps'
            value={values.recipeSteps}  
            placeholder='Enter Recipe Steps'
            name='recipeSteps'
            onChange={handleChange}
            onBlur={handleBlur}>
            </textarea>
          </label>

          {(errors.recipeSteps && touched.recipeSteps) && <p className='error-message'>{errors.recipeSteps}</p>}
        </div>

        <button className='primary-light-btn' type='submit' disabled={!(isValid)}>Edit Recipe</button>

      </form>
    </main>
  )
}
