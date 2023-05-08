import { useState, useEffect } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { recipeValidationSchema } from '../../validation/RecipeValidation';
import axios from 'axios'; 

export default function EditRecipe() {
  const [recipe, setRecipe] = useState('');
  const [responseError, setResponseError] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const navigate = useNavigate();
  const { recipeId } = useParams();

  useEffect(() => {
    try {
      const fetchRecipe = async () => {
        const response = await axios.get(`https://spice-scape-server.onrender.com/api/v1/recipes/${recipeId}`,
      {
      headers: { 
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        withCredentials: true
      } 
      }); 
      
        if (response.data.recipe) {
          const { recipe } = response.data
          setRecipe(recipe); 
          setImgSrc(recipe.recipeImage.url);
        } 
      };

      fetchRecipe();
    } catch(err) {
       if (err.response.status === 500) {
        navigate('/');
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

      const response = await axios.patch(`https://spice-scape-server.onrender.com/api/v1/recipes?recipeId=${recipeId}`, JSON.stringify({...recipeData}),
    {
      headers: { 
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json',
        withCredentials: true
      }
    }); 
    if (response.status === 200) {
      navigate(`/recipes/${recipeId}`);
    } 

    } catch(err) {  
      setResponseError(err.response.data.message);
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
    <main className='recipe-revision'>

      <form onSubmit={(e) => handleSubmit(e)} className='recipe-revision-form'>

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

        <button className='submit-btn' type='submit' disabled={!(isValid)}>Edit Recipe</button>

      </form>
    </main>
  )
}