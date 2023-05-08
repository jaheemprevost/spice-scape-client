import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { useFormik } from 'formik';
import { commentValidationSchema } from '../../validation/CommentValidation'; 
import useRefreshToken from '../../hooks/useRefreshToken';
import Comment from './Comment';
import axios from 'axios'; 
import CommentSection from './CommentSection';

export default function RecipeDetail() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); 
  const [showComments, setShowComments] = useState(false);
  const [isOwnRecipe, setIsOwnRecipe] = useState(false);

  const { recipeId } = useParams(); 
  useRefreshToken();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`https://spice-scape-server.onrender.com/api/v1/recipes/${recipeId}`,
      {
      headers: { 
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        withCredentials: true
      } 
      }); 
      
      if (response.data.recipe) {
        setRecipe(response.data.recipe);
        setIsOwnRecipe(response.data.isOwnRecipe);
        setIsFavorite(response.data.isFavorite);
      }

      } catch(err) {
        if (err.response.status === 500) { 
          navigate('/something-wrong');
        } else if (err.response.status === 404) {
          navigate('/not-found')
        }
      }
    }
    
    fetchRecipe();
  }, [recipeId]);
 
  const favoriteRecipe = async () => {
    try {
      const response = await axios.post(`https://spice-scape-server.onrender.com/api/v1/recipes/${recipeId}/favorite`, {},
    {
    headers: { 
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      withCredentials: true
    } 
    }); 
    
    if (response.data.message) {
      setIsFavorite(true); 
    }

    } catch(err) {
      if (err.response.status === 500) { 
        navigate('/something-wrong');
      } 
    }
  };

  const unfavoriteRecipe = async () => {
    try {
      const response = await axios.delete(`https://spice-scape-server.onrender.com/api/v1/recipes/${recipeId}/favorite`,
    {
    headers: { 
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      withCredentials: true
    } 
    }); 
    
    if (response.data.message) {
      setIsFavorite(false);
    }

    } catch(err) {
      if (err.response.status === 500) { 
        navigate('/something-wrong');
      } 
    }
  };

  const deleteRecipe = async () => {
    try {
      const response = await axios.delete(`https://spice-scape-server.onrender.com/api/v1/recipes?recipeId=${recipeId}`,
    {
    headers: { 
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      withCredentials: true
    } 
    }); 
    
    if (response.status === 200) {
      navigate('/');
    }

    } catch(err) {
      if (err.response.status === 500) { 
        navigate('/something-wrong');
      }  
    }
  };

  const backgroundStyles = {
    backgroundImage: `url(${recipe ? recipe.recipeImage.url : ''})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    width: '100%',
    height: '250px'
  };

  const favoriteButton = isFavorite ? 
   <button onClick={unfavoriteRecipe} className='unfavorite-btn'>Unfavorite</button> :
   <button onClick={favoriteRecipe} className='favorite-btn'>Favorite</button>;

  return (
    <>
      {recipe && <div className='recipe'>
        <div className='options'>
          <Link className='back-btn' to='/'>Back</Link>

          {isOwnRecipe ? 
            <div className='options'>
              <Link className='edit-btn' to={`/recipes/${recipeId}/edit`}>Edit Recipe</Link>
              <button onClick={deleteRecipe} className='delete-btn'>Delete</button>
            </div> : 
            favoriteButton}
        </div>
       
        <div style={backgroundStyles}>

        </div>

        <h1 className='recipe-title'>{recipe.recipeTitle}</h1>

        <p className='author'>Created By: <Link to={`/profile/${recipe.createdBy._id}`}>{recipe.createdBy.username}</Link></p>

        <div className='recipe-info'>

          <h2>Description</h2>

          <p>{recipe.recipeDescription}</p>

          <h2>Ingredients</h2>

          <p>{recipe.recipeIngredients}</p>

          <h2>Steps</h2>

          <p>{recipe.recipeSteps}</p>
        </div>

        <button onClick={() => setShowComments(prevState => !prevState)} className='show-comments'>{showComments ? 'Hide' : 'Show'} Comments</button>


      {showComments &&  <CommentSection recipeId={recipeId}/>}
      </div>
      } 
    </>
  )
}
