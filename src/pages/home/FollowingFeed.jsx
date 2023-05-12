import {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext }  from '../../context/AuthProvider';
import axiosInstance from '../../services/axios';
import Recipe from '../recipes/Recipe'

export default function FollowingFeed() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState(null);
  const [message, setMessage] = useState('');
  const {logOut} = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axiosInstance.get('recipes/following-feed'); 
        
      const { recipeTiles, message } = response.data ?? {};
 
      if (recipeTiles) {
        setRecipes(recipeTiles); 
      } else if (message) {
        setMessage(message);
      }

      } catch(err) {
        console.log(err);
        if (err.response.status === 401) {
          logOut();
          navigate('/login');
        }
      }
    }
    
    fetchRecipes();
  }, []);

  const recipeElements = recipes && recipes.map(recipe => { 
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
        {recipes ? recipeElements : message}
      </div>
    </>
  )
}
