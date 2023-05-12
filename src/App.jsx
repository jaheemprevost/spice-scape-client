import { useContext } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import RecipesFeed from './pages/home/RecipesFeed';
import FollowingFeed from './pages/home/FollowingFeed';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import {AuthContext} from './context/AuthProvider';
import MainLayout from './Layouts/MainLayout';
import HomeLayout from './Layouts/HomeLayout';
import ProfileLayout from './Layouts/ProfileLayout';
import FollowingList from './pages/profile/FollowingList';
import FollowerList from './pages/profile/FollowerList'; 
import EditProfile from './pages/profile/EditProfile';
import RecipeDetail from './pages/recipes/RecipeDetail';
import CreateRecipe from './pages/recipes/CreateRecipe';
import EditRecipe from './pages/recipes/EditRecipe';
import Settings from './pages/Settings/Settings';
import NotFound from './pages/errors/NotFound';
import NotAuthorized from './pages/errors/NotAuthorized';
import SomethingWrong from './pages/errors/SomethingWrong';
import { ThemeContext } from './context/ThemeProvider';

function App() { 
  const { loggedIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext)
  return (
    <div className={`container-${theme}`}>
      <Router>
        <Routes>
          <Route 
            path='/' 
            exact
            element={<MainLayout />}
          >
            <Route 
              path=''  
              element={<HomeLayout />}
            >
              <Route path='/' element={<RecipesFeed />}/>
              <Route path='following' element={<FollowingFeed/>}/>
            </Route>

            <Route path='create-recipe' element={<CreateRecipe />}/>
            <Route path='recipes/:recipeId' element={<RecipeDetail />}/>
            <Route path='recipes/:recipeId/edit' element={<EditRecipe />}/>

            <Route path='profile/:profileId' element={<ProfileLayout />}>
              
            </Route>

            <Route path='profile/:profileId/following' element={<FollowingList />}/>
            <Route path='profile/:profileId/followers' element={<FollowerList />}/>
            <Route path='profile/:profileId/edit' element={<EditProfile/>}/>
            
            <Route path='settings' element={<Settings />}/> 

            <Route path='not-found' element={<NotFound />}/>
            <Route path='not-authorized' element={<NotAuthorized />}/>
            <Route path='something-wrong' element={<SomethingWrong />}/>
          </Route>
        
          <Route 
            path='/register' 
            element={loggedIn ? <Navigate to='/' /> : <Register />}
          />
          <Route 
            path='/login' 
            element={loggedIn ? <Navigate to='/' /> : <Login />}
          />

        </Routes>
      </Router>
    </div>
  )
}

export default App;
