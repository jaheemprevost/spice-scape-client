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

function App() { 
  const { loggedIn } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route 
          path='/' 
          element={loggedIn ? <MainLayout /> : <Navigate to='/login' />}
        >
          <Route 
            path='' 
            element={loggedIn ? <HomeLayout /> : <Navigate to='/login' />}
          >
            <Route path='/' element={<RecipesFeed />}/>
            <Route path='following' element={<FollowingFeed/>}/>
          </Route>

          <Route path='create-recipe' element={<CreateRecipe />}/>
          <Route path='recipes/:recipeId' element={<RecipeDetail />}/>
          <Route path='recipes/:recipeId/edit' element={<EditRecipe />}/>

          <Route path='profile/:profileId' element={<ProfileLayout />}>
            <Route path='following' element={<FollowingList />}/>
            <Route path='followers' element={<FollowerList />}/>
          </Route>

          <Route path='profile/:profileId/edit' element={<EditProfile/>}/>
          
          <Route path='settings' element={<Settings />}/> 
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
  )
}

export default App;
