import {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import useRefreshToken from '../../hooks/useRefreshToken';
import { AuthContext }  from '../../context/AuthProvider';
import axios from 'axios';
import Recipe from '../recipes/Recipe'

export default function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const {loggedIn, setLoggedIn, setUser} = useContext(AuthContext);
  useRefreshToken();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('https://spice-scape-server.onrender.com/api/v1/recipes',
      {
      headers: { 
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        withCredentials: true
      } 
      }); 
      
      if (response.data.recipeTiles) {
        setRecipes(response.data.recipeTiles);
      } else {
        setRecipes(response.data.message);
      }
      } catch(err) {
        if (err.response.status === 401) {
          setUser({});
          setLoggedIn(false);
          localStorage.removeItem('accessToken');
          navigate('/login');
        }
      }
    }
    
    fetchRecipes();
  }, []);

  const recipeElements = recipes.map(recipe => { 
    const recipeData = {
      image: recipe.recipeImage,
      name: recipe.recipeTitle,
      createdBy: recipe.createdBy,
      authorName: recipe.author,
      authorImage: recipe.authorImage,
      recipeId: recipe.recipeId
    };

    return <Recipe key={recipeData.recipeId} {...recipeData} />; 
  });

  return (
    <>  
      <div className='recipes'>
        {recipes && recipeElements}
      </div>
    </>
  )
}
