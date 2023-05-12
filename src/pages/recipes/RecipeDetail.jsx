import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { ThemeContext } from '../../context/ThemeProvider';
import axiosInstance from '../../services/axios';
import CommentSection from './CommentSection';

export default function RecipeDetail() { 
  const { logOut } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); 
  const [showComments, setShowComments] = useState(false);
  const [isOwnRecipe, setIsOwnRecipe] = useState(false);

  const { recipeId } = useParams(); 

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axiosInstance.get(`recipes/${recipeId}`); 
      
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
        } else if (err.response.status === 401) {
          logOut();
          navigate('/login');
        }  
      }
    }
    
    fetchRecipe();
  }, [recipeId]);
 
  const favoriteRecipe = async () => {
    try {
      const response = await axiosInstance.post(`recipes/${recipeId}/favorite`, {}); 
    
      setIsFavorite(true); 
   
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
      }  
    }
  };

  const unfavoriteRecipe = async () => {
    try {
      const response = await axiosInstance.delete(`recipes/${recipeId}/favorite`); 
    
      setIsFavorite(false);

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
      } 
    }
  };

  const deleteRecipe = async () => {
    try {
      const response = await axiosInstance.delete(`recipes?recipeId=${recipeId}`); 
    
      navigate('/');

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
   <button onClick={unfavoriteRecipe} className='option-btn red-accent'>Unfavorite</button> :
   <button onClick={favoriteRecipe} className='option-btn green-accent'>Favorite</button>;

  return (
    <>
      {recipe && <div className='recipe'>
        <div className='options'>
          <Link className={`secondary-${theme}-btn`} to='/'>Back</Link>

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

        <button onClick={() => setShowComments(prevState => !prevState)} className={`show-comments-${theme}`}>{showComments ? 'Hide' : 'Show'} Comments</button>


      {showComments &&  <CommentSection recipeId={recipeId}/>}
      </div>
      } 
    </>
  )
}
