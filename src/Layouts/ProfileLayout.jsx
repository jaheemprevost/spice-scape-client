import { NavLink, Outlet, useParams } from 'react-router-dom'; 
import Profile from '../pages/profile/Profile';

export default function ProfileLayout() {
  const { profileId } = useParams();
  return (
    <>
      <Profile />
      <div className='profile-tabs'>
        <div className='profile-tab'>
          <NavLink to={`/profile/${profileId}`} end={true}>Recipes</NavLink>
        </div>

        <div className='profile-tab'>
          <NavLink to={`/profile/${profileId}/favorite-recipes`}>Favorites</NavLink>
        </div>

        <div className='profile-tab'>
        <NavLink to={`/profile/${profileId}/comments`}>Comments</NavLink>
        </div>
      </div>
      <Outlet />
    </>
  )
}
