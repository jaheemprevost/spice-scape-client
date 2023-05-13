import {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext }  from '../../context/AuthProvider';
import axiosInstance from '../../services/axios';
import Recipe from '../recipes/Recipe';

export default function ProfileRecipes() {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [profileRecipes, setProfileRecipes] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfileRecipes = async () => {
      try {
        const response = await axiosInstance.get(`/profile/${profileId}/recipes`); 

        const {recipeTiles, message} = response.data ?? {};

        if (recipeTiles) {
          setProfileRecipes(recipeTiles);
        } else if (message) {
          setMessage(message);
        }

      } catch(err) {
        if (err.response.status === 401) {
          logOut();
          navigate('/login');
        } else if (err.response.status === 500) {
          navigate('/something-wrong');
        }
      }
    }
    
    fetchProfileRecipes();
  }, []);

  const recipeElements = profileRecipes && profileRecipes.map(recipe => { 
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
        {profileRecipes ? recipeElements : message}
      </div>
    </>
  )
}
